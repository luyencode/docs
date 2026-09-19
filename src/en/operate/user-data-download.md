# User Data Download

LCOJ lets users download their own data, including comments and submissions.

This feature is disabled by default. To enable it, configure it in `local_settings.py`.

## Configuration

### With Docker (recommended)

The cache directory is already set up in the `userdatacache` Docker volume.

Just add the following to `environment/site.env`:

```env
DMOJ_USER_DATA_DOWNLOAD=True
DMOJ_USER_DATA_CACHE=/userdatacache/
DMOJ_USER_DATA_INTERNAL=/userdatacache
```

Restart the services:

```sh
docker compose restart site celery
```

### With bare metal

Configure it in `local_settings.py`:

```python
DMOJ_USER_DATA_DOWNLOAD = True
DMOJ_USER_DATA_CACHE = '/home/dmoj-uwsgi/userdatacache'
DMOJ_USER_DATA_INTERNAL = '/userdatacache'
DMOJ_USER_DATA_DOWNLOAD_RATELIMIT = datetime.timedelta(days=1)
```

### Configure Nginx (if needed)

**With Docker:** The Nginx config is already set up; no changes needed.

**With bare metal:** Add the following to your nginx config:

```nginx
location /userdatacache {
    internal;
    root /home/dmoj-uwsgi/;
}
```

### Restart

**With Docker:**

```sh
docker compose restart site celery nginx
```

**With bare metal:**

**Docker:**

```sh
docker compose restart site nginx
```

**Bare metal:**

```sh
supervisorctl restart site
service nginx reload
```

## Cleaning up old files

Data files are not deleted automatically. Clean up old files periodically.

### With Docker

```sh
# Run manually
docker compose exec site find /userdatacache/ -type f -mtime +2 -delete

# Or create a cron job on the host
0 */4 * * * docker compose -f /path/to/lcoj-docker/dmoj/docker-compose.yml exec -T site find /userdatacache/ -type f -mtime +2 -delete
```

### With bare metal

```sh
crontab -e
```

Add:

```
0 */4 * * * find /home/dmoj-uwsgi/userdatacache/ -type f -mtime +2 -delete
```

**Explanation:**
- `0 */4 * * *`: Runs at minute 0 every 4 hours
- `find ... -mtime +2`: Finds files older than 2 days
- `-delete`: Deletes the files found

**Note:** Adjust the schedule to match `RATELIMIT`.

## Usage

Once configured, users can:

1. Open the _Edit profile_ page
2. Find the _Data download_ section
3. Choose the data to download (comments, submissions)
4. Click _Request download_
5. Wait for the system to generate the file (this may take a few minutes)
6. Download the file

## Data format

### Comments (comments.json)

```json
[
    {
        "id": 123,
        "page": "problem/APLUSB",
        "time": "2024-01-01T00:00:00Z",
        "score": 5,
        "body": "Comment content"
    }
]
```

### Submissions (submissions.json)

```json
[
    {
        "id": 123456,
        "problem": "APLUSB",
        "date": "2024-01-01T00:00:00Z",
        "language": "CPP17",
        "result": "AC",
        "points": 100,
        "time": 0.1,
        "memory": 2048,
        "source": "// Source code"
    }
]
```

## Troubleshooting

**The file is not generated:**
- Check the cache directory permissions
- Check Celery (Docker): `docker compose ps celery`
- Check the logs (Docker): `docker compose logs -f celery`
- Check Celery (bare metal): `supervisorctl status celery`
- Check the logs (bare metal): `supervisorctl tail -f celery`

**The file cannot be downloaded:**
- Check the nginx config
- Check the `DMOJ_USER_DATA_INTERNAL` path
- Check the nginx logs: `tail -f /var/log/nginx/error.log`

**Rate limit errors:**
- Users must wait for the period configured in `RATELIMIT`
- The default is 1 day

## Security

- Only the owning user can download their data file
- Files have random, hard-to-guess names
- Clean up old files regularly
- Do not keep files on the server for too long
