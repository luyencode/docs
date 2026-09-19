# SSL Proxy cho nội dung người dùng

Khi website dùng HTTPS nhưng người dùng nhúng hình ảnh HTTP, trình duyệt sẽ chặn (mixed content). SSL proxy giúp giải quyết vấn đề này.

**Lưu ý:** Tính năng này tùy chọn, chỉ cần nếu cho phép người dùng nhúng hình ảnh từ nguồn bên ngoài.

## Cài đặt Camo

Camo là proxy server chuyển HTTP thành HTTPS.

### Bước 1: Cài đặt Node.js

```sh
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install nodejs
```

### Bước 2: Cài đặt Camo

```sh
npm install -g camo
```

### Bước 3: Tạo secret key

```sh
openssl rand -hex 32
```

Lưu key này, sẽ dùng ở bước sau.

### Bước 4: Chạy Camo

```sh
PORT=8081 CAMO_KEY="your_secret_key_here" camo
```

## Cấu hình LCOJ

### Với Docker

Thêm vào `environment/site.env`:

```env
DMOJ_CAMO_URL=https://luyencode.net/camo
DMOJ_CAMO_KEY=your_secret_key_here
DMOJ_CAMO_EXCLUDE=luyencode.net,cdn.luyencode.net
```

### Với bare metal

Thêm vào `local_settings.py`:

```python
# URL của Camo
DMOJ_CAMO_URL = "https://luyencode.net:8081"

# Secret key (phải giống với CAMO_KEY)
DMOJ_CAMO_KEY = "your_secret_key_here"

# Domains không cần proxy (domains của bạn)
DMOJ_CAMO_EXCLUDE = ["luyencode.net", "cdn.luyencode.net"]
```

## Cấu hình Nginx

### Reverse proxy cho Camo

```nginx
location /camo/ {
    proxy_pass http://localhost:8081/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Khởi động lại

**Docker:**

```sh
docker compose restart nginx site
```

**Bare metal:**

```sh
service nginx reload
supervisorctl restart site
```

## Chạy Camo với Supervisor

Tạo file `/etc/supervisor/conf.d/camo.conf`:

```ini
[program:camo]
command=/usr/bin/camo
directory=/tmp
user=camo
environment=PORT="8081",CAMO_KEY="your_secret_key_here"
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/camo.log
```

Khởi động:

```sh
supervisorctl update
supervisorctl start camo
```

## Cách hoạt động

### Trước khi có Camo

```
User -> HTTPS -> Website -> HTTP image -> ❌ Blocked
```

### Sau khi có Camo

```
User -> HTTPS -> Website -> HTTPS -> Camo -> HTTP image -> ✓ OK
```

### Ví dụ

**URL gốc:**
```
http://example.com/image.png
```

**URL qua Camo:**
```
https://luyencode.net/camo/abc123.../image.png
```

## Kiểm tra

### Test Camo

```sh
curl http://localhost:8081/
```

Nếu thấy "hwhat", Camo đang chạy.

### Test proxy

1. Tạo bình luận với hình ảnh HTTP
2. Kiểm tra source code trang
3. URL hình ảnh phải qua Camo

## Xử lý lỗi

**Hình ảnh không load:**
- Kiểm tra Camo đang chạy
- Kiểm tra `DMOJ_CAMO_URL` và `DMOJ_CAMO_KEY`
- Xem log Camo Docker: `docker compose logs -f camo` (nếu chạy trong Docker)
- Xem log Camo bare metal: `supervisorctl tail -f camo`

**Mixed content warning:**
- Kiểm tra `DMOJ_CAMO_URL` dùng HTTPS
- Kiểm tra nginx config

**Hình ảnh bị chặn:**
- Một số site chặn proxy
- Không có cách giải quyết, người dùng phải upload hình lên server

## Bảo mật

### Giới hạn kích thước

Thêm vào Camo config:

```sh
CAMO_MAX_SIZE=5242880  # 5MB
```

### Giới hạn loại file

Chỉ cho phép hình ảnh:

```sh
CAMO_ALLOWED_CONTENT_TYPES="image/*"
```

### Rate limiting

Dùng nginx để giới hạn:

```nginx
location /camo/ {
    limit_req zone=camo burst=10;
    proxy_pass http://localhost:8081/;
}
```

## Tối ưu

### Cache

Camo tự động cache. Để tăng cache time:

```sh
CAMO_TIMING_ALLOW_ORIGIN="*"
CAMO_HEADER_VIA="Camo"
```

### CDN

Nếu có CDN, đặt Camo sau CDN:

```
User -> CDN -> Camo -> HTTP image
```

## Lưu ý

- Camo tốn băng thông vì proxy tất cả hình ảnh
- Nên giới hạn kích thước và loại file
- Không proxy video (quá nặng)
- Khuyến khích người dùng upload hình lên server thay vì dùng link ngoài
