# Restore Howto — cothilaptrinh

Step-by-step commands to restore the site from a Google Drive backup.
Run all commands from the repo root unless noted otherwise.

## Prerequisites

- rclone installed and `gdrive` remote configured (see `backup-setup.md`)
- Docker Compose available on the host
- Know your `BACKUP_PREFIX` (set in `dmoj/environment/backup.env`)

## Step 1 — List available backups

```bash
source dmoj/environment/backup.env
rclone ls "$RCLONE_REMOTE"
```

Note the date you want to restore (format: `YYYY-MM-DD`).

## Step 2 — Download the backup files

```bash
source dmoj/environment/backup.env
DATE="YYYY-MM-DD"   # ← set this
mkdir -p /tmp/restore
rclone copy "${RCLONE_REMOTE}/${BACKUP_PREFIX}-db-${DATE}.sql.gz"       /tmp/restore/
rclone copy "${RCLONE_REMOTE}/${BACKUP_PREFIX}-media-${DATE}.tar.gz"    /tmp/restore/
rclone copy "${RCLONE_REMOTE}/${BACKUP_PREFIX}-problems-${DATE}.tar.gz" /tmp/restore/
```

## Step 3 — Restore the database

The `db` container must be running. Enter the root password from
`dmoj/environment/mysql-admin.env` (`MYSQL_ROOT_PASSWORD`) when prompted.

```bash
source dmoj/environment/backup.env
gunzip -c "/tmp/restore/${BACKUP_PREFIX}-db-${DATE}.sql.gz" \
  | docker compose -f dmoj/docker-compose.yml exec -T db \
    mysql -u root -p
```

## Step 4 — Restore media files

Stop the site first to avoid file conflicts during extraction.

```bash
source dmoj/environment/backup.env
docker compose -f dmoj/docker-compose.yml stop site celery
tar xzf "/tmp/restore/${BACKUP_PREFIX}-media-${DATE}.tar.gz" -C dmoj/
```

## Step 5 — Restore problem test data

```bash
source dmoj/environment/backup.env
tar xzf "/tmp/restore/${BACKUP_PREFIX}-problems-${DATE}.tar.gz" -C dmoj/
```

## Step 6 — Restart services

```bash
docker compose -f dmoj/docker-compose.yml restart site celery bridged
```

## Step 7 — Verify

- Open the site in a browser and confirm it loads.
- Submit a test problem and confirm judging works.
- Check `dmoj/media/` has the expected files.

## Cleanup

```bash
rm -rf /tmp/restore/
```
