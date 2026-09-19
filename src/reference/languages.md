# Ngôn ngữ được hỗ trợ

> Danh sách ngôn ngữ LCOJ có thể chấm, cách xem ngôn ngữ đang thực sự dùng được trên site, và cách quản trị viên thêm ngôn ngữ mới.
>
> ⏱ ~5 phút đọc · 👤 Mọi người dùng, quản trị viên

## Khi nào cần trang này

- Bạn muốn biết site có chấm ngôn ngữ mình dùng không, hoặc phiên bản trình biên dịch là gì.
- Một ngôn ngữ không xuất hiện trong ô chọn khi nộp bài.
- Bạn là quản trị viên và muốn bật thêm ngôn ngữ cho site.

Mã nguồn judge của LCOJ ([luyencode/judge-server](https://github.com/luyencode/judge-server), dựa trên DMOJ và VNOJ) có sẵn trình chạy (executor) cho gần 70 ngôn ngữ. Tuy vậy, **danh sách ngôn ngữ bạn thực sự dùng được trên một site cụ thể là do các judge của site đó báo lên**, không phải danh sách đầy đủ bên dưới.

## Xem ngôn ngữ đang dùng được

Trên site LCOJ (ví dụ `https://luyencode.net`), mở:

| Trang | Nội dung |
|---|---|
| `/runtimes/` | Danh sách ngôn ngữ đang có ít nhất một judge online hỗ trợ, kèm phiên bản trình biên dịch/thông dịch |
| `/runtimes/matrix/` | Bảng phiên bản runtime theo từng judge |
| `/status/` | Danh sách judge đang online và runtime của từng judge |

Khi nộp bài, ô chọn ngôn ngữ chỉ hiện những ngôn ngữ thỏa **cả ba** điều kiện:

1. Một judge đang online đã nạp được executor của ngôn ngữ đó (judge tự kiểm tra từng ngôn ngữ lúc khởi động và bỏ những ngôn ngữ lỗi).
2. Cơ sở dữ liệu của website có bản ghi **Language** với **key** trùng tên executor (ví dụ `CPP17`, `PY3`). Judge báo một executor mà website không có bản ghi tương ứng thì ngôn ngữ đó không xuất hiện.
3. Người ra đề cho phép ngôn ngữ đó trong bài, và judge có dữ liệu của bài.

## Ngôn ngữ có sẵn khi cài mới

Khi cài đặt, lệnh `./scripts/manage.py loaddata language_small` (xem [Cài đặt với Docker](/operate/installation)) tạo sẵn các ngôn ngữ sau:

| Key | Tên hiển thị | Ghi chú |
|---|---|---|
| `C`, `C11` | C, C11 | GCC |
| `CPP03`, `CPP11`, `CPP14`, `CPP17`, `CPP20` | C++03 … C++20 | GCC với chuẩn C++ tương ứng |
| `PAS` | Pascal | Free Pascal |
| `PY2`, `PY3` | Python 2, Python 3 | CPython |
| `PYPY`, `PYPY3` | PyPy 2, PyPy 3 | Python chạy nhanh hơn nhờ JIT |
| `JAVA8`, `JAVA` | Java 8, Java 19 | `JAVA` dùng phiên bản Java mới nhất có trên judge; tên hiển thị do quản trị viên đặt |
| `KOTLIN` | Kotlin | |
| `TEXT` | TEXT | Nộp trực tiếp nội dung output |
| `OUTPUT` | Output Only | Chỉ nộp file `.zip` chứa output (tối đa 10 MB) |
| `SCRATCH` | Scratch | Chỉ nộp file `.sb3` (tối đa 1 MB) |

Muốn thêm ngôn ngữ khác, quản trị viên thêm bản ghi tại `/admin/judge/language/` với **key** trùng tên executor (xem bảng bên dưới).

::: warning Không nạp `language_all` chồng lên `language_small`
Repo có sẵn fixture `language_all`, nhưng khóa chính (id) của nó trùng với `language_small` mà nội dung khác nhau. Nạp chồng sẽ ghi đè sai các ngôn ngữ đang có. Chỉ cân nhắc dùng `language_all` **thay cho** `language_small` trên một cơ sở dữ liệu mới.
:::

::: tip Phiên bản thật nằm ở `/runtimes/`
Tên hiển thị như "Java 19" chỉ là nhãn lưu trong cơ sở dữ liệu. Phiên bản thực tế của trình biên dịch/thông dịch là do judge báo lên và hiển thị ở `/runtimes/`, cũng như ở ô chọn ngôn ngữ khi nộp bài.
:::

## Toàn bộ executor của judge

Judge có sẵn các executor dưới đây, mỗi executor là một module trong thư mục [`dmoj/executors/`](https://github.com/luyencode/judge-server/tree/master/dmoj/executors) của judge. Một executor chỉ hoạt động khi image judge có cài runtime tương ứng.

| Nhóm | Key (tên ngôn ngữ) |
|---|---|
| C/C++ | `C`, `C11`, `CLANG` (Clang), `CPP03`, `CPP11`, `CPP14`, `CPP17`, `CPP20`, `CLANGX` (Clang++), `CICPC`, `CPPICPC` (C/C++ theo cờ biên dịch kiểu ICPC), `CPPTHEMIS` (C++ theo kiểu Themis) |
| Pascal | `PAS` (Free Pascal), `PASTHEMIS` (Pascal theo kiểu Themis) |
| Python | `PY2`, `PY3`, `PYPY`, `PYPY3` |
| JVM | `JAVA8`, `JAVA`, `KOTLIN`, `SCALA`, `GROOVY` |
| .NET (Mono) | `MONOCS` (C#), `MONOFS` (F#), `MONOVB` (Visual Basic) |
| JavaScript | `NODEJS` (Node.js), `V8JS` (V8), `COFFEE` (CoffeeScript) |
| Hợp ngữ | `GAS32`, `GAS64`, `GASARM` (GNU as), `NASM`, `NASM64`, `LLC` (LLVM IR) |
| Hệ thống | `GO`, `RUST`, `D`, `ZIG`, `SWIFT`, `OBJC` (Objective-C), `DART` |
| Hàm và logic | `HASK` (Haskell), `OCAML`, `SBCL` (Common Lisp), `SCM` (Scheme), `RKT` (Racket), `PRO` (Prolog), `LEAN4` (Lean 4) |
| Kịch bản | `RUBY`, `PERL`, `PHP`, `LUA`, `TCL`, `BASH`, `AWK`, `SED`, `PIKE` |
| Cổ điển và khác | `ADA`, `CBL` (COBOL), `F95` (Fortran), `FORTH`, `ALGL68` (Algol 68), `TUR` (Turing), `BF` (Brain\*\*\*\*), `ICK` (INTERCAL) |
| Đặc biệt | `TEXT`, `OUTPUT` (output-only), `SCRATCH` |

## Lưu ý

- Ngôn ngữ phổ biến trong lập trình thi đấu là C++ (nên dùng `CPP17` hoặc `CPP20`), Python 3 (với bài nặng, thử `PYPY3`), Java và Pascal.
- Mỗi bài có thể đặt giới hạn thời gian và bộ nhớ **riêng cho từng ngôn ngữ**. Giới hạn áp dụng được ghi trên trang đề bài.
- Các ngôn ngữ ít dùng có thể còn lỗi chưa phát hiện. Nếu gặp lỗi với một ngôn ngữ, hãy [báo lỗi cho judge](https://github.com/luyencode/judge-server/issues).

## Tiếp theo

- [Nộp bài và chấm bài](/learn/submissions): cách chọn ngôn ngữ và nộp bài.
- [Mã trạng thái](/reference/status-codes): ý nghĩa các kết quả như `CE`, `RTE`, `IR`.
- [Cài đặt judge](/operate/judge-setup): với người vận hành, chạy judge để site có ngôn ngữ.
- [Thuật ngữ](/start/glossary): giải thích judge, executor, runtime.
