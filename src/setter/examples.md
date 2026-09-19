# Ví dụ bài tập

Repository tài liệu của LCOJ ([luyencode/docs](https://github.com/luyencode/docs)) có sẵn các bài tập mẫu hoàn chỉnh, chạy được, trong thư mục [`problem_examples`](https://github.com/luyencode/docs/tree/master/problem_examples). Mỗi bài minh họa một cách chấm khác nhau, kèm `init.yml` thật và đầy đủ các file cần thiết. Các ví dụ này được chuyển thể từ [bộ ví dụ của DMOJ](https://github.com/DMOJ/docs/tree/master/problem_examples).

## Danh sách ví dụ

| Ví dụ | Cách chấm | Nội dung minh họa |
|---|---|---|
| [`standard/aplusb`](https://github.com/luyencode/docs/tree/master/problem_examples/standard/aplusb) | Chuẩn | Test data trong file zip, ba test lần lượt 5, 20 và 75 điểm. |
| [`batched/hungry`](https://github.com/luyencode/docs/tree/master/problem_examples/batched/hungry) | Theo batch | Ba subtask lần lượt 5, 20 và 25 điểm. |
| [`generator/ds3`](https://github.com/luyencode/docs/tree/master/problem_examples/generator/ds3) | Generator | 20 test sinh bằng generator C++, mỗi test 5 điểm. |
| [`grader/shortest1`](https://github.com/luyencode/docs/tree/master/problem_examples/grader/shortest1) | Grader Python tùy chỉnh | Bài "code golf" chấm bằng một lớp con của `StandardGrader`. |
| [`interactive/seed2`](https://github.com/luyencode/docs/tree/master/problem_examples/interactive/seed2) | Grader tương tác bằng Python | Trò chơi đoán số viết bằng `InteractiveGrader`. |
| [`interactive/seed2native`](https://github.com/luyencode/docs/tree/master/problem_examples/interactive/seed2native) | Tương tác native | Cùng trò chơi đó với interactor C++. |
| [`signature/fastbit`](https://github.com/luyencode/docs/tree/master/problem_examples/signature/fastbit) | Chữ ký hàm (kiểu IOI) + checker Python | Thí sinh cài đặt một hàm C. |

Mỗi thư mục có `init.yml`, `README.md` (tiếng Việt), test data hoặc generator, và các file checker hay grader nếu có.

## Chạy thử một ví dụ trên LCOJ của bạn

1. Tải thư mục ví dụ về, ví dụ `standard/aplusb`.
2. Chép vào thư mục dữ liệu bài tập, dùng tên thư mục làm mã bài: `dmoj/problems/aplusb/`.
3. Tạo một bài có **cùng mã** (`aplusb`) trong admin và bật **manually managed** (quản lý test thủ công), để trình sửa test trên web không thay mất `init.yml` của ví dụ.
4. Đảm bảo judge nhìn thấy thư mục mới (xem [Cài đặt judge](/operate/judge-setup)).
5. Nộp một lời giải và kiểm tra kết quả.

## Chi tiết

### 1. Chấm chuẩn: `standard/aplusb`

Thí sinh đọc input từ stdin và in đáp án ra stdout. Mọi file test nằm trong `aplusb.zip`, và checker mặc định `standard` so sánh output.

```yaml
archive: aplusb.zip
test_cases:
- {in: aplusb.1.in, out: aplusb.1.out, points: 5}
- {in: aplusb.2.in, out: aplusb.2.out, points: 20}
- {in: aplusb.3.in, out: aplusb.3.out, points: 75}
```

Xem [Cấu trúc bài tập](/setter/problem-format).

### 2. Chấm theo batch: `batched/hungry`

Các test được gom thành ba batch. Một batch chỉ được điểm khi mọi test trong batch đều đúng.

```yaml
archive: hungry.zip
test_cases:
- batched:
  - {in: hungry.1a.in, out: hungry.1a.out}
  - {in: hungry.1b.in, out: hungry.1b.out}
  - {in: hungry.1c.in, out: hungry.1c.out}
  points: 5
- batched:
  - {in: hungry.2a.in, out: hungry.2a.out}
  - {in: hungry.2b.in, out: hungry.2b.out}
  - {in: hungry.2c.in, out: hungry.2c.out}
  - {in: hungry.2d.in, out: hungry.2d.out}
  points: 20
- batched:
  - {in: hungry.3a.in, out: hungry.3a.out}
  - {in: hungry.3b.in, out: hungry.3b.out}
  - {in: hungry.3c.in, out: hungry.3c.out}
  - {in: hungry.3d.in, out: hungry.3d.out}
  points: 25
```

Xem [Batched test cases](/setter/problem-format#batched-test-cases).

### 3. Generator: `generator/ds3`

Không có file test lưu sẵn. `generator.cpp` nhận số thứ tự test qua `argv[1]`, in input ra stdout và output chuẩn ra stderr. Key `points: 5` ở cấp ngoài cùng áp dụng cho mọi test.

```yaml
generator: generator.cpp
points: 5
test_cases:
- generator_args: [1]
- generator_args: [2]
# ... tiếp tục đến
- generator_args: [20]
```

Xem [Generator](/setter/generators).

### 4. Grader Python tùy chỉnh: `grader/shortest1`

Một bài "code golf": bài nộp được kỳ vọng chạy tới hết giới hạn thời gian, nên TLE được tính là thành công, và mã nguồn càng ngắn càng được nhiều điểm (`min((9 / độ dài mã nguồn)^5 × điểm, điểm)`). Grader kế thừa `StandardGrader` và ghi đè `check_result` cùng `_interact_with_process`.

```yaml
custom_judge: shortest1.py
test_cases:
- {points: 10}
```

Xem [Grader Python tùy chỉnh](/setter/graders#grader-python-tuy-chinh).

### 5. Grader tương tác bằng Python: `interactive/seed2`

Mỗi file input chứa một số bí mật `N`. Thí sinh đoán; grader trả lời `OK`, `FLOATS` (đoán lớn quá) hoặc `SINKS` (đoán nhỏ quá). Test đúng nếu tìm ra số trong tối đa 31 lượt.

```yaml
custom_judge: seed2.py
unbuffered: true
archive: seed2.zip
test_cases:
- {in: seed2.1.in, points: 20}
- {in: seed2.2.in, points: 20}
- {in: seed2.3.in, points: 20}
- {in: seed2.4.in, points: 20}
- {in: seed2.5.in, points: 20}
```

Xem [Grader tương tác bằng Python](/setter/graders#grader-tuong-tac-bang-python).

### 6. Chấm tương tác native: `interactive/seed2native`

Cùng trò chơi đó, nhưng interactor là chương trình C++. Interactor đọc `N` từ file input (`argv[1]`), trao đổi với thí sinh qua stdin và stdout, rồi thoát với mã 0 (đúng) hoặc 1 (sai).

```yaml
unbuffered: True
archive: seed2.zip
interactive: {files: interactor.cpp, type: testlib}
test_cases:
- {in: seed2.1.in, points: 20}
- {in: seed2.2.in, points: 20}
- {in: seed2.3.in, points: 20}
- {in: seed2.4.in, points: 20}
- {in: seed2.5.in, points: 20}
```

Xem [Chấm tương tác native](/setter/graders#cham-tuong-tac-native).

### 7. Chấm theo chữ ký hàm: `signature/fastbit`

Thí sinh cài đặt hàm `int setbits(unsigned long long)`, khai báo trong `fastbit.h`. File entry `grader.c` gọi hàm này với rất nhiều số ngẫu nhiên và in `Correct.` nếu mọi kết quả đều đúng. Mọi test dùng chung output chuẩn `correct.txt` (key `out` kế thừa từ cấp ngoài cùng), và `checker.py` cho trọn điểm nếu mã nguồn ngắn hơn 560 byte, còn lại được nửa số điểm.

```yaml
output_prefix_length: 0
checker: checker.py
signature_grader: {entry: grader.c, header: fastbit.h}
out: correct.txt
test_cases:
- {in: 1.txt, points: 20}
- {in: 2.txt, points: 30}
- {in: 3.txt, points: 50}
```

Xem [Chấm theo chữ ký hàm](/setter/graders#cham-theo-chu-ky-ham) và [Checker viết bằng Python](/setter/checkers#checker-viet-bang-python).

## Tài liệu tham khảo

- [Bộ ví dụ của DMOJ](https://github.com/DMOJ/docs/tree/master/problem_examples), nguồn gốc của các ví dụ này
- [testlib](https://github.com/VNOI-Admin/testlib), phiên bản được cài trên judge của LCOJ
- [Codeforces Polygon](https://polygon.codeforces.com/), nơi LCOJ có thể nhập bài từ đó (xem [Quản lý bài tập](/setter/managing-problems))
