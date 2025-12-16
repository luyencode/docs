# Ví dụ bài tập

Thư mục này chứa các ví dụ bài tập thực tế với các loại chấm điểm khác nhau.

## Danh sách ví dụ

| Loại chấm điểm | Thư mục | Tham khảo |
|----------------|---------|-----------|
| [Chấm điểm chuẩn (Standard)](/problem_examples/standard/aplusb) | `standard/aplusb` | Bài A+B đơn giản |
| [Chấm điểm theo batch (Batched)](/problem_examples/batched/hungry) | `batched/hungry` | Bài có nhiều subtask |
| [Custom Grading](/problem_examples/grader/shortest1) | `grader/shortest1` | Bài cần logic chấm đặc biệt |
| [Interactive Grading](/problem_examples/interactive/seed2) | `interactive/seed2` | Bài tương tác (Python) |
| [Native Interactive Grading](/problem_examples/interactive/seed2native) | `interactive/seed2native` | Bài tương tác (C++) |
| [Signature Grading (IOI-style)](/problem_examples/signature/fastbit) | `signature/fastbit` | Bài implement hàm |
| [Generator](/problem_examples/generator/ds3) | `generator/ds3` | Bài dùng generator tạo test |

## Cách sử dụng

Mỗi thư mục ví dụ chứa:
- **init.yml** - File cấu hình bài tập
- **README.md** - Hướng dẫn chi tiết
- **Test data** hoặc generator
- **Checker/grader** (nếu có)

## Tài liệu

Xem thêm tài liệu chi tiết tại [docs/problem_format/problem_examples.md](../docs/problem_format/problem_examples.md)

## Nguồn gốc

Các ví dụ này dựa trên [DMOJ problem examples](https://github.com/DMOJ/docs/tree/master/problem_examples).
