# Native Interactive Grading

Ví dụ này minh họa bài tập tương tác với interactor viết bằng C++, cho hiệu năng cao hơn Python.

## So sánh với Interactive Python

| Đặc điểm | Python | C++ (Native) |
|----------|--------|--------------|
| Tốc độ | Chậm hơn | Nhanh hơn |
| Dễ viết | ✅ Dễ | ⚠️ Khó hơn |
| Phù hợp | Bài đơn giản | Bài phức tạp, nhiều tương tác |

## File init.yml

```yaml
unbuffered: true
archive: seed2.zip
interactive:
  files: interactor.cpp
  type: testlib
test_cases:
- {in: seed2.1.in, points: 50}
- {in: seed2.2.in, points: 50}
```

## Interactor (C++)

```cpp
#include <iostream>
#include <cstdio>
using namespace std;

int main(int argc, char* argv[]) {
    FILE *input_file = fopen(argv[1], "r");
    int secret;
    fscanf(input_file, "%d", &secret);
    fclose(input_file);
    
    int attempts = 0;
    int guess;
    
    while (attempts < 10) {
        // Đọc từ thí sinh
        if (scanf("%d", &guess) != 1) {
            return 1; // WA
        }
        attempts++;
        
        // Gửi phản hồi
        if (guess == secret) {
            printf("Correct!\n");
            fflush(stdout);
            return 0; // AC
        } else if (guess < secret) {
            printf("Higher\n");
        } else {
            printf("Lower\n");
        }
        fflush(stdout);
    }
    
    return 1; // WA - Hết lượt
}
```

## Lưu ý quan trọng

### 1. Flush output

```cpp
printf("Higher\n");
fflush(stdout);  // BẮT BUỘC!
```

Nếu không flush, thí sinh sẽ không nhận được phản hồi.

### 2. Return codes

- `return 0` → AC (Accepted)
- `return 1` → WA (Wrong Answer)
- Khác → Internal Error

### 3. Testlib.h

Nếu dùng testlib.h:

```cpp
#include "testlib.h"

int main(int argc, char* argv[]) {
    registerInteraction(argc, argv);
    
    int secret = inf.readInt();
    
    // ... logic tương tác ...
    
    if (correct) {
        quitf(_ok, "Correct!");
    } else {
        quitf(_wa, "Wrong answer");
    }
}
```

## Khi nào dùng Native Interactive?

✅ **Nên dùng khi:**
- Có nhiều tương tác (> 1000 lần)
- Cần tính toán phức tạp trong interactor
- Cần hiệu năng cao

❌ **Không cần khi:**
- Ít tương tác (< 100 lần)
- Logic đơn giản
- Ưu tiên dễ viết/debug

## Xem thêm

- [Interactive Grading (Python)](../seed2/)
- [Custom Graders Documentation](/problem_format/custom_graders.md)
- [Testlib.h](https://github.com/MikeMirzayanov/testlib)
