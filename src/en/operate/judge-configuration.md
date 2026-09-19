# Judge configuration

> Each judge reads a YAML file at startup, passed in with the `-c` argument. This page explains the keys in that file and how to apply changes.
>
> ⏱ ~10 min · 👤 Operators · 🔑 SSH to the server (to edit `dmoj/problems/`) + permission to run `docker` on the judge machine

For how to run a judge, see [Setting up judges](/en/operate/judge-setup). *YAML* is a `key: value` configuration file format; a *glob* is a path pattern with wildcards such as `*`. For other terms, see the [Glossary](/en/start/glossary).

## Before you start

- [ ] At least one judge is registered on the site and runs as described in [Setting up judges](/en/operate/judge-setup).
- [ ] You know the judge container's name (e.g. `judge_judge1`) and its config file name.
- [ ] You have SSH access to the server to edit files in `lcoj-docker/dmoj/problems/`.

## Where the config file lives

In LCOJ, the config file goes in the shared problems directory `dmoj/problems` on the server, named `judge_<name>.yml`. That directory is mounted into the judge container at `/problems`, so the judge reads the file through its in-container path:

| On the server | Inside the judge container | Argument |
|---|---|---|
| `lcoj-docker/dmoj/problems/judge_judge1.yml` | `/problems/judge_judge1.yml` | `-c /problems/judge_judge1.yml` |
| `lcoj-docker/dmoj/problems/<problem code>/init.yml` | `/problems/<problem code>/init.yml` | (found automatically through `problem_storage_globs`) |

## Sample config file

The minimal config for a judge running the `vnoj/judge-tier3` image:

```yaml
# Judge name, matching the name created in the admin panel (/admin/judge/judge/)
id: "judge1"

# Authentication key, matching that judge's "Authentication key" on the site
key: "<key>"

# Where to find problems: any directory matching a glob below that contains init.yml is a problem
problem_storage_globs:
  - /problems/*
```

These three keys are enough for most setups. The Docker image has already detected the available languages (see [Runtimes](#runtime)).

::: warning Never commit real keys
`judge_*.yml` files contain authentication keys. Don't commit them, and don't paste their real contents into issues or docs.
:::

## Key reference

### `id`: judge name

```yaml
id: "judge1"
```

Must match the judge's **Name** on the site **exactly** (case-sensitive). A name passed on the command line (`... localhost judge1 "<key>"`) or through the `DMOJ_JUDGE_NAME` environment variable overrides `id` in the file.

### `key`: authentication key

```yaml
key: "<key>"
```

Must match the **Authentication key** field on the site. Quote it, since keys can contain `+`, `/`, and `=`. As with `id`, a key passed on the command line or through the `DMOJ_JUDGE_KEY` environment variable overrides the value in the file.

### `problem_storage_globs`: problem directories

```yaml
problem_storage_globs:
  - /problems/*
```

A list of glob patterns. The judge looks for `init.yml` in every directory that matches; each directory with an `init.yml` is a problem, and **the directory name is the problem code**. This key is **required**: without it, the judge exits with `no problems available to grade`.

| Pattern | Matches | Doesn't match |
|---|---|---|
| `/problems/*` | `/problems/aplusb`, `/problems/hello` | `/problems/archive/aplusb` |
| `/problems/archive/**` | `/problems/archive/aplusb`, `/problems/archive/2024/hello` (any depth) | `/problems/aplusb` |
| `/problems/year20[0-9][0-9]/*` | `/problems/year2024/aplusb` | `/problems/year24/aplusb` |

::: tip Use `/problems/*` with LCOJ
The site stores problem data in `/problems/<problem code>/` (`DMOJ_PROBLEM_DATA_ROOT = '/problems/'`), so `/problems/*` matches every problem uploaded through the site. The judge watches this directory, so new problems and new test data are picked up without restarting the judge.
:::

### `runtime`: programming languages {#runtime}

The `runtime` key maps program names to their paths, for example:

```yaml
runtime:
  gcc: /usr/bin/gcc
  g++: /usr/bin/g++
  python3: /usr/bin/python3
```

**With the Docker image, you don't need this key.** At build time, the image runs `dmoj-autoconf` and saves the result to `/judge-runtime-paths.yml`. When the judge starts inside Docker, that file is loaded first, then your config file.

::: danger Declaring `runtime` replaces every detected runtime
Config files are merged by **top-level key**. If you add a `runtime:` block to `judge_*.yml`, it **completely replaces** the runtimes the image detected instead of adding to them. The judge will only have the languages you list. To drop some languages, use `-e`/`-x` instead (see [below](#choosing-languages-at-startup)).
:::

If you install the judge directly (without Docker), run `dmoj-autoconf` to print a `runtime` block for your machine, then copy it into your config file.

### Other optional keys

These keys all have defaults. Only add them when you need to.

| Key | Default | Meaning |
|---|---|---|
| `compiler_time_limit` | `10` | Maximum seconds for one compilation |
| `compiler_output_character_limit` | `65536` | Maximum characters of compiler output |
| `compiled_binary_cache_dir` | (temp directory) | Where compiled executables are cached for reuse |
| `compiled_binary_cache_size` | `100` | Number of compiled files kept in the cache |
| `test_size_limit` | `262144` | Maximum size of one test (KB, i.e. 256 MB) |
| `tempdir` | (system default, e.g. `/tmp`) | Temporary directory for submissions while grading |
| `submission_cpu_affinity` | (unset) | List of CPU cores (0-indexed) to run submissions on, e.g. `[2, 3]` |
| `generator_time_limit`, `generator_memory_limit` | `20`, `524288` | Time (seconds) and memory (KB) limits for generators |
| `validator_time_limit`, `validator_memory_limit` | `20`, `524288` | Time (seconds) and memory (KB) limits for validators |
| `selftest_time_limit`, `selftest_memory_limit` | `10`, `131072` | Limits for the language self-test at startup |

## Choosing languages at startup {#choosing-languages-at-startup}

Instead of editing `runtime`, you can limit languages with `dmoj` command-line arguments. Languages are named by executor code, such as `CPP17`, `PY3`, or `PAS`:

| Argument | Meaning |
|---|---|
| `-e CPP17,PY3` | Load only the listed languages |
| `-x JAVA8,PYPY` | Load every language except the listed ones |
| `--skip-self-test` | Skip the language self-test (faster startup, but broken languages won't be filtered out) |

`-e` and `-x` can't be used together. For example, a judge that only grades C++17 and Python 3:

```sh
docker run ... vnoj/judge-tier3 \
    run -p 9999 -c /problems/judge_judge1.yml -a 12345 -e CPP17,PY3 \
    localhost judge1 "<key>"
```

## Applying changes

1. Edit `dmoj/problems/judge_<name>.yml` on the server.
2. Restart the judge:

   ```sh
   docker restart judge_judge1
   ```

## Verify

Check the logs for errors and confirm the judge reconnected:

```sh
docker logs -f judge_judge1
```

A line like `Judge "judge1" online: [localhost]:9999` means the judge is ready. You can also check the list of judges and languages on the site's `/status/` page.

## Troubleshooting

| Symptom | Fix |
|---|---|
| The judge exits with `no problems available to grade` | Add the `problem_storage_globs` key (e.g. `/problems/*`) |
| The bridge logs `Judge authentication failure` | Compare `id` (case-sensitive) and `key` with the record at `/admin/judge/judge/`; remember command-line arguments and `DMOJ_JUDGE_NAME`/`DMOJ_JUDGE_KEY` override the file |
| After editing the config, the judge has only a few languages | You added a `runtime:` block, which replaces the auto-detected runtimes. Remove it and filter with `-e`/`-x` instead |
| The judge won't start with both `-e` and `-x` | The two can't be combined; keep only one |
| Problems in subdirectories aren't picked up | The glob `/problems/*` matches one level only; use `**` for all levels |
| Edits have no effect | The judge wasn't restarted: `docker restart judge_judge1` |

For other connection problems, see [Setting up judges](/en/operate/judge-setup).

## Next steps

- [Setting up judges](/en/operate/judge-setup): run more judges, or run a judge on another machine.
- [Supported languages](/en/reference/languages): executor codes (`CPP17`, `PY3`…) to use with `-e`/`-x`.
- [Operating LCOJ](/en/operate/operations): reading `bridged` logs and other day-to-day tasks.

::: tip Need help?
- Open an issue on [GitHub Issues](https://github.com/luyencode/lcoj-docker/issues)
- More resources at [behitek.com](https://behitek.com)
- LCOJ offers free installation help: [luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he)
:::
