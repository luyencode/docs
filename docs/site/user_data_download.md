# Tải dữ liệu người dùng

LCOJ cho phép người dùng tải xuống dữ liệu của họ, bao gồm bình luận và bài nộp.

Tính năng này mặc định bị tắt. Để bật, cấu hình trong `local_settings.py`.

## Cấu hình

### Với Docker (khuyến nghị)

Thư mục cache đã được setup sẵn trong Docker volume `userdatacache`.

Chỉ cần thêm vào `environment/site.env`:

```env
DMOJ_USER_DATA_DOWNLOAD=True
DMOJ_USER_DATA_CACHE=/userdatacache/
DMOJ_USER_DATA_INTERNAL=/userdatacache
```

Restart services:

```sh
docker compose restart site celery
```

### Với bare metal

Cấu hình trong `local_settings.py`:

```python
DMOJ_USER_DATA_DOWNLOAD = True
DMOJ_USER_DATA_CACHE = '/home/dmoj-uwsgi/userdatacache'
DMOJ_USER_DATA_INTERNAL = '/userdatacache'
DMOJ_USER_DATA_DOWNLOAD_RATELIMIT = datetime.timedelta(days=1)
```

### Cấu hình Nginx (nếu cần)

**Với Docker:** Nginx config đã được setup sẵn, không cần thay đổi.

**Với bare metal:** Thêm vào nginx config:

```nginx
location /userdatacache {
    internal;
    root /home/dmoj-uwsgi/;
}
```

### Khởi động lại

**Với Docker:**

```sh
docker compose restart site celery nginx
```

**Với bare metal:**

**Docker:**

```sh
docker compose restart site nginx
```

**Bare metal:**

```sh
supervisorctl restart site
service nginx reload
```

## Dọn dẹp file cũ

File dữ liệu không tự động xóa. Nên dọn dẹp file cũ định kỳ.

### Với Docker

```sh
# Chạy thủ công
docker compose exec site find /userdatacache/ -type f -mtime +2 -delete

# Hoặc tạo cron job trên host
0 */4 * * * docker compose -f /path/to/lcoj-docker/dmoj/docker-compose.yml exec -T site find /userdatacache/ -type f -mtime +2 -delete
```

### Với bare metal

```sh
crontab -e
```

Thêm:

```
0 */4 * * * find /home/dmoj-uwsgi/userdatacache/ -type f -mtime +2 -delete
```

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
- Kiểm tra Celery Docker: `docker compose ps celery`
- Xem log Docker: `docker compose logs -f celery`
- Kiểm tra Celery bare metal: `supervisorctl status celery`
- Xem log bare metal: `supervisorctl tail -f celery`

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
