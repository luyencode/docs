# Management Commands

> Tra cứu mọi lệnh quản trị riêng của LCOJ (tạo người dùng, đăng ký máy chấm, nhập bài, xuất dữ liệu kỳ thi, sinh lời giải...) cùng đúng tham số của từng lệnh.
>
> 👤 Người vận hành · 🔑 SSH vào máy chủ và quyền chạy `docker compose` trong thư mục `dmoj/`

LCOJ có sẵn một bộ lệnh quản trị (Django management command) cho các việc như tạo người dùng và máy chấm, nhập bài, xuất dữ liệu kỳ thi, sinh lời giải... Trang này liệt kê **toàn bộ** các lệnh riêng đó, kèm đúng các tham số mà từng lệnh nhận.

## Khi nào cần trang này

Dùng trang này khi bạn cần làm một việc quản trị mà giao diện web không làm được hoặc làm chậm (ví dụ tạo hàng loạt tài khoản). *Management command* là một lệnh Django chạy từ dòng lệnh bên trong container `site`; xem thêm [Thuật ngữ](/start/glossary).

- Mọi lệnh đều chạy theo cùng một cách, xem [Cách chạy lệnh](#cach-chay-lenh).
- Tìm lệnh theo nhóm trong bảng [Tổng quan](#tong-quan), hoặc theo việc cần làm:

| Tôi muốn... | Lệnh |
|---|---|
| Tạo một tài khoản | [`adduser`](#adduser) |
| Tạo tài khoản cho cả lớp từ file CSV | [`batchadduser`](#batchadduser) |
| Gộp hai tài khoản của cùng một người | [`move_user_content`](#move-user-content) |
| Cấp API token cho người dùng | [`generate_api_token`](#generate-api-token) |
| Đăng ký một máy chấm mới | [`addjudge`](#addjudge) |
| Nhập bài từ Codeforces Polygon | [`import_polygon_package`](#import-polygon-package) |
| Tải mã nguồn của thí sinh sau kỳ thi | [`export_contest_submissions`](#export-contest-submissions) |
| Kiểm tra đạo code trong kỳ thi | [`runmoss`](#runmoss) |
| Sinh lời giải tự động | [`generate_editorials`](#generate-editorials) |
| Xem tham số của một lệnh bất kỳ | `./scripts/manage.py help <command>` ([chi tiết](#xem-huong-dan-cua-lenh)) |

## Cách chạy lệnh

Với bản cài Docker, chạy lệnh từ thư mục `dmoj/` qua script bọc `./scripts/manage.py`:

```sh
cd dmoj/
./scripts/manage.py <command> [tham số] [tùy chọn]
```

Script này chạy `docker compose exec $COMPOSE_EXEC_FLAGS site python3 manage.py <command>`, tức là lệnh được thực thi **bên trong container `site`**.

::: tip Đường dẫn file nằm trong container
Thư mục làm việc của container `site` là `/site/`, tương ứng `dmoj/repo/` trên máy chủ. Mọi đường dẫn tương đối bạn truyền vào (file CSV đầu vào, file hay thư mục đầu ra) đều nằm dưới `dmoj/repo/` trên máy chủ. Các thư mục dùng chung khác: `/problems/` = `dmoj/problems/`, `/media/` = `dmoj/media/`.
:::

::: warning Tham số có dấu cách
Script truyền tham số không có dấu nháy (`$@`), nên một tham số chứa dấu cách (như tên bài) sẽ bị tách thành nhiều tham số. Với những lệnh như vậy, hãy mở shell trong container bằng `./scripts/enter_site` rồi chạy `python3 manage.py <command> ...` ở đó.
:::

::: tip Truyền thêm biến môi trường
Script chuyển `COMPOSE_EXEC_FLAGS` cho `docker compose exec`. Ví dụ, đặt một biến chỉ cho một lần chạy:

```sh
COMPOSE_EXEC_FLAGS="-e OPENAI_API_KEY=sk-..." ./scripts/manage.py generate_editorials --dry-run
```
:::

## Tổng quan

| Nhóm | Lệnh | Công dụng |
|---|---|---|
| Người dùng | [`adduser`](#adduser) | Tạo một người dùng |
| Người dùng | [`batchadduser`](#batchadduser) | Tạo nhiều người dùng từ file CSV, tự sinh mật khẩu |
| Người dùng | [`move_user_content`](#move-user-content) | Chuyển bài nộp và bình luận từ tài khoản này sang tài khoản khác |
| Người dùng | [`generate_api_token`](#generate-api-token) | Sinh (hoặc sinh lại) API token của người dùng |
| Chấm bài | [`addjudge`](#addjudge) | Đăng ký máy chấm cùng khóa xác thực |
| Chấm bài | [`runbridged`](#runbridged) | Chạy bridge cho máy chấm (dịch vụ `bridged` dùng lệnh này) |
| Chấm bài | [`runbalancer`](#runbalancer) | Chạy bộ cân bằng tải cho máy chấm |
| Bài tập | [`create_problem`](#create-problem) | Tạo một bài trống |
| Bài tập | [`import_polygon_package`](#import-polygon-package) | Nhập bài từ package Codeforces Polygon |
| Bài tập | [`submit_polygon_solutions`](#submit-polygon-solutions) | Nộp toàn bộ lời giải có trong package Polygon |
| Bài tập | [`copy_language`](#copy-language) | Cho phép ngôn ngữ B ở mọi bài đang cho phép ngôn ngữ A |
| Bài tập | [`render_pdf`](#render-pdf) | Xuất đề bài ra PDF |
| Bài tập | [`backfill_problem_data_size`](#backfill-problem-data-size) | Tính lại dung lượng file dữ liệu của từng bài |
| Lời giải | [`generate_editorials`](#generate-editorials) | Sinh lời giải bằng API tương thích OpenAI |
| Kỳ thi | [`export_contest_submissions`](#export-contest-submissions) | Xuất mã nguồn của thí sinh ra cây thư mục |
| Kỳ thi | [`export_contest_submissions_details`](#export-contest-submissions-details) | Xuất kết quả từng test ra CSV |
| Kỳ thi | [`export_event_feed`](#export-event-feed) | Xuất event feed CLICS dạng XML (cho ICPC Resolver) |
| Kỳ thi | [`runmoss`](#runmoss) | Kiểm tra đạo code trong kỳ thi bằng MOSS |
| Kỳ thi | [`merge_replay_data`](#merge-replay-data) | Thêm thí sinh của kỳ thi khác vào replay dưới dạng "bóng ma" |
| Tổ chức | [`backfill_current_credit`](#backfill-current-credit) | Tính lại credit đã dùng trong tháng này của mọi tổ chức |
| Tổ chức | [`backfill_monthly_credit`](#backfill-monthly-credit) | Tính lại lịch sử credit theo tháng của mọi tổ chức |
| Trang web | [`add_blog_navigation`](#add-blog-navigation) | Thêm mục "Blog" vào thanh điều hướng |
| Trang web | [`generate_sitemap`](#generate-sitemap) | Ghi các file sitemap tĩnh vào một thư mục |
| Trang web | [`update_permissions`](#update-permissions) | Tạo/đổi tên quyền sau khi model thay đổi |
| Trang web | [`makedmojmessages`](#makedmojmessages) | Tạo file dịch cho các chuỗi lưu trong cơ sở dữ liệu |
| Trang web | [`camo`](#camo) | In ra URL qua proxy Camo của một ảnh |

Các lệnh có sẵn của Django (`migrate`, `createsuperuser`, `shell`, `loaddata`, `compilemessages`, ...) cũng chạy qua cùng script này.

## Người dùng

### adduser

Tạo một người dùng cùng hồ sơ (profile).

```sh
./scripts/manage.py adduser <name> <email> <password> [language] [--superuser] [--staff]
```

| Tham số | Mô tả |
|---|---|
| `name` | Tên đăng nhập |
| `email` | Email (không cần là email thật) |
| `password` | Mật khẩu |
| `language` | Không bắt buộc. Mã ngôn ngữ mặc định của người dùng; mặc định là `DEFAULT_USER_LANGUAGE` (`CPP20`) |
| `--superuser` | Cấp quyền superuser |
| `--staff` | Cấp quyền staff (được vào trang quản trị Django) |

```sh
./scripts/manage.py adduser alice alice@luyencode.net 'S3cret!' PY3
```

::: warning
Mật khẩu sẽ nằm trong lịch sử shell. Với tài khoản quản trị, nên dùng `createsuperuser`, hoặc đổi mật khẩu ngay sau khi tạo.
:::

### batchadduser

Tạo nhiều người dùng từ file CSV. Mật khẩu được **tự sinh** (8 ký tự ngẫu nhiên) và ghi ra một file CSV kết quả.

```sh
./scripts/manage.py batchadduser <input> <output>
```

| Tham số | Mô tả |
|---|---|
| `input` | File CSV có dòng tiêu đề gồm cột `username` và `fullname` |
| `output` | Nơi ghi file CSV kết quả (`username,fullname,password`) |

File đầu vào (`dmoj/repo/students.csv` trên máy chủ):

```csv
username,fullname
lc_student01,Nguyen Van A
lc_student02,Tran Thi B
```

```sh
./scripts/manage.py batchadduser students.csv students_out.csv
```

`fullname` được lưu vào trường tên (first name); mọi người dùng nhận ngôn ngữ mặc định `DEFAULT_USER_LANGUAGE`. Lệnh sẽ dừng ngay khi gặp tên đăng nhập trùng, vì vậy hãy kiểm tra file đầu vào trước.

::: warning
File CSV kết quả chứa mật khẩu dạng rõ. Hãy gửi cho người dùng một cách an toàn rồi xóa file.
:::

### move_user_content

Chuyển toàn bộ **bài nộp, bình luận và lượt vote bình luận** từ `source` sang `target`. Hữu ích khi một người có hai tài khoản.

```sh
./scripts/manage.py move_user_content <source> <target>
```

::: danger Không thể hoàn tác
Thao tác chạy trong một transaction nhưng không có cách tự động đảo ngược: sau đó bạn không còn phân biệt được bài nộp nào vốn của `source`. Hãy sao lưu cơ sở dữ liệu trước. Lệnh từ chối chạy nếu `source` đã từng tham gia kỳ thi. Tài khoản `source` **không** bị xóa.
:::

### generate_api_token

Sinh hoặc sinh lại API token của người dùng và in ra màn hình. Token là chuỗi URL-safe dài 48 ký tự, dùng trong header `Authorization: Bearer <token>` (xem [API](/reference/api)).

```sh
./scripts/manage.py generate_api_token <name>
```

::: warning
Sinh lại token sẽ làm token cũ mất hiệu lực. Token bỏ qua xác thực hai lớp (nhưng không vào được trang quản trị), nên hãy giữ nó như mật khẩu.
:::

## Chấm bài

### addjudge

Đăng ký máy chấm vào cơ sở dữ liệu để nó kết nối được tới bridge.

```sh
./scripts/manage.py addjudge <name> <auth_key>
```

| Tham số | Mô tả |
|---|---|
| `name` | Tên máy chấm (phải trùng với `id` trong cấu hình máy chấm) |
| `auth_key` | Khóa xác thực (phải trùng với `key` trong cấu hình máy chấm) |

Lệnh **không** tự sinh khóa; bạn tự chọn, ví dụ bằng `openssl rand -base64 48`. Cũng có thể tạo máy chấm trong trang quản trị Django. Xem [Cài đặt máy chấm](/operate/judge-setup).

### runbridged

Chạy bridge mà các máy chấm kết nối tới. Với bản cài Docker, đây là lệnh khởi động của dịch vụ `bridged`; bạn không cần tự chạy.

```sh
python3 manage.py runbridged [--monitor] [--problem-storage-globs GLOB ...]
```

| Tùy chọn | Mô tả |
|---|---|
| `--monitor` | Theo dõi thư mục dữ liệu bài và tự cập nhật bài khi dữ liệu thay đổi |
| `--problem-storage-globs` | Các glob cần theo dõi (mặc định: không có) |

Địa chỉ lắng nghe lấy từ các thiết lập `BRIDGED_JUDGE_ADDRESS` (mặc định cổng 9999) và `BRIDGED_DJANGO_ADDRESS` (mặc định cổng 9998), không phải từ tham số dòng lệnh.

### runbalancer

Chạy bộ cân bằng tải cho máy chấm với file cấu hình YAML.

```sh
./scripts/manage.py runbalancer -c <config.yml>
```

| Tùy chọn | Mô tả |
|---|---|
| `-c`, `--config` | File YAML chứa cấu hình bộ cân bằng tải (bắt buộc) |

## Bài tập

### create_problem

Tạo một bài trống với đề bài, một dạng bài và một nhóm bài. Dạng bài và nhóm bài phải có sẵn.

```sh
./scripts/manage.py create_problem <code> <name> <body> <type> <group>
```

| Tham số | Mô tả |
|---|---|
| `code` | Mã bài |
| `name` | Tên bài |
| `body` | Đề bài (Markdown) |
| `type` | Tên một dạng bài đã có |
| `group` | Tên một nhóm bài đã có |

```sh
# chạy trong container (./scripts/enter_site), vì tên và đề bài có dấu cách
python3 manage.py create_problem aplusb "A + B" "Tính a + b." <type_name> <group_name>
```

Lệnh không đặt giới hạn, điểm, test hay tác giả; hãy sửa bài sau khi tạo (xem [Quản lý bài tập](/setter/managing-problems)).

### import_polygon_package

Nhập một package **đầy đủ** (full package, dạng zip) từ Codeforces Polygon.

```sh
./scripts/manage.py import_polygon_package <package> <code> [--update] [--authors USER ...] [--curators USER ...]
```

| Tham số / tùy chọn | Mô tả |
|---|---|
| `package` | Đường dẫn tới file zip |
| `code` | Mã bài cần tạo |
| `--update` | Cập nhật bài nếu đã tồn tại |
| `--authors` | Một hoặc nhiều tên đăng nhập làm tác giả |
| `--curators` | Một hoặc nhiều tên đăng nhập làm người quản lý bài |

```sh
./scripts/manage.py import_polygon_package packages/aplusb.zip aplusb --authors admin
```

Quá trình nhập có tương tác (có thể hỏi bạn), và in ra URL của bài khi xong.

### submit_polygon_solutions

Nộp mọi lời giải liệt kê trong `problem.xml` của package Polygon vào một bài đã có, để kiểm tra kết quả chấm có khớp nhãn mong đợi. Mỗi mã nguồn được thêm chú thích đầu file gồm tên file và kết quả mong đợi.

```sh
./scripts/manage.py submit_polygon_solutions <package> <code> <submitter>
```

| Tham số | Mô tả |
|---|---|
| `package` | Đường dẫn tới file zip |
| `code` | Mã bài |
| `submitter` | Tên đăng nhập dùng để nộp |

Các ngôn ngữ được hỗ trợ ánh xạ sang mã `CPP20`, `JAVA`, `PAS`, `PY2`, `PY3`, `PYPY`, `PYPY3`, `KOTLIN`, `GO`, `RUST`; lời giải khác bị bỏ qua. Các mã ngôn ngữ này phải có trên hệ thống.

### copy_language

Với mọi bài đang cho phép ngôn ngữ `source`, cho phép thêm ngôn ngữ `target`, đồng thời chép giới hạn thời gian/bộ nhớ riêng theo ngôn ngữ của `source` sang `target`.

```sh
./scripts/manage.py copy_language <source> <target>
```

```sh
./scripts/manage.py copy_language CPP17 CPP20
```

Cả hai tham số là **mã ngôn ngữ**, không phải mã bài.

::: danger Ghi đè danh sách bài của `target`
Danh sách bài cho phép `target` sẽ bị **thay** bằng danh sách của `source`: bài nào đang cho phép `target` nhưng không cho phép `source` sẽ mất `target`. Hãy sao lưu cơ sở dữ liệu trước khi chạy.
:::

### render_pdf

Xuất đề bài ra file `<code>.pdf` trong thư mục làm việc (`dmoj/repo/` trên máy chủ).

```sh
./scripts/manage.py render_pdf <code> [-l LANGUAGE]
```

| Tham số / tùy chọn | Mô tả |
|---|---|
| `code` | Mã bài |
| `-l`, `--language` | Ngôn ngữ đề; dùng bản dịch nếu có. Mặc định: `LANGUAGE_CODE` (`vi` trong cấu hình mặc định của lcoj-docker) |

Cần Pdfoid (`DMOJ_PDF_PDFOID_URL`). Xem [Pdfoid](/operate/pdfoid).

### backfill_problem_data_size

Tính lại dung lượng các file dữ liệu của từng bài (zip test, generator, checker, grader, header tùy biến) trong `DMOJ_PROBLEM_DATA_ROOT` và lưu tổng vào bản ghi dữ liệu bài.

```sh
./scripts/manage.py backfill_problem_data_size [--dry-run]
```

| Tùy chọn | Mô tả |
|---|---|
| `--dry-run` | Chỉ hiển thị thay đổi, không lưu |

Chạy một lần sau khi nâng cấp lên phiên bản có theo dõi dung lượng dữ liệu bài, hoặc khi dung lượng hiển thị có vẻ sai.

## Lời giải

### generate_editorials

Sinh lời giải (editorial) cho các **bài công khai** chưa có lời giải, dùng API chat tương thích OpenAI với structured output của Pydantic.

```sh
./scripts/manage.py generate_editorials [tùy chọn]
```

**Yêu cầu**

- Gói `openai` và `pydantic`. Hai gói này có trong `additional_requirements.txt` và đã được cài trong image base của Docker.
- Biến `OPENAI_API_KEY` phải có trong môi trường của container `site` (thêm vào `environment/site.env` rồi tạo lại container, hoặc truyền qua `COMPOSE_EXEC_FLAGS` như ở trên).
- `OPENAI_BASE_URL` không bắt buộc; đặt biến này để dùng một endpoint tương thích OpenAI khác.

**Tùy chọn**

| Tùy chọn | Mô tả | Mặc định |
|---|---|---|
| `--problem CODE`, `-p CODE` | Chỉ xử lý một bài | Mọi bài công khai chưa có lời giải |
| `--limit N`, `-l N` | Số bài tối đa cần xử lý | `10` |
| `--offset N` | Bỏ qua N bài đầu tiên (sắp theo ID) | `0` |
| `--dry-run` | Sinh và xem trước, không lưu gì | tắt |
| `--verbose` | Ghi log mức debug | tắt |
| `--model MODEL` | Tên model gửi lên API | `mimo-v2-flash` |
| `--temperature T` | Nhiệt độ lấy mẫu | `0.7` |
| `--max-retries N` | Số lần thử lại khi API lỗi | `3` |
| `--retry-delay S` | Thời gian chờ gốc (giây), nhân đôi sau mỗi lần thử lại | `2` |
| `--log-file PATH` | Ghi log thêm vào file này | không có |

**Cách hoạt động**

1. Chọn các bài có `is_public=True` và chưa có lời giải (với `--problem`, bài đó phải công khai và chưa có lời giải).
2. Lấy tối đa 3 bài nộp Accepted gần nhất bằng C/C++, ưu tiên của những người khác nhau.
3. Gửi đề bài và các lời giải lên API, rồi phân tích câu trả lời theo một schema cố định.
4. Dựng Markdown theo định dạng chuẩn bên dưới.
5. Lưu lời giải ở trạng thái **công khai, xuất bản ngay**. Tác giả: người dùng tên `admin` (hoặc superuser đầu tiên), sau đó là tác giả của các bài nộp được lấy mẫu.

::: warning Xuất bản ngay lập tức
Lời giải sinh ra hiển thị cho người dùng ngay. Luôn xem trước bằng `--dry-run` và kiểm tra vài kết quả trên trang (`https://luyencode.net/problem/<code>/editorial`).
:::

**Định dạng lời giải** (tiêu đề bằng tiếng Việt, đúng như được sinh ra):

````markdown
## Hiểu bài toán
[Giải thích đề bài]

## Các cách tiếp cận

### Cách Brute Force

```cpp
[code]
```

* **Time Complexity**: O(n²)
* **Space Complexity**: O(1)

[Giải thích]

### Cách Hash Map
[code + giải thích]

## Phân tích độ phức tạp
| Cách tiếp cận | Time | Space | Tên |
|--------------|------|-------|-----|
| 1 | O(n²) | O(1) | Brute Force |
| 2 | O(n) | O(n) | Hash Map |

## Bài học kinh nghiệm
- [Nhận xét]

## Lỗi thường gặp
- [Lỗi]
````

**Ví dụ**

```sh
# 1. Xem trước một bài (không lưu gì)
./scripts/manage.py generate_editorials --problem aplusb --dry-run --verbose

# 2. Sinh thật
./scripts/manage.py generate_editorials --problem aplusb

# 3. Xử lý 20 bài và ghi log (đường dẫn nằm trong container)
./scripts/manage.py generate_editorials --limit 20 --log-file /tmp/editorials.log

# 4. Dùng model khác
./scripts/manage.py generate_editorials --problem aplusb --model gpt-4o-mini --temperature 0.5
```

Log đánh dấu bài thành công bằng `✓` và thất bại bằng `✗`. Mỗi bài mất vài giây; hãy giảm `--limit` hoặc tăng `--retry-delay` nếu API giới hạn tần suất.

**Lỗi thường gặp**

| Thông báo | Cách xử lý |
|---|---|
| `OPENAI_API_KEY environment variable not set` | Cung cấp khóa cho container `site` |
| `OpenAI package not installed` | Build lại image: `docker compose up -d --build base site celery` |
| `Insufficient AC C/C++ solutions` | Bài chưa có bài nộp Accepted bằng C/C++; bỏ qua hoặc tự viết lời giải |
| `Problem '<code>' not found or already has editorial` | Sai mã bài, bài không công khai, hoặc đã có lời giải |

**Gỡ một lời giải đã sinh**

Sửa hoặc xóa ở phần lời giải trong trang chỉnh sửa bài của trang quản trị Django, hoặc dùng shell:

::: danger
Lệnh dưới đây xóa vĩnh viễn lời giải của bài được chỉ định.
:::

```sh
./scripts/manage.py shell
>>> from judge.models import Solution
>>> Solution.objects.filter(problem__code='aplusb').delete()
```

## Kỳ thi

### export_contest_submissions

Xuất mã nguồn của mọi thí sinh thi **chính thức** (không tính thi ảo) ra cây thư mục. Bài nộp cuối cùng của mỗi người cho mỗi bài nằm ở `<output>/<username>/<problem>.<ext>`; các bài nộp cũ hơn nằm ở `<output>/<username>/$History/<problem>_<id>.<ext>`.

```sh
./scripts/manage.py export_contest_submissions <key> <output>
```

| Tham số | Mô tả |
|---|---|
| `key` | Mã kỳ thi |
| `output` | **Thư mục** đầu ra; phải chưa tồn tại |

```sh
./scripts/manage.py export_contest_submissions lcoj_round1 exports/lcoj_round1
```

### export_contest_submissions_details

Xuất kết quả từng test của mọi bài nộp trong kỳ thi ra **một file CSV** với các cột `username, problem, submission, testcase, points, time, memory, feedback`.

```sh
./scripts/manage.py export_contest_submissions_details <key> <output>
```

```sh
./scripts/manage.py export_contest_submissions_details lcoj_round1 exports/lcoj_round1_details.csv
```

### export_event_feed

Xuất event feed CLICS dạng **XML** cho các công cụ như ICPC Resolver.

```sh
./scripts/manage.py export_event_feed <key> <output> [--medal lastGold lastSilver lastBronze]
```

| Tham số / tùy chọn | Mô tả | Mặc định |
|---|---|---|
| `key` | Mã kỳ thi | |
| `output` | File đầu ra; phải có đuôi `.xml` | |
| `--medal` | Thứ hạng cuối cùng nhận huy chương vàng, bạc, đồng | `4 8 12` |

```sh
./scripts/manage.py export_event_feed lcoj_icpc exports/lcoj_icpc.xml --medal 1 3 6
```

### runmoss

Chạy MOSS trên các bài nộp Accepted của kỳ thi (thí sinh chính thức và người theo dõi), theo từng bài và từng ngôn ngữ (C++, C, Java, Python, Pascal), rồi in ra URL kết quả MOSS.

```sh
./scripts/manage.py runmoss <contest>
```

`contest` là **mã** kỳ thi. Cần `MOSS_API_KEY` (trong lcoj-docker, đặt qua biến môi trường `MOSS_API_KEY`). Người tổ chức kỳ thi cũng có thể chạy MOSS từ trang `/moss` của kỳ thi.

### merge_replay_data

Bổ sung vào replay bảng xếp hạng của kỳ thi A các thí sinh của một kỳ thi B khác, hiển thị dưới dạng "bóng ma" (ghost). Hữu ích khi so sánh một kỳ thi mirror trên luyencode.net với kỳ thi gốc.

```sh
./scripts/manage.py merge_replay_data <contest> <b_json>
```

| Tham số | Mô tả |
|---|---|
| `contest` | Mã kỳ thi A trên hệ thống này |
| `b_json` | File JSON dữ liệu replay của kỳ thi B (cùng định dạng được phục vụ tại `/contest/<key>/replay/<version>/`) |

Lệnh dựng lại dữ liệu replay của A từ cơ sở dữ liệu (nên chạy lại nhiều lần cũng không bị nhân đôi bóng ma), ghép bài theo **thứ tự**, tăng `replay_version` của kỳ thi, ghi file mới vào `MEDIA_ROOT/contest_replay/`, và bật nút bật/tắt bóng ma trên trang bảng xếp hạng. Hai kỳ thi phải có cùng số bài; nếu thời lượng khác nhau thì lệnh in cảnh báo. Chỉ những kỳ thi xem lại được (công khai, đã kết thúc, không đóng băng, bảng xếp hạng hiển thị) mới có replay.

## Tổ chức

Các lệnh này tính lại lượng credit mà tổ chức đã dùng (thời gian chấm của bài và kỳ thi thuộc tổ chức). Không có tham số và có ghi vào cơ sở dữ liệu.

### backfill_current_credit

Tính lại lượng dùng trong **tháng hiện tại** của mọi tổ chức và đặt lại credit miễn phí về `VNOJ_MONTHLY_FREE_CREDIT`.

```sh
./scripts/manage.py backfill_current_credit
```

### backfill_monthly_credit

Tính lại bản ghi lượng dùng theo tháng của mọi tổ chức, từ tháng 6/2023 tới tháng trọn vẹn gần nhất.

```sh
./scripts/manage.py backfill_monthly_credit
```

## Bảo trì trang web

### add_blog_navigation

Thêm mục điều hướng cấp cao nhất `Blog` → `/blog/` (key `blog`) vào cuối thanh điều hướng. Không làm gì nếu đã có mục với key `blog`.

```sh
./scripts/manage.py add_blog_navigation
```

### generate_sitemap

Ghi các file sitemap tĩnh: `<directory>/sitemap.xml` (file chỉ mục) và mỗi trang sitemap một file trong thư mục con. Trang web vốn đã phục vụ `/sitemap.xml` động, nên lệnh này chỉ cần khi bạn muốn phục vụ file tĩnh.

```sh
./scripts/manage.py generate_sitemap <directory> [-s SITE] [-p PROTOCOL] [-d SUBDIR] [-P PREFIX]
```

| Tham số / tùy chọn | Mô tả | Mặc định |
|---|---|---|
| `directory` | Thư mục đầu ra | |
| `-s`, `--site` | ID của site | Site hiện tại |
| `-p`, `--protocol` | Giao thức dùng trong liên kết | `https` |
| `-d`, `--subdir`, `--subdirectory` | Thư mục con chứa các file sitemap riêng lẻ | `sitemaps` |
| `-P`, `--prefix` | Tiền tố URL của các sitemap riêng lẻ; phải kết thúc bằng `/` | `<protocol>://<domain>/<subdir>/` |

Thêm `-v 2` để xem tiến trình.

### update_permissions

Tạo các quyền còn thiếu và cập nhật tên các quyền đã có, cho mọi app hoặc chỉ các app chỉ định. Chạy sau khi `Meta.permissions` của model thay đổi (xem [Phân quyền](/admin/permissions)).

```sh
./scripts/manage.py update_permissions [--apps APP1,APP2] [--create-only | --update-only]
```

| Tùy chọn | Mô tả |
|---|---|
| `--apps` | Danh sách app, cách nhau bằng dấu phẩy (mặc định: mọi app) |
| `--create-only` | Chỉ tạo quyền còn thiếu |
| `--update-only` | Chỉ đổi tên quyền đã có |

Dùng `-v 2` để in ra từng quyền được đổi tên.

### makedmojmessages

Tạo catalog dịch `dmoj-user` từ các chuỗi trong **cơ sở dữ liệu** (nhãn thanh điều hướng và tên dạng bài), thay vì từ mã nguồn.

```sh
./scripts/manage.py makedmojmessages (-l LOCALE ... | -a) [-x LOCALE] [--no-wrap] [--no-obsolete] [--keep-pot]
```

| Tùy chọn | Mô tả |
|---|---|
| `-l`, `--locale` | Locale cần tạo/cập nhật (dùng được nhiều lần), ví dụ `vi` |
| `-a`, `--all` | Cập nhật mọi locale đang có |
| `-x`, `--exclude` | Locale cần bỏ qua (dùng được nhiều lần) |
| `--no-wrap` | Không ngắt dòng dài |
| `--no-obsolete` | Xóa các chuỗi lỗi thời |
| `--keep-pot` | Giữ lại file `.pot` (để debug) |

Sau đó biên dịch bằng `./scripts/manage.py compilemessages`.

### camo

In ra URL qua proxy Camo của một URL ảnh. Báo lỗi `Camo not available` nếu chưa cấu hình Camo (`DMOJ_CAMO_URL`, `DMOJ_CAMO_KEY`). Xem [Proxy nội dung SSL](/operate/ssl-content-proxy).

```sh
./scripts/manage.py camo <url>
```

## Mẹo

### Chạy lệnh dài ở chế độ nền

Dùng `-T` (không cấp TTY) để lệnh vẫn chạy khi phiên SSH kết thúc:

```sh
COMPOSE_EXEC_FLAGS="-T" nohup ./scripts/manage.py generate_editorials --limit 100 > editorials.out 2>&1 &
tail -f editorials.out
```

### Lên lịch với cron

Đặt trong crontab của máy chủ; dùng đường dẫn tuyệt đối tới `dmoj/` và `-T` vì cron không có TTY:

```cron
# Tính lại credit của tổ chức lúc 00:10 ngày 1 hằng tháng
10 0 1 * * cd /path/to/lcoj-docker/dmoj && COMPOSE_EXEC_FLAGS="-T" ./scripts/manage.py backfill_monthly_credit
```

## Xem hướng dẫn của lệnh

Liệt kê mọi lệnh (có sẵn của Django và riêng của LCOJ):

```sh
./scripts/manage.py help
```

Xem tham số của một lệnh:

```sh
./scripts/manage.py help <command>
# ví dụ
./scripts/manage.py help adduser
```

## Tiếp theo

- [Các script hỗ trợ](/operate/scripts): các script khác trong `dmoj/scripts/`, gồm `manage.py` và `enter_site`.
- [Cài đặt máy chấm](/operate/judge-setup): dùng `addjudge` khi thêm máy chấm.
- [Quản lý người dùng](/admin/users): làm việc với tài khoản qua giao diện web.
- [API](/reference/api): dùng token tạo bởi `generate_api_token`.
- [Tham khảo cấu hình](/reference/settings): các thiết lập nhắc tới ở trang này, như `BRIDGED_JUDGE_ADDRESS`, `MOSS_API_KEY`, `VNOJ_MONTHLY_FREE_CREDIT`.
