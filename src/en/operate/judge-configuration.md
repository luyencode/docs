# Judge configuration

The judge is configured through a YAML file that specifies programming languages, problem directories, and other settings.

Sample configuration file: [judge_conf.yml](https://github.com/luyencode/docs/blob/master/sample_files/judge_conf.yml)

## Configuration file structure

### ID - Judge name

The judge's display name. It must match the name created on the site:

```yaml
id: judge1
```

### Key - Authentication key

The secret key the judge uses to connect to the bridge. It must match the key on the site:

```yaml
key: your_secret_key_here
```

### Problem storage - Problem directories

A list of directories containing problems. Each problem directory must contain an `init.yml` file:

```yaml
problem_storage_globs:
  - /problems/*
  - /problems/archive/**
```

**Examples:**
- `/problems/*` - Matches all direct subdirectories of `/problems`
  - Matches: `/problems/bai1`, `/problems/bai2`
  - Does not match: `/problems/folder/bai3`

- `/problems/archive/**` - Matches all subdirectories (including nested ones)
  - Matches: `/problems/archive/2023/bai1`, `/problems/archive/bai2`

- `/problems/year20[0-9][0-9]` - Matches directories by pattern
  - Matches: `/problems/year2023`, `/problems/year2024`

### Runtimes - Programming languages

Configure the supported programming languages:

```yaml
runtime:
  python3: /usr/bin/python3
  gcc: /usr/bin/gcc
  g++: /usr/bin/g++
```

**Notes:** 
- Most languages are detected automatically with the `dmoj-autoconf` command
- Manual configuration is only needed if the program is not on your `$PATH`

## Complete configuration file

A complete `judge.yml` example:

```yaml
id: judge1
key: my_secret_authentication_key

problem_storage_globs:
  - /problems/*

runtime:
  python3: /usr/bin/python3
  python2: /usr/bin/python2
  gcc: /usr/bin/gcc
  g++: /usr/bin/g++
  java: /usr/bin/java
```

## Automatic language detection

To automatically detect the languages available on the system:

```sh
dmoj-autoconf > judge.yml
```

Then edit `judge.yml` to add `id`, `key`, and `problem_storage_globs`.

## Verifying the configuration

After editing the configuration file, restart the judge:

```sh
docker restart judge
```

Check the logs to make sure there are no errors:

```sh
docker logs judge
```
