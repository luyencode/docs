# Tải dữ liệu kỳ thi

LCOJ cho phép tác giả kỳ thi tải xuống dữ liệu kỳ thi, bao gồm bài nộp của thí sinh.

Tính năng này mặc định bị tắt. Để bật, cấu hình trong `local_settings.py`.

## Cấu hình

### Với Docker (khuyến nghị)

Thư mục cache đã được setup sẵn trong Docker volume `contestdatacache`.

Thêm vào `environment/site.env`:

```env
DMOJ_CONTEST_DATA_DOWNLOAD=True
DMOJ_CONTEST_DATA_CACHE=/contestdatacache/
DMOJ_CONTEST_DATA_INTERNAL=/contestdatacache
```

Restart:

```sh
docker compose restart site celery nginx
```

### Với bare metal

Cấu hình trong `local_settings.py`:

```python
DMOJ_CONTEST_DATA_DOWNLOAD = True
DMOJ_CONTEST_DATA_CACHE = '/home/dmoj-uwsgi/contestdatacache'
DMOJ_CONTEST_DATA_INTERNAL = '/contestdatacache'
DMOJ_CONTEST_DATA_DOWNLOAD_RATELIMIT = datetime.timedelta(days=1)
```

Cấu hình nginx và tạo thư mục cache tương tự user_data_download.

## Dọn dẹp file cũ

### Với Docker

```sh
# Chạy thủ công
docker compose exec site find /contestdatacache/ -type f -mtime +2 -delete

# Cron job
0 */4 * * * docker compose -f /path/to/lcoj-docker/dmoj/docker-compose.yml exec -T site find /contestdatacache/ -type f -mtime +2 -delete
```

### Với bare metal

```
0 */4 * * * find /home/dmoj-uwsgi/contestdatacache/ -type f -mtime +2 -delete
```

## Sử dụng

### Quyền truy cập

Chỉ những người sau có thể tải dữ liệu kỳ thi:
- Organizer của kỳ thi
- Admin có quyền `edit_all_contest`

### Cách tải

1. Vào trang quản lý kỳ thi (admin)
2. Chọn kỳ thi cần tải dữ liệu
3. Click _Download contest data_
4. Chọn loại dữ liệu:
   - Tất cả bài nộp
   - Chỉ bài nộp cuối cùng
   - Chỉ bài nộp AC
5. Click _Request download_
6. Đợi hệ thống tạo file
7. Tải file về

## Format dữ liệu

### Submissions (submissions.csv)

File CSV chứa thông tin bài nộp:

```csv
ID,User,Problem,Date,Language,Result,Points,Time,Memory
123456,user1,APLUSB,2024-01-01 00:00:00,CPP17,AC,100,0.1,2048
123457,user2,APLUSB,2024-01-01 00:01:00,PYTHON3,WA,0,0.2,4096
```

### Submissions với source code (submissions_with_source.zip)

File zip chứa:
- `submissions.csv`: Thông tin bài nộp
- `sources/`: Thư mục chứa mã nguồn
  - `123456_user1_APLUSB.cpp`
  - `123457_user2_APLUSB.py`

### Scoreboard (scoreboard.csv)

Bảng xếp hạng kỳ thi:

```csv
Rank,User,Score,Time,Problem1,Problem2,Problem3
1,user1,300,120,100,100,100
2,user2,200,150,100,100,0
```

## Tùy chọn tải

### Lọc theo thời gian

Chỉ tải bài nộp trong khoảng thời gian:

```python
# Trong admin, chọn:
Start time: 2024-01-01 00:00:00
End time: 2024-01-01 23:59:59
```

### Lọc theo người dùng

Chỉ tải bài nộp của một số người dùng:

```python
# Nhập danh sách username, mỗi dòng một user
user1
user2
user3
```

### Lọc theo bài tập

Chỉ tải bài nộp của một số bài:

```python
# Nhập danh sách problem code, mỗi dòng một bài
APLUSB
SORTING
GRAPH
```

## Xử lý lỗi

**File không tạo được:**
- Kiểm tra quyền thư mục cache
- Kiểm tra Celery Docker: `docker compose ps celery`
- Xem log Docker: `docker compose logs -f celery`
- Kiểm tra Celery bare metal: `supervisorctl status celery`
- Xem log bare metal: `supervisorctl tail -f celery`

**File quá lớn:**
- Lọc theo thời gian hoặc bài tập
- Tải từng phần riêng biệt
- Tăng timeout cho Celery

**Lỗi rate limit:**
- Mỗi kỳ thi chỉ tải được 1 lần trong khoảng thời gian `RATELIMIT`
- Mặc định là 1 ngày
- Admin có thể xóa file cũ để tải lại sớm hơn

## Phân tích dữ liệu

### Python

```python
import pandas as pd

# Đọc file CSV
df = pd.read_csv('submissions.csv')

# Thống kê theo người dùng
user_stats = df.groupby('User').agg({
    'ID': 'count',
    'Points': 'sum'
}).rename(columns={'ID': 'Submissions', 'Points': 'Total Points'})

print(user_stats)
```

### Excel

Mở file CSV bằng Excel để phân tích và tạo biểu đồ.

## Bảo mật

- Chỉ organizer và admin mới tải được
- File có tên ngẫu nhiên, khó đoán
- Nên dọn dẹp file cũ thường xuyên
- Không chia sẻ file chứa mã nguồn thí sinh
- Tôn trọng quyền riêng tư của thí sinh
