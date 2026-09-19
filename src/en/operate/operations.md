# Operating LCOJ

A day-to-day operations guide for running LCOJ with Docker.

## Starting and stopping

### Start all services

```sh
cd lcoj-docker/dmoj
docker compose up -d
```

### Stop all services

```sh
docker compose down
```

**Note:** This command does NOT delete any data. The database and media files are preserved.

### Stop and remove everything (including volumes)

```sh
docker compose down -v
```

**Warning:** This command DELETES the database! Use it only when you want a complete reset.

## Managing individual services

### Restart a service

```sh
docker compose restart site
docker compose restart celery
docker compose restart nginx
```

### Stop a service

```sh
docker compose stop site
```

### Start a stopped service

```sh
docker compose start site
```

### Rebuild and restart

```sh
docker compose up -d --build site
```

## Viewing logs

### Logs for all services

```sh
docker compose logs -f
```

### Logs for a single service

```sh
docker compose logs -f site
docker compose logs -f celery
docker compose logs -f nginx
```

### Limit the number of log lines

```sh
docker compose logs --tail=100 site
```

### Logs within a time range

```sh
docker compose logs --since 1h site
docker compose logs --since "2024-01-01 00:00:00" site
```

### Save logs to a file

```sh
docker compose logs site > site_logs.txt
```

## Monitoring the system

### Resource usage

```sh
docker stats
```

Shows CPU, RAM, network, and disk I/O for each container.

### Disk usage

```sh
# Overview
docker system df

# Details
docker system df -v
```

### Container status

```sh
docker compose ps
```

### View processes in a container

```sh
docker compose top site
```

## Accessing containers

### Open a shell in a container

```sh
docker compose exec site bash
docker compose exec db bash
```

### Run a command in a container

```sh
docker compose exec site python manage.py check
docker compose exec db mysql -u root -p
```

### View a file in a container

```sh
docker compose exec site cat /site/local_settings.py
```

## Database operations

### Back up the database

```sh
# Full backup
docker exec lcoj_mysql mysqldump -u root -p<password> lcoj > backup.sql

# Backup with timestamp
docker exec lcoj_mysql mysqldump -u root -p<password> lcoj > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup and compress
docker exec lcoj_mysql mysqldump -u root -p<password> lcoj | gzip > backup.sql.gz
```

### Restore the database

```sh
# Restore from a file
docker exec -i lcoj_mysql mysql -u root -p<password> lcoj < backup.sql

# Restore from a compressed file
gunzip < backup.sql.gz | docker exec -i lcoj_mysql mysql -u root -p<password> lcoj
```

### Open the MySQL shell

```sh
docker compose exec db mysql -u root -p
```

### Run an SQL query

```sh
docker compose exec db mysql -u root -p<password> lcoj -e "SELECT COUNT(*) FROM judge_submission;"
```

## Migrations

### Run migrations

```sh
./scripts/migrate
```

### List unapplied migrations

```sh
./scripts/manage.py showmigrations
```

### Roll back a migration

```sh
./scripts/manage.py migrate <app_name> <migration_name>
```

### Create a new migration

```sh
./scripts/manage.py makemigrations
```

## Static files

### Collect static files

```sh
./scripts/copy_static
```

### Remove old static files

```sh
docker compose exec site rm -rf /assets/*
./scripts/copy_static
```

## Cache management

### Clear cache

```sh
docker compose exec site python manage.py clear_cache
```

### Restart Redis

```sh
docker compose restart redis
```

### Flush Redis

```sh
docker compose exec redis redis-cli FLUSHALL
```

## Celery tasks

### View active tasks

```sh
docker compose exec celery celery -A dmoj_celery inspect active
```

### View scheduled tasks

```sh
docker compose exec celery celery -A dmoj_celery inspect scheduled
```

### Purge all tasks

```sh
docker compose exec celery celery -A dmoj_celery purge
```

### Restart Celery

```sh
docker compose restart celery
```

## Problem data

### Upload problem data

```sh
# Copy into the problems directory
cp -r /path/to/problem dmoj/problems/

# Set permissions
chmod -R 755 dmoj/problems/
```

### Back up problems

```sh
tar -czf problems_backup_$(date +%Y%m%d).tar.gz dmoj/problems/
```

### Restore problems

```sh
tar -xzf problems_backup_20240101.tar.gz
```

## Media files

### Back up media

```sh
tar -czf media_backup_$(date +%Y%m%d).tar.gz dmoj/media/
```

### Clean up old media

```sh
# Delete files older than 30 days
find dmoj/media/ -type f -mtime +30 -delete
```

## Monitoring scripts

### Health check script

**File: `check_health.sh`**

```bash
#!/bin/bash

echo "=== LCOJ Health Check ==="
echo

echo "Container Status:"
docker compose ps

echo
echo "Resource Usage:"
docker stats --no-stream

echo
echo "Disk Usage:"
df -h | grep -E "/$|/var"

echo
echo "Database Status:"
docker compose exec -T db mysqladmin -u root -p<password> status

echo
echo "Redis Status:"
docker compose exec -T redis redis-cli ping

echo
echo "Site Status:"
curl -s -o /dev/null -w "%{http_code}" http://localhost
```

### Automated backup script

**File: `backup.sh`**

```bash
#!/bin/bash

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "Starting backup at $DATE"

# Backup database
echo "Backing up database..."
docker exec lcoj_mysql mysqldump -u root -p<password> lcoj | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup media
echo "Backing up media..."
tar -czf $BACKUP_DIR/media_$DATE.tar.gz dmoj/media/

# Backup problems
echo "Backing up problems..."
tar -czf $BACKUP_DIR/problems_$DATE.tar.gz dmoj/problems/

# Delete old backups (older than 7 days)
echo "Cleaning old backups..."
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed!"
```

### Backup cron jobs

```cron
# Back up every day at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/lcoj_backup.log 2>&1

# Health check every 5 minutes
*/5 * * * * /path/to/check_health.sh >> /var/log/lcoj_health.log 2>&1
```

## Performance optimization

### View slow queries

```sh
docker compose exec db mysql -u root -p -e "
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
SHOW VARIABLES LIKE 'slow_query%';
"
```

### Analyze the database

```sh
docker compose exec db mysqlcheck -u root -p --analyze --all-databases
```

### Optimize the database

```sh
docker compose exec db mysqlcheck -u root -p --optimize --all-databases
```

## Security

### Change the database password

```sh
# Open the MySQL shell
docker compose exec db mysql -u root -p

# Change the password
ALTER USER 'lcoj'@'%' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

Then update `environment/mysql.env` and restart:

```sh
docker compose restart site celery bridged
```

### View failed login attempts

```sh
docker compose logs site | grep "Failed login"
```

### Block an IP

Add to `nginx/conf.d/nginx.conf`:

```nginx
deny 1.2.3.4;
```

Restart nginx:

```sh
docker compose restart nginx
```

## Troubleshooting

### Container keeps crashing

```sh
# View logs
docker compose logs --tail=100 <service>

# View the exit code
docker inspect <container> | grep ExitCode

# Restart with logs attached
docker compose up <service>
```

### Out of memory

```sh
# View memory usage
docker stats

# Raise the memory limit
# Add to docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 4G
```

### Disk full

```sh
# View disk usage
df -h

# Remove unused Docker resources
docker system prune -a

# Delete old logs
find /var/lib/docker/containers/ -name "*.log" -mtime +7 -delete
```

### Database locked

```sh
# View processes
docker compose exec db mysql -u root -p -e "SHOW PROCESSLIST;"

# Kill a process
docker compose exec db mysql -u root -p -e "KILL <process_id>;"
```

### Celery tasks stuck

```sh
# View active tasks
docker compose exec celery celery -A dmoj_celery inspect active

# Revoke a task
docker compose exec celery celery -A dmoj_celery control revoke <task_id>

# Restart Celery
docker compose restart celery
```

## Maintenance mode

### Enable maintenance mode

Create the file `dmoj/repo/maintenance.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Maintenance</title>
</head>
<body>
    <h1>Under maintenance</h1>
    <p>The system is currently under maintenance. Please check back later.</p>
</body>
</html>
```

Update the nginx config:

```nginx
if (-f /site/maintenance.html) {
    return 503;
}

error_page 503 @maintenance;
location @maintenance {
    root /site;
    rewrite ^(.*)$ /maintenance.html break;
}
```

### Disable maintenance mode

```sh
rm dmoj/repo/maintenance.html
docker compose restart nginx
```

## See also

- [Installation](/en/operate/installation)
- [Updating](/en/operate/updating)
- [Management Commands](/en/reference/management-commands)
