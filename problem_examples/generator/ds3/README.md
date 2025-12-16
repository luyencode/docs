# Generator - Tạo test data tự động

Với một số bài tập, test data rất lớn và không khả thi để lưu trữ tất cả file. Judge cho phép dùng generator để tạo dữ liệu tự động khi cần.

## Cách hoạt động

Judge sẽ gọi generator khi thấy node `generator` trong `init.yml`. Generator có thể truy cập file input được chỉ định trong `test_cases`.

**Output của generator:**
- Input data → In ra `stdout`
- Output data (đáp án) → In ra `stderr`

## File init.yml

```yaml
generator: gen.cpp
test_cases:
- {generator_args: [10], points: 30}
- {generator_args: [100], points: 30}
- {generator_args: [1000], points: 40}
```

## Generator (C++)

```cpp
#include <iostream>
#include <cstdlib>
using namespace std;

int main(int argc, char* argv[]) {
    // argv[1] = "_aux_file"
    // argv[2] = tham số đầu tiên (10, 100, hoặc 1000)
    
    int n = atoi(argv[2]);
    
    // In input ra stdout
    cout << n << endl;
    for (int i = 0; i < n; i++) {
        cout << rand() % 100 << " ";
    }
    cout << endl;
    
    // Tính output và in ra stderr
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += rand() % 100;
    }
    cerr << sum << endl;
    
    return 0;
}
```

## Lợi ích

✅ **Tiết kiệm dung lượng** - Không cần lưu file input/output lớn

✅ **Dễ quản lý** - Thay đổi test chỉ cần sửa generator

✅ **Tạo test ngẫu nhiên** - Dễ dàng tạo nhiều test khác nhau

✅ **Linh hoạt** - Có thể tạo test với tham số khác nhau

## Ví dụ thực tế

**Bài toán:** Tính tổng N số nguyên

**Test 1:** N = 10 (nhỏ)
```sh
generator_args: [10]
```

**Test 2:** N = 100 (trung bình)
```sh
generator_args: [100]
```

**Test 3:** N = 1,000,000 (lớn)
```sh
generator_args: [1000000]
```

Nếu lưu file, test 3 sẽ chiếm ~10MB. Với generator, chỉ cần vài KB code!

## Lưu ý

- Generator phải compile được và chạy nhanh
- Nên dùng seed cố định để kết quả ổn định
- Test kỹ generator trước khi dùng
- Có thể dùng testlib.h để viết generator chuyên nghiệp

## Xem thêm

- [Generator Documentation](/problem_format/generator.md)
- [Testlib.h](https://github.com/MikeMirzayanov/testlib)
