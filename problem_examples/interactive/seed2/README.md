# Grader tương tác bằng Python

Ví dụ này minh họa bài tương tác dùng grader Python kế thừa `InteractiveGrader`. Chương trình thí sinh trao đổi với grader qua stdin/stdout trong lúc chạy.

## Đề bài

Mỗi file input chứa một số bí mật `N` (1 ≤ N ≤ 2 000 000 000). Thí sinh in một số dự đoán mỗi dòng; grader trả lời:

- `OK` nếu đoán đúng,
- `FLOATS` nếu số đoán lớn hơn `N`,
- `SINKS` nếu số đoán nhỏ hơn `N`.

Test đúng nếu tìm ra `N` trong tối đa 31 lượt (đủ cho tìm kiếm nhị phân).

## Các file

| File | Vai trò |
|---|---|
| `init.yml` | Cấu hình bài. |
| `seed2.py` | Grader tương tác. |
| `seed2.zip` | 5 file input `seed2.1.in` … `seed2.5.in`, mỗi file một số `N`. Không có file output. |

## init.yml

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

- `custom_judge`: dùng class `Grader` trong `seed2.py`.
- `unbuffered: true`: output của thí sinh không bị đệm, thí sinh không bắt buộc phải tự flush.
- Test chỉ có `in`, không có `out`: grader tự quyết định đúng sai. 5 test × 20 = 100 điểm.

## Grader (`seed2.py`)

```python
from dmoj.graders.interactive import InteractiveGrader

class Grader(InteractiveGrader):
    def interact(self, case, interactor):
        N = int(case.input_data())
        guesses = 0
        guess = 0
        while guess != N:
            guess = interactor.readint(1, 2000000000)
            guesses += 1
            if guess == N:
                interactor.writeln('OK')
            elif guess > N:
                interactor.writeln('FLOATS')
            else:
                interactor.writeln('SINKS')
        return guesses <= 31
```

- `case.input_data()` trả về nội dung file input của test (số `N`).
- `interactor.readint(lo, hi)` đọc một số nguyên từ thí sinh; số ngoài khoảng hoặc không phải số nguyên là sai.
- `interactor.writeln(...)` gửi một dòng cho thí sinh.
- Trả về `True` là trọn điểm test, `False` là 0 điểm.

## Chạy thử

Làm theo mục "Chạy thử một ví dụ" trong [README chung](../../README.md), với mã bài `seed2`, rồi nộp một lời giải tìm kiếm nhị phân trên đoạn `[1, 2000000000]`.

Xem thêm: [Grader tương tác bằng Python](../../../src/setter/graders.md), [cùng bài với interactor C++](../seed2native/).
