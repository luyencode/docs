# Management Commands

LCOJ cung cấp nhiều management commands để quản lý hệ thống. Các lệnh này được chạy qua `./manage.py <command>`.

## Cách sử dụng

```sh
cd /path/to/site
source ../lcojsite/bin/activate
./manage.py <command> [options]
```

## User Management

### adduser - Thêm người dùng

Tạo người dùng mới nhanh chóng.

```sh
./manage.py adduser <username> <email> <password>
```

**Ví dụ:**
```sh
./manage.py adduser alice alice@example.com password123
```

**Tùy chọn:**
- `--superuser` - Tạo superuser
- `--staff` - Tạo staff user

### batchadduser - Thêm nhiều người dùng

Thêm nhiều người dùng từ file CSV.

```sh
./manage.py batchadduser <csv_file>
```

**Format CSV:**
```csv
username,email,password,first_name,last_name
user1,user1@example.com,pass1,John,Doe
user2,user2@example.com,pass2,Jane,Smith
```

**Ví dụ:**
```sh
./manage.py batchadduser users.csv
```

### move_user_content - Chuyển nội dung người dùng

Chuyển tất cả nội dung (bài nộp, bình luận) từ user này sang user khác.

```sh
./manage.py move_user_content <from_user> <to_user>
```

**Ví dụ:**
```sh
./manage.py move_user_content old_account new_account
```

**Lưu ý:** Lệnh này không xóa user cũ, chỉ chuyển nội dung.

## Judge Management

### addjudge - Thêm judge

Tạo judge mới với authentication key.

```sh
./manage.py addjudge <judge_name>
```

**Ví dụ:**
```sh
./manage.py addjudge judge1
```

Lệnh sẽ tự động tạo authentication key và hiển thị.

### runbridged - Chạy bridge

Chạy bridge server để kết nối với judge.

```sh
./manage.py runbridged
```

**Tùy chọn:**
- `--host <host>` - Host để bind (mặc định: localhost)
- `--port <port>` - Port để bind (mặc định: 9999)

**Ví dụ:**
```sh
./manage.py runbridged --host 0.0.0.0 --port 9999
```

**Lưu ý:** Thường chạy qua supervisor, không chạy trực tiếp.

### runbalancer - Chạy load balancer

Chạy load balancer cho nhiều judge.

```sh
./manage.py runbalancer
```

## Problem Management

### create_problem - Tạo bài tập

Tạo bài tập mới nhanh chóng.

```sh
./manage.py create_problem <code> <name>
```

**Ví dụ:**
```sh
./manage.py create_problem APLUSB "A Plus B"
```

**Tùy chọn:**
- `--time-limit <seconds>` - Giới hạn thời gian
- `--memory-limit <kb>` - Giới hạn bộ nhớ
- `--points <points>` - Điểm của bài

### import_polygon_package - Import từ Polygon

Import bài tập từ Polygon package (Codeforces).

```sh
./manage.py import_polygon_package <zip_file>
```

**Ví dụ:**
```sh
./manage.py import_polygon_package problem.zip
```

### submit_polygon_solutions - Test solutions

Nộp tất cả solutions từ Polygon package để test.

```sh
./manage.py submit_polygon_solutions <problem_code>
```

### copy_language - Copy ngôn ngữ

Copy cấu hình ngôn ngữ từ bài này sang bài khác.

```sh
./manage.py copy_language <from_problem> <to_problem>
```

**Ví dụ:**
```sh
./manage.py copy_language APLUSB SORTING
```

## Contest Management

### export_contest_submissions - Export bài nộp

Export tất cả bài nộp của contest ra CSV.

```sh
./manage.py export_contest_submissions <contest_key> <output_file>
```

**Ví dụ:**
```sh
./manage.py export_contest_submissions contest2024 submissions.csv
```

### export_contest_submissions_details - Export chi tiết

Export bài nộp kèm source code.

```sh
./manage.py export_contest_submissions_details <contest_key> <output_dir>
```

**Ví dụ:**
```sh
./manage.py export_contest_submissions_details contest2024 ./export/
```

### export_event_feed - Export event feed

Export event feed cho ICPC tools.

```sh
./manage.py export_event_feed <contest_key> <output_file>
```

**Ví dụ:**
```sh
./manage.py export_event_feed icpc2024 events.json
```

### runmoss - Chạy MOSS

Chạy MOSS để phát hiện gian lận trong contest.

```sh
./manage.py runmoss <contest_key>
```

**Ví dụ:**
```sh
./manage.py runmoss contest2024
```

**Yêu cầu:** Cần cấu hình MOSS user ID trong settings.

## API & Tokens

### generate_api_token - Tạo API token

Tạo API token cho user.

```sh
./manage.py generate_api_token <username>
```

**Ví dụ:**
```sh
./manage.py generate_api_token alice
```

Token sẽ được in ra console.

## Utilities

### render_pdf - Render PDF

Render đề bài thành PDF.

```sh
./manage.py render_pdf <problem_code> <output_file>
```

**Ví dụ:**
```sh
./manage.py render_pdf APLUSB aplusb.pdf
```

**Yêu cầu:** Cần cấu hình Pdfoid.

### generate_sitemap - Tạo sitemap

Tạo sitemap.xml cho SEO.

```sh
./manage.py generate_sitemap
```

Sitemap sẽ được lưu trong thư mục static.

### camo - Camo proxy

Chạy Camo proxy cho hình ảnh.

```sh
./manage.py camo
```

**Lưu ý:** Thường không dùng, dùng Camo standalone thay thế.

### makedmojmessages - Tạo translation files

Tạo file translation cho đa ngôn ngữ.

```sh
./manage.py makedmojmessages
```

Sau đó compile:

```sh
./manage.py compilemessages
```

## Permissions & Credits

### update_permissions - Cập nhật quyền

Cập nhật permissions cho tất cả users dựa trên groups.

```sh
./manage.py update_permissions
```

### backfill_current_credit - Backfill credit hiện tại

Cập nhật credit hiện tại cho users.

```sh
./manage.py backfill_current_credit
```

### backfill_monthly_credit - Backfill credit hàng tháng

Cập nhật credit hàng tháng cho users.

```sh
./manage.py backfill_monthly_credit
```

## Ví dụ thực tế

### Setup ban đầu

```sh
# Tạo superuser
./manage.py createsuperuser

# Tạo judge
./manage.py addjudge judge1

# Tạo bài tập mẫu
./manage.py create_problem HELLO "Hello World" --time-limit 1 --memory-limit 65536 --points 100
```

### Quản lý contest

```sh
# Export bài nộp sau contest
./manage.py export_contest_submissions contest2024 submissions.csv

# Chạy MOSS để check gian lận
./manage.py runmoss contest2024

# Export event feed cho ICPC tools
./manage.py export_event_feed contest2024 events.json
```

### Batch operations

```sh
# Thêm nhiều users từ CSV
./manage.py batchadduser students.csv

# Tạo API tokens cho tất cả users
for user in $(cat users.txt); do
    ./manage.py generate_api_token $user >> tokens.txt
done
```

### Maintenance

```sh
# Cập nhật permissions
./manage.py update_permissions

# Tạo sitemap mới
./manage.py generate_sitemap

# Render tất cả đề bài thành PDF
for problem in APLUSB SORTING GRAPH; do
    ./manage.py render_pdf $problem pdfs/$problem.pdf
done
```

## Tips

### Chạy trong background

```sh
nohup ./manage.py runbridged > bridged.log 2>&1 &
```

### Chạy với timeout

```sh
timeout 3600 ./manage.py runmoss contest2024
```

### Chạy định kỳ với cron

```cron
# Tạo sitemap mỗi ngày lúc 2 giờ sáng
0 2 * * * cd /path/to/site && ./manage.py generate_sitemap

# Backfill credit mỗi tháng
0 0 1 * * cd /path/to/site && ./manage.py backfill_monthly_credit
```

## Xem thêm

Để xem tất cả commands có sẵn:

```sh
./manage.py help
```

Để xem help của một command cụ thể:

```sh
./manage.py help <command>
```

**Ví dụ:**
```sh
./manage.py help adduser
```
