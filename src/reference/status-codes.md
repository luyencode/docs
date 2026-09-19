# Mã trạng thái

Mỗi bài nộp trên LCOJ có hai thông tin: **trạng thái xử lý** (bài đang ở bước nào) và **kết quả** (verdict, bài đúng hay sai và sai kiểu gì). Trang này liệt kê đầy đủ các mã, đúng như định nghĩa trong mã nguồn website (`judge/models/submission.py`) và judge.

Cách nộp bài và đọc trang kết quả xem tại [Nộp bài và chấm bài](/learn/submissions).

## Trạng thái xử lý

| Mã | Tên (tiếng Anh) | Giao diện tiếng Việt | Ý nghĩa |
|---|---|---|---|
| `QU` | Queued | Đang chờ | Bài đã được nhận, đang đợi một judge rảnh |
| `P` | Processing | Đang xử lý | Judge đã nhận bài và đang biên dịch |
| `G` | Grading | Chấm điểm | Judge đang chạy từng test |
| `D` | Completed | Đã Hoàn Thành | Chấm xong. Xem cột kết quả để biết đúng hay sai |
| `CE` | Compile Error | Lỗi dịch (CE) | Biên dịch thất bại, bài không được chạy |
| `IE` | Internal Error | Lỗi Nội Bộ | Có lỗi phía hệ thống, không phải lỗi của bạn |
| `AB` | Aborted | Bị hủy bỏ | Bài bị hủy trước khi chấm xong |

## Kết quả (verdict)

| Mã | Tên (tiếng Anh) | Giao diện tiếng Việt | Tóm tắt |
|---|---|---|---|
| `AC` | Accepted | Kết quả đúng (AC) | Đúng |
| `PAC` | Partially Accepted | Partially Accepted | Đúng một phần (chỉ được một phần điểm của test) |
| `WA` | Wrong Answer | Kết quả sai (WA) | Output sai |
| `TLE` | Time Limit Exceeded | Quá thời gian (TLE) | Chạy quá thời gian |
| `MLE` | Memory Limit Exceeded | Tràn bộ nhớ (MLE) | Dùng quá bộ nhớ |
| `OLE` | Output Limit Exceeded | Kết xuất dữ liệu ra quá nhiều (OLE) | In ra quá nhiều |
| `IR` | Invalid Return | Lỗi khi chạy chương trình (IR) | Chương trình thoát với mã lỗi khác 0 |
| `RTE` | Runtime Error | Lỗi Runtime (RE) | Chương trình bị hệ điều hành dừng (tín hiệu lỗi) |
| `CE` | Compile Error | Lỗi dịch (CE) | Không biên dịch được |
| `IE` | Internal Error | Lỗi nội bộ (máy chủ chấm bài lỗi) | Lỗi phía hệ thống |
| `SC` | Short Circuited | Ngắn Mạch | Test bị bỏ qua, không chạy |
| `AB` | Aborted | Bị hủy bỏ | Bài bị hủy |

## Kết quả cuối cùng được chọn thế nào

Hệ thống chấm theo hai tầng:

1. **Mỗi test** chỉ mang một kết quả. Nếu một test gặp nhiều lỗi cùng lúc, judge chọn theo thứ tự ưu tiên: `TLE` → `MLE` → `OLE` → `RTE` → `IR` → `WA` → `SC`. Test không có lỗi là `AC`, hoặc `PAC` nếu checker chỉ cho một phần điểm.
2. **Cả bài** lấy kết quả "tệ nhất" trong các test, theo thứ tự tăng dần:

   `SC` < `AC` < `PAC` < `WA` < `MLE` < `TLE` < `IR` < `RTE` < `OLE`

   Ví dụ: bài có test `WA` và test `TLE` sẽ có kết quả chung là `TLE`.

`CE`, `IE` và `AB` là kết quả của cả bài, không gắn với từng test.

::: info Điểm và kết quả là hai chuyện khác nhau
Bài có kết quả `WA` vẫn có thể được điểm nếu đề cho **chấm điểm từng phần** (partial). Ngược lại, với bài **không** chấm từng phần, bạn chỉ được điểm khi qua hết mọi test; sai một test là 0 điểm.
:::

## Chi tiết từng kết quả

### AC: Accepted

Chương trình chạy đúng trên test. Đôi khi checker kèm theo một dòng phản hồi.

### PAC: Partially Accepted

Chương trình chạy không lỗi, nhưng checker chỉ cho **một phần** điểm của test (thường gặp ở bài có checker tùy chỉnh chấm theo mức độ đúng). Trên trang bài nộp, `PAC` được tô màu giống `AC`.

### WA: Wrong Answer

Chương trình chạy xong nhưng output không khớp đáp án.

Checker mặc định (`standard`) so sánh từng "từ" (token) và khá dễ tính với khoảng trắng: thừa dấu cách, thừa dòng trống ở đầu hoặc cuối đều không sao. Tuy vậy, **xuống dòng giữa các token phải khớp**, và mọi chữ in thừa (như `Nhap n:`) đều bị tính là sai.

### TLE: Time Limit Exceeded

Chương trình chạy quá giới hạn thời gian. Trên trang bài nộp, thời gian của test `TLE` hiện dạng `[>1.000s]`.

Cách khắc phục:
- Giảm độ phức tạp thuật toán (ví dụ từ O(n²) xuống O(n log n)).
- Dùng nhập/xuất nhanh: trong C++ thêm `ios::sync_with_stdio(false); cin.tie(nullptr);`, trong Python dùng `sys.stdin.readline`.
- Kiểm tra vòng lặp vô hạn, hoặc chương trình đang chờ nhập thêm dữ liệu không có.

### MLE: Memory Limit Exceeded

Chương trình dùng quá giới hạn bộ nhớ. Đôi khi lỗi hết bộ nhớ lại hiện dưới dạng `RTE` (ví dụ `std::bad_alloc`, `segmentation fault`).

Cách khắc phục: giảm kích thước mảng, tránh sao chép dữ liệu lớn, dùng cấu trúc dữ liệu tiết kiệm hơn.

### OLE: Output Limit Exceeded

Chương trình in ra quá nhiều. Mặc định judge giới hạn output mỗi test khoảng **24 MB** (`output_limit_length: 25165824` byte); người ra đề có thể đổi giới hạn này cho từng bài.

Nguyên nhân thường gặp: vòng lặp in vô hạn, hoặc quên xóa lệnh in để gỡ lỗi (debug).

### IR: Invalid Return

Chương trình kết thúc với mã thoát (exit code) **khác 0**. Thường gặp khi:
- Python hoặc Java ném ngoại lệ không được bắt. Judge thường ghi kèm tên ngoại lệ, ví dụ `IndexError`, `java.lang.NullPointerException`.
- C/C++ `return 1;` trong `main` hoặc gọi `exit(1)`. Khi không đọc được tên lỗi, phản hồi có dạng `Exit code 1`.

### RTE: Runtime Error

Chương trình bị hệ điều hành dừng bằng một tín hiệu lỗi. Thường gặp với C/C++. Judge ghi kèm thông báo:

| Thông báo | Nguyên nhân thường gặp |
|---|---|
| `segmentation fault`, `bus error` | Truy cập bộ nhớ không hợp lệ: vượt chỉ số mảng, dùng con trỏ `NULL`, đệ quy quá sâu, hoặc hết bộ nhớ |
| `floating point exception` | Phép toán không hợp lệ, thường là chia số nguyên cho 0 hoặc lấy dư cho 0 |
| `aborted` | Chương trình tự dừng, ví dụ do `assert` sai |
| `killed` | Chương trình bị hệ thống giết, thường vì vượt giới hạn tài nguyên |
| `std::bad_alloc` | Không cấp phát được bộ nhớ (C++) |
| `failed initializing` | Chương trình không khởi động nổi, thường do khai báo biến toàn cục quá lớn so với giới hạn bộ nhớ (ví dụ `int a[10000][10000]` cần khoảng 381 MB) |
| `<tên> syscall disallowed` | Chương trình gọi một lời gọi hệ thống bị sandbox cấm (ví dụ mở file, tạo tiến trình). Nếu bạn không làm gì đặc biệt mà vẫn gặp lỗi này, hãy [báo lỗi](https://github.com/luyencode/judge-server/issues) |

```cpp
int a[100];
a[1000] = 5;               // segmentation fault: vượt chỉ số mảng

int x = 10, y = 0;
int z = x / y;             // floating point exception: chia cho 0

int big[100000][100000];   // failed initializing: mảng toàn cục quá lớn
```

### CE: Compile Error

Mã nguồn không biên dịch được. Thông báo lỗi của trình biên dịch hiện ngay trên trang bài nộp. Kiểm tra lại bạn đã chọn **đúng ngôn ngữ** (ví dụ nộp code C++17 nhưng chọn C) và đúng phiên bản.

::: warning
Trong kỳ thi có giới hạn số lần nộp, bài `CE` **vẫn bị tính** là một lần nộp. Hãy biên dịch thử trên máy trước khi nộp.
:::

### IE: Internal Error

Lỗi phía hệ thống: dữ liệu bài cấu hình sai, checker lỗi, hoặc judge gặp sự cố. Đây không phải lỗi của bạn. Hãy báo cho người ra đề hoặc quản trị viên; sau khi sửa sự cố, họ có thể chấm lại bài của bạn. Bài `IE` không bị tính vào giới hạn số lần nộp của kỳ thi.

### SC: Short Circuited

Test bị **bỏ qua**, không chạy, và hiện dấu `—` trên trang bài nộp. Judge bỏ qua các test còn lại khi:
- Bạn sai một test trong một **nhóm test** (batch): các test còn lại của nhóm đó không cần chạy nữa.
- Bài bật chế độ **short circuit**: sai một test là dừng luôn.
- Bạn sai một test **0 điểm** (thường là test ví dụ).
- Một nhóm test phụ thuộc vào nhóm khác mà bạn chưa qua.

### AB: Aborted

Bài bị hủy trước khi chấm xong, do bạn bấm **Huỷ bỏ** trong lúc bài đang chấm, hoặc do quản trị viên hủy. Bài bị hủy được 0 điểm.
