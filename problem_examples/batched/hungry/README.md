# Chấm điểm theo Batch (Batched Grading)

Ví dụ này mở rộng từ chấm điểm chuẩn: input và output vẫn lưu trong file zip. Tuy nhiên, lần này các test được nhóm thành _batch_ (subtask). Judge sẽ chấm từng batch và chỉ cho điểm nếu chương trình đúng _tất cả_ test case trong batch đó.

## Điểm khác biệt

File `init.yml` tương tự Standard Grading, nhưng có điểm khác quan trọng: `batched` chỉ định các test case thuộc cùng một batch và sẽ được tính điểm theo batch.

```yaml
- batched:
  - {in: hungry.1a.in, out: hungry.1a.out}
  - {in: hungry.1b.in, out: hungry.1b.out}
  - {in: hungry.1c.in, out: hungry.1c.out}
  points: 5
```

## Cách hoạt động

1. Judge chạy tất cả test trong batch
2. Nếu **TẤT CẢ** test đều đúng → Được điểm của batch
3. Nếu **BẤT KỲ** test nào sai → Không được điểm

## Ví dụ

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
  points: 20
- batched:
  - {in: hungry.3a.in, out: hungry.3a.out}
  - {in: hungry.3b.in, out: hungry.3b.out}
  - {in: hungry.3c.in, out: hungry.3c.out}
  - {in: hungry.3d.in, out: hungry.3d.out}
  points: 75
```

## Tính điểm

**Batch 1 (5 điểm):**
- Test 1a: AC
- Test 1b: AC
- Test 1c: AC
- → **Được 5 điểm**

**Batch 2 (20 điểm):**
- Test 2a: AC
- Test 2b: WA
- → **Được 0 điểm** (vì có test sai)

**Batch 3 (75 điểm):**
- Test 3a: AC
- Test 3b: AC
- Test 3c: AC
- Test 3d: AC
- → **Được 75 điểm**

**Tổng điểm:** 5 + 0 + 75 = 80/100

## Khi nào dùng Batched?

- Bài có subtask với độ khó tăng dần
- Muốn thí sinh được điểm từng phần
- Ví dụ: Subtask 1 (N ≤ 100), Subtask 2 (N ≤ 1000), Subtask 3 (N ≤ 10^6)
