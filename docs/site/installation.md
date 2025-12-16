# Cài đặt Website

Hướng dẫn này giúp bạn cài đặt website LCOJ từ đầu. Hệ thống chỉ hỗ trợ Linux.

**Lưu ý:** Nếu bạn muốn cài đặt nhanh bằng Docker, xem [lcoj-docker](https://github.com/luyencode/lcoj-docker).

## Bước 1: Cài đặt các công cụ cần thiết

### Cài đặt các gói phần mềm cơ bản

```sh
apt update
apt install git gcc g++ make python3-dev python3-pip python3-venv libxml2-dev libxslt1-dev zlib1g-dev gettext curl redis-server pkg-config
```

### Cài đặt Node.js

```sh
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install nodejs
```

## Bước 2: Cài đặt Database

### Cài đặt MariaDB

Truy cập [trang MariaDB](https://mariadb.org/download/?t=repo-config) và làm theo hướng dẫn cài đặt. Chọn phiên bản mới nhất.

```sh
apt update
apt install mariadb-server libmysqlclient-dev
```

### Tạo database

```sh
sudo mysql
```

Trong MySQL shell, chạy các lệnh sau:

```sql
CREATE DATABASE lcoj DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_general_ci;
GRANT ALL PRIVILEGES ON lcoj.* TO 'lcoj'@'localhost' IDENTIFIED BY 'mat_khau_cua_ban';
exit
```

**Lưu ý:** Thay `mat_khau_cua_ban` bằng mật khẩu thực tế.

## Bước 3: Cài đặt mã nguồn website

### Tạo môi trường Python

```sh
python3 -m venv lcojsite
source lcojsite/bin/activate
```

Bạn sẽ thấy `(lcojsite)` xuất hiện trước dòng lệnh. Từ giờ, tất cả lệnh đều chạy trong môi trường này.

### Tải mã nguồn

```sh
git clone --recursive https://github.com/luyencode/OJ.git site
cd site
```

### Cài đặt thư viện Python

```sh
pip3 install -r requirements.txt
```

### Cài đặt thư viện Node.js

```sh
npm install
```

## Bước 4: Cấu hình

### Tạo file cấu hình

Tạo file `dmoj/local_settings.py` từ [file mẫu](https://github.com/luyencode/docs/blob/master/sample_files/local_settings.py).

Các thiết lập quan trọng cần chỉnh sửa:

```python
# Thông tin database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'lcoj',
        'USER': 'lcoj',
        'PASSWORD': 'mat_khau_cua_ban',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

# Tên website
SITE_NAME = 'LCOJ'
SITE_LONG_NAME = 'LuyenCode Online Judge'

# Để DEBUG = True trong lúc cài đặt, sau đó đổi thành False
DEBUG = True
```

## Bước 5: Biên dịch giao diện

### Tạo file CSS

```sh
./make_style.sh
```

### Thu thập static files

```sh
./manage.py collectstatic
```

### Tạo file ngôn ngữ

```sh
./manage.py compilemessages
./manage.py compilejsi18n
```

## Bước 6: Cấu hình Celery

Celery giúp xử lý các tác vụ nặng như chấm lại bài hàng loạt.

### Khởi động Redis

```sh
service redis-server start
```

### Cấu hình trong local_settings.py

Bỏ comment (xóa dấu `#`) ở các dòng:

```python
CELERY_BROKER_URL = 'redis://localhost:6379'
CELERY_RESULT_BACKEND = 'redis://localhost:6379'
```

## Bước 7: Khởi tạo database

### Tạo bảng trong database

```sh
./manage.py migrate
```

### Load dữ liệu mẫu

```sh
./manage.py loaddata navbar
./manage.py loaddata language_small
./manage.py loaddata demo
```

**Lưu ý:** Lệnh `loaddata demo` tạo tài khoản admin với username và password đều là `admin`. Bạn nên đổi mật khẩu sau khi đăng nhập.

### Tạo tài khoản admin

```sh
./manage.py createsuperuser
```

Làm theo hướng dẫn để tạo tài khoản.

## Bước 8: Kiểm tra

### Kiểm tra cấu hình

```sh
./manage.py check
```

### Chạy thử server

```sh
./manage.py runserver 0.0.0.0:8000
```

Truy cập `http://localhost:8000` để kiểm tra. Nhấn Ctrl+C để dừng.

**Cảnh báo:** Không dùng `runserver` cho production!

### Kiểm tra bridge

```sh
./manage.py runbridged
```

Đợi 10 giây, nếu không có lỗi thì OK. Nhấn Ctrl+C để dừng.

### Kiểm tra Celery

```sh
celery -A dmoj_celery worker
```

Nhấn Ctrl+C để dừng.

## Bước 9: Cài đặt uWSGI

uWSGI giúp chạy website một cách an toàn và hiệu quả.

### Cài đặt

```sh
pip3 install uwsgi
```

### Cấu hình

Tạo file `uwsgi.ini` từ [file mẫu](https://github.com/luyencode/docs/blob/master/sample_files/uwsgi.ini). Chỉnh sửa đường dẫn cho phù hợp.

### Kiểm tra

```sh
uwsgi --ini uwsgi.ini
```

Nếu thấy "spawned uWSGI worker" thì OK. Nhấn Ctrl+C để dừng.

## Bước 10: Cài đặt Supervisor

Supervisor giúp tự động chạy và giám sát các dịch vụ.

### Cài đặt

```sh
apt install supervisor
```

### Cấu hình

Copy các file cấu hình vào `/etc/supervisor/conf.d/`:

- [site.conf](https://github.com/luyencode/docs/blob/master/sample_files/site.conf)
- [bridged.conf](https://github.com/luyencode/docs/blob/master/sample_files/bridged.conf)
- [celery.conf](https://github.com/luyencode/docs/blob/master/sample_files/celery.conf)

Chỉnh sửa đường dẫn trong các file cho phù hợp.

### Khởi động

```sh
supervisorctl update
supervisorctl status
```

Tất cả dịch vụ phải có trạng thái RUNNING.

## Bước 11: Cài đặt Nginx

Nginx là web server giúp phục vụ website ra internet.

### Cài đặt

```sh
apt install nginx
```

### Cấu hình

Copy [file cấu hình mẫu](https://github.com/luyencode/docs/blob/master/sample_files/nginx.conf) vào `/etc/nginx/conf.d/lcoj.conf`.

Chỉnh sửa:
- `server_name`: Tên miền của bạn
- Các đường dẫn cho phù hợp

### Kiểm tra và khởi động

```sh
nginx -t
service nginx reload
```

Truy cập website qua trình duyệt để kiểm tra.

**Quan trọng:** Sau khi kiểm tra xong, đổi `DEBUG = False` trong `local_settings.py`.

## Bước 12: Cấu hình Event Server

Event server giúp cập nhật realtime (như bảng xếp hạng trong contest).

### Tạo file cấu hình

Tạo file `websocket/config.js`:

```js
const config = {
  get_host: '127.0.0.1',
  get_port: 15100,
  post_host: '127.0.0.1',
  post_port: 15101,
  http_host: '127.0.0.1',
  http_port: 15102,
  long_poll_timeout: 29000
};

export default config;
```

### Cài đặt thư viện

```sh
pip3 install websocket-client
```

### Cấu hình trong local_settings.py

Thêm:

```python
EVENT_DAEMON_GET = 'ws://127.0.0.1:15100/'
EVENT_DAEMON_POST = 'http://127.0.0.1:15101/'
EVENT_DAEMON_POLL = '/channels/'
```

### Cấu hình Nginx

Bỏ comment các section `/event/` và `/channels/` trong file nginx config.

### Cấu hình Supervisor

Copy [wsevent.conf](https://github.com/luyencode/docs/blob/master/sample_files/wsevent.conf) vào `/etc/supervisor/conf.d/`.

### Khởi động lại

```sh
supervisorctl update
supervisorctl restart bridged
supervisorctl restart site
service nginx restart
```

## Hoàn tất!

Website của bạn đã sẵn sàng. Truy cập `/admin` để quản lý hệ thống.

## Xử lý lỗi thường gặp

**Website không hiển thị:**
- Kiểm tra log: `supervisorctl tail -f site`
- Kiểm tra nginx: `tail -f /var/log/nginx/error.log`

**Database lỗi:**
- Kiểm tra thông tin kết nối trong `local_settings.py`
- Kiểm tra MariaDB đang chạy: `service mariadb status`

**Static files không load:**
- Chạy lại: `./manage.py collectstatic`
- Kiểm tra đường dẫn `STATIC_ROOT` trong cấu hình
