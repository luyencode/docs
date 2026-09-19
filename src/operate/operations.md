# Vận hành LCOJ

Các thao tác hằng ngày với một bản cài LCOJ bằng Docker: bật/tắt, xem log, áp dụng cấu hình, xóa cache, sao lưu và khôi phục.

::: tip
Mọi lệnh trong trang này chạy từ thư mục `lcoj-docker/dmoj/`. Danh sách service và cổng xem ở [Kiến trúc hệ thống](/operate/architecture), các script trong `scripts/` xem ở [Script hỗ trợ](/operate/scripts).
:::

## Bật, tắt và khởi động lại

| Việc cần làm | Lệnh |
|---|---|
| Bật toàn bộ (tạo lại container nếu cấu hình đổi) | `docker compose up -d` |
| Xem trạng thái | `docker compose ps` |
| Khởi động lại một service | `docker compose restart site` |
| Tạm dừng / bật lại một service | `docker compose stop site` / `docker compose start site` |
| Tắt và xóa container, giữ dữ liệu | `docker compose down` |

Service `base` chỉ dùng để build image và luôn ở trạng thái đã thoát. Đó không phải lỗi.

### `docker compose down -v` xóa những gì? {#down-v}

Cờ `-v` xóa các **named volume** khai báo trong `docker-compose.yml`. Dữ liệu chính của LCOJ nằm trong thư mục bind mount trên máy chủ nên không bị xóa.

| Dữ liệu | Nơi lưu | `down -v` có xóa? |
|---|---|---|
| Cơ sở dữ liệu | `./database/` (bind mount) | Không |
| Dữ liệu test | `./problems/` (bind mount) | Không |
| File tải lên | `./media/` (bind mount) | Không |
| Mã nguồn, cấu hình | `./repo/`, `./environment/`, `./nginx/` | Không |
| CSS/JS đã build, static | volume `assets` | **Có**, tạo lại bằng `./scripts/copy_static` |
| File tải dữ liệu người dùng / kỳ thi | volume `userdatacache`, `contestdatacache` | **Có**, người dùng phải yêu cầu tạo lại |
| Cache dùng chung site–nginx | volume `cache` | **Có** |
| Dữ liệu Redis (cache, hàng đợi Celery) | volume ẩn danh của `redis` | **Có** |

::: danger
Sau `docker compose down -v`, trang web sẽ mất CSS cho đến khi bạn chạy lại `./scripts/copy_static`. Muốn xóa sạch cơ sở dữ liệu thì phải xóa thư mục `./database/`. Việc này **không thể hoàn tác**, hãy [sao lưu](#backup) trước.
:::

## Xem log

```sh
docker compose logs -f site            # theo dõi log site
docker compose logs --tail=100 celery  # 100 dòng cuối
docker compose logs --since 1h bridged # log trong 1 giờ qua
docker compose logs -f                 # tất cả service
```

Service cần xem theo từng triệu chứng:

| Triệu chứng | Service |
|---|---|
| Lỗi 500, trang không tải | `site` |
| Tác vụ nền (chấm lại, xuất dữ liệu) bị treo | `celery` |
| Máy chấm không kết nối, bài nộp đứng ở trạng thái chờ | `bridged` |
| Kết quả không tự cập nhật trên trang | `wsevent` |
| Lỗi 502, file tĩnh 404 | `nginx` |

## Vào bên trong container

```sh
./scripts/enter_site               # shell bash trong container site
./scripts/manage.py dbshell        # shell SQL bằng tài khoản của site
./scripts/manage.py <lệnh>         # chạy lệnh quản trị Django
```

Mở shell MariaDB bằng root mà không phải gõ mật khẩu ra dòng lệnh (biến môi trường có sẵn trong container `db`):

```sh
docker compose exec db sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mariadb -u root "$MYSQL_DATABASE"'
```

::: info
Service `db` dùng image `mariadb` (bản mới nhất). Hãy dùng các lệnh `mariadb`, `mariadb-dump`, `mariadb-admin`, `mariadb-check`. Từ MariaDB 11, image chính thức không còn kèm các tên cũ `mysql`, `mysqldump`…
:::

Danh sách lệnh quản trị xem [Management Commands](/reference/management-commands).

## Áp dụng thay đổi cấu hình

| Bạn sửa | Cần làm |
|---|---|
| `environment/*.env` | `docker compose up -d` (lệnh `restart` **không** nạp lại file env) |
| `repo/dmoj/local_settings.py` | `docker compose restart site celery bridged` |
| `repo/uwsgi.ini` | `docker compose restart site` |
| `repo/websocket/config.js` | `docker compose restart wsevent` |
| `nginx/conf.d/nginx.conf` | `docker compose restart nginx` |
| SCSS, JS, ảnh trong `repo/resources/`, file dịch | `./scripts/copy_static` rồi `docker compose restart site` |
| Code Python, template | `docker compose restart site celery bridged` |

Code không cần build lại image vì thư mục `./repo` được mount thẳng vào container. Khi nào cần build lại, xem [Cập nhật LCOJ](/operate/updating).

## Cache

LCOJ dùng Redis: database số 0 cho cache Django (`REDIS_CACHING_URL`), database số 1 cho hàng đợi Celery (`CELERY_BROKER_URL`). Không có lệnh `clear_cache`. Để xóa cache, dùng một trong hai cách:

::: code-group

```sh [Qua Django]
docker compose exec site python3 manage.py shell -c "from django.core.cache import cache; cache.clear()"
```

```sh [Qua Redis]
docker compose exec redis redis-cli -n 0 FLUSHDB
```

:::

::: warning
Đừng dùng `FLUSHALL`. Lệnh này xóa cả database số 1, làm mất các tác vụ Celery đang chờ.
:::

## Celery

```sh
docker compose exec celery celery -A dmoj_celery inspect active     # tác vụ đang chạy
docker compose exec celery celery -A dmoj_celery inspect scheduled  # tác vụ đã hẹn giờ
docker compose restart celery
```

Celery chạy với `--concurrency=2` (đặt trong `celery/Dockerfile`).

## Sao lưu {#backup}

Cần sao lưu bốn thứ:

| Thành phần | Vị trí | Ghi chú |
|---|---|---|
| Cơ sở dữ liệu | container `db` | Dump bằng `mariadb-dump` khi đang chạy, không chép thô thư mục `database/` |
| Dữ liệu test | `problems/` | Thường là phần lớn nhất |
| File tải lên | `media/` | Ảnh, PDF, file đính kèm |
| Cấu hình | `environment/*.env`, `repo/dmoj/local_settings.py`, `repo/uwsgi.ini`, `repo/websocket/config.js`, `nginx/conf.d/` | Chứa bí mật, hãy lưu ở nơi an toàn |

### Sao lưu thủ công

1. Dump cơ sở dữ liệu:

   ```sh
   mkdir -p backups
   docker compose exec -T db sh -c \
     'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mariadb-dump -u root --single-transaction "$MYSQL_DATABASE"' \
     | gzip > backups/db_$(date +%F_%H%M).sql.gz
   ```

2. Nén dữ liệu test, file tải lên và cấu hình:

   ```sh
   tar -czf backups/files_$(date +%F_%H%M).tar.gz \
     problems media environment nginx/conf.d \
     repo/dmoj/local_settings.py repo/uwsgi.ini repo/websocket/config.js
   ```

3. Chép thư mục `backups/` sang máy khác hoặc kho lưu trữ ngoài. Bản sao lưu nằm cùng máy chủ không giúp được gì khi hỏng ổ đĩa.

::: warning
Thư mục `dmoj/backups/` chứa mật khẩu và **không** nằm trong `.gitignore`. Hãy thêm nó vào `.gitignore` (hoặc lưu bản sao lưu ngoài repo) để không lỡ commit.
:::

### Sao lưu tự động

Lưu script sau thành `dmoj/backup.sh` và `chmod +x`:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"          # thư mục dmoj/

DEST=backups
STAMP=$(date +%F_%H%M)
mkdir -p "$DEST"

docker compose exec -T db sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mariadb-dump -u root --single-transaction "$MYSQL_DATABASE"' \
  | gzip > "$DEST/db_$STAMP.sql.gz"

tar -czf "$DEST/files_$STAMP.tar.gz" \
  problems media environment nginx/conf.d \
  repo/dmoj/local_settings.py repo/uwsgi.ini repo/websocket/config.js

# Giữ bản sao lưu trong 7 ngày
find "$DEST" -type f -mtime +7 -delete
```

Chạy lúc 2 giờ sáng hằng ngày (`crontab -e`):

```cron
0 2 * * * /đường/dẫn/tới/lcoj-docker/dmoj/backup.sh >> /var/log/lcoj_backup.log 2>&1
```

Cờ `-T` trong `docker compose exec` là bắt buộc khi chạy từ cron vì không có terminal.

## Khôi phục {#restore}

### Trên máy chủ đang chạy

1. Dừng các service ghi vào cơ sở dữ liệu, giữ `db` chạy:

   ```sh
   docker compose stop site celery bridged
   ```

2. Nạp lại dump (ghi đè các bảng hiện có):

   ::: danger
   Bước này thay dữ liệu hiện tại bằng dữ liệu trong bản sao lưu.
   :::

   ```sh
   gunzip -c backups/db_2026-09-19_0200.sql.gz | docker compose exec -T db sh -c \
     'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mariadb -u root "$MYSQL_DATABASE"'
   ```

3. Nếu cần, giải nén file (chạy trong `dmoj/`, đường dẫn trong file nén là tương đối):

   ```sh
   tar -xzf backups/files_2026-09-19_0200.tar.gz
   ```

4. Bật lại và kiểm tra:

   ```sh
   docker compose up -d
   ./scripts/migrate          # chỉ cần nếu code mới hơn bản sao lưu
   ```

### Sang máy chủ mới

1. Làm Bước 1–2 của [Cài đặt](/operate/installation): cài Docker, clone repo.
2. Trong `dmoj/`, giải nén file sao lưu. Thao tác này khôi phục `problems/`, `media/`, `environment/`, cấu hình nginx và các file cấu hình trong `repo/` (không cần chạy `initialize`).
3. Build image: `docker compose build base && docker compose build`.
4. Bật `db` với thư mục `database/` trống để MariaDB tạo database và user từ `mysql.env`:

   ```sh
   docker compose up -d db
   docker compose logs -f db   # đợi "ready for connections"
   ```

5. Nạp dump như bước 2 ở trên.
6. Bật phần còn lại, tạo lại static:

   ```sh
   docker compose up -d site celery
   ./scripts/migrate
   ./scripts/copy_static
   docker compose up -d
   ```

## Trang bảo trì {#maintenance}

Nginx đã cấu hình `error_page 502 504 /502.html`. Khi `site` bị dừng, người dùng sẽ thấy trang này thay vì lỗi trống. Vì vậy cách bật "chế độ bảo trì" đơn giản nhất là:

```sh
docker compose stop site      # người dùng thấy trang 502.html
# ... bảo trì ...
docker compose start site
```

Nội dung trang nằm ở `repo/502.html`. Sau khi sửa, chạy `./scripts/copy_static` để chép sang volume `assets`.

## Đổi mật khẩu cơ sở dữ liệu {#change-db-password}

1. Đổi mật khẩu trong MariaDB (thay `dmoj` nếu `MYSQL_USER` của bạn khác):

   ```sh
   docker compose exec db sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mariadb -u root'
   ```

   ```sql
   ALTER USER 'dmoj'@'%' IDENTIFIED BY '<mật khẩu mới>';
   ```

2. Sửa `MYSQL_PASSWORD` trong `environment/mysql.env`.
3. Tạo lại container để chúng nhận mật khẩu mới:

   ```sh
   docker compose up -d
   ```

## Xử lý sự cố

| Triệu chứng | Cách xử lý |
|---|---|
| Mất CSS, file tĩnh 404 | `./scripts/copy_static && docker compose restart nginx` |
| Lỗi kết nối cơ sở dữ liệu | `docker compose ps db`, `docker compose logs db`, kiểm tra `environment/mysql.env` |
| Tác vụ Celery bị treo | `docker compose logs -f celery`, rồi `docker compose restart celery` |
| Kết quả chấm không tự cập nhật | `docker compose ps wsevent`, kiểm tra `EVENT_DAEMON_POST` |
| Container khởi động lại liên tục | `docker compose logs --tail=100 <service>` |
| Đầy ổ đĩa | `docker image prune`, `docker builder prune`, kiểm tra dung lượng `problems/` và `backups/` |

## Xem thêm

- [Cài đặt](/operate/installation)
- [Cập nhật LCOJ](/operate/updating)
- [Biến môi trường](/operate/environment)
- [Management Commands](/reference/management-commands)

::: tip Cần hỗ trợ?
Tạo issue tại [lcoj-docker](https://github.com/luyencode/lcoj-docker/issues), hoặc liên hệ qua [behitek.com](https://behitek.com) và [luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he).
:::
