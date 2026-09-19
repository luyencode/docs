# Grader Python tùy chỉnh: bài "code golf"

Ví dụ này minh họa `custom_judge`: một file Python định nghĩa class `Grader` thay đổi cách chấm. Đề bài: viết chương trình **ngắn nhất có thể** chạy mãi không dừng. Bài nộp chạy tới hết giới hạn thời gian (TLE) được tính là đúng, và mã nguồn càng ngắn càng nhiều điểm.

## Các file

| File | Vai trò |
|---|---|
| `init.yml` | Cấu hình bài. |
| `shortest1.py` | Grader tùy chỉnh. |

Không có test data: test duy nhất không có `in` hay `out`.

## init.yml

```yaml
custom_judge: shortest1.py
test_cases:
- {points: 10}
```

- `custom_judge`: judge nạp class `Grader` trong `shortest1.py` thay cho grader chuẩn.
- Một test, 10 điểm.

## Grader (`shortest1.py`)

```python
from dmoj.graders.standard import StandardGrader
from dmoj.result import Result, CheckerResult


class Grader(StandardGrader):
    def check_result(self, case, result):
        passed = bool(result.result_flag & Result.TLE)
        result.result_flag &= ~Result.TLE & ~Result.RTE
        return CheckerResult(passed, min((9. / len(self.source)) ** 5 * case.points, case.points) if passed else 0)

    def _interact_with_process(self, case, result, input):
        process = self._current_proc
        for handle in [process.stdin, process.stdout, process.stderr]:
            if handle:
                handle.close()
        process.wait()
```

- `_interact_with_process`: không gửi input, đóng stdin/stdout/stderr của bài nộp rồi chờ nó kết thúc (hoặc bị giết vì quá thời gian).
- `check_result`: bài nộp chỉ đúng nếu bị **TLE**. Sau đó cờ TLE và RTE được xóa để kết quả không hiện là lỗi.
- Điểm: `min((9 / độ dài mã nguồn)^5 × 10, 10)`. Mã nguồn từ 9 byte trở xuống được trọn 10 điểm; 18 byte chỉ được khoảng 0,31 điểm.

## Chạy thử

Làm theo mục "Chạy thử một ví dụ" trong [README chung](../../README.md), với mã bài `shortest1`, bật **partial** cho bài. Nộp một vòng lặp vô hạn thật ngắn, ví dụ Python `while 1:0` (9 byte), rồi thử bản dài hơn để thấy điểm giảm.

Xem thêm: [Grader Python tùy chỉnh](../../../src/setter/graders.md).
