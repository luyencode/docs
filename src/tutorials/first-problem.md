# Ra đề đầu tiên trong 15 phút

> Bạn sẽ tạo trọn vẹn bài "Tổng hai số" (A + B) trên LCOJ: viết đề, tải test, chọn checker, nộp thử rồi công khai bài.
>
> ⏱ ~15 phút · 👤 Người ra đề mới, giáo viên · 🔑 Quyền `judge.add_problem` (tạo bài); công khai bài cần quản trị viên hoặc quyền `judge.change_public_visibility`

## Bạn sẽ làm gì

- Tạo bài `aplusb` trên giao diện web với đề viết bằng Markdown và công thức toán.
- Chuẩn bị 5 test nhỏ, nén thành một file zip và tải lên trình sửa test.
- Chọn checker chuẩn và lưu để site tự sinh `init.yml`.
- Nộp hai lời giải đúng (C++ và Python) và một lời giải cố tình sai để thấy `WA`.
- Công khai bài cho mọi người cùng giải.

```mermaid
flowchart LR
  A[Tạo bài] --> B[Viết đề]
  B --> C[Chuẩn bị test + zip]
  C --> D[Tải test, chọn checker, Lưu]
  D --> E[Nộp thử: AC và WA]
  E --> F[Công khai bài]
```

## Trước khi bắt đầu

- [ ] Bạn đã đăng nhập luyencode.net và tài khoản có quyền `judge.add_problem`. Nếu mở `/problems/create` mà bị từ chối, hãy nhờ quản trị viên cấp quyền (xem [Phân quyền](/admin/permissions)).
- [ ] Máy bạn có công cụ nén zip (có sẵn trên Windows, macOS và hầu hết bản Linux).
- [ ] (Tuỳ chọn) Trình biên dịch C++ hoặc Python để chạy thử lời giải trên máy trước khi nộp.

## Bước 1: Tạo bài

Mục tiêu: có một bài tập riêng tư mang mã `aplusb`.

1. Mở `https://luyencode.net/problems/create` (hoặc vào **Danh sách bài** rồi bấm tab **Tạo bài mới**).
2. Điền các ô:

   | Ô | Giá trị |
   |---|---|
   | **Mã bài** | `aplusb` |
   | **Tên bài toán** | `Tổng hai số` |
   | **Giới hạn thời gian** | `1` (giây) |
   | **Giới hạn bộ nhớ** | giữ mặc định `262144` (KB = 256 MB) |
   | **Điểm** | `1` |
   | **Cho phép nhận điểm với từng test đúng** | giữ nguyên dấu tích (đã bật sẵn) |

3. Tạm để nguyên ô đề bài; bạn sẽ viết đề ở bước 2 ngay trên form này.

::: warning Quy tắc đặt mã bài
Mã bài chỉ gồm **chữ thường**, chữ số và dấu gạch dưới (`^[a-z0-9_]+$`), tối đa 32 ký tự, và là duy nhất trên toàn LCOJ. `APlusB`, `a-plus-b` hay `a+b` đều bị từ chối. Nếu `aplusb` đã có người dùng, hãy thêm hậu tố, ví dụ `aplusb_lop10a`, và dùng mã đó ở mọi bước sau.
:::

✅ **Kết quả:** form đã điền mã, tên và giới hạn; bạn chưa bấm **Tạo**.

## Bước 2: Viết đề bài

Mục tiêu: đề hiển thị rõ ràng, có công thức toán và ví dụ.

1. Kéo xuống ô **Bài toán** (nội dung đề). Ô này đã có sẵn một đề mẫu; xoá hết nội dung đó.
2. Dán đề dưới đây:

````markdown
Cho hai số nguyên ~a~ và ~b~. Hãy tính ~a + b~.

## Dữ liệu vào

Một dòng duy nhất chứa hai số nguyên ~a~ và ~b~ (~-10^9 \le a, b \le 10^9~).

## Kết quả

In ra một số nguyên duy nhất là giá trị ~a + b~.

## Ví dụ

### Dữ liệu vào

```
3 5
```

### Kết quả

```
8
```

### Giải thích

Ta có ~3 + 5 = 8~.
````

3. Dùng khung xem trước bên cạnh để kiểm tra công thức hiển thị đúng.
4. Bấm **Tạo** ở cuối trang.

::: tip Công thức toán dùng dấu `~`
Trên LCOJ, công thức cùng dòng viết `~a+b~`, công thức riêng dòng viết `$$...$$`. `$a+b$` sẽ hiện nguyên văn. Không cần ghi giới hạn thời gian và bộ nhớ trong đề; thanh bên của trang bài tự hiển thị.
:::

✅ **Kết quả:** bạn được chuyển tới `/problem/aplusb`. Thanh bên phải có **Sửa đề bài** và **Sửa đổi test**. Bài đang ở chế độ riêng tư: chỉ bạn (curator) và quản trị viên thấy.

## Bước 3: Chuẩn bị test

Mục tiêu: có file `aplusb.zip` chứa 5 cặp input/output đặt tên theo kiểu Themis (`N.inp` / `N.out`), để trình sửa test tự điền bảng.

Tạo 10 file sau trong một thư mục trống:

| Test | `N.inp` | `N.out` | Kiểm tra điều gì |
|---|---|---|---|
| 1 | `3 5` | `8` | Ví dụ trong đề |
| 2 | `-7 2` | `-5` | Số âm |
| 3 | `0 0` | `0` | Giá trị 0 |
| 4 | `1000000000 1000000000` | `2000000000` | Tổng vượt giới hạn `int` |
| 5 | `-1000000000 -1000000000` | `-2000000000` | Tổng âm lớn nhất |

Tạo nhanh bằng lệnh rồi nén:

::: code-group

```bash [Linux / macOS]
mkdir aplusb-tests && cd aplusb-tests
printf '3 5\n'                     > 1.inp; printf '8\n'           > 1.out
printf -- '-7 2\n'                 > 2.inp; printf -- '-5\n'       > 2.out
printf '0 0\n'                     > 3.inp; printf '0\n'           > 3.out
printf '1000000000 1000000000\n'   > 4.inp; printf '2000000000\n'  > 4.out
printf -- '-1000000000 -1000000000\n' > 5.inp; printf -- '-2000000000\n' > 5.out
zip ../aplusb.zip *.inp *.out
```

```powershell [Windows (PowerShell)]
mkdir aplusb-tests; cd aplusb-tests
"3 5"                     | Out-File -Encoding ascii 1.inp; "8"           | Out-File -Encoding ascii 1.out
"-7 2"                    | Out-File -Encoding ascii 2.inp; "-5"          | Out-File -Encoding ascii 2.out
"0 0"                     | Out-File -Encoding ascii 3.inp; "0"           | Out-File -Encoding ascii 3.out
"1000000000 1000000000"   | Out-File -Encoding ascii 4.inp; "2000000000"  | Out-File -Encoding ascii 4.out
"-1000000000 -1000000000" | Out-File -Encoding ascii 5.inp; "-2000000000" | Out-File -Encoding ascii 5.out
Compress-Archive -Path *.inp,*.out -DestinationPath ..\aplusb.zip
```

:::

::: tip Quy tắc đặt tên để bảng test tự điền
- Dùng **một** kiểu đặt tên cho cả file zip: ở đây là `1.inp` + `1.out`. Kiểu `aplusb.1.in` + `aplusb.1.out` cũng được, nhưng đừng trộn hai kiểu.
- Đặt file ở **gốc** file zip, không lồng thư mục.
- Input và output được sắp xếp tự nhiên (1, 2, …, 10) rồi ghép cặp theo thứ tự, nên số file `.inp` phải bằng số file `.out`.
:::

✅ **Kết quả:** bạn có file `aplusb.zip` chứa đúng 10 file.

## Bước 4: Tải test lên và chọn checker

Mục tiêu: lưu bộ test để site sinh `init.yml` cho judge.

1. Trên trang bài, bấm **Sửa đổi test** (URL `/problem/aplusb/test_data`).
2. Ở ô **Tập tin dữ liệu nén dạng zip**, chọn `aplusb.zip`.
   Nếu bạn chỉ có các file rời, bấm **or click here to build zip file** và chọn cả 10 file; trình duyệt sẽ nén giúp.
3. Bảng test tự điền 5 dòng **Test đơn**, mỗi dòng 1 điểm, và hiện thông báo vàng **Các test đã được điền tự động!**. Bảng **chưa được lưu**.
4. Kiểm tra cột **Tập tin đầu vào** / **Tập tin đầu ra**: dòng 1 là `1.inp` / `1.out`, …, dòng 5 là `5.inp` / `5.out`.
5. Ở danh sách **Trình chấm**, giữ **Mặc định** (`standard`): so từng token, bỏ qua khoảng trắng thừa. Đây là lựa chọn đúng cho bài in ra một số nguyên.
6. Bấm **Lưu**.

✅ **Kết quả:** trang tải lại không có thông báo lỗi, và liên kết **Xem YAML** xuất hiện cạnh tiêu đề. Bấm vào sẽ thấy:

```yaml
archive: aplusb.zip
checker: standard
test_cases:
- in: 1.inp
  out: 1.out
  points: 1
- in: 2.inp
  out: 2.out
  points: 1
- in: 3.inp
  out: 3.out
  points: 1
- in: 4.inp
  out: 4.out
  points: 1
- in: 5.inp
  out: 5.out
  points: 1
```

(Tên file zip ở dòng `archive` có thể khác một chút tùy cách site lưu file; phần `test_cases` phải giống như trên.)

## Bước 5: Nộp thử

Mục tiêu: chắc chắn lời giải đúng được `AC` và bộ test bắt được lời giải sai.

1. Trên trang bài, bấm **Gửi bài giải**.
2. Chọn ngôn ngữ, dán mã, bấm **Nộp bài!**. Làm lần lượt với ba lời giải dưới đây (mỗi lần chờ bài trước chấm xong; mặc định mỗi người chỉ có tối đa 2 bài đang chờ chấm).

::: code-group

```cpp [Đúng: C++ (CPP17)]
#include <bits/stdc++.h>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << a + b << '\n';
    return 0;
}
```

```python [Đúng: Python 3 (PY3)]
a, b = map(int, input().split())
print(a + b)
```

```cpp [Cố tình sai: dùng int]
#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b;          // sai: a + b có thể vượt 2^31 - 1
    cin >> a >> b;
    cout << a + b << '\n';
    return 0;
}
```

:::

✅ **Kết quả:**

| Lời giải | Bạn sẽ thấy |
|---|---|
| C++ dùng `long long` | 5 test đều **Kết quả đúng (AC)**, điểm `5/5` |
| Python 3 | 5 test đều **Kết quả đúng (AC)**, điểm `5/5` |
| C++ dùng `int` | Test 4 **Kết quả sai (WA)** do tràn số (in ra số âm), các test khác AC; điểm `4/5`, tức 0.8 trên 1 điểm của bài vì bài cho điểm thành phần |

Nếu lời giải sai vẫn `AC` ở mọi test, bộ test chưa đủ mạnh; hãy thêm test biên. Cách đọc trang kết quả: xem [Nộp bài và chấm bài](/learn/submissions).

## Bước 6: Công khai bài

Mục tiêu: mọi người thấy bài trong danh sách và nộp được.

Bài tạo trên site luôn bắt đầu ở chế độ riêng tư, và form sửa đề trên site không có ô công khai. Việc công khai làm trong trang quản trị, bởi quản trị viên hoặc người có quyền `judge.change_public_visibility` (tài khoản cần là staff):

1. Mở `/admin/judge/problem/` và tìm `aplusb`.
2. Cách A: mở bài, tích **Hiển thị công khai** rồi bấm **Lưu lại**.
   Cách B: tích ô đầu dòng của bài trong danh sách, chọn hành động **Công bố bài và đặt ngày công bố là bây giờ**, rồi chạy hành động.

::: info Không có quyền công khai?
Hãy gửi mã bài (`aplusb`) cho quản trị viên LCOJ và nhờ họ công khai. Nếu bạn định dùng bài trong một kỳ thi, **đừng** công khai trước: bài công khai thì ai cũng xem được đề mà không cần vào kỳ thi. Xem [Tổ chức kỳ thi đầu tiên](/tutorials/first-contest).
:::

✅ **Kết quả:** đăng xuất (hoặc mở cửa sổ ẩn danh) và mở `https://luyencode.net/problem/aplusb`: đề hiển thị bình thường.

## Kiểm tra kết quả

- [ ] `/problem/aplusb` hiển thị đề với công thức toán đã được render (không còn dấu `~` quanh `a + b`).
- [ ] **Xem YAML** liệt kê 5 test, `checker: standard`.
- [ ] Có ít nhất một bài nộp C++ và một bài nộp Python đạt `AC` 5/5.
- [ ] Bài nộp dùng `int` bị `WA` ở test 4.
- [ ] Khách (chưa đăng nhập) mở được trang bài sau khi công khai.

## Sự cố thường gặp

| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Form báo mã bài không hợp lệ | Mã có chữ hoa, dấu `-`, dấu cách, hoặc đã tồn tại | Dùng chữ thường, số, `_`; thêm hậu tố nếu trùng |
| Hộp thoại "Files are not in the same format!" khi chọn zip | Trộn kiểu tên, ví dụ `1.inp` với `aplusb.2.in` | Đổi tất cả về một kiểu rồi nén lại |
| Hộp thoại "Số lượng file input (…) không khớp với số lượng file output (…)!" | Thiếu một file `.out` hoặc thừa file lạ | Kiểm tra lại thư mục, đảm bảo mỗi `N.inp` có `N.out` |
| Hộp thoại "No input/output files. Make sure your files are following themis/polygon/cms test format" | Tên file không có đuôi được nhận (`.inp`, `.in`, `.out`, `.ok`, `.ans`) | Đổi tên file theo bảng ở [Quản lý bài tập](/setter/managing-problems) |
| Lưu xong vẫn không thấy **Xem YAML**, đầu trang có lỗi | Dòng test thiếu file hoặc điểm | Đọc thông báo lỗi, sửa dòng tương ứng rồi **Lưu** lại |
| Bài nộp chờ mãi ở trạng thái đang chờ | Chưa có judge nào nhận bài hoặc ngôn ngữ | Báo quản trị viên; xem [Cài đặt judge](/operate/judge-setup) |
| Bài nộp bị `IE` | Judge không đọc được dữ liệu bài | Kiểm tra **Xem YAML** tồn tại; báo quản trị viên nếu vẫn lỗi |
| Lời giải đúng bị `WA` | Output chuẩn sai, hoặc file `.out` có ký tự lạ (BOM) | Mở lại file `.out`, lưu bằng mã hoá ASCII/UTF-8 không BOM |
| Không thấy ô công khai trên form sửa đề | Form trên site không có ô này (trừ bài của tổ chức) | Công khai trong admin như Bước 6 |

## Tiếp theo

- [Quản lý bài tập](/setter/managing-problems): mọi trường của bài, subtask (batch), chấm lại.
- [Cấu trúc bài tập](/setter/problem-format): viết `init.yml` bằng tay.
- [Checker](/setter/checkers): số thực, nhiều đáp án, checker tự viết.
- [Grader](/setter/graders) và [Generator](/setter/generators): bài tương tác, sinh test bằng chương trình.
- [Ví dụ bài tập](/setter/examples): các bài mẫu hoàn chỉnh.
- [Tổ chức kỳ thi đầu tiên](/tutorials/first-contest): đưa bài vào một kỳ thi.
