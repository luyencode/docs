# Chấm điểm chuẩn (Standard Grading)

Đây là ví dụ về hệ thống chấm điểm phổ biến nhất: input và output được lưu trong file zip.

## Cấu trúc

File `init.yml` khai báo file zip bằng `archive`. Ba test case được liệt kê trong `test_cases`.

Mỗi test case khai báo file input và output riêng, có thể là bất kỳ file nào trong zip. Các test case có giá trị lần lượt là 5, 20, và 75 điểm, tổng cộng 100 điểm.

## File init.yml

```yaml
archive: aplusb.zip
test_cases:
- {in: aplusb.1.in, out: aplusb.1.out, points: 5}
- {in: aplusb.2.in, out: aplusb.2.out, points: 20}
- {in: aplusb.3.in, out: aplusb.3.out, points: 75}
```

## Cách hoạt động

1. Judge giải nén `aplusb.zip`
2. Chạy chương trình với input từ `aplusb.1.in`
3. So sánh output với `aplusb.1.out`
4. Nếu đúng, được 5 điểm
5. Lặp lại cho các test còn lại

## Tính điểm

- Test 1 đúng: 5 điểm
- Test 2 đúng: 20 điểm
- Test 3 đúng: 75 điểm
- **Tổng:** Tối đa 100 điểm

Điểm cuối cùng là tổng điểm của các test đúng.
