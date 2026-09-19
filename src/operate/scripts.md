# Các script hỗ trợ

> Thư mục `dmoj/scripts/` có 6 script Bash ngắn (`initialize`, `migrate`, `copy_static`, `manage.py`, `enter_site`, `moderate_comments`) bọc các lệnh `docker compose` hay dùng. Trang này nói chính xác từng script làm gì.
>
> ⏱ ~8 phút đọc · 👤 Người vận hành · 🔑 SSH vào máy chủ và quyền chạy `docker`

## Khi nào cần trang này

- Khi trang khác bảo bạn chạy `./scripts/...` và bạn muốn biết lệnh đó thực sự làm gì trước khi chạy.
- Khi chạy script từ cron hoặc CI và gặp lỗi TTY.
- Khi cần chạy một lệnh quản trị Django (xem thêm [Lệnh quản trị](/reference/management-commands)).

## Tổng quan

| Script | Chạy trong | Việc làm | Khi nào dùng |
|---|---|---|---|
| `initialize` | máy chủ | Tạo thư mục, sao chép file cấu hình mẫu vào `repo/` | Một lần, khi cài mới |
| `migrate` | container `site` | `python3 manage.py migrate` | Sau khi cập nhật code có migration mới |
| `copy_static` | container `site` | Build CSS, gom static, biên dịch bản dịch, chép vào `/assets` | Sau khi đổi SCSS/JS/static hoặc bản dịch |
| `manage.py` | container `site` | `python3 manage.py <lệnh>` | Mọi lệnh quản trị Django |
| `enter_site` | container `site` | Mở shell `bash` | Gỡ lỗi, chạy lệnh thủ công |
| `moderate_comments` | container `db` | Ẩn bình luận có điểm ≤ -5 | Dọn bình luận xấu, định kỳ hoặc thủ công |

## Cách chạy

Chạy script từ thư mục `dmoj/`:

```sh
cd lcoj-docker/dmoj
./scripts/migrate
```

Mỗi script bắt đầu bằng `cd $(dirname $(dirname $0))`, tức là tự chuyển về thư mục cha của `scripts/` (chính là `dmoj/`) trước khi chạy `docker compose`. Vì vậy gọi bằng đường dẫn đầy đủ từ nơi khác (ví dụ `/srv/lcoj-docker/dmoj/scripts/migrate`) cũng được.

Trừ `initialize`, các script đều dùng `docker compose exec`, nên container tương ứng (`site` hoặc `db`) phải **đang chạy**.

### Biến `COMPOSE_EXEC_FLAGS`

Các script chạy trong container đều gọi `docker compose exec $COMPOSE_EXEC_FLAGS ...`. Mặc định biến này rỗng. Bạn có thể dùng nó để truyền thêm cờ cho `docker compose exec`, phổ biến nhất là `-T` (không cấp TTY), cần khi chạy từ cron, CI hoặc khi chuyển hướng output:

```sh
COMPOSE_EXEC_FLAGS=-T ./scripts/migrate
COMPOSE_EXEC_FLAGS=-T ./scripts/manage.py clearsessions >> /var/log/lcoj-cron.log 2>&1
```

::: tip
Nếu thấy lỗi `the input device is not a TTY`, hãy thêm `COMPOSE_EXEC_FLAGS=-T`.
:::

## `initialize`

```sh
mkdir -p problems media

cp config/config.js repo/websocket/
cp config/local_settings.py repo/dmoj/
cp config/uwsgi.ini repo/
```

Script này:

1. Tạo thư mục `dmoj/problems/` (dữ liệu test) và `dmoj/media/` (file tải lên) nếu chưa có.
2. Sao chép ba file cấu hình mẫu từ `dmoj/config/` vào mã nguồn lcoj-site:

   | Bản mẫu | Chép tới | Dùng bởi |
   |---|---|---|
   | `config/config.js` | `repo/websocket/config.js` | wsevent |
   | `config/local_settings.py` | `repo/dmoj/local_settings.py` | site, celery, bridged |
   | `config/uwsgi.ini` | `repo/uwsgi.ini` | site |

Script **không** tạo các file `environment/*.env`; bạn phải tự sao chép từ file `*.example` (xem [Biến môi trường](/operate/environment)). Nó cũng không chạy lệnh Docker nào.

::: warning Chạy lại sẽ ghi đè cấu hình
`cp` ghi đè không hỏi. Nếu bạn đã sửa `repo/dmoj/local_settings.py`, `repo/uwsgi.ini` hay `repo/websocket/config.js` mà chưa cập nhật bản mẫu trong `dmoj/config/`, chạy lại `initialize` sẽ làm mất các thay đổi đó. Hãy sao lưu hoặc đồng bộ bản mẫu trước.
:::

## `migrate`

```sh
docker compose exec $COMPOSE_EXEC_FLAGS site python3 manage.py migrate $@
```

Áp dụng migration của Django lên database. Tham số thêm vào được chuyển thẳng cho `manage.py migrate`:

```sh
./scripts/migrate                 # áp dụng tất cả migration
./scripts/migrate judge           # chỉ app judge
./scripts/migrate --plan          # xem trước, không thay đổi gì
```

Dùng khi cài mới và sau mỗi lần cập nhật code (xem [Cập nhật hệ thống](/operate/updating)). Nên sao lưu database trước khi chạy migration trên production.

## `copy_static`

Chạy trong container `site` một chuỗi lệnh (dừng ngay khi có lệnh lỗi):

1. `bash make_style.sh`: biên dịch SCSS trong `resources/` bằng `sass` + `postcss`, cho cả giao diện sáng (`resources/`) và tối (`resources/dark/`).
2. `python3 manage.py collectstatic --noinput`: gom file tĩnh vào `STATIC_ROOT` (`/assets/static/`).
3. `python3 manage.py compilemessages`: biên dịch bản dịch `.po` thành `.mo`.
4. `python3 manage.py compilejsi18n`: tạo file bản dịch cho JavaScript.
5. `cp -r resources/ /assets/`: chép thư mục `resources/` (kèm CSS vừa build) vào `/assets/resources/`.
6. Xóa các file CSS vừa sinh ra khỏi `resources/` và `resources/dark/`, xóa thư mục `sass_processed`, để mã nguồn gọn sạch.
7. Chép `502.html`, `logo.png`, `robots.txt` vào `/assets/`.

`/assets` là volume dùng chung với nginx, nên sau khi script chạy xong nginx phục vụ ngay file mới.

Khi nào dùng:

- Lần đầu cài đặt.
- Sau khi đổi SCSS, JavaScript, ảnh trong `resources/`, hoặc file bản dịch.
- Khi gặp lỗi 404 với file static hay CSS không cập nhật.

```sh
./scripts/copy_static
```

::: tip
Nếu trình duyệt vẫn hiển thị giao diện cũ, hãy xóa cache trình duyệt (và cache của CDN nếu bạn đặt site sau CDN), vì nginx đặt `expires max` cho `/static`.
:::

## `manage.py`

```sh
docker compose exec $COMPOSE_EXEC_FLAGS site python3 manage.py $@
```

Chạy bất kỳ lệnh quản trị Django nào trong container `site`:

```sh
./scripts/manage.py createsuperuser
./scripts/manage.py loaddata navbar language_small demo
./scripts/manage.py test judge.tests.test_api_sync
```

Danh sách lệnh riêng của LCOJ xem ở [Lệnh quản trị](/reference/management-commands).

::: warning Tham số có dấu cách
Script dùng `$@` không có dấu ngoặc kép, nên một tham số chứa dấu cách sẽ bị tách thành nhiều tham số. Với những lệnh như vậy, hãy vào container bằng `./scripts/enter_site` rồi chạy `python3 manage.py ...` trực tiếp.
:::

## `enter_site`

```sh
docker compose exec $COMPOSE_EXEC_FLAGS site /bin/bash
```

Mở shell `bash` bên trong container `site`, ở thư mục làm việc `/site` (chính là `dmoj/repo/` trên máy chủ). Hữu ích để chạy nhiều lệnh liên tiếp, xem file, hoặc mở `python3 manage.py shell`.

::: code-group

```sh [Máy chủ]
./scripts/manage.py shell
```

```sh [Trong container (sau enter_site)]
python3 manage.py shell
```

:::

Sửa file trong `/site` là sửa trực tiếp `dmoj/repo/` trên máy chủ, vì đây là bind mount.

## `moderate_comments`

Ẩn các bình luận bị chấm điểm thấp. Script đọc `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` từ `environment/mysql.env`, rồi dùng client `mariadb` trong container `db` để thao tác trực tiếp với bảng `judge_comment`, với điều kiện `hidden = 0 AND score <= -5`.

1. Xem trước (chỉ chạy `SELECT`, không thay đổi gì): in tổng số bình luận sẽ bị ẩn và 5 bình luận mới nhất trong số đó (id, 80 ký tự đầu, điểm).

   ```sh
   ./scripts/moderate_comments --dry-run
   ```

2. Thực hiện (chạy `UPDATE judge_comment SET hidden = 1 ...`) và in số bình luận đã ẩn:

   ```sh
   ./scripts/moderate_comments
   ```

::: danger Ghi trực tiếp vào database
Chế độ thường sửa database ngay, không hỏi xác nhận. Luôn chạy `--dry-run` trước. Bình luận chỉ bị ẩn (`hidden = 1`), không bị xóa, nên có thể hiện lại trong trang quản trị Django nếu cần.
:::

Một số lưu ý:

- Script ẩn lỗi của `mariadb` (`2>/dev/null`). Nếu kết quả trống hoặc số lượng rỗng, hãy kiểm tra container `db` có đang chạy và thông tin trong `mysql.env` có đúng không.
- Script lấy giá trị bằng `grep ... | cut -d= -f2`, nên mật khẩu chứa dấu `=` sẽ bị đọc sai. Nếu định dùng script này, tránh dấu `=` trong `MYSQL_PASSWORD`.
- Muốn chạy định kỳ bằng cron, thêm `COMPOSE_EXEC_FLAGS=-T`, ví dụ:

  ```sh
  0 3 * * * COMPOSE_EXEC_FLAGS=-T /srv/lcoj-docker/dmoj/scripts/moderate_comments >> /var/log/lcoj-moderate.log 2>&1
  ```

## Tiếp theo

- [Vận hành hằng ngày](/operate/operations): khởi động lại, xem log, sao lưu.
- [Cập nhật LCOJ](/operate/updating): khi nào cần `migrate` và `copy_static` sau khi kéo code mới.
- [Lệnh quản trị](/reference/management-commands): các lệnh chạy được qua `./scripts/manage.py`.

::: tip Cần hỗ trợ?
- Tạo issue tại [GitHub Issues](https://github.com/luyencode/lcoj-docker/issues)
- Tham khảo thêm tại [behitek.com](https://behitek.com)
- LCOJ hỗ trợ cài đặt miễn phí: [luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he)
:::
