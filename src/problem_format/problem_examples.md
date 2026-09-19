# Ví dụ bài tập

Repository này chứa các ví dụ bài tập thực tế. Xem chi tiết tại [problem_examples trên GitHub](https://github.com/luyencode/docs/tree/master/problem_examples).

## Danh sách ví dụ

| Loại chấm điểm | Thư mục | Mô tả |
|----------------|---------|-------|
| [Chấm điểm chuẩn](https://github.com/luyencode/docs/tree/master/problem_examples/standard/aplusb) | `standard/aplusb` | Bài A+B đơn giản |
| [Chấm điểm theo batch](https://github.com/luyencode/docs/tree/master/problem_examples/batched/hungry) | `batched/hungry` | Bài có nhiều subtask |
| [Custom Grading](https://github.com/luyencode/docs/tree/master/problem_examples/grader/shortest1) | `grader/shortest1` | Bài cần logic chấm đặc biệt |
| [Interactive Grading](https://github.com/luyencode/docs/tree/master/problem_examples/interactive/seed2) | `interactive/seed2` | Bài tương tác (Python) |
| [Native Interactive](https://github.com/luyencode/docs/tree/master/problem_examples/interactive/seed2native) | `interactive/seed2native` | Bài tương tác (C++) |
| [Signature Grading](https://github.com/luyencode/docs/tree/master/problem_examples/signature/fastbit) | `signature/fastbit` | Bài implement hàm (IOI-style) |
| [Generator](https://github.com/luyencode/docs/tree/master/problem_examples/generator/ds3) | `generator/ds3` | Bài dùng generator tạo test |

## Cấu trúc thư mục

```
problem_examples/
├── standard/          # Bài chấm điểm chuẩn
│   └── aplusb/
├── batched/          # Bài có batch/subtask
│   └── hungry/
├── grader/           # Bài dùng custom grader
│   └── shortest1/
├── interactive/      # Bài tương tác
│   ├── seed2/        # Python interactor
│   └── seed2native/  # C++ interactor
├── signature/        # Bài IOI-style
│   └── fastbit/
└── generator/        # Bài dùng generator
    └── ds3/
```

## Cách sử dụng

Mỗi thư mục ví dụ chứa:
- `init.yml` - File cấu hình bài tập
- `README.md` - Hướng dẫn chi tiết
- Test data hoặc generator
- Checker/grader (nếu có)

## Mô tả chi tiết

### 1. Chấm điểm chuẩn (Standard)

Bài tập đơn giản nhất, thí sinh đọc input từ stdin và in output ra stdout.

**Ví dụ:** Tính A + B

```yaml
archive: aplusb.zip
test_cases:
- {in: aplusb.1.in, out: aplusb.1.out, points: 50}
- {in: aplusb.2.in, out: aplusb.2.out, points: 50}
```

### 2. Chấm điểm theo batch (Batched)

Bài tập có nhiều subtask, mỗi subtask có nhiều test. Phải đúng tất cả test trong subtask mới được điểm.

**Ví dụ:**

```yaml
test_cases:
- points: 30
  batched:
  - {in: test1.1.in, out: test1.1.out}
  - {in: test1.2.in, out: test1.2.out}
- points: 70
  batched:
  - {in: test2.1.in, out: test2.1.out}
  - {in: test2.2.in, out: test2.2.out}
  - {in: test2.3.in, out: test2.3.out}
```

### 3. Custom Grading

Bài tập cần logic chấm điểm đặc biệt, không chỉ so sánh output.

**Ví dụ:** Bài tìm đường đi ngắn nhất, có nhiều đáp án đúng.

```yaml
custom_judge: grader.py
test_cases:
- {in: test1.in, out: test1.out, points: 100}
```

### 4. Interactive Grading

Bài tập tương tác, chương trình thí sinh trao đổi dữ liệu với grader.

**Ví dụ:** Bài đoán số

```yaml
custom_judge: interactor.py
unbuffered: true
test_cases:
- {in: test1.in, points: 100}
```

### 5. Native Interactive Grading

Tương tự Interactive nhưng interactor viết bằng C/C++ cho hiệu năng cao.

```yaml
unbuffered: true
interactive:
  files: interactor.cpp
  type: testlib
test_cases:
- {in: test1.in, points: 100}
```

### 6. Signature Grading (IOI-style)

Thí sinh implement hàm, không cần đọc/ghi input/output.

**Ví dụ:** Implement hàm `is_valid(n)`

```yaml
signature_grader:
  entry: handler.c
  header: header.h
test_cases:
- {in: test1.in, out: test1.out, points: 100}
```

### 7. Generator

Dùng generator để tạo test data tự động.

```yaml
generator: gen.cpp
test_cases:
- {generator_args: [10], points: 30}
- {generator_args: [100], points: 30}
- {generator_args: [1000], points: 40}
```

## Tài nguyên tham khảo

- [DMOJ Problem Examples](https://github.com/DMOJ/docs/tree/master/problem_examples)
- [Testlib Documentation](https://github.com/MikeMirzayanov/testlib)
- [Polygon System](https://polygon.codeforces.com/)

## Lưu ý

- Tất cả ví dụ trên đều có thể xem mã nguồn đầy đủ tại repository DMOJ
- Bạn có thể kết hợp nhiều kỹ thuật trong một bài tập
- Nên test kỹ trước khi đưa bài lên hệ thống chính thức
