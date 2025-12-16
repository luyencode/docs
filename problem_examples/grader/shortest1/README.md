# Custom Grader - Shortest Path

Ví dụ này minh họa cách dùng custom grader cho bài tập có nhiều đáp án đúng.

## Bài toán

Tìm đường đi ngắn nhất từ A đến B. Có thể có nhiều đường đi có cùng độ dài ngắn nhất.

## Tại sao cần Custom Grader?

Vì có nhiều đáp án đúng, không thể dùng checker chuẩn (so sánh output với file .out). Custom grader sẽ:
1. Kiểm tra đường đi có hợp lệ không
2. Tính độ dài đường đi
3. So sánh với độ dài ngắn nhất

## File init.yml

```yaml
custom_judge: shortest1.py
test_cases:
- points: 100
```

## Custom Grader (shortest1.py)

Grader sẽ:
- Đọc output của thí sinh (đường đi)
- Kiểm tra các đỉnh có liên tiếp nhau không
- Tính tổng độ dài
- So sánh với đáp án tối ưu

## Ví dụ

**Input:** Đồ thị với 4 đỉnh, tìm đường từ 1 đến 4

**Đáp án đúng:**
- `1 -> 2 -> 4` (độ dài 5)
- `1 -> 3 -> 4` (độ dài 5)

Cả hai đều được chấp nhận vì cùng độ dài ngắn nhất.

## Khi nào dùng Custom Grader?

- Bài có nhiều đáp án đúng
- Cần kiểm tra tính hợp lệ phức tạp
- Cần tính điểm theo độ chính xác
- Ví dụ: Tìm đường đi, xếp lịch, tô màu đồ thị

## Xem thêm

- [Custom Graders Documentation](/problem_format/custom_graders.md)
- [Custom Checkers](/problem_format/custom_checkers.md)
