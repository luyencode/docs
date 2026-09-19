# Chấm chuẩn (Standard Grading)

Cách chấm phổ biến nhất: thí sinh đọc input từ stdin, in đáp án ra stdout, và checker mặc định `standard` so sánh với output chuẩn. Mọi file test nằm trong một file zip.

## Các file

| File | Vai trò |
|---|---|
| `init.yml` | Cấu hình bài. |
| `aplusb.zip` | Test data: `aplusb.1.in`/`.out`, `aplusb.2.in`/`.out`, `aplusb.3.in`/`.out`. |

## init.yml

```yaml
archive: aplusb.zip
test_cases:
- {in: aplusb.1.in, out: aplusb.1.out, points: 5}
- {in: aplusb.2.in, out: aplusb.2.out, points: 20}
- {in: aplusb.3.in, out: aplusb.3.out, points: 75}
```

- `archive`: file zip chứa test. `in` và `out` là tên file bên trong zip.
- Mỗi test được chấm độc lập và có điểm riêng: 5, 20 và 75, tổng 100.
- Không khai báo `checker` nên dùng checker `standard` (bỏ qua khác biệt về khoảng trắng).

Điểm bài nộp là tổng điểm các test đúng, quy đổi theo số điểm của bài trên site.

## Chạy thử

Làm theo mục "Chạy thử một ví dụ" trong [README chung](../../README.md), với mã bài `aplusb`.

Xem thêm: [Cấu trúc bài tập](../../../src/setter/problem-format.md).
