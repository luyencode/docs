# uWSGI

uWSGI là application server chạy Django, thay thế cho `runserver` trong production.

**Lưu ý:** Nếu dùng Docker, không cần cấu hình này. Xem [lcoj-docker](https://github.com/luyencode/lcoj-docker).

## Cài đặt

uWSGI đã được cài trong quá trình [cài đặt website](/site/installation.md).

Nếu chưa có:

```sh
source lcojsite/bin/activate
pip3 install uwsgi
```

## Cấu hình

### File uwsgi.ini

Tạo file `uwsgi.ini` trong thư mục site:

```ini
[uwsgi]
# Django project
chdir = /home/lcoj/site
module = dmoj.wsgi:application

# Virtual environment
home = /home/lcoj/lcojsite

# Process
master = true
processes = 4
threads = 2

# Socket
socket = /tmp/lcoj-site.sock
chmod-socket = 666
vacuum = true

# Logging
logto = /var/log/uwsgi/lcoj-site.log

# Performance
max-requests = 5000
harakiri = 60
```

**Giải thích:**
- `chdir`: Thư mục project
- `module`: Module WSGI
- `home`: Virtual environment
- `processes`: Số worker processes
- `threads`: Số threads mỗi process
- `socket`: Unix socket để nginx kết nối
- `max-requests`: Restart worker sau N requests
- `harakiri`: Timeout (giây)

### Tạo thư mục log

```sh
mkdir -p /var/log/uwsgi
chown lcoj:lcoj /var/log/uwsgi
```

## Chạy với Supervisor

File `/etc/supervisor/conf.d/site.conf`:

```ini
[program:site]
command=/home/lcoj/lcojsite/bin/uwsgi --ini /home/lcoj/site/uwsgi.ini
directory=/home/lcoj/site
user=lcoj
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/uwsgi/site-supervisor.log
```

Khởi động:

```sh
supervisorctl update
supervisorctl start site
```

## Cấu hình Nginx

File nginx config:

```nginx
upstream lcoj {
    server unix:///tmp/lcoj-site.sock;
}

server {
    listen 80;
    server_name luyencode.net;
    
    location / {
        uwsgi_pass lcoj;
        include uwsgi_params;
    }
    
    location /static/ {
        alias /home/lcoj/site/staticfiles/;
    }
    
    location /media/ {
        alias /home/lcoj/site/media/;
    }
}
```

Khởi động lại nginx:

```sh
service nginx reload
```

## Tối ưu

### Số processes

Công thức: `processes = (CPU cores × 2) + 1`

Ví dụ: 4 cores → 9 processes

```ini
processes = 9
```

### Threads

Tăng threads nếu có nhiều I/O:

```ini
threads = 4
```

### Buffer size

Tăng nếu có request lớn:

```ini
buffer-size = 32768
```

### Lazy apps

Load app sau khi fork (tiết kiệm RAM):

```ini
lazy-apps = true
```

### Offload

Offload static files:

```ini
offload-threads = 4
```

## Monitoring

### Stats server

Thêm vào `uwsgi.ini`:

```ini
stats = 127.0.0.1:9191
```

Xem stats:

```sh
uwsgitop 127.0.0.1:9191
```

Cài đặt uwsgitop:

```sh
pip3 install uwsgitop
```

### Log

Xem log realtime:

```sh
tail -f /var/log/uwsgi/lcoj-site.log
```

Hoặc qua supervisor:

```sh
supervisorctl tail -f site
```

## Xử lý lỗi

**uWSGI không start:**
- Kiểm tra `uwsgi.ini` syntax
- Kiểm tra đường dẫn
- Xem log: `supervisorctl tail -f site`

**502 Bad Gateway:**
- Kiểm tra uWSGI đang chạy
- Kiểm tra socket file tồn tại: `ls -la /tmp/lcoj-site.sock`
- Kiểm tra quyền socket

**Slow response:**
- Tăng `processes` và `threads`
- Kiểm tra database performance
- Kiểm tra `harakiri` timeout

**Memory leak:**
- Giảm `max-requests`
- Kiểm tra code có leak không
- Restart định kỳ

## Reload

### Graceful reload

Không downtime:

```sh
supervisorctl restart site
```

Hoặc:

```sh
touch /home/lcoj/site/uwsgi.ini
```

### Force reload

```sh
killall -9 uwsgi
supervisorctl start site
```

## Lưu ý

- Không dùng `runserver` trong production
- Monitor RAM và CPU usage
- Backup config trước khi thay đổi
- Test trên staging trước khi deploy production
