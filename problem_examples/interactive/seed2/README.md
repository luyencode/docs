# Interactive Grading (Chấm điểm tương tác)

Ví dụ này minh họa bài tập tương tác, nơi chương trình thí sinh trao đổi dữ liệu qua lại với grader.

## Cách hoạt động

1. Grader gửi dữ liệu cho chương trình thí sinh
2. Chương trình thí sinh xử lý và gửi phản hồi
3. Grader kiểm tra phản hồi và quyết định tiếp tục hoặc kết thúc
4. Quá trình lặp lại cho đến khi tìm ra đáp án hoặc hết lượt

## Ví dụ: Đoán số

Grader nghĩ một số từ 1 đến 100. Chương trình thí sinh phải đoán số đó trong tối đa 10 lần.

**Tương tác:**
```
Thí sinh: 50
Grader: Higher

Thí sinh: 75
Grader: Lower

Thí sinh: 62
Grader: Lower

Thí sinh: 56
Grader: Correct!
```

## File init.yml

```yaml
custom_judge: interactor.py
unbuffered: true
test_cases:
- {in: seed2.1.in, points: 50}
- {in: seed2.2.in, points: 50}
```

## Interactor (Python)

```python
from dmoj.graders.interactive import InteractiveGrader

class Grader(InteractiveGrader):
    def interact(self, case, interactor):
        secret = 42  # Số cần đoán
        attempts = 0
        max_attempts = 10
        
        while attempts < max_attempts:
            guess = interactor.readint(1, 100)
            attempts += 1
            
            if guess == secret:
                interactor.writeln('Correct!')
                return True
            elif guess < secret:
                interactor.writeln('Higher')
            else:
                interactor.writeln('Lower')
        
        return False
```

## Lưu ý

- `unbuffered: true` - Tắt buffering, không cần flush()
- Interactor phải gửi phản hồi sau mỗi input từ thí sinh
- Thí sinh phải đọc phản hồi trước khi gửi input tiếp theo

## Xem thêm

- [Custom Graders Documentation](/problem_format/custom_graders.md)
- [Native Interactive Example](../seed2native/)
