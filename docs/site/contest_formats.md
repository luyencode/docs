# Các định dạng kỳ thi

LCOJ hỗ trợ 6 định dạng kỳ thi: Default, IOI, Legacy IOI, ECOO, AtCoder, và ICPC.

## Default (Mặc định)

Định dạng chuẩn, đơn giản nhất.

**Cách tính điểm:**
- Điểm = Tổng điểm cao nhất của mỗi bài
- Phá tie: Thời gian bài nộp cuối cùng có điểm

**Lưu ý:** Mọi bài nộp đều tăng thời gian penalty, kể cả bài không tăng điểm.

**Cấu hình:** Không có tùy chọn đặc biệt.

**Ví dụ:**

| Thí sinh | Bài A | Bài B | Bài C | Tổng điểm | Thời gian |
|----------|-------|-------|-------|-----------|-----------|
| Alice    | 100 (10p) | 80 (25p) | 60 (40p) | 240 | 40p |
| Bob      | 100 (15p) | 80 (20p) | 60 (35p) | 240 | 35p |

Bob thắng vì thời gian ít hơn.

## IOI

Định dạng của Olympic Tin học Quốc tế.

**Cách tính điểm:**
- Mỗi bài có nhiều subtask
- Điểm subtask = Điểm cao nhất của subtask đó trong tất cả bài nộp
- Điểm bài = Tổng điểm các subtask
- Điểm tổng = Tổng điểm các bài
- Mặc định không phá tie

**Ví dụ:**

Bài A có 2 subtask (30 điểm và 70 điểm):

| Bài nộp | Subtask 1 | Subtask 2 | Tổng |
|---------|-----------|-----------|------|
| Lần 1   | 30        | 10        | 40   |
| Lần 2   | 0         | 70        | 70   |
| **Điểm cuối** | **30** | **70** | **100** |

**Tùy chọn:**

```json
{
  "cumtime": true
}
```

Nếu `cumtime: true`, phá tie bằng tổng thời gian của bài nộp đầu tiên pass mỗi subtask.

## Legacy IOI

Định dạng của Codechef IOI Ranklist.

**Cách tính điểm:**
- Điểm = Tổng điểm cao nhất của mỗi bài
- Mặc định không phá tie

**Tùy chọn:**

```json
{
  "cumtime": true
}
```

Nếu `cumtime: true`, phá tie bằng tổng thời gian của bài nộp thay đổi điểm gần nhất.

## ECOO

Định dạng của kỳ thi ECOO.

**Cách tính điểm:**
- Điểm = Tổng điểm của bài nộp **cuối cùng** mỗi bài
- Mặc định không phá tie

**Tùy chọn:**

```json
{
  "cumtime": true,
  "first_ac_bonus": 10,
  "time_bonus": 5
}
```

**`first_ac_bonus`:** Điểm thưởng nếu AC ngay lần đầu (mặc định 10).

**`time_bonus`:** Điểm thưởng theo thời gian. Cứ mỗi `time_bonus` phút trước khi kết thúc, được thêm 1 điểm (mặc định 5).

**Ví dụ time_bonus:**

- Bài nộp được 50/100 điểm
- Nộp lúc còn 23 phút
- Bonus = ⌊23/5⌋ = 4 điểm
- Tổng = 50 + 4 = 54 điểm

## AtCoder

Định dạng của AtCoder.

**Cách tính điểm:**
- Điểm = Tổng điểm cao nhất của mỗi bài
- Phá tie: Thời gian bài nộp cuối thay đổi điểm + penalty

**Penalty:**

```json
{
  "penalty": 5
}
```

Penalty = Số bài nộp sai trước bài đúng × `penalty` phút (mặc định 5).

**Ví dụ:**

Bài A:
- Nộp lần 1 (5p): 0 điểm
- Nộp lần 2 (10p): 0 điểm
- Nộp lần 3 (15p): 100 điểm

Penalty = 2 × 5 = 10 phút

Thời gian = 15 + 10 = 25 phút

## ICPC

Định dạng của ACM-ICPC.

**Cách tính điểm:**
- Điểm = Số bài AC
- Phá tie 1: Tổng thời gian + penalty
- Phá tie 2: Thời gian bài nộp cuối thay đổi điểm

**Penalty:**

```json
{
  "penalty": 20
}
```

Penalty = Số bài nộp sai trước bài AC × `penalty` phút (mặc định 20).

**Ví dụ:**

| Bài | Thời gian AC | Số lần sai | Penalty | Thời gian tổng |
|-----|--------------|------------|---------|----------------|
| A   | 10p          | 0          | 0       | 10p            |
| B   | 25p          | 2          | 40p     | 65p            |
| C   | 50p          | 1          | 20p     | 70p            |

Tổng: 3 bài, 145 phút

## So sánh các định dạng

| Định dạng | Điểm | Phá tie | Penalty | Phù hợp |
|-----------|------|---------|---------|---------|
| Default | Tổng điểm cao nhất | Thời gian cuối | Mọi bài nộp | Kỳ thi thông thường |
| IOI | Tổng điểm subtask | Không | Không | Olympic, có subtask |
| Legacy IOI | Tổng điểm cao nhất | Tùy chọn | Không | Tương tự IOI |
| ECOO | Điểm bài cuối | Tùy chọn | Có bonus | Kỳ thi ECOO |
| AtCoder | Tổng điểm cao nhất | Thời gian + penalty | Bài sai | Kỳ thi AtCoder |
| ICPC | Số bài AC | Thời gian + penalty | Bài sai | ACM-ICPC |

## Cách chọn định dạng

**Default:** Phù hợp nhất cho kỳ thi thông thường, dễ hiểu.

**IOI:** Dùng khi bài có subtask rõ ràng, muốn thí sinh được điểm từng phần.

**ICPC:** Dùng khi muốn tập trung vào số bài AC, không quan trọng điểm từng phần.

**AtCoder:** Cân bằng giữa điểm và thời gian, có penalty nhẹ.

**ECOO:** Có tính năng đặc biệt như bonus AC đầu tiên, bonus thời gian.

## Cấu hình trong Admin

1. Vào trang tạo/sửa contest
2. Chọn _Contest format_
3. Nhập JSON config nếu cần (ví dụ: `{"cumtime": true, "penalty": 10}`)
4. Lưu

**Ví dụ config:**

```json
{
  "cumtime": true,
  "penalty": 10,
  "first_ac_bonus": 15,
  "time_bonus": 3
}
```
