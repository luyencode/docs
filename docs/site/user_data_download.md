# Tải dữ liệu người dùng

LCOJ cho phép người dùng tải xuống dữ liệu của họ, bao gồm bình luận và bài nộp.

Tính năng này mặc định bị tắt. Để bật, cấu hình trong `local_settings.py`.

## Cấu hình

### Bước 1: Cấu hình trong local_settings.py

```python
## Cài đặt tải dữ liệu người dùng
# Bỏ comment để cho phép người dùng tải dữ liệu
DMOJ_USER_DATA_DOWNLOAD = True

# Thư mục cache dữ liệu tải xuống
# Admin chịu trách nhiệm dọn dẹp file cũ
DMOJ_USER_DATA_CACHE = '/home/dmoj-uwsgi/userdatacache'

# Đường dẫn cho tính năng X-Accel-Redirect của nginx
# Phải là internal location trỏ đến thư mục trên
DMOJ_USER_DATA_INTERNAL = '/userdatacache'

# Tần suất cho phép tải dữ liệu
DMOJ_USER_DATA_DOWNLOAD_RATELIMIT = datetime.timedelta(days=1)
```

### Bước 2: Cấu hình Nginx

Bỏ comment section sau trong file cấu hình nginx:

```nginx
# Bỏ comment nếu cho phép tải dữ liệu người dùng
# Location name phải khớp với DMOJ_USER_DATA_INTERNAL
location /userdatacache {
    internal;
    root /home/dmoj-uwsgi/;
    
    # Đường dẫn không bao gồm /userdatacache ở cuối
    # Ví dụ: nếu cache ở /home/dmoj-uwsgi/userdatacache
    # thì root là /home/dmoj-uwsgi/
}
```

### Bước 3: Tạo thư mục cache

```sh
mkdir -p /home/dmoj-uwsgi/userdatacache
chown dmoj-uwsgi:dmoj-uwsgi /home/dmoj-uwsgi/userdatacache
chmod 755 /home/dmoj-uwsgi/userdatacache
```

### Bước 4: Khởi động lại dịch vụ

```sh
supervisorctl restart site
service nginx reload
```

## Dọn dẹp file cũ

File dữ liệu không tự động xóa. Mỗi người dùng chỉ có tối đa 1 file trên server, nhưng nên dọn dẹp file cũ định kỳ.

### Tạo Cron job

```sh
crontab -e
```

Thêm dòng sau:

```
0 */4 * * * find /home/dmoj-uwsgi/userdatacache/ -type f -mtime +2 -delete
```

Cron job này sẽ xóa file cũ hơn 2 ngày, chạy mỗi 4 giờ.

**Giải thích:**
- `0 */4 * * *`: Chạy vào phút 0 của mỗi 4 giờ
- `find ... -mtime +2`: Tìm file cũ hơn 2 ngày
- `-delete`: Xóa file tìm được

**Lưu ý:** Điều chỉnh thời gian cho phù hợp với `RATELIMIT`.

## Sử dụng

Sau khi cấu hình xong, người dùng có thể:

1. Vào trang _Edit profile_
2. Tìm phần _Data download_
3. Chọn loại dữ liệu muốn tải (bình luận, bài nộp)
4. Click _Request download_
5. Đợi hệ thống tạo file (có thể mất vài phút)
6. Tải file về

## Format dữ liệu

### Bình luận (comments.json)

```json
[
    {
        "id": 123,
        "page": "problem/APLUSB",
        "time": "2024-01-01T00:00:00Z",
        "score": 5,
        "body": "Nội dung bình luận"
    }
]
```

### Bài nộp (submissions.json)

```json
[
    {
        "id": 123456,
        "problem": "APLUSB",
        "date": "2024-01-01T00:00:00Z",
        "language": "CPP17",
        "result": "AC",
        "points": 100,
        "time": 0.1,
        "memory": 2048,
        "source": "// Mã nguồn"
    }
]
```

## Xử lý lỗi

**File không tạo được:**
- Kiểm tra quyền thư mục cache
- Kiểm tra Celery đang chạy: `supervisorctl status celery`
- Xem log: `supervisorctl tail -f celery`

**Không tải được file:**
- Kiểm tra cấu hình nginx
- Kiểm tra đường dẫn `DMOJ_USER_DATA_INTERNAL`
- Xem log nginx: `tail -f /var/log/nginx/error.log`

**Lỗi rate limit:**
- Người dùng phải đợi theo thời gian cấu hình trong `RATELIMIT`
- Mặc định là 1 ngày

## Bảo mật

- File dữ liệu chỉ người dùng đó mới tải được
- File có tên ngẫu nhiên, khó đoán
- Nên dọn dẹp file cũ thường xuyên
- Không lưu file quá lâu trên server
