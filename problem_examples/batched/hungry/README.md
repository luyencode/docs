# Chấm theo batch (Batched Grading)

Mở rộng từ chấm chuẩn: input và output vẫn nằm trong file zip, nhưng các test được gom thành _batch_ (subtask). Một batch chỉ được điểm khi **mọi** test trong batch đều đúng.

## Các file

| File | Vai trò |
|---|---|
| `init.yml` | Cấu hình bài. |
| `hungry.zip` | 11 cặp test: `hungry.1a`–`1c`, `hungry.2a`–`2d`, `hungry.3a`–`3d` (mỗi test có `.in` và `.out`). |

## init.yml

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

- Mỗi phần tử có `batched` là một batch; `points` đặt ở cấp batch, các test bên trong không có `points` riêng.
- Ba batch: batch 1 (3 test, 5 điểm), batch 2 (4 test, 20 điểm), batch 3 (4 test, 25 điểm). Tổng điểm test là 50.
- Khi một test trong batch sai, các test còn lại của batch đó bị bỏ qua.

## Tính điểm

Ví dụ một bài nộp đúng hết batch 1 và 3, nhưng sai `hungry.2b`:

| Batch | Kết quả | Điểm |
|---|---|---|
| 1 | Đúng cả 3 test | 5 |
| 2 | Sai `hungry.2b` | 0 |
| 3 | Đúng cả 4 test | 25 |

Tổng: 30/50 điểm test. Site quy đổi theo số điểm của bài (ví dụ bài 100 điểm thì được 60), và chỉ cho điểm thành phần nếu bài bật **partial**.

## Chạy thử

Làm theo mục "Chạy thử một ví dụ" trong [README chung](../../README.md), với mã bài `hungry`.

Xem thêm: [Batched test cases](../../../src/setter/problem-format.md).
