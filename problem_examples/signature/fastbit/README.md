# Signature Grading (IOI-style)

Ví dụ này minh họa bài tập kiểu IOI, nơi thí sinh implement hàm thay vì đọc/ghi input/output.

## Khái niệm

Thay vì viết chương trình đầy đủ với `main()`, thí sinh chỉ cần implement một hoặc nhiều hàm theo yêu cầu.

## Ví dụ: Fast Bit Counting

**Yêu cầu:** Implement hàm đếm số bit 1 trong số nguyên.

```c
int count_bits(int n);
```

## Cấu trúc

### 1. header.h - Header file

Khai báo hàm thí sinh cần implement:

```c
#ifndef _GRADER_HEADER_INCLUDED
#define _GRADER_HEADER_INCLUDED

int count_bits(int n);

#endif
```

### 2. handler.c - Entry point

Chương trình chính, đọc input và gọi hàm của thí sinh:

```c
#include "header.h"
#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    
    int result = count_bits(n);  // Gọi hàm thí sinh
    
    printf("%d\n", result);
    return 0;
}
```

### 3. Bài nộp của thí sinh

Thí sinh chỉ cần implement hàm:

```c
int count_bits(int n) {
    int count = 0;
    while (n > 0) {
        count += n & 1;
        n >>= 1;
    }
    return count;
}
```

## File init.yml

```yaml
signature_grader:
  entry: handler.c
  header: header.h
test_cases:
- {in: 1.txt, out: 1.out, points: 50}
- {in: 2.txt, out: 2.out, points: 50}
```

## Cách hoạt động

1. Hệ thống tự động include `header.h` vào bài nộp
2. Đổi tên `main()` của thí sinh (nếu có) thành `main_GUID`
3. Compile và link với `handler.c`
4. Chạy và so sánh output

## Lợi ích

✅ **Đơn giản hóa** - Thí sinh không cần lo về I/O

✅ **Tập trung logic** - Chỉ cần implement thuật toán

✅ **Dễ test** - Thí sinh có thể test local dễ dàng

✅ **Giống IOI** - Format chuẩn của Olympic Tin học

## Ví dụ thực tế

### Bài 1: Tính giai thừa

**header.h:**
```c
long long factorial(int n);
```

**handler.c:**
```c
#include "header.h"
#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    printf("%lld\n", factorial(n));
    return 0;
}
```

**Thí sinh implement:**
```c
long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```

### Bài 2: Tìm kiếm nhị phân

**header.h:**
```c
int binary_search(int arr[], int n, int x);
```

**handler.c:**
```c
#include "header.h"
#include <stdio.h>

int main() {
    int n, x;
    scanf("%d %d", &n, &x);
    
    int arr[n];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    int pos = binary_search(arr, n, x);
    printf("%d\n", pos);
    return 0;
}
```

## Ngôn ngữ hỗ trợ

- C
- C++
- C11
- C++11/14/17/20
- Clang/Clang++

## Lưu ý

- Thí sinh có thể có `main()` để test local, sẽ tự động bị vô hiệu hóa
- Không dùng biến toàn cục trùng tên với handler
- Include guard trong header.h là bắt buộc

## Xem thêm

- [Custom Graders Documentation](/problem_format/custom_graders.md)
- [IOI Problem Format](https://ioinformatics.org/)
