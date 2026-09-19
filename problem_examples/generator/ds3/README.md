# Generator: sinh test tự động

Bài này không lưu sẵn file test nào. Mọi test được sinh khi chấm bằng `generator.cpp`, nên thư mục bài chỉ vài KB dù test lớn nhất có 100 000 phần tử và 500 000 truy vấn.

## Các file

| File | Vai trò |
|---|---|
| `init.yml` | Cấu hình bài. |
| `generator.cpp` | Generator C++: in input ra **stdout**, output chuẩn ra **stderr**. |

## init.yml

```yaml
generator: generator.cpp
points: 5
test_cases:
- generator_args: [1]
- generator_args: [2]
# ... tương tự, đến
- generator_args: [20]
```

(File thật liệt kê đủ 20 test, `generator_args: [1]` đến `generator_args: [20]`.)

- `generator`: file nguồn generator. Judge biên dịch nó một lần rồi chạy lại cho từng test.
- `generator_args`: tham số cho test đó. Judge chuyển mỗi giá trị thành chuỗi và truyền vào dòng lệnh, **bắt đầu từ `argv[1]`** (`argv[0]` là tên chương trình).
- `points: 5` ở cấp ngoài cùng được mọi test kế thừa, vì không test nào tự đặt `points`: 20 test × 5 = 100 điểm.
- Không có `in`, `out` hay `archive`: toàn bộ input lấy từ stdout và output chuẩn lấy từ stderr của generator.

## Generator

Bài toán: dãy `A` gồm `N` số và `M` thao tác. `C a b` gán `A[a] = b`; `M a b`, `G a b`, `Q a b` hỏi trên đoạn `[a, b]` lần lượt min, gcd, và số phần tử bằng gcd của đoạn. Generator vừa sinh input vừa tự giải bằng segment tree để in đáp án.

Hàm `main` đọc số thứ tự test từ `argv[1]` và chọn bộ tham số cho `gen(...)`:

```cpp
int main(int argc, char **argv)
{
    int T = atoi(argv[1]);
    switch(T)
    {
    case 1:
        gen(5, 5, 2, 3, 1, 1, 1, 1, 1);
        break;
    // ... case 2 đến case 20
    }
    return 0;
}
```

Tham số của `gen` là `N, M, unique_base, max_gap, p_c, p_m, p_g, p_q, min_dist` (kích thước, độ đa dạng giá trị, và tỉ lệ các loại thao tác). Trong `gen`:

- Input (`N M`, dãy `A`, rồi `M` dòng thao tác) được in ra stdout.
- Đáp án mỗi truy vấn `M`/`G`/`Q` được in ra stderr, mỗi dòng một số.
- Bộ sinh ngẫu nhiên được seed từ chính các tham số, nên chạy lại luôn cho ra cùng một test.

## Chạy thử

Thử generator ở máy trước khi đưa lên judge:

```sh
g++ -O2 -o gen generator.cpp
./gen 1 > 1.in 2> 1.out
```

Sau đó làm theo mục "Chạy thử một ví dụ" trong [README chung](../../README.md), với mã bài `ds3`.

Xem thêm: [Generator](../../../src/setter/generators.md).
