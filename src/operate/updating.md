# Cập nhật LCOJ

LCOJ thường xuyên được cập nhật với các tính năng mới và sửa lỗi. Đây là hướng dẫn cập nhật hệ thống Docker.

**Cảnh báo:** Luôn backup dữ liệu trước khi cập nhật!

## Backup trước khi cập nhật

### Backup database

```sh
docker exec lcoj_mysql mysqldump -u root -p<password> lcoj | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Backup media và problems

```sh
tar -czf media_backup_$(date +%Y%m%d).tar.gz dmoj/media/
tar -czf problems_backup_$(date +%Y%m%d).tar.gz dmoj/problems/
```

## Các bước cập nhật

### Bước 1: Tải mã nguồn mới

```sh
cd lcoj-docker/dmoj
git pull origin master
git submodule update --init --recursive
```

**Lưu ý:** `git submodule update` rất quan trọng để cập nhật code trong `repo/`.

### Bước 2: Kiểm tra thay đổi

```sh
git log --oneline -10
git diff HEAD~1 docker-compose.yml
```

Xem có thay đổi gì trong docker-compose.yml hoặc environment files không.

### Bước 3: Cập nhật environment (nếu cần)

Nếu có thêm biến môi trường mới, cập nhật file `environment/*.env`.

So sánh với file example:

```sh
diff environment/site.env environment/site.env.example
```

### Bước 4: Rebuild images

```sh
docker compose build
```

Hoặc rebuild chỉ services cần thiết:

```sh
docker compose build site celery bridged wsevent
```

### Bước 5: Chạy migrations

```sh
./scripts/migrate
```

Kiểm tra không có lỗi:

```sh
./scripts/manage.py check
```

### Bước 6: Cập nhật static files

```sh
./scripts/copy_static
```

### Bước 7: Restart services

```sh
docker compose up -d --no-deps site celery bridged wsevent
```

**Giải thích flags:**
- `--no-deps`: Không restart dependencies (db, redis)
- Chỉ restart các services có code thay đổi

## Script tự động

Bạn có thể tạo script để tự động hóa quá trình cập nhật:

**File: `update.sh`**

```bash
#!/bin/bash

set -e  # Exit on error

echo "=== Bắt đầu cập nhật LCOJ ==="
echo

# Backup database
echo "1. Backup database..."
docker exec lcoj_mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} lcoj | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Backup media
echo "2. Backup media files..."
tar -czf media_backup_$(date +%Y%m%d_%H%M%S).tar.gz dmoj/media/

# Pull new code
echo "3. Tải mã nguồn mới..."
git pull origin master
git submodule update --init --recursive

# Rebuild images
echo "4. Rebuild Docker images..."
docker compose build site celery bridged wsevent

# Run migrations
echo "5. Chạy migrations..."
./scripts/migrate

# Update static files
echo "6. Cập nhật static files..."
./scripts/copy_static

# Restart services
echo "7. Restart services..."
docker compose up -d --no-deps site celery bridged wsevent

# Check status
echo "8. Kiểm tra status..."
docker compose ps

echo
echo "=== Cập nhật hoàn tất! ==="
echo "Kiểm tra logs: docker compose logs -f site"
```

Cấp quyền thực thi:

```sh
chmod +x update.sh
```

Chạy script:

```sh
cd lcoj-docker/dmoj
./update.sh
```

## Xử lý lỗi

### Lỗi migration

Nếu gặp lỗi khi chạy `migrate`:

```sh
# Xem các migration chưa chạy
./scripts/manage.py showmigrations

# Chạy migration cụ thể
./scripts/manage.py migrate <app_name> <migration_name>

# Fake migration (nếu đã chạy thủ công)
./scripts/manage.py migrate --fake <app_name> <migration_name>
```

### Lỗi static files

Nếu static files không load:

```sh
# Xóa static files cũ
docker compose exec site rm -rf /assets/*

# Thu thập lại
./scripts/copy_static

# Restart nginx
docker compose restart nginx
```

### Lỗi dependencies

Nếu có lỗi về thư viện Python:

```sh
# Rebuild image từ đầu (không dùng cache)
docker compose build --no-cache site celery

# Restart services
docker compose up -d site celery
```

### Container không start

```sh
# Xem logs chi tiết
docker compose logs --tail=100 site

# Xem exit code
docker inspect lcoj_site | grep ExitCode

# Thử start với logs realtime
docker compose up site
```

## Rollback

Nếu cập nhật gặp vấn đề, có thể rollback:

### Rollback code

```sh
# Quay lại commit trước
git reset --hard HEAD~1
git submodule update --init --recursive

# Hoặc quay lại commit cụ thể
git reset --hard <commit_hash>
git submodule update --init --recursive

# Rebuild images
docker compose build site celery bridged wsevent

# Restart services
docker compose up -d --no-deps site celery bridged wsevent
```

### Restore database

```sh
# Stop site để tránh conflict
docker compose stop site celery

# Restore từ backup
gunzip < backup_20240101_120000.sql.gz | docker exec -i lcoj_mysql mysql -u root -p<password> lcoj

# Start lại
docker compose start site celery
```

### Restore media files

```sh
tar -xzf media_backup_20240101_120000.tar.gz
docker compose restart site nginx
```

## Kiểm tra sau cập nhật

### Kiểm tra services

```sh
# Xem status
docker compose ps

# Xem logs
docker compose logs -f --tail=50 site
docker compose logs -f --tail=50 celery
```

### Kiểm tra chức năng

- Truy cập website, kiểm tra giao diện
- Đăng nhập tài khoản admin
- Thử nộp bài
- Kiểm tra trang admin
- Test judge bridge: `docker compose logs bridged`

### Kiểm tra performance

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

## Lưu ý

- Nên cập nhật vào lúc ít người dùng
- Thông báo trước cho người dùng về thời gian bảo trì
- Luôn backup trước khi cập nhật
- Test trên môi trường development trước khi cập nhật production
