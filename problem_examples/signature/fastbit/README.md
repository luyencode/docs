# Chấm theo chữ ký hàm (Signature Grading, kiểu IOI)

Thí sinh không viết chương trình đầy đủ mà chỉ cài đặt một hàm. Judge biên dịch bài nộp cùng file entry của người ra đề, file này có `main` và gọi hàm của thí sinh. Ví dụ này còn dùng checker Python để thưởng mã nguồn ngắn.

## Đề bài

Cài đặt hàm trả về số bit 1 của một số 64 bit:

```c
int setbits(unsigned long long);
```

## Các file

| File | Vai trò |
|---|---|
| `init.yml` | Cấu hình bài. |
| `fastbit.h` | Header khai báo hàm thí sinh cần cài đặt. |
| `grader.c` | File entry: có `main`, gọi `setbits`. |
| `checker.py` | Checker Python. |
| `1.txt`, `2.txt`, `3.txt` | Input: số lần gọi hàm (1 000 000, 10 000 000, 100 000 000). |
| `correct.txt` | Output chuẩn chung cho mọi test: `Correct.` |

Không có file zip: các file test nằm trực tiếp trong thư mục bài.

## init.yml

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

- `signature_grader`: `entry` là file có `main`, `header` là file khai báo hàm. Chỉ dùng được với các ngôn ngữ họ C/C++ (C, C11, C++03 đến C++20, Clang).
- `out: correct.txt` và `checker: checker.py` ở cấp ngoài cùng nên mọi test kế thừa.
- `output_prefix_length: 0`: không lưu và hiển thị output của bài nộp (đây cũng là mặc định khi có `signature_grader`).
- Ba test 20, 30 và 50 điểm, tổng 100.

## Cách judge biên dịch

1. Thêm vào đầu bài nộp dòng `#include "fastbit.h"`.
2. Thêm `#define main main_<chuỗi ngẫu nhiên>`, nên nếu thí sinh có `main` để thử ở máy, nó không xung đột với `main` của `grader.c` (trừ khi đặt `allow_main: true`).
3. Biên dịch bài nộp cùng `grader.c` với cờ `-DSIGNATURE_GRADER`.

## File entry (`grader.c`)

`main` đọc số lần gọi `total` từ input, sinh `total` số 64 bit bằng bộ sinh xorshift cố định, và so `setbits(k)` với `__builtin_popcountll(k)`:

```c
int main() {
    int total;
    scanf("%d", &total);

    for (int i = 0; i < total; ++i) {
        unsigned long long k = ((unsigned long long) xorshf96() << 32) | xorshf96();
        if (setbits(k) != __builtin_popcountll(k))
            return 0;
        if (i == 0) putchar('C');
    }
    puts("orrect.");
}
```

Chỉ khi mọi lần gọi đều đúng thì output mới là `Correct.`. Test 3 gọi hàm 100 triệu lần, nên `setbits` phải nhanh.

## Checker (`checker.py`)

```python
from dmoj.result import CheckerResult
from dmoj.utils.unicode import utf8text

def check(process_output, judge_output, judge_input, point_value, submission_source, **kwargs):
    result = utf8text(process_output.rstrip()).split('\n')
    if len(result) != 1 or result[0].strip() != 'Correct.':
        return CheckerResult(False, 0)
    return CheckerResult(True, int(point_value) / (1 if len(submission_source) < 560 else 2))
```

Output phải đúng một dòng `Correct.`. Nếu mã nguồn ngắn hơn 560 byte thì được trọn điểm test, còn lại được một nửa.

## Chạy thử

Làm theo mục "Chạy thử một ví dụ" trong [README chung](../../README.md), với mã bài `fastbit`, bật **partial** cho bài. Nộp bằng C hoặc C++, ví dụ:

```c
int setbits(unsigned long long x) {
    return __builtin_popcountll(x);
}
```

Xem thêm: [Chấm theo chữ ký hàm](../../../src/setter/graders.md), [Checker viết bằng Python](../../../src/setter/checkers.md).
