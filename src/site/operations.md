# Vận hành LCOJ

Hướng dẫn vận hành hàng ngày cho LCOJ với Docker.

## Khởi động và dừng

### Khởi động tất cả services

```sh
cd lcoj-docker/dmoj
docker compose up -d
```

### Dừng tất cả services

```sh
docker compose down
```

**Lưu ý:** Lệnh này KHÔNG xóa data. Database và media files vẫn được giữ.

### Dừng và xóa tất cả (bao gồm volumes)

```sh
docker compose down -v
```

**Cảnh báo:** Lệnh này XÓA database! Chỉ dùng khi muốn reset hoàn toàn.

## Quản lý từng service

### Restart một service

```sh
docker compose restart site
docker compose restart celery
docker compose restart nginx
```

### Stop một service

```sh
docker compose stop site
```

### Start một service đã stop

```sh
docker compose start site
```

### Rebuild và restart

```sh
docker compose up -d --build site
```

## Xem logs

### Logs tất cả services

```sh
docker compose logs -f
```

### Logs một service

```sh
docker compose logs -f site
docker compose logs -f celery
docker compose logs -f nginx
```

### Logs với số dòng giới hạn

```sh
docker compose logs --tail=100 site
```

### Logs trong khoảng thời gian

```sh
docker compose logs --since 1h site
docker compose logs --since "2024-01-01 00:00:00" site
```

### Lưu logs ra file

```sh
docker compose logs site > site_logs.txt
```

## Theo dõi hệ thống

### Resource usage

```sh
docker stats
```

Hiển thị CPU, RAM, Network, Disk I/O của từng container.

### Disk usage

```sh
# Tổng quan
docker system df

# Chi tiết
docker system df -v
```

### Container status

```sh
docker compose ps
```

### Xem processes trong container

```sh
docker compose top site
```

## Truy cập container

### Exec vào container

```sh
docker compose exec site bash
docker compose exec db bash
```

### Chạy lệnh trong container

```sh
docker compose exec site python manage.py check
docker compose exec db mysql -u root -p
```

### Xem file trong container

```sh
docker compose exec site cat /site/local_settings.py
```

## Database operations

### Backup database

```sh
# Backup toàn bộ
docker exec lcoj_mysql mysqldump -u root -p<password> lcoj > backup.sql

# Backup với timestamp
docker exec lcoj_mysql mysqldump -u root -p<password> lcoj > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup và compress
docker exec lcoj_mysql mysqldump -u root -p<password> lcoj | gzip > backup.sql.gz
```

### Restore database

```sh
# Restore từ file
docker exec -i lcoj_mysql mysql -u root -p<password> lcoj < backup.sql

# Restore từ compressed file
gunzip < backup.sql.gz | docker exec -i lcoj_mysql mysql -u root -p<password> lcoj
```

### Truy cập MySQL shell

```sh
docker compose exec db mysql -u root -p
```

### Chạy SQL query

```sh
docker compose exec db mysql -u root -p<password> lcoj -e "SELECT COUNT(*) FROM judge_submission;"
```

## Migrations

### Chạy migrations

```sh
./scripts/migrate
```

### Xem migrations chưa chạy

```sh
./scripts/manage.py showmigrations
```

### Rollback migration

```sh
./scripts/manage.py migrate <app_name> <migration_name>
```

### Tạo migration mới

```sh
./scripts/manage.py makemigrations
```

## Static files

### Collect static files

```sh
./scripts/copy_static
```

### Xóa static files cũ

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

### Xem active tasks

```sh
docker compose exec celery celery -A dmoj_celery inspect active
```

### Xem scheduled tasks

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
# Copy vào thư mục problems
cp -r /path/to/problem dmoj/problems/

# Set permissions
chmod -R 755 dmoj/problems/
```

### Backup problems

```sh
tar -czf problems_backup_$(date +%Y%m%d).tar.gz dmoj/problems/
```

### Restore problems

```sh
tar -xzf problems_backup_20240101.tar.gz
```

## Media files

### Backup media

```sh
tar -czf media_backup_$(date +%Y%m%d).tar.gz dmoj/media/
```

### Clean old media

```sh
# Xóa file cũ hơn 30 ngày
find dmoj/media/ -type f -mtime +30 -delete
```

## Monitoring scripts

### Script kiểm tra health

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

### Script backup tự động

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

### Cron job cho backup

```cron
# Backup mỗi ngày lúc 2 giờ sáng
0 2 * * * /path/to/backup.sh >> /var/log/lcoj_backup.log 2>&1

# Health check mỗi 5 phút
*/5 * * * * /path/to/check_health.sh >> /var/log/lcoj_health.log 2>&1
```

## Performance optimization

### Xem slow queries

```sh
docker compose exec db mysql -u root -p -e "
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
SHOW VARIABLES LIKE 'slow_query%';
"
```

### Analyze database

```sh
docker compose exec db mysqlcheck -u root -p --analyze --all-databases
```

### Optimize database

```sh
docker compose exec db mysqlcheck -u root -p --optimize --all-databases
```

## Security

### Đổi mật khẩu database

```sh
# Vào MySQL shell
docker compose exec db mysql -u root -p

# Đổi password
ALTER USER 'lcoj'@'%' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

Sau đó cập nhật `environment/mysql.env` và restart:

```sh
docker compose restart site celery bridged
```

### Xem failed login attempts

```sh
docker compose logs site | grep "Failed login"
```

### Block IP

Thêm vào `nginx/conf.d/nginx.conf`:

```nginx
deny 1.2.3.4;
```

Restart nginx:

```sh
docker compose restart nginx
```

## Troubleshooting

### Container bị crash liên tục

```sh
# Xem logs
docker compose logs --tail=100 <service>

# Xem exit code
docker inspect <container> | grep ExitCode

# Restart với logs
docker compose up <service>
```

### Out of memory

```sh
# Xem memory usage
docker stats

# Tăng memory limit
# Thêm vào docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 4G
```

### Disk full

```sh
# Xem disk usage
df -h

# Xóa unused Docker resources
docker system prune -a

# Xóa old logs
find /var/lib/docker/containers/ -name "*.log" -mtime +7 -delete
```

### Database locked

```sh
# Xem processes
docker compose exec db mysql -u root -p -e "SHOW PROCESSLIST;"

# Kill process
docker compose exec db mysql -u root -p -e "KILL <process_id>;"
```

### Celery tasks stuck

```sh
# Xem active tasks
docker compose exec celery celery -A dmoj_celery inspect active

# Revoke task
docker compose exec celery celery -A dmoj_celery control revoke <task_id>

# Restart Celery
docker compose restart celery
```

## Maintenance mode

### Bật maintenance mode

Tạo file `dmoj/repo/maintenance.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Maintenance</title>
</head>
<body>
    <h1>Đang bảo trì</h1>
    <p>Hệ thống đang được bảo trì. Vui lòng quay lại sau.</p>
</body>
</html>
```

Cập nhật nginx config:

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

### Tắt maintenance mode

```sh
rm dmoj/repo/maintenance.html
docker compose restart nginx
```

## Xem thêm

- [Cài đặt](/site/installation.md)
- [Cập nhật](/site/updating.md)
- [Management Commands](/site/management_commands.md)
