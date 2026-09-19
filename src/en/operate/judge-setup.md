# Setting up a judge

This guide walks you through installing a judge (the grading system) and connecting it to the site. Only Linux (including WSL) is supported; Windows is not.

**Prerequisites:** The site must already be installed and the bridge must be running.

## Configuring the site

### Step 1: Add a new judge

Go to the admin page at `/admin/judge/` and add a new judge:
- Give the judge a name
- Create an authentication key — you can use the `Regenerate` button to generate one automatically

### Step 2: Check the connection address

In `local_settings.py`, find `BRIDGED_JUDGE_ADDRESS`. This is the address the judge will connect to:
- Default: `localhost:9999`
- If the judge runs on a different machine, replace `localhost` with the actual IP address
- **Important:** Make sure this port is open

### Step 3: Check that the bridge is running

Run the following command to check:

```sh
supervisorctl status
```

You should see a line like this:
```
bridged RUNNING pid <pid>, uptime <uptime>
```

## Installing the judge

We recommend installing the judge with Docker, since it is simple and easy to manage.

### Using the prebuilt Docker image

LCOJ uses the `tier3` Docker image, which supports the largest number of programming languages:
- Python 2/3
- C/C++ (GCC)
- Java 8
- Pascal
- And several other languages

See the full list on the [runtimes page](https://luyencode.net/runtimes).

### Building from source

To build the Docker image yourself:

```sh
git clone --recursive https://github.com/luyencode/judge-server.git
cd judge/.docker
make judge-tier3
```

### Running the judge

#### Preparation

Create a `judge.yml` configuration file:

```yaml
id: <judge name>
key: <authentication key>
problem_storage_globs:
  - /problems/*
```

**Notes:** 
- `id` must match the judge name you created on the site
- `key` must match the authentication key you created on the site
- The `/problems` directory contains the problem data

#### Starting the judge

```sh
docker run \
    --name judge \
    --network="host" \
    -v /mnt/problems:/problems \
    --cap-add=SYS_PTRACE \
    -d \
    --restart=always \
    luyencode/judge-tier3:latest \
    run -p 9999 -c /problems/judge.yml localhost -A 0.0.0.0 -a 12345
```

**Parameters:**
- `--name judge`: Container name
- `-v /mnt/problems:/problems`: Mounts the problems directory from the host into the container
- `-p 9999`: Port used to connect to the bridge (must match `BRIDGED_JUDGE_ADDRESS`)
- `-a 12345`: The judge's API port

**Notes on ports:**
- If you changed the port in `BRIDGED_JUDGE_ADDRESS`, change `-p 9999` to match
- If you run multiple judges, each judge needs:
  - A distinct container name (`--name`)
  - Its own configuration file (`judge.yml`)
  - A distinct API port (`-a`)

### Running multiple judges

To increase grading capacity, you can run several judges at the same time:

**Judge 1:**
```sh
docker run --name judge1 -v /mnt/problems:/problems --cap-add=SYS_PTRACE -d --restart=always --network="host" luyencode/judge-tier3:latest run -p 9999 -c /problems/judge1.yml localhost -A 0.0.0.0 -a 12345
```

**Judge 2:**
```sh
docker run --name judge2 -v /mnt/problems:/problems --cap-add=SYS_PTRACE -d --restart=always --network="host" luyencode/judge-tier3:latest run -p 9999 -c /problems/judge2.yml localhost -A 0.0.0.0 -a 12346
```

Each judge needs its own configuration file (`judge1.yml`, `judge2.yml`) with a different `id`.

## Verification

After starting the judge, check the site's admin page (`/admin/judge/`). The judge shows as "online" if it connected successfully.

## Troubleshooting

**The judge cannot connect:**
- Check that the bridge is running
- Check that the port is open
- Check that `id` and `key` in `judge.yml` match the site

**The judge keeps disconnecting:**
- Check the network connection
- Check the judge's logs: `docker logs judge`

**The judge does not pick up test data for new problems:**

This is the most common issue, usually caused by an incorrect path to the problems directory.

**Causes:**
- Incorrect volume mount path
- The problems directory is empty or not accessible
- Incorrect problem directory structure

**How to check:**

1. Check the problems directory inside the container:

```sh
docker exec judge ls -la /problems
```

You should see a list of problem directories. For example:
```
drwxr-xr-x 2 root root 4096 Jan 01 00:00 aplusb
drwxr-xr-x 2 root root 4096 Jan 01 00:00 hello
-rw-r--r-- 1 root root  123 Jan 01 00:00 judge.yml
```

2. Check the structure of a specific problem:

```sh
docker exec judge ls -la /problems/aplusb
```

It must contain these files:
```
-rw-r--r-- 1 root root  100 Jan 01 00:00 init.yml
-rw-r--r-- 1 root root   10 Jan 01 00:00 1.in
-rw-r--r-- 1 root root   10 Jan 01 00:00 1.out
```

3. Check access permissions:

```sh
docker exec judge cat /problems/aplusb/init.yml
```

If you see a "Permission denied" error, fix the permissions:

```sh
sudo chmod -R 755 /mnt/problems
```

**How to fix:**

If the directory is empty or incorrect, double-check the `docker run` command:

```sh
# Wrong - mounts the wrong directory
docker run -v /wrong/path:/problems ...

# Right - mounts the directory that contains the problems
docker run -v /mnt/problems:/problems ...
```

After fixing it, restart the judge:

```sh
docker stop judge
docker rm judge
# Rerun the docker run command with the correct path
```

**Check that the judge has loaded the problems:**

View the judge's logs:

```sh
docker logs judge | grep "problem"
```

You should see lines like these:
```
[INFO] Loaded problem: aplusb
[INFO] Loaded problem: hello
```

If you don't, the judge has not loaded the problems.
