# Tải dữ liệu kỳ thi

Sau khi kỳ thi kết thúc, người tổ chức có thể tải về **mã nguồn các bài nộp** của thí sinh dưới dạng một file ZIP, ví dụ để lưu trữ, chấm lại ngoài hệ thống hoặc kiểm tra gian lận.

## Ai được dùng?

Người dùng phải đăng nhập và có quyền sửa kỳ thi, tức là một trong hai:

| Trường hợp | Điều kiện |
|---|---|
| Tác giả hoặc người quản lý (curator) của kỳ thi | Có quyền `judge.edit_own_contest` |
| Quản trị viên | Có quyền `judge.edit_all_contest` |

Xem thêm [Phân quyền](/admin/permissions).

Ngoài ra:

- Kỳ thi phải **đã kết thúc**. Trước đó, trang sẽ báo *"Vui lòng đợi sau khi kỳ thi kết thúc để tải dữ liệu."*
- Tính năng phải được bật (`DMOJ_CONTEST_DATA_DOWNLOAD = True`). Nếu tắt, các URL bên dưới trả về 404.

## Cách tải

```mermaid
flowchart LR
    A["Trang kỳ thi<br/>nút Tải dữ liệu"] --> B["Chọn bộ lọc<br/>Chuẩn bị dữ liệu"]
    B --> C["Celery tạo file ZIP<br/>(thanh tiến trình)"]
    C --> D["Tải dữ liệu đã chuẩn bị"]
```

1. Mở trang kỳ thi. Người có quyền sửa sẽ thấy nút **Tải dữ liệu** trên trang này.
2. Trang **Tải dữ liệu kỳ thi** (`/contest/<mã kỳ thi>/data/prepare/`) có các tuỳ chọn:
   - **Tải bài nộp?** (bật sẵn): bắt buộc phải chọn.
   - **Lọc theo mã bài:** mẫu glob trên mã bài, mặc định `*` (tất cả). Ví dụ `LC*` chỉ lấy các bài có mã bắt đầu bằng `LC`.
   - **Lọc theo kết quả:** các mã kết quả (AC, WA…). *Bỏ trống để tải tất cả bài nộp.*
3. Bấm **Chuẩn bị dữ liệu**. Hệ thống chuyển sang trang tiến trình trong lúc Celery đóng gói.
4. Khi xong, bấm **Tải dữ liệu đã chuẩn bị** (`/contest/<mã kỳ thi>/data/download/`). File tải về có tên `<mã kỳ thi>-data.zip`.

::: warning Bộ lọc kết quả
Trong mã nguồn hiện tại, bộ lọc **Lọc theo kết quả** lọc trên bảng bài nộp kỳ thi, vốn không có trường `result`, nên tác vụ có thể bị lỗi khi chọn bộ lọc này. Nếu tác vụ thất bại, hãy để trống bộ lọc kết quả.
:::

## Giới hạn tần suất

Mỗi **kỳ thi** (không phải mỗi người dùng) chỉ được chuẩn bị dữ liệu mới một lần trong khoảng `DMOJ_CONTEST_DATA_DOWNLOAD_RATELIMIT` (mặc định 1 ngày). Có thể chuẩn bị lại sớm hơn nếu file ZIP cũ không còn trên đĩa. Trong khi một tác vụ đang chạy thì không thể tạo tác vụ mới.

Trong thời gian chờ, trang vẫn cho tải file đã chuẩn bị trước đó.

## Nội dung file ZIP

File chỉ chứa **mã nguồn** bài nộp của thí sinh **chính thức** (không có người tham gia ảo hay khán giả). Không có file CSV, bảng xếp hạng hay thông tin điểm.

```
<mã kỳ thi>-data.zip
├── alice/
│   ├── APLUSB.cpp               ← bài nộp điểm cao nhất của alice cho bài APLUSB
│   ├── SORTING.py
│   └── $History/
│       ├── APLUSB_123457.cpp    ← các bài nộp khác: <mã bài>_<ID bài nộp>.<đuôi>
│       └── APLUSB_123460.py
└── bob/
    └── APLUSB.java
```

| Quy tắc | Chi tiết |
|---|---|
| Thư mục cấp 1 | Tên đăng nhập của thí sinh |
| `<mã bài>.<đuôi>` | Bài nộp có điểm cao nhất cho bài đó (bằng điểm thì lấy bài nộp có ID nhỏ nhất) |
| `$History/<mã bài>_<ID>.<đuôi>` | Tất cả bài nộp còn lại cho bài đó |
| Đuôi file | Đuôi của ngôn ngữ đã chọn (ví dụ `cpp`, `py`, `java`) |
| Ngôn ngữ nộp file | Với ngôn ngữ chỉ nộp file, LCOJ đưa file gốc thí sinh đã tải lên vào ZIP |

## Cấu hình (cho người vận hành)

Các thiết lập nằm trong `dmoj/local_settings.py` của site (với Docker là `dmoj/repo/dmoj/local_settings.py`, được sao chép từ `dmoj/config/local_settings.py` khi chạy `./scripts/initialize`). Các thiết lập này **không** đọc từ biến môi trường, nên đặt trong `environment/site.env` sẽ không có tác dụng.

| Thiết lập | Mặc định trong `settings.py` | Giá trị trong cấu hình Docker của LCOJ | Ý nghĩa |
|---|---|---|---|
| `DMOJ_CONTEST_DATA_DOWNLOAD` | `False` | `True` | Bật/tắt tính năng |
| `DMOJ_CONTEST_DATA_CACHE` | `''` | `'/contestdatacache'` | Thư mục lưu file ZIP, mỗi kỳ thi một file `<ID kỳ thi>.zip` |
| `DMOJ_CONTEST_DATA_INTERNAL` | `''` | `'/contestdatacache'` | Đường dẫn nội bộ của nginx cho `X-Accel-Redirect` |
| `DMOJ_CONTEST_DATA_DOWNLOAD_RATELIMIT` | `timedelta(days=1)` | `timedelta(days=1)` | Khoảng thời gian tối thiểu giữa hai lần chuẩn bị dữ liệu của cùng một kỳ thi |

```python
# dmoj/local_settings.py
DMOJ_CONTEST_DATA_DOWNLOAD = True
DMOJ_CONTEST_DATA_CACHE = '/contestdatacache'
DMOJ_CONTEST_DATA_INTERNAL = '/contestdatacache'
DMOJ_CONTEST_DATA_DOWNLOAD_RATELIMIT = datetime.timedelta(days=1)
```

Trong `docker-compose.yml`, volume `contestdatacache` được gắn vào `/contestdatacache/` của cả ba service `site`, `celery` (nơi ghi file) và `nginx` (nơi phục vụ file). nginx có sẵn location nội bộ:

```nginx
location /contestdatacache {
    internal;
    root /;
}
```

Khi site chạy sau nginx, Django chỉ trả header `X-Accel-Redirect` và nginx gửi file trực tiếp. Nếu không, Django tự đọc và trả file.

Sau khi sửa `local_settings.py`, khởi động lại site và celery (chạy từ `dmoj/`):

```sh
docker compose restart site celery
```

## Dọn dẹp file cũ

Mỗi kỳ thi chỉ có một file ZIP (lần chuẩn bị mới ghi đè file cũ), nhưng LCOJ **không** tự xoá các file này. Có thể xoá định kỳ các file cũ hơn 2 ngày:

::: warning
Lệnh sau xoá vĩnh viễn các file ZIP đã chuẩn bị. Người tổ chức sẽ phải chuẩn bị lại nếu cần.
:::

```sh
# Chạy từ dmoj/
docker compose exec site find /contestdatacache/ -type f -mtime +2 -delete
```

Ví dụ cron chạy mỗi 4 giờ:

```
0 */4 * * * docker compose -f /path/to/lcoj-docker/dmoj/docker-compose.yml exec -T site find /contestdatacache/ -type f -mtime +2 -delete
```

## Xử lý sự cố

| Triệu chứng | Nguyên nhân / cách xử lý |
|---|---|
| Không thấy nút **Tải dữ liệu** | Tính năng đang tắt, hoặc bạn không có quyền sửa kỳ thi. |
| Trang báo 403 "đợi kỳ thi kết thúc" | Kỳ thi chưa kết thúc. |
| Thanh tiến trình đứng yên | Kiểm tra `docker compose ps celery` và `docker compose logs -f celery`. |
| Tác vụ lỗi ngay sau khi bắt đầu | Thử bỏ trống **Lọc theo kết quả** (xem cảnh báo ở trên); kiểm tra quyền ghi thư mục cache. |
| Tải file trả về 404 | File ZIP chưa được tạo hoặc đã bị dọn dẹp; chuẩn bị lại. |

## Bảo mật và quyền riêng tư

- File ZIP chứa mã nguồn của thí sinh. Không chia sẻ công khai nếu chưa có sự đồng ý.
- File chỉ tải được qua URL của Django (có kiểm tra quyền); location nginx là `internal` nên không truy cập trực tiếp được.
- Người dùng tự tải dữ liệu cá nhân bằng một tính năng riêng, xem [Tải dữ liệu người dùng](/operate/user-data-download).
