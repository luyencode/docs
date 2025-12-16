# Quản lý bài tập

LCOJ cung cấp giao diện web để tạo và chỉnh sửa bài tập, bao gồm cả đề bài và test data.

## Cấu hình

Trong `local_settings.py`, đặt `DMOJ_PROBLEM_DATA_ROOT` trỏ đến thư mục lưu test data:

```python
DMOJ_PROBLEM_DATA_ROOT = '/home/lcoj/problems'
```

Tất cả test data của các bài tập sẽ được lưu trong thư mục này.

## Thêm bài tập mới

### Bước 1: Truy cập trang quản trị

Truy cập `/admin/` và đăng nhập bằng tài khoản admin.

### Bước 2: Tạo bài tập

Click nút _Add_ ở mục _Problems_.

![Add Problem](https://i.imgur.com/RFPQaUi.png)

### Bước 3: Điền thông tin cơ bản

**Thông tin bắt buộc:**
- **Problem code**: Mã bài tập (phải unique, ví dụ: `APLUSB`)
- **Title**: Tên bài tập (ví dụ: "Tổng hai số")
- **Authors**: **Quan trọng!** Phải thêm bản thân làm tác giả, nếu không sẽ không chỉnh sửa được bài

![Problem Info](https://i.imgur.com/bPlNZUR.png)

### Bước 4: Viết đề bài

LCOJ hỗ trợ Markdown với các tính năng mở rộng:
- LaTeX cho công thức toán học
- Syntax highlighting cho code
- Hình ảnh, bảng biểu

**Ví dụ đề bài:**

```markdown
# Đề bài

Cho hai số nguyên $a$ và $b$. Hãy tính tổng của chúng.

## Input

Một dòng chứa hai số nguyên $a$ và $b$ ($-10^9 \le a, b \le 10^9$).

## Output

In ra một số nguyên duy nhất là $a + b$.

## Ví dụ

### Input
```
3 5
```

### Output
```
8
```

## Giới hạn

- Thời gian: 1 giây
- Bộ nhớ: 256 MB
```

Xem [template đầy đủ](https://raw.githubusercontent.com/luyencode/docs/master/sample_files/problem_markdown_example.md.txt).

### Bước 5: Cấu hình bài tập

**Các tùy chọn quan trọng:**

- **Time limit**: Giới hạn thời gian (giây)
- **Memory limit**: Giới hạn bộ nhớ (KB)
- **Points**: Điểm của bài (thường 100)
- **Partial**: Cho phép điểm thành phần
- **Group**: Nhóm bài tập
- **Types**: Loại bài (DP, Graph, Math, ...)
- **Allowed languages**: Ngôn ngữ được phép

### Bước 6: Lưu và xem

Click _Save_, sau đó click _View on site_ để xem bài tập.

![View on site](https://i.imgur.com/ZgO5xcY.png)

## Quản lý test data

### Bước 1: Mở trình chỉnh sửa test data

Trên trang bài tập, click _Edit test data_.

![Edit test data](https://i.imgur.com/eDWEEJk.png)

### Bước 2: Upload test data

Chuẩn bị file zip chứa test data. Quy ước đặt tên:

```
<problem_code>.<test_number>.in   # File input
<problem_code>.<test_number>.out  # File output
```

**Ví dụ:** Bài `APLUSB`:

```
APLUSB.1.in
APLUSB.1.out
APLUSB.2.in
APLUSB.2.out
APLUSB.3.in
APLUSB.3.out
```

Upload file zip lên hệ thống.

![Upload zip](https://i.imgur.com/w5ytsgi.png)

### Bước 3: Cấu hình test cases

**Các trường quan trọng:**

- **Input file**: Đường dẫn file input trong zip
- **Output file**: Đường dẫn file output trong zip
- **Points**: Điểm của test case

**Ví dụ cấu hình:**

```
Test 1: APLUSB.1.in, APLUSB.1.out, 30 điểm
Test 2: APLUSB.2.in, APLUSB.2.out, 30 điểm
Test 3: APLUSB.3.in, APLUSB.3.out, 40 điểm
```

### Tính điểm

Nếu bật _Partial points_:

**Công thức:**

```
Điểm = (Tổng điểm test đúng / Tổng điểm tất cả test) × Điểm bài
```

**Ví dụ:**

- Bài 100 điểm
- 3 test: 1/2/7 điểm
- Thí sinh đúng test 1 và 2, sai test 3
- Điểm = (1+2)/(1+2+7) × 100 = 30 điểm

## Batched test cases

Dùng cho bài có subtask. Phải đúng tất cả test trong subtask mới được điểm.

**Cách tạo:**

1. Click _Add batch_
2. Đặt điểm cho batch
3. Thêm các test case vào batch

**Ví dụ:**

```
Batch 1 (30 điểm):
  - Test 1.1
  - Test 1.2
  
Batch 2 (70 điểm):
  - Test 2.1
  - Test 2.2
  - Test 2.3
```

## Checker tùy chỉnh

Nếu bài có nhiều đáp án đúng, cần dùng custom checker.

**Các checker có sẵn:**

- `standard`: So sánh chính xác (mặc định)
- `floats`: Cho phép sai số số thực
- `sorted`: Bỏ qua thứ tự
- `identical`: So sánh từng ký tự

**Cách chọn checker:**

Trong phần _Checker_, chọn checker phù hợp và cấu hình tham số.

## Generator

Nếu có nhiều test, có thể dùng generator thay vì upload file.

**Cách dùng:**

1. Upload file generator (C/C++)
2. Cấu hình tham số cho mỗi test
3. Hệ thống tự động tạo input/output

Xem thêm: [Generator](/problem_format/generator.md)

## Nộp bài thử

Sau khi tạo xong test data, quay lại trang bài tập và click _Submit solution_ để thử nộp bài.

## Cập nhật test data

Nếu cần sửa test data:

1. Truy cập _Edit test data_
2. Upload file zip mới hoặc chỉnh sửa cấu hình
3. Click _Save_
4. Test data sẽ tự động cập nhật

## Rejudge

Sau khi sửa test data, nên rejudge các bài nộp cũ:

1. Vào trang bài tập
2. Click _Rejudge all submissions_
3. Chọn phạm vi rejudge (tất cả hoặc từ thời điểm nào đó)

## Tips

- **Đặt tên test rõ ràng**: Dễ quản lý và debug
- **Test đầy đủ**: Bao gồm edge cases, corner cases
- **Kiểm tra output**: Đảm bảo output chuẩn đúng
- **Thử nhiều ngôn ngữ**: Test với C++, Python, Java
- **Đọc kỹ log**: Nếu có lỗi, xem log để biết nguyên nhân

## Xử lý lỗi thường gặp

**Test data không load:**
- Kiểm tra đường dẫn file trong zip
- Kiểm tra quyền thư mục `DMOJ_PROBLEM_DATA_ROOT`

**Checker không hoạt động:**
- Kiểm tra cú pháp checker
- Xem log lỗi trong admin

**Rejudge không chạy:**
- Kiểm tra Celery đang chạy: `supervisorctl status celery`
- Xem log Celery: `supervisorctl tail -f celery`
