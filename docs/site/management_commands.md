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

### generate_editorials - Tạo editorial tự động

Tạo editorial (lời giải) tự động cho bài tập bằng AI, sử dụng Pydantic structured output để đảm bảo định dạng nhất quán.

```sh
./manage.py generate_editorials [options]
```

**Yêu cầu:**
- Cài đặt packages: `pip install openai pydantic`
- Thiết lập API key: `export OPENAI_API_KEY="sk-..."`
- Hoặc cấu hình trong `environment/openai.env`

**Tùy chọn:**

| Tùy chọn | Mô tả | Mặc định |
|----------|-------|----------|
| `--problem CODE`, `-p CODE` | Xử lý một bài cụ thể | Tất cả bài chưa có editorial |
| `--limit N`, `-l N` | Số bài tối đa cần xử lý | 10 |
| `--offset N` | Bắt đầu từ vị trí thứ N | 0 |
| `--dry-run` | Chế độ xem trước, không lưu vào DB | False |
| `--verbose` | Hiển thị chi tiết quá trình | False |
| `--model MODEL` | Model OpenAI sử dụng | mimo-v2-flash |
| `--temperature T` | Độ sáng tạo (0.0-2.0) | 0.7 |
| `--max-retries N` | Số lần thử lại khi API lỗi | 3 |
| `--retry-delay S` | Thời gian chờ giữa các lần thử (giây) | 2 |
| `--log-file PATH` | Lưu log vào file | None |

**Ví dụ:**

```sh
# Bước 1: Test với một bài (dry run - QUAN TRỌNG)
./manage.py generate_editorials --problem cb01 --dry-run --verbose

# Bước 2: Tạo editorial cho một bài
./manage.py generate_editorials --problem cb01 --verbose

# Bước 3: Xử lý nhiều bài với logging
./manage.py generate_editorials --limit 20 --log-file /tmp/editorials.log --verbose

# Bước 4: Tiếp tục từ bài thứ 50
./manage.py generate_editorials --limit 50 --offset 50

# Sử dụng model khác
./manage.py generate_editorials --problem cb01 --model gpt-4 --temperature 0.5
```

**Cách hoạt động:**

1. Tìm các bài chưa có editorial (is_public=True)
2. Lấy 3 bài nộp AC khác nhau (ưu tiên C/C++)
3. Gửi đến OpenAI API với Pydantic structured output
4. Tạo editorial theo định dạng chuẩn với các phần:
   - Hiểu bài toán
   - Các cách tiếp cận (từ đơn giản đến tối ưu)
   - Phân tích độ phức tạp
   - Bài học kinh nghiệm
   - Lỗi thường gặp
5. Lưu vào database với trạng thái PUBLIC

**Định dạng editorial:**

```markdown
## Hiểu bài toán
[Giải thích rõ ràng về bài toán]

## Các cách tiếp cận

### Cách Brute Force
```cpp
[code]
```
* **Time Complexity**: O(n²)
* **Space Complexity**: O(1)
[Giải thích chi tiết]

### Cách Hash Map
[code + giải thích]

## Phân tích độ phức tạp
| Cách tiếp cận | Time | Space | Tên |
|--------------|------|-------|-----|
| 1 | O(n²) | O(1) | Brute Force |
| 2 | O(n) | O(n) | Hash Map |

## Bài học kinh nghiệm
- [Insight 1]
- [Insight 2]

## Lỗi thường gặp
- [Pitfall 1]
- [Pitfall 2]
```

**Kiểm tra và xuất bản:**

```sh
# Kiểm tra trong database
./manage.py shell
>>> from judge.models import Solution
>>> s = Solution.objects.get(problem__code='cb01')
>>> print(s.content[:500])
>>> print(f"Is public: {s.is_public}")
>>> print(f"Authors: {[a.user.username for a in s.authors.all()]}")

# Xem trên website
# https://luyencode.net/problem/cb01/editorial
```

**Xử lý hàng loạt:**

```sh
# Chạy trong background với nohup
nohup ./manage.py generate_editorials --limit 100 --log-file /tmp/editorials.log > /tmp/output.log 2>&1 &

# Theo dõi tiến trình
tail -f /tmp/output.log

# Kiểm tra kết quả
grep "✓" /tmp/editorials.log | wc -l  # Số bài thành công
grep "✗" /tmp/editorials.log | wc -l  # Số bài thất bại
```

**Rollback nếu cần:**

```sh
./manage.py shell
>>> from judge.models import Solution

# Xóa editorial của một bài cụ thể
>>> Solution.objects.filter(problem__code='cb01').delete()

# Xóa tất cả editorial PUBLIC (cẩn thận!)
>>> Solution.objects.filter(is_public=True).delete()

# Xóa 10 editorial mới nhất
>>> from django.db.models import Max
>>> last_id = Solution.objects.aggregate(Max('id'))['id__max']
>>> Solution.objects.filter(id__gte=last_id - 10).delete()
```

**Lưu ý:**
- Editorial được tạo với trạng thái PUBLIC (is_public=True)
- Hệ thống tự động thêm admin và tác giả solutions vào danh sách authors
- Sử dụng `--dry-run` để test trước khi tạo thật
- API có thể bị rate limit, giảm `--limit` nếu gặp lỗi
- Thời gian xử lý: ~5-15 giây/bài

**Troubleshooting:**

```sh
# Lỗi: "OpenAI package not installed"
pip install openai pydantic

# Lỗi: "OPENAI_API_KEY not set"
export OPENAI_API_KEY="sk-..."

# Lỗi: "No AC solutions found"
# Kiểm tra xem bài có submissions AC không
./manage.py shell
>>> from judge.models import Submission
>>> Submission.objects.filter(problem__code='xxx', result='AC').count()

# Lỗi: API rate limit
# Giảm batch size và tăng delay
./manage.py generate_editorials --limit 5 --retry-delay 5
```

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

### Tạo editorial tự động

```sh
# Bước 1: Cài đặt dependencies
pip install openai pydantic

# Bước 2: Thiết lập API key
export OPENAI_API_KEY="sk-..."

# Bước 3: Test với một bài (dry run)
./manage.py generate_editorials --problem cb01 --dry-run --verbose

# Bước 4: Tạo editorial thật
./manage.py generate_editorials --problem cb01 --verbose

# Bước 5: Kiểm tra kết quả
./manage.py shell
>>> from judge.models import Solution
>>> s = Solution.objects.get(problem__code='cb01')
>>> print(f"Editorial created: {s.is_public}")
>>> print(f"Content length: {len(s.content)} chars")

# Bước 6: Xử lý hàng loạt
./manage.py generate_editorials --limit 50 --log-file /tmp/editorials.log

# Bước 7: Theo dõi tiến trình
tail -f /tmp/editorials.log
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
