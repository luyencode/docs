# Backup Setup — cothilaptrinh

How to install, configure, and schedule the automated daily backup to Google Drive.

## What gets backed up

| File on Google Drive | Source |
|---|---|
| `<prefix>-db-YYYY-MM-DD.sql.gz` | MariaDB full dump (`mysqldump --single-transaction`) |
| `<prefix>-media-YYYY-MM-DD.tar.gz` | `dmoj/media/` (user uploads, avatars) |
| `<prefix>-problems-YYYY-MM-DD.tar.gz` | `dmoj/problems/` (test data) |

The prefix and retention period are controlled by `dmoj/environment/backup.env`.

## Prerequisites

1. **rclone** — uploads to Google Drive

   ```bash
   curl https://rclone.org/install.sh | sudo bash
   rclone --version   # expect: rclone v1.x.x
   ```

2. **mail** — sends failure email alerts

   ```bash
   sudo apt install -y mailutils
   ```
   Configure your MTA or SMTP relay so `mail` can actually send (e.g. `msmtp`, `postfix` with Gmail relay).

## Create the backup config file

Copy the example and fill in your values:

```bash
cp dmoj/environment/backup.env.example dmoj/environment/backup.env
```

Edit `dmoj/environment/backup.env`:

```bash
# Short prefix used in all backup filenames and the log file
BACKUP_PREFIX=cothilaptrinh

# Email to notify on failure
NOTIFY_EMAIL=your@email.com

# rclone remote path (remote must be configured first — see next section)
RCLONE_REMOTE=gdrive:cothilaptrinh-backups

# Days to keep backups on Google Drive
RETENTION_DAYS=7

# Log file on the host
LOG_FILE=/var/log/cothilaptrinh-backup.log
```

`backup.env` is gitignored — it will never be committed.

## Configure Google Drive remote

```bash
rclone config
```

Follow the prompts:
1. `n` — new remote
2. Name: `gdrive`
3. Storage: `drive` (Google Drive)
4. `client_id` and `client_secret`: leave blank
5. Scope: `1` (full access)
6. `root_folder_id`: leave blank
7. Auto config: `y` — browser opens, log in with the target Google account
8. Team drive: `n`
9. Confirm: `y`

Verify:

```bash
rclone lsd gdrive:
```

Expected: your Google Drive top-level folders are listed.

## Configure log rotation

```bash
sudo tee /etc/logrotate.d/backup > /dev/null <<EOF
$(grep LOG_FILE dmoj/environment/backup.env | cut -d= -f2) {
    weekly
    rotate 4
    compress
    missingok
    notifempty
}
EOF
```

Or manually create `/etc/logrotate.d/backup` with the log file path from your `backup.env`.

Verify:

```bash
sudo logrotate --debug /etc/logrotate.d/backup
```

## Schedule with cron

```bash
crontab -e
```

Add (use the real absolute path):

```
0 3 * * * /absolute/path/to/dmoj/scripts/backup.sh >> /var/log/cothilaptrinh-backup.log 2>&1
```

Find the absolute path:

```bash
realpath dmoj/scripts/backup.sh
```

Use the same log path as `LOG_FILE` in `backup.env`.

Verify:

```bash
crontab -l | grep backup
```

## Test the backup manually

Run once before relying on cron:

```bash
/absolute/path/to/dmoj/scripts/backup.sh
```

Expected output ends with: `Backup completed successfully.`

Confirm files on Drive:

```bash
rclone ls gdrive:cothilaptrinh-backups/
```

Expected: three files prefixed with your `BACKUP_PREFIX` for today's date.

## Checking the log

```bash
tail -50 "$LOG_FILE"   # use the path from backup.env
```
