# Helper scripts

> The `dmoj/scripts/` directory has 6 short Bash scripts (`initialize`, `migrate`, `copy_static`, `manage.py`, `enter_site`, `moderate_comments`) that wrap common `docker compose` commands. This page says exactly what each one does.
>
> ⏱ ~8 min read · 👤 Operators · 🔑 SSH to the server and permission to run `docker`

## When you need this page

- When another page tells you to run `./scripts/...` and you want to know what it does first.
- When running a script from cron or CI and hitting a TTY error.
- When you need to run a Django management command (see also [Management commands](/en/reference/management-commands)).

## Overview

| Script | Runs in | What it does | When to use it |
|---|---|---|---|
| `initialize` | host | Creates directories, copies config templates into `repo/` | Once, on a fresh install |
| `migrate` | `site` container | `python3 manage.py migrate` | After updating code that ships new migrations |
| `copy_static` | `site` container | Builds CSS, collects static files, compiles translations, copies into `/assets` | After changing SCSS/JS/static files or translations |
| `manage.py` | `site` container | `python3 manage.py <command>` | Any Django management command |
| `enter_site` | `site` container | Opens a `bash` shell | Debugging, running commands by hand |
| `moderate_comments` | `db` container | Hides comments scored ≤ -5 | Cleaning up bad comments, on a schedule or by hand |

## How to run them

Run the scripts from the `dmoj/` directory:

```sh
cd lcoj-docker/dmoj
./scripts/migrate
```

Every script starts with `cd $(dirname $(dirname $0))`, which switches to the parent of `scripts/` (that is, `dmoj/`) before calling `docker compose`. So calling one by its full path from elsewhere (for example `/srv/lcoj-docker/dmoj/scripts/migrate`) also works.

Except for `initialize`, all scripts use `docker compose exec`, so the target container (`site` or `db`) must be **running**.

### The `COMPOSE_EXEC_FLAGS` variable

The in-container scripts all call `docker compose exec $COMPOSE_EXEC_FLAGS ...`. It's empty by default. Use it to pass extra flags to `docker compose exec`; the most common is `-T` (no TTY), which you need when running from cron or CI, or when redirecting output:

```sh
COMPOSE_EXEC_FLAGS=-T ./scripts/migrate
COMPOSE_EXEC_FLAGS=-T ./scripts/manage.py clearsessions >> /var/log/lcoj-cron.log 2>&1
```

::: tip
If you see `the input device is not a TTY`, add `COMPOSE_EXEC_FLAGS=-T`.
:::

## `initialize`

```sh
mkdir -p problems media

cp config/config.js repo/websocket/
cp config/local_settings.py repo/dmoj/
cp config/uwsgi.ini repo/
```

This script:

1. Creates `dmoj/problems/` (test data) and `dmoj/media/` (uploads) if they don't exist.
2. Copies three config templates from `dmoj/config/` into the lcoj-site source:

   | Template | Copied to | Used by |
   |---|---|---|
   | `config/config.js` | `repo/websocket/config.js` | wsevent |
   | `config/local_settings.py` | `repo/dmoj/local_settings.py` | site, celery, bridged |
   | `config/uwsgi.ini` | `repo/uwsgi.ini` | site |

It does **not** create the `environment/*.env` files; copy those from the `*.example` files yourself (see [Environment variables](/en/operate/environment)). It doesn't run any Docker commands either.

::: warning Re-running overwrites your config
`cp` overwrites without asking. If you've edited `repo/dmoj/local_settings.py`, `repo/uwsgi.ini`, or `repo/websocket/config.js` without updating the templates in `dmoj/config/`, re-running `initialize` discards those edits. Back them up or sync the templates first.
:::

## `migrate`

```sh
docker compose exec $COMPOSE_EXEC_FLAGS site python3 manage.py migrate $@
```

Applies Django migrations to the database. Extra arguments go straight to `manage.py migrate`:

```sh
./scripts/migrate                 # apply all migrations
./scripts/migrate judge           # only the judge app
./scripts/migrate --plan          # preview, change nothing
```

Use it on a fresh install and after every code update (see [Updating](/en/operate/updating)). Back up the database before migrating in production.

## `copy_static`

Runs this chain inside the `site` container (it stops at the first failing command):

1. `bash make_style.sh`: compiles the SCSS in `resources/` with `sass` + `postcss`, for both the light (`resources/`) and dark (`resources/dark/`) themes.
2. `python3 manage.py collectstatic --noinput`: collects static files into `STATIC_ROOT` (`/assets/static/`).
3. `python3 manage.py compilemessages`: compiles `.po` translations into `.mo` files.
4. `python3 manage.py compilejsi18n`: generates the JavaScript translation catalogs.
5. `cp -r resources/ /assets/`: copies `resources/` (including the freshly built CSS) to `/assets/resources/`.
6. Deletes the generated CSS files from `resources/` and `resources/dark/` and removes `sass_processed`, keeping the source tree clean.
7. Copies `502.html`, `logo.png`, and `robots.txt` into `/assets/`.

`/assets` is a volume shared with nginx, so nginx serves the new files as soon as the script finishes.

When to use it:

- On first install.
- After changing SCSS, JavaScript, images in `resources/`, or translation files.
- When static files 404 or CSS changes don't show up.

```sh
./scripts/copy_static
```

::: tip
If the browser still shows the old look, clear the browser cache (and the Cloudflare cache, if any), since nginx sets `expires max` on `/static`.
:::

## `manage.py`

```sh
docker compose exec $COMPOSE_EXEC_FLAGS site python3 manage.py $@
```

Runs any Django management command inside the `site` container:

```sh
./scripts/manage.py createsuperuser
./scripts/manage.py loaddata navbar language_small demo
./scripts/manage.py test judge.tests.test_api_sync
```

For LCOJ's own commands, see [Management commands](/en/reference/management-commands).

::: warning Arguments with spaces
The script uses an unquoted `$@`, so an argument containing spaces gets split into several arguments. For such commands, enter the container with `./scripts/enter_site` and run `python3 manage.py ...` directly.
:::

## `enter_site`

```sh
docker compose exec $COMPOSE_EXEC_FLAGS site /bin/bash
```

Opens a `bash` shell inside the `site` container, in the working directory `/site` (which is `dmoj/repo/` on the host). Handy for running several commands in a row, inspecting files, or opening `python3 manage.py shell`.

::: code-group

```sh [Host]
./scripts/manage.py shell
```

```sh [Inside the container (after enter_site)]
python3 manage.py shell
```

:::

Editing files under `/site` edits `dmoj/repo/` on the host directly, since it's a bind mount.

## `moderate_comments`

Hides comments that received low scores. The script reads `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE` from `environment/mysql.env`, then uses the `mariadb` client in the `db` container to work directly on the `judge_comment` table, with the condition `hidden = 0 AND score <= -5`.

1. Preview (runs `SELECT` only, changes nothing): prints how many comments would be hidden and the 5 most recent of them (id, first 80 characters, score).

   ```sh
   ./scripts/moderate_comments --dry-run
   ```

2. Apply (runs `UPDATE judge_comment SET hidden = 1 ...`) and print how many comments were hidden:

   ```sh
   ./scripts/moderate_comments
   ```

::: danger Writes directly to the database
The normal mode changes the database immediately, with no confirmation. Always run `--dry-run` first. Comments are only hidden (`hidden = 1`), not deleted, so you can unhide them from the Django admin if needed.
:::

Things to note:

- The script suppresses `mariadb` errors (`2>/dev/null`). If the output is empty or the count is blank, check that the `db` container is running and that `mysql.env` is correct.
- Values are read with `grep ... | cut -d= -f2`, so a password containing `=` gets truncated.
- To run it from cron, add `COMPOSE_EXEC_FLAGS=-T`, for example:

  ```sh
  0 3 * * * COMPOSE_EXEC_FLAGS=-T /srv/lcoj-docker/dmoj/scripts/moderate_comments >> /var/log/lcoj-moderate.log 2>&1
  ```

## Next steps

- [Day-to-day operations](/en/operate/operations): restarts, logs, backups.
- [Updating LCOJ](/en/operate/updating): when to run `migrate` and `copy_static` after pulling new code.
- [Management commands](/en/reference/management-commands): commands you can run through `./scripts/manage.py`.

::: tip Need help?
- Open an issue on [GitHub Issues](https://github.com/luyencode/lcoj-docker/issues)
- More resources at [behitek.com](https://behitek.com)
- LCOJ offers free installation help: [luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he)
:::
