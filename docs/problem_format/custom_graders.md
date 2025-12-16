# Custom Grader

Custom grader được dùng khi cần tương tác đặc biệt với chương trình thí sinh, không chỉ đơn giản là so sánh input/output.

## Khi nào dùng Custom Grader?

- **Bài interactive**: Cần trao đổi dữ liệu qua lại với chương trình
- **Bài IOI-style**: Thí sinh implement hàm, không có input/output thông thường
- **Chấm điểm phức tạp**: Cần logic chấm điểm đặc biệt

**Lưu ý:** Hầu hết trường hợp chỉ cần dùng checker có sẵn hoặc custom checker. Custom grader chỉ cần khi tương tác thông thường không đủ.

## Custom Grader cơ bản

Trong `init.yml`, thêm:

```yaml
custom_judge: grader.py
```

File `grader.py`:

```python
from dmoj.graders.standard import StandardGrader
from dmoj.result import Result

class Grader(StandardGrader):
    def grade(self, case):
        # Logic chấm bài
        pass
```

### Tham số `case`

- `case.position`: vị trí test (bắt đầu từ 0)
- `case.input_data()`: nội dung file input
- `case.output_data()`: nội dung file output chuẩn
- `case.points`: điểm tối đa của test

### Giá trị trả về

Trả về object `Result`:

```python
from dmoj.result import Result

result = Result(case)
result.result_flag = Result.AC  # Hoặc Result.WA, Result.TLE, etc.
result.points = case.points
result.feedback = 'Phản hồi ngắn'
result.extended_feedback = 'Phản hồi chi tiết'
result.proc_output = 'Output của chương trình'
```

### Ví dụ

Bài tập: In ra dòng "Hello, World!"

```python
import subprocess
from dmoj.graders.standard import StandardGrader
from dmoj.result import Result

class Grader(StandardGrader):
    def grade(self, case):
        result = Result(case)
        case_input = b'Hello, World!\n'

        # Chạy chương trình
        self._current_proc = self.binary.launch(
            time=self.problem.time_limit,
            memory=self.problem.memory_limit,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        output, error = self._current_proc.communicate(case_input)
        self.binary.populate_result(error, result, self._current_proc)

        # Kiểm tra output
        if output == case_input:
            result.extended_feedback = 'Chính xác!'
            if result.result_flag == Result.AC:
                result.points = case.points
        else:
            result.result_flag |= Result.WA
            result.feedback = 'Sai rồi!'

        return result
```

File `init.yml`:

```yaml
custom_judge: grader.py
unbuffered: true
test_cases:
- points: 100
```

**Lưu ý `unbuffered`:** Đặt `true` để tắt buffering, thí sinh không cần `flush()`.

## Interactive Grading

Dùng cho bài tập cần tương tác qua lại với chương trình.

```python
from dmoj.graders.interactive import InteractiveGrader
from dmoj.utils.unicode import utf8text

class Grader(InteractiveGrader):
    def interact(self, case, interactor):
        # Gửi dữ liệu cho thí sinh
        interactor.writeln('Hello, World!')
        
        # Nhận phản hồi
        response = utf8text(interactor.readln())
        
        # Trả về True nếu đúng, False nếu sai
        return response == 'Hello, World!'
```

### Các hàm của `interactor`

**Đọc dữ liệu:**
- `interactor.read()`: đọc tất cả output
- `interactor.readln(strip_newline=True)`: đọc một dòng
- `interactor.readtoken(delim=None)`: đọc một token
- `interactor.readint(lo=-inf, hi=inf, delim=None)`: đọc số nguyên (tự động WA nếu không hợp lệ)
- `interactor.readfloat(lo=-inf, hi=inf, delim=None)`: đọc số thực

**Ghi dữ liệu:**
- `interactor.write(val)`: ghi dữ liệu
- `interactor.writeln(val)`: ghi dữ liệu + xuống dòng
- `interactor.close()`: đóng stdin

### Ví dụ: Đoán số

```python
from dmoj.graders.interactive import InteractiveGrader

class Grader(InteractiveGrader):
    def interact(self, case, interactor):
        secret = 42
        attempts = 0
        max_attempts = 10
        
        while attempts < max_attempts:
            guess = interactor.readint(1, 100)
            attempts += 1
            
            if guess == secret:
                interactor.writeln('Correct!')
                return True
            elif guess < secret:
                interactor.writeln('Higher')
            else:
                interactor.writeln('Lower')
        
        interactor.writeln('Out of attempts!')
        return False
```

## Native Interactive Grading

Dùng interactor viết bằng C/C++ cho hiệu năng cao.

Trong `init.yml`:

```yaml
unbuffered: true
archive: data.zip
interactive:
  files: interactor.cpp
  type: testlib
test_cases:
- {in: test1.in, points: 50}
- {in: test2.in, points: 50}
```

**Tham số:**
- `files`: file interactor (hoặc danh sách file)
- `lang`: ngôn ngữ (tự động detect từ extension)
- `flags`: flag compile
- `compiler_time_limit`: thời gian compile
- `preprocessing_time`: thời gian thêm cho interactor (mặc định 2s)
- `memory_limit`: giới hạn bộ nhớ
- `type`: loại interactor (`default`, `testlib`, `coci`, `peg`)

**Ví dụ interactor.cpp (testlib):**

```cpp
#include "testlib.h"
#include <iostream>

int main(int argc, char* argv[]) {
    registerInteraction(argc, argv);
    
    int secret = inf.readInt();  // Đọc từ input file
    int attempts = 0;
    
    while (attempts < 10) {
        int guess = ouf.readInt(1, 100);  // Đọc từ thí sinh
        attempts++;
        
        if (guess == secret) {
            std::cout << "Correct!" << std::endl;
            quitf(_ok, "Solved in %d attempts", attempts);
        } else if (guess < secret) {
            std::cout << "Higher" << std::endl;
        } else {
            std::cout << "Lower" << std::endl;
        }
    }
    
    quitf(_wa, "Too many attempts");
}
```

## Function Signature Grading (IOI-style)

Dùng cho bài tập kiểu IOI, thí sinh implement hàm thay vì đọc/ghi input/output.

Trong `init.yml`:

```yaml
signature_grader:
  entry: handler.c
  header: header.h
test_cases:
- {in: test1.in, out: test1.out, points: 50}
- {in: test2.in, out: test2.out, points: 50}
```

**Ngôn ngữ hỗ trợ:** C, C++, Clang

### Ví dụ

**header.h:**

```c
#ifndef _GRADER_HEADER_INCLUDED
#define _GRADER_HEADER_INCLUDED
#include <stdbool.h>
bool is_valid(int n);
#endif
```

**handler.c (entry):**

```c
#include "header.h"
#include <stdio.h>

static int n;

int main() {
    scanf("%d", &n);
    bool valid = is_valid(n);  // Hàm thí sinh implement
    printf(valid ? "correct" : "wrong");
    return 0;
}
```

**Bài nộp của thí sinh:**

```c
#include <stdbool.h>

bool is_valid(int n) {
    return n > 0 && n % 2 == 0;
}
```

Hệ thống tự động:
- Include `header.h` vào bài nộp
- Đổi tên `main` của thí sinh thành `main_GUID`
- Compile và link với `handler.c`
