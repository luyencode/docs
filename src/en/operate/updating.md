# Updating LCOJ

This page covers moving a Docker install to a newer version: pulling code, rebuilding when needed, running migrations and restarting the right services.

::: warning Always back up first
Before updating, [back up the database](/en/operate/operations#backup). Git can bring old code back, but migrations that have already run don't undo themselves.
:::

## Two repos to update

An install is made of two nested Git repos:

| Directory | Repo | Contains |
|---|---|---|
| `lcoj-docker/` | [lcoj-docker](https://github.com/luyencode/lcoj-docker) | `docker-compose.yml`, Dockerfiles, scripts, config templates, nginx |
| `lcoj-docker/dmoj/repo/` | [lcoj-site](https://github.com/luyencode/lcoj-site) (submodule) | All Django code, templates, CSS/JS, WebSocket server |

### Submodules and "detached HEAD"

The outer repo doesn't record a branch for the submodule. It pins `dmoj/repo` to **one specific commit**. As a result:

- `git submodule update` checks out exactly that pinned commit, which leaves `dmoj/repo` in a **detached HEAD** state (not on any branch). `git pull` inside it fails until you check out a branch.
- `.gitmodules` has no `branch` entry, so `git submodule update --remote` follows lcoj-site's default branch (`master`), **not** the production branch.
- luyencode.net runs the **`prod/luyencode`** branch of lcoj-site.

Check where you are:

```sh
git -C repo status | head -1   # "On branch prod/luyencode" or "HEAD detached at ..."
```

If you're on a detached HEAD and want to follow the production branch:

```sh
git -C repo fetch origin
git -C repo checkout prod/luyencode
```

## Update steps

Run every command from `lcoj-docker/dmoj/`.

1. **Record the current commits** of both repos so you can see what changed and roll back if needed:

   ```sh
   OLD=$(git -C repo rev-parse HEAD); echo $OLD
   OLD_DOCKER=$(git rev-parse HEAD); echo $OLD_DOCKER
   ```

2. **Update the outer repo** (Dockerfiles, scripts, config templates):

   ```sh
   git pull --ff-only
   ```

3. **Update the site code.** Pick one approach:

   ::: code-group

   ```sh [Follow the production branch (luyencode.net)]
   git -C repo fetch origin
   git -C repo checkout prod/luyencode
   git -C repo pull --ff-only origin prod/luyencode
   ```

   ```sh [Use the commit pinned by the outer repo]
   git submodule update --init --recursive
   # repo/ is now on a detached HEAD, which is expected
   ```

   :::

4. **See what changed:**

   ```sh
   git -C repo diff --stat $OLD HEAD
   git diff --stat $OLD_DOCKER HEAD -- .   # changes under lcoj-docker/dmoj
   ```

5. **Follow the table below** for whatever changed.

### What to do for each kind of change

| Change | Action |
|---|---|
| `requirements.txt`, `additional_requirements.txt`, `package.json`, `package-lock.json` | Rebuild the `base` image, then the images built on it (see [below](#rebuild)) |
| `dmoj/base/Dockerfile`, `dmoj/site/Dockerfile`, `dmoj/celery/Dockerfile`, `dmoj/bridged/Dockerfile`, `dmoj/wsevent/Dockerfile` | `docker compose build <service>`, then `docker compose up -d` |
| New models / files in `*/migrations/` | `./scripts/migrate` |
| SCSS, JS or images in `resources/`, translations in `locale/` | `./scripts/copy_static` |
| Python code, templates | `docker compose restart site celery bridged` |
| `websocket/*.js` | `docker compose restart wsevent` |
| `docker-compose.yml`, `environment/*.env.example` | Compare with your `.env` files, add any new variables, then `docker compose up -d` |
| `config/local_settings.py`, `config/uwsgi.ini`, `config/config.js` | Port the changes into the copies in `repo/` by hand (see the warning below), then restart the matching service |
| `nginx/conf.d/nginx.conf` | `docker compose restart nginx` |

Code changes do **not** need an image rebuild because `./repo` is bind-mounted into the containers. A restart is enough.

::: warning Config files in repo/ don't update themselves
`repo/dmoj/local_settings.py`, `repo/uwsgi.ini` and `repo/websocket/config.js` are ignored by lcoj-site's `.gitignore`, so `git pull` never touches them. If a template in `config/` changes, compare them (`diff config/local_settings.py repo/dmoj/local_settings.py`) and edit by hand. Re-running `./scripts/initialize` would overwrite your own changes.
:::

### Rebuilding when dependencies change {#rebuild}

Python, Node.js and every library live in the `lcoj/lcoj-base` image. The `site`, `celery` and `bridged` images are built from it, while `wsevent` installs `package.json` on its own. Rebuilding only `site` does **not** install new libraries.

```sh
docker compose build base
docker compose build site celery bridged wsevent
docker compose up -d
```

If you suspect Docker is reusing a stale cache, add `--no-cache` to the `base` build.

### Finishing up

If you're not sure what changed, run all of these. Each one is safe to repeat:

```sh
./scripts/migrate
./scripts/copy_static
docker compose restart site celery bridged wsevent
docker compose ps
```

## Sample update script

This script follows the steps above for the `prod/luyencode` branch. Save it as `dmoj/update.sh` (`*.sh` files in `dmoj/` are already ignored by `.gitignore`) and `chmod +x` it.

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"                 # the dmoj/ directory
export COMPOSE_EXEC_FLAGS=-T         # lets the scripts in scripts/ run without a terminal
BRANCH=prod/luyencode
STAMP=$(date +%F_%H%M%S)

echo "1. Back up the database"
mkdir -p backups
docker compose exec -T db sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mariadb-dump -u root --single-transaction "$MYSQL_DATABASE"' \
  | gzip > "backups/db_before_update_$STAMP.sql.gz"

echo "2. Pull new code"
OLD=$(git -C repo rev-parse HEAD)
git pull --ff-only
git -C repo fetch origin
git -C repo checkout "$BRANCH"
git -C repo pull --ff-only origin "$BRANCH"
NEW=$(git -C repo rev-parse HEAD)

if [ "$OLD" = "$NEW" ]; then
  echo "Site code unchanged."
else
  echo "Updating $OLD -> $NEW"
  CHANGED=$(git -C repo diff --name-only "$OLD" "$NEW")

  if echo "$CHANGED" | grep -qE '^(requirements\.txt|additional_requirements\.txt|package(-lock)?\.json)$'; then
    echo "3. Dependencies changed: rebuilding images"
    docker compose build base
    docker compose build site celery bridged wsevent
  fi
fi

echo "4. Start (recreates containers whose image or config changed)"
docker compose up -d

echo "5. Migrations and static files"
./scripts/migrate
./scripts/copy_static

echo "6. Restart to load the new code"
docker compose restart site celery bridged wsevent
docker compose ps

echo "Done. Follow the logs with: docker compose logs -f site"
```

The script doesn't compare `config/` against the config files in `repo/`. Check the diff from step 4 above after every update.

## After updating

1. `docker compose ps`: every service (except `base`) is **Up**.
2. `docker compose logs --tail=50 site celery bridged`: no tracebacks.
3. Open the site, log in, view a problem and make a test submission.
4. In `docker compose logs bridged`, confirm the judges have reconnected.

## Rolling back

::: danger
Going back to old code does **not** reverse migrations that already ran. If the new version included migrations, the safest route is restoring the database backup you took before updating.
:::

1. Stop the services that write data:

   ```sh
   docker compose stop site celery bridged
   ```

2. Put the code back on the old commit (`$OLD` from step 1):

   ```sh
   git -C repo checkout <OLD>
   ```

3. If there were new migrations, [restore the database](/en/operate/operations#restore) from the pre-update backup.
4. If dependencies changed, rebuild as described [above](#rebuild).
5. Start again:

   ```sh
   docker compose up -d
   ./scripts/copy_static
   docker compose restart site celery bridged wsevent
   ```

Once the problem is fixed, get back on the branch with `git -C repo checkout prod/luyencode`.

## Tips

- Update during quiet hours, and never in the middle of a contest.
- Warn users ahead of time. While `site` is stopped, nginx serves the `502.html` page (see [Maintenance page](/en/operate/operations#maintenance)).
- If you can, try the new version on a test machine first.

::: tip Need help?
Open an issue on [lcoj-docker](https://github.com/luyencode/lcoj-docker/issues), or reach us via [behitek.com](https://behitek.com) or [luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he).
:::
