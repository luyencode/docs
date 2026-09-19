# Management Commands

LCOJ ships a set of Django management commands for administrative work: creating users and judges, importing problems, exporting contest data, generating editorials, and more. This page lists **every** custom command in `judge/management/commands/` of lcoj-site, with the exact arguments each one accepts.

## How to run a command

On a Docker install, run commands from the `dmoj/` directory through the `./scripts/manage.py` wrapper:

```sh
cd dmoj/
./scripts/manage.py <command> [arguments] [options]
```

The wrapper runs `docker compose exec $COMPOSE_EXEC_FLAGS site python3 manage.py <command>`, so the command executes **inside the `site` container**.

::: tip File paths are inside the container
The `site` container's working directory is `/site/`, which is `dmoj/repo/` on the host. Any relative path you pass (input CSV, output file, output directory) resolves under `dmoj/repo/` on the host. Other shared mounts: `/problems/` = `dmoj/problems/`, `/media/` = `dmoj/media/`.
:::

::: warning Arguments with spaces
The wrapper passes arguments unquoted (`$@`), so an argument containing spaces, such as a problem title, is split into several arguments. For such commands, open a shell in the container with `./scripts/enter_site` and run `python3 manage.py <command> ...` there.
:::

::: tip Passing extra environment variables
The wrapper forwards `COMPOSE_EXEC_FLAGS` to `docker compose exec`. For example, to set a variable for a single run:

```sh
COMPOSE_EXEC_FLAGS="-e OPENAI_API_KEY=sk-..." ./scripts/manage.py generate_editorials --dry-run
```
:::

## Summary

| Group | Command | What it does |
|---|---|---|
| Users | [`adduser`](#adduser) | Create a single user |
| Users | [`batchadduser`](#batchadduser) | Create many users from a CSV file, with generated passwords |
| Users | [`move_user_content`](#move-user-content) | Move submissions and comments from one user to another |
| Users | [`generate_api_token`](#generate-api-token) | Generate (or regenerate) a user's API token |
| Judging | [`addjudge`](#addjudge) | Register a judge with its authentication key |
| Judging | [`runbridged`](#runbridged) | Run the judge bridge (used by the `bridged` service) |
| Judging | [`runbalancer`](#runbalancer) | Run the judge load balancer |
| Problems | [`create_problem`](#create-problem) | Create an empty problem |
| Problems | [`import_polygon_package`](#import-polygon-package) | Import a Codeforces Polygon package |
| Problems | [`submit_polygon_solutions`](#submit-polygon-solutions) | Submit every solution in a Polygon package |
| Problems | [`copy_language`](#copy-language) | Allow language B wherever language A is allowed |
| Problems | [`render_pdf`](#render-pdf) | Render a problem statement to PDF |
| Problems | [`backfill_problem_data_size`](#backfill-problem-data-size) | Recompute the stored size of each problem's data files |
| Editorials | [`generate_editorials`](#generate-editorials) | Generate editorials with an OpenAI-compatible API |
| Contests | [`export_contest_submissions`](#export-contest-submissions) | Export contestants' source code into a directory tree |
| Contests | [`export_contest_submissions_details`](#export-contest-submissions-details) | Export per-test-case results to CSV |
| Contests | [`export_event_feed`](#export-event-feed) | Export a CLICS XML event feed (for the ICPC Resolver) |
| Contests | [`runmoss`](#runmoss) | Check a contest for plagiarism with MOSS |
| Contests | [`merge_replay_data`](#merge-replay-data) | Add another contest's participants as "ghosts" to a replay |
| Organizations | [`backfill_current_credit`](#backfill-current-credit) | Recompute this month's credit usage of every organization |
| Organizations | [`backfill_monthly_credit`](#backfill-monthly-credit) | Recompute monthly credit history of every organization |
| Site | [`add_blog_navigation`](#add-blog-navigation) | Add a "Blog" item to the navigation bar |
| Site | [`generate_sitemap`](#generate-sitemap) | Write static sitemap files to a directory |
| Site | [`update_permissions`](#update-permissions) | Create/rename permissions after model changes |
| Site | [`makedmojmessages`](#makedmojmessages) | Build translation files for database strings |
| Site | [`camo`](#camo) | Print the Camo proxy URL for an image URL |

Django's built-in commands (`migrate`, `createsuperuser`, `shell`, `loaddata`, `compilemessages`, ...) also work through the same wrapper.

## Users

### adduser

Create one user and their profile.

```sh
./scripts/manage.py adduser <name> <email> <password> [language] [--superuser] [--staff]
```

| Argument | Description |
|---|---|
| `name` | Username |
| `email` | Email address (does not have to be real) |
| `password` | Password |
| `language` | Optional. Key of the user's default language; defaults to `DEFAULT_USER_LANGUAGE` (`CPP20`) |
| `--superuser` | Give the user superuser privileges |
| `--staff` | Give the user staff privileges (Django admin access) |

```sh
./scripts/manage.py adduser alice alice@luyencode.net 'S3cret!' PY3
```

::: warning
The password appears in your shell history. Prefer `createsuperuser` for admin accounts, or change the password after creation.
:::

### batchadduser

Create many users from a CSV file. Passwords are **generated** (8 random characters) and written to an output CSV.

```sh
./scripts/manage.py batchadduser <input> <output>
```

| Argument | Description |
|---|---|
| `input` | CSV with header columns `username` and `fullname` |
| `output` | Where to write the result CSV (`username,fullname,password`) |

Input file (`dmoj/repo/students.csv` on the host):

```csv
username,fullname
lc_student01,Nguyen Van A
lc_student02,Tran Thi B
```

```sh
./scripts/manage.py batchadduser students.csv students_out.csv
```

`fullname` is stored as the user's first name; every user gets the default language `DEFAULT_USER_LANGUAGE`. The command stops at the first duplicate username, so check the input first.

::: warning
The output CSV contains plaintext passwords. Hand it out securely and delete it afterwards.
:::

### move_user_content

Reassign all **submissions, comments and comment votes** from `source` to `target`. Useful when a person has two accounts.

```sh
./scripts/manage.py move_user_content <source> <target>
```

::: danger Irreversible
The change runs in a single transaction but cannot be undone automatically: afterwards you can no longer tell which submissions came from `source`. Back up the database first. The command refuses to run if `source` has any contest participation. The `source` account itself is **not** deleted.
:::

### generate_api_token

Generate or regenerate a user's API token and print it. The token is a 48-character URL-safe string used as `Authorization: Bearer <token>` (see [API](/en/reference/api)).

```sh
./scripts/manage.py generate_api_token <name>
```

::: warning
Regenerating invalidates the user's previous token. The token bypasses two-factor authentication (it cannot access admin pages), so treat it like a password.
:::

## Judging

### addjudge

Register a judge in the database so it can connect to the bridge.

```sh
./scripts/manage.py addjudge <name> <auth_key>
```

| Argument | Description |
|---|---|
| `name` | Judge name (must match the `id` in the judge's configuration) |
| `auth_key` | Authentication key (must match `key` in the judge's configuration) |

The command does **not** generate a key; you choose one, for example with `openssl rand -base64 48`. You can also create judges in the Django admin. See [Judge setup](/en/operate/judge-setup).

### runbridged

Run the bridge that judges connect to. On a Docker install this is the entrypoint of the `bridged` service; you do not need to run it by hand.

```sh
python3 manage.py runbridged [--monitor] [--problem-storage-globs GLOB ...]
```

| Option | Description |
|---|---|
| `--monitor` | Watch problem storage and automatically update problems when data changes |
| `--problem-storage-globs` | Globs to watch for problem updates (default: none) |

Listen addresses come from the `BRIDGED_JUDGE_ADDRESS` (default port 9999) and `BRIDGED_DJANGO_ADDRESS` (default port 9998) settings, not from command-line options.

### runbalancer

Run the judge load balancer with a YAML configuration file.

```sh
./scripts/manage.py runbalancer -c <config.yml>
```

| Option | Description |
|---|---|
| `-c`, `--config` | YAML file containing the balancer configuration (required in practice) |

## Problems

### create_problem

Create an empty problem with a statement, one type and a group. The type and group must already exist.

```sh
./scripts/manage.py create_problem <code> <name> <body> <type> <group>
```

| Argument | Description |
|---|---|
| `code` | Problem code |
| `name` | Problem title |
| `body` | Statement (Markdown) |
| `type` | Name of an existing problem type |
| `group` | Name of an existing problem group |

```sh
# inside the container (./scripts/enter_site), because the title and body contain spaces
python3 manage.py create_problem aplusb "A + B" "Compute a + b." <type_name> <group_name>
```

Limits, points, tests and authors are not set by this command; edit the problem afterwards (see [Managing problems](/en/setter/managing-problems)).

### import_polygon_package

Import a **full** Codeforces Polygon package (zip).

```sh
./scripts/manage.py import_polygon_package <package> <code> [--update] [--authors USER ...] [--curators USER ...]
```

| Argument / option | Description |
|---|---|
| `package` | Path to the package zip |
| `code` | Problem code to create |
| `--update` | Update the problem if it already exists |
| `--authors` | One or more usernames to set as authors |
| `--curators` | One or more usernames to set as curators |

```sh
./scripts/manage.py import_polygon_package packages/aplusb.zip aplusb --authors admin
```

The import is interactive (it may ask questions), and it prints the problem URL when done.

### submit_polygon_solutions

Submit every solution listed in a Polygon package's `problem.xml` to an existing problem, to check that verdicts match the expected tags. Each source gets a header comment with its file name and expected verdict.

```sh
./scripts/manage.py submit_polygon_solutions <package> <code> <submitter>
```

| Argument | Description |
|---|---|
| `package` | Path to the package zip |
| `code` | Problem code |
| `submitter` | Username to submit as |

Supported languages map to the keys `CPP20`, `JAVA`, `PAS`, `PY2`, `PY3`, `PYPY`, `PYPY3`, `KOTLIN`, `GO`, `RUST`; other solutions are skipped. Those language keys must exist on your site.

### copy_language

For every problem that allows language `source`, also allow language `target`, and copy `source`'s per-language time/memory limits to `target`.

```sh
./scripts/manage.py copy_language <source> <target>
```

```sh
./scripts/manage.py copy_language CPP17 CPP20
```

Both arguments are **language keys**, not problem codes. Note that the allowed-problem list of `target` is replaced by that of `source`.

### render_pdf

Render a problem statement to `<code>.pdf` in the working directory (`dmoj/repo/` on the host).

```sh
./scripts/manage.py render_pdf <code> [-l LANGUAGE]
```

| Argument / option | Description |
|---|---|
| `code` | Problem code |
| `-l`, `--language` | Statement language; uses the translation if one exists. Default: `LANGUAGE_CODE` (`vi` on LCOJ) |

Requires Pdfoid (`DMOJ_PDF_PDFOID_URL`). See [Pdfoid](/en/operate/pdfoid).

### backfill_problem_data_size

Recompute the storage size of each problem's data files (test zip, generator, custom checker, custom grader, custom header) from `DMOJ_PROBLEM_DATA_ROOT`, and store the total in the problem data record.

```sh
./scripts/manage.py backfill_problem_data_size [--dry-run]
```

| Option | Description |
|---|---|
| `--dry-run` | Show what would change without saving |

Run it once after upgrading to a version that tracks problem data size, or whenever the stored sizes look wrong.

## Editorials

### generate_editorials

Generate editorials for **public problems** that do not have one yet, using an OpenAI-compatible chat API with Pydantic structured output.

```sh
./scripts/manage.py generate_editorials [options]
```

**Requirements**

- The `openai` and `pydantic` packages. They are listed in `additional_requirements.txt` and installed in the Docker base image.
- `OPENAI_API_KEY` must be set in the `site` container's environment (add it to `environment/site.env` and recreate the container, or pass it with `COMPOSE_EXEC_FLAGS` as shown above).
- `OPENAI_BASE_URL` is optional; set it to use a different OpenAI-compatible endpoint.

**Options**

| Option | Description | Default |
|---|---|---|
| `--problem CODE`, `-p CODE` | Process one problem only | All public problems without an editorial |
| `--limit N`, `-l N` | Maximum number of problems to process | `10` |
| `--offset N` | Skip the first N matching problems (ordered by ID) | `0` |
| `--dry-run` | Generate and preview, but save nothing | off |
| `--verbose` | Debug-level logging | off |
| `--model MODEL` | Model name sent to the API | `mimo-v2-flash` |
| `--temperature T` | Sampling temperature | `0.7` |
| `--max-retries N` | Retries on API errors | `3` |
| `--retry-delay S` | Base delay in seconds; doubles on each retry | `2` |
| `--log-file PATH` | Also write logs to this file | none |

**How it works**

1. Selects problems with `is_public=True` that have no editorial yet (with `--problem`, the problem must be public and have no editorial).
2. Picks up to 3 recent Accepted C/C++ submissions, preferring different users.
3. Sends the statement and the solutions to the API and parses the answer into a fixed schema.
4. Builds Markdown in the standard format below.
5. Saves the editorial as **public, published now**. Authors: the user named `admin` (or the first superuser), followed by the authors of the sampled submissions.

::: warning Published immediately
Generated editorials are visible to users right away. Always review with `--dry-run` first, and check a few results on the site (`https://luyencode.net/problem/<code>/editorial`).
:::

**Editorial format** (headings are in Vietnamese, as generated):

````markdown
## Hiểu bài toán
[Explanation of the problem]

## Các cách tiếp cận

### Cách Brute Force

```cpp
[code]
```

* **Time Complexity**: O(n²)
* **Space Complexity**: O(1)

[Explanation]

### Cách Hash Map
[code + explanation]

## Phân tích độ phức tạp
| Cách tiếp cận | Time | Space | Tên |
|--------------|------|-------|-----|
| 1 | O(n²) | O(1) | Brute Force |
| 2 | O(n) | O(n) | Hash Map |

## Bài học kinh nghiệm
- [Insight]

## Lỗi thường gặp
- [Pitfall]
````

**Examples**

```sh
# 1. Preview one problem (nothing is saved)
./scripts/manage.py generate_editorials --problem aplusb --dry-run --verbose

# 2. Generate it for real
./scripts/manage.py generate_editorials --problem aplusb

# 3. Process 20 problems and keep a log (the path is inside the container)
./scripts/manage.py generate_editorials --limit 20 --log-file /tmp/editorials.log

# 4. Use another model
./scripts/manage.py generate_editorials --problem aplusb --model gpt-4o-mini --temperature 0.5
```

The log marks successes with `✓` and failures with `✗`. Each problem takes several seconds; lower `--limit` or raise `--retry-delay` if the API rate-limits you.

**Common errors**

| Message | Fix |
|---|---|
| `OPENAI_API_KEY environment variable not set` | Provide the key to the `site` container |
| `OpenAI package not installed` | Rebuild the images: `docker compose up -d --build base site celery` |
| `Insufficient AC C/C++ solutions` | The problem has no Accepted C/C++ submission; skip it or write the editorial by hand |
| `Problem '<code>' not found or already has editorial` | The code is wrong, the problem is not public, or an editorial already exists |

**Removing a generated editorial**

Edit or delete it in the editorial section of the problem's page in the Django admin, or from the shell:

::: danger
This permanently deletes the editorial of the given problem.
:::

```sh
./scripts/manage.py shell
>>> from judge.models import Solution
>>> Solution.objects.filter(problem__code='aplusb').delete()
```

## Contests

### export_contest_submissions

Export the source code of all **live** (non-virtual) participants into a directory tree. Each user's last submission per problem goes to `<output>/<username>/<problem>.<ext>`; older ones go to `<output>/<username>/$History/<problem>_<id>.<ext>`.

```sh
./scripts/manage.py export_contest_submissions <key> <output>
```

| Argument | Description |
|---|---|
| `key` | Contest key |
| `output` | Output **directory**; must not exist yet |

```sh
./scripts/manage.py export_contest_submissions lcoj_round1 exports/lcoj_round1
```

### export_contest_submissions_details

Export the per-test-case results of every submission in the contest to a **CSV file** with columns `username, problem, submission, testcase, points, time, memory, feedback`.

```sh
./scripts/manage.py export_contest_submissions_details <key> <output>
```

```sh
./scripts/manage.py export_contest_submissions_details lcoj_round1 exports/lcoj_round1_details.csv
```

### export_event_feed

Export a CLICS **XML** event feed for tools such as the ICPC Resolver.

```sh
./scripts/manage.py export_event_feed <key> <output> [--medal lastGold lastSilver lastBronze]
```

| Argument / option | Description | Default |
|---|---|---|
| `key` | Contest key | |
| `output` | Output file; must end in `.xml` | |
| `--medal` | Last rank that gets gold, silver and bronze, respectively | `4 8 12` |

```sh
./scripts/manage.py export_event_feed lcoj_icpc exports/lcoj_icpc.xml --medal 1 3 6
```

### runmoss

Run MOSS on the Accepted submissions of a contest (live and spectating participations), per problem and per language (C++, C, Java, Python, Pascal), and print the MOSS result URLs.

```sh
./scripts/manage.py runmoss <contest>
```

`contest` is the contest **key**. Requires `MOSS_API_KEY` (read from the environment on LCOJ). Contest organizers can also run MOSS from the contest's `/moss` page.

### merge_replay_data

Patch contest A's ranking replay with the participants of another contest B, shown as "ghosts". Useful for comparing a mirror contest on luyencode.net with the original.

```sh
./scripts/manage.py merge_replay_data <contest> <b_json>
```

| Argument | Description |
|---|---|
| `contest` | Key of contest A on this server |
| `b_json` | Replay data JSON of contest B (the format served at `/contest/<key>/replay/<version>/`) |

The command rebuilds A's replay data from the database (so re-running it does not duplicate ghosts), matches problems by **position**, bumps the contest's `replay_version`, writes the new file under `MEDIA_ROOT/contest_replay/`, and turns on the ghost toggle on the ranking page. Both contests must have the same number of problems; a warning is printed if their durations differ. Replay is only available for contests that can be replayed (public, ended, not frozen, ranking visible).

## Organizations

These commands recompute organization credit usage (judging time used by an organization's problems and contests). They take no arguments and write to the database.

### backfill_current_credit

Recompute every organization's usage for the **current month** and reset its free credit to `VNOJ_MONTHLY_FREE_CREDIT`.

```sh
./scripts/manage.py backfill_current_credit
```

### backfill_monthly_credit

Recompute monthly usage records for every organization, from June 2023 up to the last complete month.

```sh
./scripts/manage.py backfill_monthly_credit
```

## Site maintenance

### add_blog_navigation

Add a top-level navigation item `Blog` → `/blog/` (key `blog`) at the end of the navigation bar. Does nothing if an item with key `blog` already exists.

```sh
./scripts/manage.py add_blog_navigation
```

### generate_sitemap

Write static sitemap files: `<directory>/sitemap.xml` (index) plus one file per sitemap page in a subdirectory. The site also serves a dynamic `/sitemap.xml`, so this is only needed if you want to serve static files.

```sh
./scripts/manage.py generate_sitemap <directory> [-s SITE] [-p PROTOCOL] [-d SUBDIR] [-P PREFIX]
```

| Argument / option | Description | Default |
|---|---|---|
| `directory` | Output directory | |
| `-s`, `--site` | Site ID | Current site |
| `-p`, `--protocol` | Protocol used in links | `https` |
| `-d`, `--subdir`, `--subdirectory` | Subdirectory for individual sitemap files | `sitemaps` |
| `-P`, `--prefix` | URL prefix of individual sitemaps; must end with `/` | `<protocol>://<domain>/<subdir>/` |

Add `-v 2` to see progress.

### update_permissions

Create missing permissions and update the names of existing ones, for all apps or only the given ones. Run it after a model's `Meta.permissions` changes (see [Permissions](/en/admin/permissions)).

```sh
./scripts/manage.py update_permissions [--apps APP1,APP2] [--create-only | --update-only]
```

| Option | Description |
|---|---|
| `--apps` | Comma-separated app labels (default: all apps) |
| `--create-only` | Only create missing permissions |
| `--update-only` | Only rename existing permissions |

Use `-v 2` to print each renamed permission.

### makedmojmessages

Build the `dmoj-user` translation catalog from **database** strings (navigation bar labels and problem type names), instead of source code.

```sh
./scripts/manage.py makedmojmessages (-l LOCALE ... | -a) [-x LOCALE] [--no-wrap] [--no-obsolete] [--keep-pot]
```

| Option | Description |
|---|---|
| `-l`, `--locale` | Locale to create/update (repeatable), e.g. `vi` |
| `-a`, `--all` | Update all existing locales |
| `-x`, `--exclude` | Locale to skip (repeatable) |
| `--no-wrap` | Do not wrap long lines |
| `--no-obsolete` | Remove obsolete strings |
| `--keep-pot` | Keep the `.pot` file (for debugging) |

Then compile with `./scripts/manage.py compilemessages`.

### camo

Print the Camo proxy URL for an image URL. Fails with `Camo not available` if Camo is not configured (`DMOJ_CAMO_URL`, `DMOJ_CAMO_KEY`). See [SSL content proxy](/en/operate/ssl-content-proxy).

```sh
./scripts/manage.py camo <url>
```

## Tips

### Run a long command in the background

Use `-T` (no TTY) so the command keeps running when your SSH session ends:

```sh
COMPOSE_EXEC_FLAGS="-T" nohup ./scripts/manage.py generate_editorials --limit 100 > editorials.out 2>&1 &
tail -f editorials.out
```

### Schedule with cron

Run from the host's crontab; use the absolute path to `dmoj/` and `-T` because cron has no TTY:

```cron
# Recompute organization credit at 00:10 on the 1st of each month
10 0 1 * * cd /path/to/lcoj-docker/dmoj && COMPOSE_EXEC_FLAGS="-T" ./scripts/manage.py backfill_monthly_credit
```

## Getting help for a command

List all commands (built-in and LCOJ-specific):

```sh
./scripts/manage.py help
```

Show the arguments of one command:

```sh
./scripts/manage.py help <command>
# for example
./scripts/manage.py help adduser
```
