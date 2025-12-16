# Generator

Generator được dùng khi có nhiều test data, thay vì tạo file input/output thủ công.

Generator là chương trình nhận tham số dòng lệnh và tạo ra input/output cho mỗi test case.

## Node `generator`

Node `generator` có thể là:

**1. Tên file đơn:**

```yaml
generator: gen.cpp
```

**2. Mảng (file chính + file phụ):**

```yaml
generator: [gen.cpp, testlib.h, utils.h]
```

**3. YAML object với các key:**

```yaml
generator:
  source: gen.cpp  # Hoặc [gen.cpp, testlib.h]
  language: CPP17
  flags: ['-O2', '-std=c++17']
  compiler_time_limit: 60
  time_limit: 10
  memory_limit: 256000
```

**Các tham số:**
- `source`: file generator (hoặc mảng file)
- `language`: ngôn ngữ (tự động detect nếu không chỉ định)
- `flags`: flag compile
- `compiler_time_limit`: thời gian compile (mặc định từ `dmoj/judgeenv.py`)
- `time_limit`: thời gian chạy generator
- `memory_limit`: giới hạn bộ nhớ

**Lưu ý:** Nếu dùng `testlib.h`, nên đặt `compiler_time_limit: 60`.

## Tham số Generator

Dùng `generator_args` để truyền tham số cho generator:

```yaml
generator: gen.cpp
test_cases:
- {generator_args: [false, 123, "a b\nc"], points: 10}
- {generator_args: [true, 456], points: 20}
- {points: 30}  # generator_args mặc định là []
```

**Cách hoạt động:**
- Tham số đầu tiên luôn là `"_aux_file"`
- Các tham số khác được convert thành string
- Test 1: `"_aux_file"`, `"False"`, `"123"`, `"a b\nc"`
- Test 2: `"_aux_file"`, `"True"`, `"456"`
- Test 3: `"_aux_file"`

## Output của Generator

Generator phải:
- In **input** ra `stdout`
- In **output** ra `stderr`

**Ví dụ generator (C++):**

```cpp
#include <iostream>
#include <cstdlib>
using namespace std;

int main(int argc, char* argv[]) {
    // argv[1] = "_aux_file"
    // argv[2] = tham số thứ nhất
    // argv[3] = tham số thứ hai
    
    int n = atoi(argv[2]);
    bool hard = string(argv[3]) == "True";
    
    // In input ra stdout
    cout << n << endl;
    
    // In output ra stderr
    int answer = n * 2;
    if (hard) answer *= 2;
    cerr << answer << endl;
    
    return 0;
}
```

## Generator cho từng test case

Có thể dùng generator khác nhau cho mỗi test:

```yaml
test_cases:
- generator: gen_easy.cpp
  generator_args: [10]
  points: 30
- generator: gen_hard.cpp
  generator_args: [100]
  points: 70
```

## Kết hợp Generator và File

Nếu test case đã có `in` và `out`, generator sẽ không chạy:

```yaml
generator: gen.cpp
test_cases:
- {in: manual.in, out: manual.out, points: 10}  # Không dùng generator
- {generator_args: [50], points: 20}  # Dùng generator
- {generator_args: [100], points: 30}  # Dùng generator
```

## Ví dụ hoàn chỉnh

**init.yml:**

```yaml
archive: data.zip
generator:
  source: gen.cpp
  language: CPP17
  compiler_time_limit: 60
  time_limit: 5
test_cases:
- {generator_args: [10, easy], points: 20}
- {generator_args: [100, medium], points: 30}
- {generator_args: [1000, hard], points: 50}
```

**gen.cpp:**

```cpp
#include <iostream>
#include <string>
#include <cstdlib>
#include <ctime>
using namespace std;

int main(int argc, char* argv[]) {
    int n = atoi(argv[2]);
    string difficulty = argv[3];
    
    srand(time(0));
    
    // In input
    cout << n << endl;
    for (int i = 0; i < n; i++) {
        cout << rand() % 100 << " ";
    }
    cout << endl;
    
    // Tính output
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += rand() % 100;
    }
    
    // In output ra stderr
    cerr << sum << endl;
    
    return 0;
}
```

## Generator với testlib.h

`testlib.h` là thư viện phổ biến để viết generator:

```cpp
#include "testlib.h"
#include <iostream>
using namespace std;

int main(int argc, char* argv[]) {
    registerGen(argc, argv, 1);
    
    int n = atoi(argv[2]);
    
    // In input
    cout << n << endl;
    for (int i = 0; i < n; i++) {
        cout << rnd.next(1, 100) << " ";
    }
    cout << endl;
    
    // Tính và in output ra stderr
    // ...
    
    return 0;
}
```

**init.yml:**

```yaml
generator:
  source: [gen.cpp, testlib.h]
  compiler_time_limit: 60
test_cases:
- {generator_args: [10], points: 100}
```

## Lợi ích của Generator

- **Tiết kiệm dung lượng**: Không cần lưu file input/output lớn
- **Dễ quản lý**: Thay đổi test chỉ cần sửa generator
- **Tạo test ngẫu nhiên**: Dễ dàng tạo nhiều test khác nhau
- **Kiểm tra tính đúng**: Generator có thể tính output chuẩn
