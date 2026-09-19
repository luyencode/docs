# Chấm tương tác native (interactor C++)

Cùng trò chơi đoán số với [`interactive/seed2`](../seed2/), nhưng interactor là một chương trình C++ riêng thay vì grader Python. Judge chạy song song interactor và bài nộp: stdout của interactor nối vào stdin của bài nộp, và ngược lại. Mã thoát của interactor quyết định kết quả.

## Đề bài

Mỗi file input chứa một số bí mật `N` (1 ≤ N ≤ 2 000 000 000). Thí sinh in một số dự đoán mỗi dòng; interactor trả lời `OK` (đúng), `FLOATS` (lớn quá) hoặc `SINKS` (nhỏ quá). Test đúng nếu tìm ra `N` trong tối đa 31 lượt.

## Các file

| File | Vai trò |
|---|---|
| `init.yml` | Cấu hình bài. |
| `interactor.cpp` | Interactor C++. |
| `seed2.zip` | 5 file input `seed2.1.in` … `seed2.5.in`, giống hệt bản Python. Không có file output. |

## init.yml

```yaml
unbuffered: True
archive: seed2.zip
interactive: {files: interactor.cpp, type: testlib}
test_cases:
- {in: seed2.1.in, points: 20}
- {in: seed2.2.in, points: 20}
- {in: seed2.3.in, points: 20}
- {in: seed2.4.in, points: 20}
- {in: seed2.5.in, points: 20}
```

- `interactive.files`: mã nguồn interactor. Judge tự biên dịch bằng C++ (không đặt `lang` thì chọn phiên bản C++ mới nhất có trên judge).
- `interactive.type: testlib`: interactor được gọi với `argv[1]` = file input, `argv[2]` = file log, `argv[3]` = file đáp án; mã thoát đọc theo quy ước testlib: 0 = AC, 1 = WA, 2 = PE (còn 3 là lỗi hệ thống, 7 là điểm thành phần).
- `unbuffered: True`: output của bài nộp không bị đệm.
- 5 test × 20 = 100 điểm.

## Interactor (`interactor.cpp`)

```cpp
#include <cstdio>
#include <cstdlib>

inline void read(long long *i) {
  if (scanf("%lld", i) != 1 || *i < 1 || *i > 2000000000)
    exit(2);
}

int main(int argc, char *argv[]) {
  FILE *input_file = fopen(argv[1], "r");
  int N, guesses = 0;
  long long guess;
  fscanf(input_file, "%d", &N);
  while (guess != N) {
    read(&guess);
    if (guess == N) {
      puts("OK");
    } else if (guess > N) {
      puts("FLOATS");
    } else {
      puts("SINKS");
    }
    fflush(stdout);
    guesses++;
  }
  if (guesses <= 31)
    return 0; // AC
  else
    return 1; // WA
}
```

- Interactor đọc `N` từ file input qua `argv[1]`; không dùng `argv[2]` và `argv[3]`.
- Đọc dự đoán của thí sinh từ stdin; số không đọc được hoặc ngoài `[1, 2000000000]` thì thoát với mã 2 (PE).
- Sau mỗi phản hồi phải `fflush(stdout)`, nếu không thí sinh sẽ chờ mãi.
- Thoát 0 nếu đoán trúng trong tối đa 31 lượt, ngược lại thoát 1.

Lưu ý: `guess` chưa được khởi tạo trước vòng `while`. Nếu tự viết interactor, hãy khởi tạo nó (ví dụ `long long guess = 0;`), hoặc dùng `testlib.h` với `registerInteraction`.

## Chạy thử

Làm theo mục "Chạy thử một ví dụ" trong [README chung](../../README.md), với mã bài `seed2native`. Lời giải tìm kiếm nhị phân dùng cho `seed2` cũng đúng ở đây.

Xem thêm: [Chấm tương tác native](../../../src/setter/graders.md), [testlib](https://github.com/VNOI-Admin/testlib).
