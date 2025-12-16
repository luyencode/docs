# Cập nhật Website

LCOJ thường xuyên được cập nhật với các tính năng mới và sửa lỗi. Đây là hướng dẫn cập nhật hệ thống.

**Cảnh báo:** Luôn backup dữ liệu trước khi cập nhật. Các bản cập nhật có thể thay đổi cấu trúc database và có thể ảnh hưởng đến dữ liệu hiện có.

## Các bước cập nhật

### Bước 1: Kích hoạt môi trường ảo

```sh
source lcojsite/bin/activate
cd site
```

### Bước 2: Tải mã nguồn mới

```sh
git pull origin master
```

Nếu bạn đã chỉnh sửa code, có thể gặp conflict. Giải quyết conflict trước khi tiếp tục.

### Bước 3: Cập nhật thư viện

```sh
pip3 install -r requirements.txt
```

Lệnh này cài đặt các thư viện mới hoặc cập nhật thư viện hiện có.

### Bước 4: Cập nhật database

```sh
./manage.py migrate
./manage.py check
```

- `migrate`: Cập nhật cấu trúc database
- `check`: Kiểm tra có lỗi cấu hình không

### Bước 5: Cập nhật static files

```sh
./make_style.sh
./manage.py collectstatic
./manage.py compilemessages
./manage.py compilejsi18n
```

**Giải thích:**
- `make_style.sh`: Biên dịch CSS
- `collectstatic`: Thu thập static files
- `compilemessages`: Biên dịch file ngôn ngữ
- `compilejsi18n`: Biên dịch JavaScript i18n

### Bước 6: Khởi động lại dịch vụ

```sh
supervisorctl restart site
supervisorctl restart celery
supervisorctl restart bridged
supervisorctl restart wsevent
```

Hoặc nếu dùng Docker:

```sh
docker compose restart site celery bridged wsevent
```

## Script tự động

Bạn có thể tạo script để tự động hóa quá trình cập nhật:

**update.sh:**

```bash
#!/bin/bash

echo "Bắt đầu cập nhật LCOJ..."

# Kích hoạt môi trường ảo
source ~/lcojsite/bin/activate
cd ~/site

# Backup database
echo "Backup database..."
./manage.py dumpdata > backup_$(date +%Y%m%d_%H%M%S).json

# Cập nhật code
echo "Tải mã nguồn mới..."
git pull origin master

# Cập nhật thư viện
echo "Cập nhật thư viện..."
pip3 install -r requirements.txt

# Cập nhật database
echo "Cập nhật database..."
./manage.py migrate
./manage.py check

# Cập nhật static files
echo "Cập nhật static files..."
./make_style.sh
./manage.py collectstatic --noinput
./manage.py compilemessages
./manage.py compilejsi18n

# Khởi động lại dịch vụ
echo "Khởi động lại dịch vụ..."
supervisorctl restart site celery bridged wsevent

echo "Cập nhật hoàn tất!"
```

Cấp quyền thực thi:

```sh
chmod +x update.sh
```

Chạy script:

```sh
./update.sh
```

## Xử lý lỗi

### Lỗi migration

Nếu gặp lỗi khi chạy `migrate`:

```sh
# Xem các migration chưa chạy
./manage.py showmigrations

# Chạy migration cụ thể
./manage.py migrate <app_name> <migration_name>

# Fake migration (nếu đã chạy thủ công)
./manage.py migrate --fake <app_name> <migration_name>
```

### Lỗi static files

Nếu static files không load:

```sh
# Xóa static files cũ
rm -rf staticfiles/*

# Thu thập lại
./manage.py collectstatic --clear --noinput
```

### Lỗi thư viện

Nếu có lỗi về thư viện:

```sh
# Cài đặt lại tất cả thư viện
pip3 install -r requirements.txt --force-reinstall

# Hoặc nâng cấp tất cả
pip3 install -r requirements.txt --upgrade
```

## Rollback

Nếu cập nhật gặp vấn đề, có thể rollback:

```sh
# Quay lại commit trước
git reset --hard HEAD~1

# Hoặc quay lại commit cụ thể
git reset --hard <commit_hash>

# Restore database từ backup
./manage.py loaddata backup_YYYYMMDD_HHMMSS.json

# Khởi động lại dịch vụ
supervisorctl restart all
```

## Kiểm tra sau cập nhật

- Truy cập website, kiểm tra giao diện
- Thử nộp bài
- Kiểm tra trang admin
- Xem log: `supervisorctl tail -f site`

## Lưu ý

- Nên cập nhật vào lúc ít người dùng
- Thông báo trước cho người dùng về thời gian bảo trì
- Luôn backup trước khi cập nhật
- Test trên môi trường development trước khi cập nhật production
