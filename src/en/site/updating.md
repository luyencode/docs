# Updating LCOJ

LCOJ is updated regularly with new features and bug fixes. This guide explains how to update a Docker-based installation.

**Warning:** Always back up your data before updating!

## Back up before updating

### Back up the database

```sh
docker exec lcoj_mysql mysqldump -u root -p<password> lcoj | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Back up media and problems

```sh
tar -czf media_backup_$(date +%Y%m%d).tar.gz dmoj/media/
tar -czf problems_backup_$(date +%Y%m%d).tar.gz dmoj/problems/
```

## Update steps

### Step 1: Pull the latest source code

```sh
cd lcoj-docker/dmoj
git pull origin master
git submodule update --init --recursive
```

**Note:** `git submodule update` is essential: it updates the code in `repo/`.

### Step 2: Review the changes

```sh
git log --oneline -10
git diff HEAD~1 docker-compose.yml
```

Check whether anything changed in docker-compose.yml or the environment files.

### Step 3: Update the environment (if needed)

If new environment variables were added, update your `environment/*.env` files.

Compare against the example file:

```sh
diff environment/site.env environment/site.env.example
```

### Step 4: Rebuild the images

```sh
docker compose build
```

Or rebuild only the services that need it:

```sh
docker compose build site celery bridged wsevent
```

### Step 5: Run migrations

```sh
./scripts/migrate
```

Check that there are no errors:

```sh
./scripts/manage.py check
```

### Step 6: Update static files

```sh
./scripts/copy_static
```

### Step 7: Restart services

```sh
docker compose up -d --no-deps site celery bridged wsevent
```

**What the flags do:**
- `--no-deps`: Does not restart dependencies (db, redis)
- Only the services whose code changed are restarted

## Automation script

You can write a script to automate the update process:

**File: `update.sh`**

```bash
#!/bin/bash

set -e  # Exit on error

echo "=== Starting LCOJ update ==="
echo

# Backup database
echo "1. Backup database..."
docker exec lcoj_mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} lcoj | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Backup media
echo "2. Backup media files..."
tar -czf media_backup_$(date +%Y%m%d_%H%M%S).tar.gz dmoj/media/

# Pull new code
echo "3. Pulling new source code..."
git pull origin master
git submodule update --init --recursive

# Rebuild images
echo "4. Rebuild Docker images..."
docker compose build site celery bridged wsevent

# Run migrations
echo "5. Running migrations..."
./scripts/migrate

# Update static files
echo "6. Updating static files..."
./scripts/copy_static

# Restart services
echo "7. Restart services..."
docker compose up -d --no-deps site celery bridged wsevent

# Check status
echo "8. Checking status..."
docker compose ps

echo
echo "=== Update complete! ==="
echo "Check logs: docker compose logs -f site"
```

Make it executable:

```sh
chmod +x update.sh
```

Run the script:

```sh
cd lcoj-docker/dmoj
./update.sh
```

## Troubleshooting

### Migration errors

If `migrate` fails:

```sh
# List unapplied migrations
./scripts/manage.py showmigrations

# Run a specific migration
./scripts/manage.py migrate <app_name> <migration_name>

# Fake a migration (if it was already applied manually)
./scripts/manage.py migrate --fake <app_name> <migration_name>
```

### Static file errors

If static files don't load:

```sh
# Delete old static files
docker compose exec site rm -rf /assets/*

# Collect them again
./scripts/copy_static

# Restart nginx
docker compose restart nginx
```

### Dependency errors

If you get errors about Python libraries:

```sh
# Rebuild the image from scratch (no cache)
docker compose build --no-cache site celery

# Restart services
docker compose up -d site celery
```

### Container won't start

```sh
# View detailed logs
docker compose logs --tail=100 site

# View the exit code
docker inspect lcoj_site | grep ExitCode

# Try starting it with live logs
docker compose up site
```

## Rollback

If the update causes problems, you can roll back:

### Roll back the code

```sh
# Go back to the previous commit
git reset --hard HEAD~1
git submodule update --init --recursive

# Or go back to a specific commit
git reset --hard <commit_hash>
git submodule update --init --recursive

# Rebuild images
docker compose build site celery bridged wsevent

# Restart services
docker compose up -d --no-deps site celery bridged wsevent
```

### Restore the database

```sh
# Stop the site to avoid conflicts
docker compose stop site celery

# Restore from backup
gunzip < backup_20240101_120000.sql.gz | docker exec -i lcoj_mysql mysql -u root -p<password> lcoj

# Start again
docker compose start site celery
```

### Restore media files

```sh
tar -xzf media_backup_20240101_120000.tar.gz
docker compose restart site nginx
```

## Post-update checks

### Check services

```sh
# View status
docker compose ps

# View logs
docker compose logs -f --tail=50 site
docker compose logs -f --tail=50 celery
```

### Check functionality

- Open the website and check the interface
- Log in with an admin account
- Try submitting a solution
- Check the admin site
- Test the judge bridge: `docker compose logs bridged`

### Check performance

```sh
# Resource usage
docker stats

# Response time
curl -w "@curl-format.txt" -o /dev/null -s http://localhost
```

**File: `curl-format.txt`**

```
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
```

## Notes

- Schedule updates for off-peak hours
- Notify users of the maintenance window in advance
- Always back up before updating
- Test in a development environment before updating production
