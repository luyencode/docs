# Cài đặt LCOJ với Docker

Hướng dẫn này giúp bạn cài đặt LCOJ bằng Docker - cách được khuyến nghị và đơn giản nhất.

**Repository:** [lcoj-docker](https://github.com/luyencode/lcoj-docker)

## Yêu cầu hệ thống

### Phần cứng tối thiểu

- **CPU:** 2 cores
- **RAM:** 4GB
- **Disk:** 20GB trống
- **OS:** Linux (Ubuntu 20.04+ khuyến nghị)

### Phần cứng khuyến nghị

- **CPU:** 4+ cores
- **RAM:** 8GB+
- **Disk:** 50GB+ SSD
- **Network:** 100Mbps+

### Phần mềm

- Docker 20.10+
- Docker Compose 2.0+
- Git

## Bước 1: Cài đặt Docker

### Ubuntu/Debian

```sh
# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào group docker
sudo usermod -aG docker $USER

# Logout và login lại để áp dụng
```

### Kiểm tra

```sh
docker --version
docker compose version
```

## Bước 2: Clone repository

```sh
git clone --recursive https://github.com/luyencode/lcoj-docker.git
cd lcoj-docker/dmoj
```

**Lưu ý:** Flag `--recursive` rất quan trọng để clone cả submodules.

## Bước 3: Khởi tạo

Chạy script khởi tạo:

```sh
./scripts/initialize
```

Script này sẽ:
- Tạo các thư mục cần thiết
- Copy file cấu hình mẫu
- Set permissions

## Bước 4: Cấu hình

### 4.1. Tạo file environment

```sh
cp environment/mysql-admin.env.example environment/mysql-admin.env
cp environment/mysql.env.example environment/mysql.env
cp environment/site.env.example environment/site.env
```

### 4.2. Cấu hình MySQL

**File: `environment/mysql.env`**

```env
MYSQL_DATABASE=lcoj
MYSQL_USER=lcoj
MYSQL_PASSWORD=<mat_khau_manh>
```

**File: `environment/mysql-admin.env`**

```env
MYSQL_ROOT_PASSWORD=<mat_khau_root_manh>
```

**Lưu ý:** Đổi `<mat_khau_manh>` thành mật khẩu thực tế!

### 4.3. Cấu hình Site

**File: `environment/site.env`**

```env
# Database
MYSQL_HOST=db
MYSQL_DATABASE=lcoj
MYSQL_USER=lcoj
MYSQL_PASSWORD=<trung_voi_mysql.env>

# Site
SITE_NAME=LCOJ
SITE_LONG_NAME=LuyenCode Online Judge
SITE_ADMIN_EMAIL=admin@luyencode.net

# Secret key (generate mới)
SECRET_KEY=<secret_key_dai_va_ngau_nhien>

# Host
HOST=luyencode.net

# Debug (PHẢI ĐỔI THÀNH False KHI PRODUCTION)
DEBUG=True
```

**Tạo SECRET_KEY:**

```sh
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

### 4.4. Cấu hình Nginx

**File: `nginx/conf.d/nginx.conf`**

Đổi `server_name`:

```nginx
server {
    listen 80;
    server_name luyencode.net;  # Đổi thành domain của bạn
    
    # ... phần còn lại giữ nguyên
}
```

## Bước 5: Build Docker images

```sh
docker compose build
```

Quá trình này mất 10-20 phút tùy vào tốc độ mạng và máy.

## Bước 6: Khởi động services

### 6.1. Khởi động database và cache

```sh
docker compose up -d db redis
```

Đợi 10 giây để database khởi động hoàn toàn.

### 6.2. Khởi động site và celery

```sh
docker compose up -d site celery
```

### 6.3. Tạo database schema

```sh
./scripts/migrate
```

### 6.4. Tạo static files

```sh
./scripts/copy_static
```

### 6.5. Load dữ liệu mẫu

```sh
./scripts/manage.py loaddata navbar
./scripts/manage.py loaddata language_small
./scripts/manage.py loaddata demo
```

**Cảnh báo:** `demo` tạo tài khoản admin với username/password là `admin`. Đổi ngay sau khi đăng nhập!

### 6.6. Tạo superuser

```sh
./scripts/manage.py createsuperuser
```

Làm theo hướng dẫn để tạo tài khoản admin của bạn.

## Bước 7: Khởi động tất cả services

```sh
docker compose up -d
```

Kiểm tra tất cả containers đang chạy:

```sh
docker compose ps
```

Bạn sẽ thấy:

```
NAME              STATUS
lcoj_bridged      Up
lcoj_celery       Up
lcoj_mysql        Up
lcoj_nginx        Up
lcoj_redis        Up
lcoj_site         Up
lcoj_wsevent      Up
```

## Bước 8: Kiểm tra

Truy cập `http://localhost` (hoặc domain của bạn) để kiểm tra.

Bạn sẽ thấy trang chủ LCOJ!

## Cấu trúc thư mục

```
dmoj/
├── base/              # Base Docker image
├── bridged/           # Bridge service
├── celery/            # Celery worker
├── config/            # Config files
├── database/          # MySQL data (tự động tạo)
├── environment/       # Environment variables
├── media/             # User uploads
├── nginx/             # Nginx config
├── problems/          # Problem data
├── repo/              # Site source code (submodule)
├── scripts/           # Helper scripts
├── site/              # Site Docker image
├── wsevent/           # WebSocket event server
└── docker-compose.yml # Docker Compose config
```

## Các services

| Service | Container | Port | Mô tả |
|---------|-----------|------|-------|
| nginx | lcoj_nginx | 80 | Web server |
| site | lcoj_site | - | Django application |
| celery | lcoj_celery | - | Background tasks |
| bridged | lcoj_bridged | 9998, 9999 | Judge bridge |
| wsevent | lcoj_wsevent | 15100-15102 | WebSocket events |
| db | lcoj_mysql | 3306 | MariaDB database |
| redis | lcoj_redis | 6379 | Cache & message broker |

## Quản lý services

### Xem logs

```sh
# Tất cả services
docker compose logs -f

# Một service cụ thể
docker compose logs -f site
docker compose logs -f celery
docker compose logs -f nginx
```

### Restart service

```sh
docker compose restart site
docker compose restart celery
```

### Stop tất cả

```sh
docker compose down
```

### Start lại

```sh
docker compose up -d
```

## Cập nhật

### Cập nhật code

```sh
cd lcoj-docker/dmoj
git pull
git submodule update --init --recursive
```

### Rebuild và restart

```sh
docker compose up -d --build site celery bridged wsevent
```

### Chạy migrations

```sh
./scripts/migrate
```

### Cập nhật static files

```sh
./scripts/copy_static
```

## Backup

### Backup database

```sh
docker exec lcoj_mysql mysqldump -u root -p<root_password> lcoj > backup_$(date +%Y%m%d).sql
```

### Backup media files

```sh
tar -czf media_backup_$(date +%Y%m%d).tar.gz dmoj/media/
```

### Backup problems

```sh
tar -czf problems_backup_$(date +%Y%m%d).tar.gz dmoj/problems/
```

## Restore

### Restore database

```sh
docker exec -i lcoj_mysql mysql -u root -p<root_password> lcoj < backup_20240101.sql
```

### Restore media

```sh
tar -xzf media_backup_20240101.tar.gz
```

## Monitoring

### Kiểm tra resource usage

```sh
docker stats
```

### Kiểm tra disk usage

```sh
docker system df
```

### Xem logs realtime

```sh
# Site logs
docker compose logs -f --tail=100 site

# Celery logs
docker compose logs -f --tail=100 celery

# Nginx access logs
docker compose exec nginx tail -f /var/log/nginx/access.log
```

## Troubleshooting

### Container không start

```sh
# Xem logs
docker compose logs <service_name>

# Xem chi tiết
docker inspect <container_name>
```

### Database connection error

```sh
# Kiểm tra MySQL đang chạy
docker compose ps db

# Kiểm tra logs
docker compose logs db

# Restart database
docker compose restart db
```

### Static files không load

```sh
# Chạy lại copy_static
./scripts/copy_static

# Restart nginx
docker compose restart nginx
```

### Out of memory

```sh
# Kiểm tra memory usage
docker stats

# Tăng memory limit trong docker-compose.yml
# Thêm vào service cần thiết:
deploy:
  resources:
    limits:
      memory: 2G
```

### Disk full

```sh
# Xóa unused images
docker image prune -a

# Xóa unused volumes
docker volume prune

# Xóa unused containers
docker container prune
```

## Production checklist

Trước khi deploy production:

- [ ] Đổi `DEBUG=False` trong `site.env`
- [ ] Đổi mật khẩu mặc định `admin`
- [ ] Cấu hình HTTPS (SSL certificate)
- [ ] Setup backup tự động
- [ ] Cấu hình firewall
- [ ] Setup monitoring (Prometheus, Grafana)
- [ ] Cấu hình log rotation
- [ ] Test disaster recovery
- [ ] Document các thay đổi custom

## Cấu hình HTTPS

### Với Let's Encrypt

```sh
# Cài đặt certbot
apt install certbot python3-certbot-nginx

# Lấy certificate
certbot --nginx -d luyencode.net

# Auto-renew
certbot renew --dry-run
```

### Cập nhật nginx config

Certbot sẽ tự động cập nhật nginx config. Sau đó:

```sh
docker compose restart nginx
```

## Performance tuning

### Tăng số Celery workers

**File: `celery/Dockerfile`**

```dockerfile
CMD celery -A dmoj_celery worker -l info --concurrency=4
```

### Tăng số uWSGI workers

**File: `site/Dockerfile`**

```dockerfile
CMD uwsgi --ini uwsgi.ini --processes=4
```

### Cấu hình Redis persistence

**File: `docker-compose.yml`**

```yaml
redis:
  command: redis-server --appendonly yes
  volumes:
    - redis-data:/data
```

## Xem thêm

- [Management Commands](/site/management_commands.md)
- [Cập nhật hệ thống](/site/updating.md)
- [Cài đặt Judge](/judge/setting_up_a_judge.md)
- [Quản lý bài tập](/site/managing_problems.md)

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs: `docker compose logs -f`
2. Tạo issue tại [GitHub Issues](https://github.com/luyencode/lcoj-docker/issues)
3. Liên hệ hỗ trợ tại [https://luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he)
