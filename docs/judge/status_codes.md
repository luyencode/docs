# Các mã trạng thái

Trang này liệt kê tất cả các mã trạng thái (verdict) khi nộp bài trên LCOJ.

**Lưu ý:** Một test case có thể có nhiều lỗi, nhưng hệ thống chỉ hiển thị lỗi có độ ưu tiên cao nhất. Các mã trạng thái dưới đây được sắp xếp theo thứ tự tăng dần về độ ưu tiên.

## AC - Accepted (Chấp nhận)

Chương trình của bạn chạy đúng! Đôi khi có thêm thông tin phản hồi từ hệ thống chấm.

## WA - Wrong Answer (Sai kết quả)

Chương trình chạy không bị lỗi nhưng kết quả in ra không đúng. Có thể kèm theo thông tin chi tiết về lỗi sai.

## IR - Invalid Return (Lỗi trả về)

Chương trình kết thúc với mã lỗi (exit code khác 0), tức là chương trình bị crash:
- Python: Thường kèm tên exception như `NameError`, `IndexError`
- Java: Thường kèm tên exception như `java.lang.NullPointerException`

## RTE - Runtime Error (Lỗi khi chạy)

Chương trình gặp lỗi trong quá trình thực thi. Thường xảy ra với C/C++.

### Các loại lỗi RTE phổ biến:

| Thông báo | Nguyên nhân |
|-----------|-------------|
| `segmentation fault`, `bus error` | Truy cập vùng nhớ không hợp lệ. Thường do: vượt quá giới hạn mảng, dùng con trỏ NULL, hoặc hết bộ nhớ |
| `floating point exception` | Phép toán số học không hợp lệ, ví dụ: chia cho 0 |
| `killed` | Chương trình bị dừng bởi hệ thống (nguyên nhân không rõ) |
| `{} syscall disallowed` | Chương trình cố gắng thực hiện lệnh hệ thống không được phép. Nếu gặp lỗi này mà không làm gì đặc biệt, vui lòng [báo lỗi](https://github.com/luyencode/judge-server/issues) |
| `std::bad_alloc` | Không thể cấp phát bộ nhớ (C++) |
| `failed initializing` | Dùng quá nhiều bộ nhớ cho biến toàn cục. Ví dụ: `int arr[10000][10000]` chiếm 381MB, vượt giới hạn 64MB |

**Ví dụ lỗi thường gặp:**

```cpp
// Segmentation fault - Vượt quá giới hạn mảng
int a[100];
a[1000] = 5;  // Lỗi!

// Floating point exception - Chia cho 0
int x = 10 / 0;  // Lỗi!

// Failed initializing - Mảng quá lớn
int arr[100000][100000];  // Lỗi nếu giới hạn bộ nhớ nhỏ!
```

## OLE - Output Limit Exceeded (Vượt quá giới hạn output)

Chương trình in ra quá nhiều dữ liệu (thường > 256MB). Một số bài có thể có giới hạn khác.

**Nguyên nhân thường gặp:**
- Vòng lặp in ra vô hạn
- In quá nhiều dữ liệu debug

## MLE - Memory Limit Exceeded (Vượt quá giới hạn bộ nhớ)

Chương trình dùng quá nhiều bộ nhớ. Đôi khi hiển thị dưới dạng RTE với `segmentation fault` hoặc `std::bad_alloc`.

**Cách khắc phục:**
- Giảm kích thước mảng
- Tối ưu thuật toán để dùng ít bộ nhớ hơn
- Giải phóng bộ nhớ không dùng nữa

## TLE - Time Limit Exceeded (Vượt quá giới hạn thời gian)

Chương trình chạy quá lâu, vượt quá thời gian cho phép.

**Cách khắc phục:**
- Tối ưu thuật toán (giảm độ phức tạp)
- Loại bỏ các vòng lặp không cần thiết
- Sử dụng cấu trúc dữ liệu hiệu quả hơn

## IE - Internal Error (Lỗi hệ thống)

Lỗi từ phía hệ thống chấm hoặc cấu hình bài tập không đúng. Nếu gặp lỗi này, vui lòng báo cho admin.
