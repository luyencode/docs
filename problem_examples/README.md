# Ví dụ bài tập

Thư mục này chứa các bài tập mẫu hoàn chỉnh, chạy được, mỗi bài minh họa một cách chấm khác nhau. Mỗi bài có `init.yml` thật và đầy đủ file cần thiết.

## Danh sách ví dụ

| Ví dụ | Cách chấm | Nội dung minh họa |
|---|---|---|
| [`standard/aplusb`](standard/aplusb/) | Chuẩn | Test data trong file zip, ba test 5, 20 và 75 điểm. |
| [`batched/hungry`](batched/hungry/) | Theo batch | Ba subtask 5, 20 và 25 điểm. |
| [`generator/ds3`](generator/ds3/) | Generator | 20 test sinh bằng generator C++, mỗi test 5 điểm. |
| [`grader/shortest1`](grader/shortest1/) | Grader Python tùy chỉnh | Bài "code golf" chấm bằng lớp con của `StandardGrader`. |
| [`interactive/seed2`](interactive/seed2/) | Grader tương tác bằng Python | Trò chơi đoán số viết bằng `InteractiveGrader`. |
| [`interactive/seed2native`](interactive/seed2native/) | Tương tác native | Cùng trò chơi đó, interactor viết bằng C++. |
| [`signature/fastbit`](signature/fastbit/) | Chữ ký hàm (kiểu IOI) + checker Python | Thí sinh cài đặt một hàm C. |

Mỗi thư mục có `init.yml`, `README.md`, test data hoặc generator, và file checker, grader hay interactor nếu có.

## Chạy thử một ví dụ

1. Chép thư mục ví dụ vào thư mục dữ liệu bài tập của judge, dùng tên thư mục làm mã bài, ví dụ `problems/aplusb/`.
2. Tạo bài có **cùng mã** trong admin và bật **manually managed**, để trình sửa test trên web không ghi đè `init.yml`.
3. Nộp một lời giải và xem kết quả.

Chi tiết xem trang [Ví dụ bài tập](../src/setter/examples.md) trong tài liệu.

## Nguồn gốc

Các ví dụ được chuyển thể từ [bộ ví dụ của DMOJ](https://github.com/DMOJ/docs/tree/master/problem_examples).
