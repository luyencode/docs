# Custom Checker

Custom checker được dùng cho bài tập có nhiều đáp án đúng hoặc cần chấm điểm theo độ chính xác.

Checker là một script Python chạy sau khi chương trình thí sinh kết thúc, để chấm output nhưng không tương tác với chương trình.

## Checker có sẵn

LCOJ đã có sẵn nhiều checker. Cách sử dụng:

```yaml
checker:
  name: <tên checker>
  args: {}
```

Nếu không cần truyền tham số:

```yaml
checker: <tên checker>
```

## Standard checker - `standard`

Đây là checker mặc định nếu không chỉ định `checker`.

So sánh output của thí sinh và output chuẩn, bỏ qua khoảng trắng. Cụ thể:
- Tách từng dòng thành các token
- Bỏ qua dòng trống
- So sánh từng token một

## Easy checker - `easy`

Bỏ qua tất cả khoảng trắng và chữ hoa/thường, chỉ kiểm tra số lần xuất hiện của mỗi ký tự.

## Floating point checker - `floats`

Dùng cho bài tập có số thực, cho phép sai số.

**Tham số:**
- `precision`: epsilon = 10^(-precision), mặc định là 6
- `error_mode`: 
  - `default`: cho phép sai số tuyệt đối hoặc tương đối
  - `relative`: chỉ sai số tương đối
  - `absolute`: chỉ sai số tuyệt đối

**Ví dụ:**

```yaml
checker:
  name: floats
  args:
    precision: 4
    error_mode: relative
```

### Floatsabs - `floatsabs`

Alias của `floats` với `error_mode: absolute`.

### Floatsrel - `floatsrel`

Alias của `floats` với `error_mode: relative`.

## Identical checker - `identical`

Kiểm tra output giống hệt nhau, bao gồm cả khoảng trắng.

**Tham số:**
- `pe_allowed`: mặc định `True`. Nếu `True`, sẽ báo "Presentation Error" nếu đúng nhưng sai khoảng trắng.

## Linecount checker - `linecount`

Checker đặc biệt, chủ yếu dùng cho bài ECOO.

**Tham số:**
- `feedback`: mặc định `True`. Nếu `True`, hiển thị ✓ cho dòng đúng, ✗ cho dòng sai.

## Sorted checker - `sorted`

Kiểm tra output giống nhau, bỏ qua thứ tự.

**Tham số:**
- `split_on`: mặc định `lines`
  - `lines`: bỏ qua thứ tự các dòng
  - `whitespace`: bỏ qua thứ tự các token

### Unordered checker - `unordered`

Alias của `sorted` với `split_on: whitespace`.

## Viết custom checker

Checker phải implement hàm:

```python
def check(process_output, judge_output, **kwargs):
    pass
```

**Tham số trong `**kwargs`:**
- `submission_source`: mã nguồn của thí sinh
- `judge_input`: input của test
- `point_value`: điểm của test
- `case_position`: vị trí test (bắt đầu từ 0)
- `batch`: batch của test (0 nếu không có batch)
- `submission_language`: ngôn ngữ nộp bài
- `binary_data`: True nếu dữ liệu không được chuẩn hóa
- `execution_time`: thời gian chạy (giây)
- `problem_id`: mã bài tập
- `result`: kết quả sơ bộ

**Flag `run_on_error`:**

Nếu đặt `check.run_on_error = True`, checker sẽ chạy ngay cả khi có IR/TLE/RTE/MLE.

**Giá trị trả về:**

Trả về `CheckerResult` hoặc boolean:

```python
from dmoj.result import CheckerResult

# Trả về CheckerResult
return CheckerResult(True, 100, feedback='Chính xác!')

# Hoặc trả về boolean
return True  # AC
return False  # WA
```

**Ví dụ:**

```python
def check(process_output, judge_output, **kwargs):
    # Kiểm tra output có chứa "Hello"
    if "Hello" in process_output:
        return CheckerResult(True, kwargs['point_value'], feedback='Đúng!')
    return CheckerResult(False, 0, feedback='Thiếu "Hello"')
```

## Native checker (Bridged)

Dùng cho checker cần tính toán phức tạp, viết bằng C/C++.

**Tham số:**
- `files`: tên file hoặc danh sách file checker
- `lang`: ngôn ngữ (C/C++)
- `time_limit`: giới hạn thời gian
- `memory_limit`: giới hạn bộ nhớ
- `compiler_time_limit`: thời gian compile
- `feedback`: hiển thị stdout làm feedback (mặc định true)
- `flags`: flag compile
- `type`: loại checker
  - `default`: tham số `input_file output_file judge_file`. Return 0 = AC, 1 = WA
  - `testlib`: tương tự default. Return 0 = AC, 1 = WA, 2 = PE, 3 = assertion fail, 7 = partial (với stderr `points X`)
  - `coci`: như testlib, nhưng partial format `partial X/Y`
  - `peg`: tương thích WCIPEG judge

**Ví dụ:**

```yaml
checker:
  name: bridged
  args:
    files: checker.cpp
    lang: CPP17
    type: testlib
```

**Ví dụ checker.cpp (testlib):**

```cpp
#include "testlib.h"

int main(int argc, char* argv[]) {
    registerTestlibCmd(argc, argv);
    
    int ja = ans.readInt();  // Đáp án chuẩn
    int pa = ouf.readInt();  // Đáp án thí sinh
    
    if (ja == pa) {
        quitf(_ok, "Correct!");
    } else {
        quitf(_wa, "Wrong answer: expected %d, got %d", ja, pa);
    }
}
```
