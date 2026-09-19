# Cấu trúc bài tập

Mỗi bài tập được lưu trong một thư mục riêng. Thư mục đó phải chứa file `init.yml`.

## File `init.yml`

File này là một YAML object và phải chứa key `test_cases`.

`test_cases` có thể là:
- Danh sách các test case
- Hai regex để tìm file input và output

Thường sẽ có thêm key `archive`, cho phép lưu dữ liệu bài tập trong file `.zip` thay vì lưu trực tiếp trong thư mục.

## `test_cases`

Có hai cách để chỉ định test cases.

### Cách 1: Danh sách test cases

Mỗi test case là một YAML object chứa key `points` (số điểm của test đó).

**Lưu ý về `points: 0`:**
- Nếu test case có `points: 0` và bị sai, các test sau sẽ bị bỏ qua
- Điều này cũng áp dụng cho batched test cases

**Ví dụ sai:**
```yaml
test_cases:
- {in: case1.1.in, out: case1.1.out, points: 100}
- {in: case1.0.in, out: case1.0.out, points: 0}
```

Test `case1.1` sẽ chạy trước `case1.0`. Nếu `case1.0` sai, kết quả sẽ là `100/100 (WA)`.

**Ví dụ đúng:**
```yaml
test_cases:
- {in: case1.0.in, out: case1.0.out, points: 0}
- {in: case1.1.in, out: case1.1.out, points: 100}
```

### Test case thông thường

Test case thông thường chứa:
- `in`: đường dẫn file input
- `out`: đường dẫn file output
- `points`: số điểm

Đường dẫn là trong file zip (nếu có `archive`) hoặc tương đối với thư mục bài tập.

### Batched test cases

Batch chứa:
- `points`: tổng điểm của batch
- `batched`: danh sách các test case trong batch

Mỗi test case trong batch chứa `in` và `out`.

**Dependencies (tùy chọn):**

Có thể thêm key `dependencies` chứa danh sách số thứ tự (bắt đầu từ 1) của các batch phụ thuộc. Batch chỉ chạy nếu tất cả các batch phụ thuộc đều pass.

**Ví dụ:**

```yaml
archive: tle16p4.zip
test_cases:
- {points: 0, in: tle16p4.p0.in, out: tle16p4.p0.out}
- {points: 10, in: tle16p4.p1.in, out: tle16p4.p1.out}
- points: 10
  batched:
  - {in: tle16p4.0.in, out: tle16p4.0.out}
  - {in: tle16p4.1.in, out: tle16p4.1.out}
- points: 10
  batched:
  - {in: tle16p4.2.in, out: tle16p4.2.out}
  - {in: tle16p4.3.in, out: tle16p4.3.out}
- points: 10
  batched:
  - {in: tle16p4.4.in, out: tle16p4.4.out}
  - {in: tle16p4.5.in, out: tle16p4.5.out}
  dependencies: [1, 2]
```

Batch cuối chỉ chạy nếu batch 1 và 2 đều pass.

### Cách 2: Chỉ định bằng regex

Nếu test cases có format giống nhau, có thể dùng regex.

Regex mặc định cho input: `^(?=.*?\.in|in).*?(?:(?:^|\W)(?P<batch>\d+)[^\d\s]+)?(?P<case>\d+)[^\d\s]*`

Regex mặc định cho output: `^(?=.*?\.out|out).*?(?:(?:^|\W)(?P<batch>\d+)[^\d\s]+)?(?P<case>\d+)[^\d\s]*`

**Ví dụ file name khớp:**

```
test.1.in
test-1.in
test-case-1.in

test-1-2.in
test-batch-1-case-2.in
1.2.in
problem-1-case-1-batch-2.in
```

Ba file đầu là test case độc lập, bốn file sau là batched.

**Lưu ý:** Test case không có batch sẽ dùng số case làm số batch. Ví dụ:

```
1.in
2.1.in
2.2.in
3.in
```

Sẽ được sắp xếp theo thứ tự trên.

**Tùy chỉnh:**

Có thể ghi đè regex bằng `input_format` và `output_format` trong `test_cases`.

Số điểm mặc định là 1 điểm/test. Có thể đặt `case_points` hoặc `points` để thay đổi.

**Ví dụ:**

```yaml
archive: data.zip
test_cases:
  input_format: test-{case}.in
  output_format: test-{case}.out
  case_points: 10
```
