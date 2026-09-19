# Câu hỏi thường gặp

Các câu hỏi hay gặp nhất, chia theo vai trò. Mỗi câu trả lời ngắn gọn kèm liên kết tới trang hướng dẫn chi tiết. Nghĩa của thuật ngữ xem ở [Thuật ngữ](/start/glossary).

## Học sinh, người luyện tập

::: details Vì sao bị Kết quả sai (WA) dù output trông giống hệt đáp án?
Nguyên nhân thường gặp nhất là in thêm chữ như `Nhap n:` hay `Ket qua la:`. Checker mặc định bỏ qua dấu cách thừa nhưng không bỏ qua chữ thừa, và cách xuống dòng giữa các số phải khớp. Ngoài ra hãy kiểm tra tràn số (`int` chỉ chứa tới khoảng 2·10⁹) và việc đọc/ghi file khi đề dùng bàn phím, màn hình. Xem [Sự cố thường gặp](/learn/submissions#su-co-thuong-gap).
:::

::: details LCOJ hỗ trợ ngôn ngữ nào, phiên bản trình biên dịch là gì?
Mở trang `/runtimes/` trên site để xem các ngôn ngữ đang có máy chấm hỗ trợ kèm phiên bản thật. Khi nộp bài, ô chọn ngôn ngữ cũng hiện phiên bản. Với C++ nên chọn C++17 hoặc C++20; với Python, bài nặng hãy thử PyPy 3. Xem [Ngôn ngữ được hỗ trợ](/reference/languages).
:::

::: details Tôi có xem được test của bài không?
Mặc định chỉ tác giả bài xem được test. Người ra đề có thể cho mọi người xem, hoặc cho xem khi bạn không đang trong kỳ thi; khi đó trang bài nộp hiện input, đáp án và output của bạn ở các test. Xem [Kết quả từng test](/learn/submissions#ket-qua-tung-test).
:::

::: details Nộp nhiều lần có bị trừ điểm không?
Khi luyện tập thì không: hệ thống chỉ ghi nhận điểm cao nhất của bạn cho mỗi bài. Trong kỳ thi, cách tính phạt tùy [định dạng kỳ thi](/organize/contest-formats), và có kỳ thi giới hạn số lần nộp mỗi bài.
:::

::: details Vì sao bài nộp cứ ở trạng thái "Đang chờ"?
Bài đang đợi một máy chấm rảnh có hỗ trợ ngôn ngữ và dữ liệu của bài. Mỗi người chỉ có tối đa 2 bài đang chờ hoặc đang chấm cùng lúc. Nếu chờ quá lâu, hãy báo cho quản trị viên. Xem [Nộp bài và chấm bài](/learn/submissions).
:::

::: details Xem code của người khác được không?
Mặc định bạn chỉ xem được code của người khác ở những bài bạn đã giải được. Người ra đề có thể đổi cài đặt này cho từng bài. Xem [Xem lời giải của người khác](/learn/submissions#xem-loi-giai-cua-nguoi-khac).
:::

::: details Rating được tính thế nào?
Rating chỉ thay đổi sau các kỳ thi được đánh dấu **tính rating**, khi kỳ thi đã kết thúc và ban quản trị chạy tính rating. LCOJ dùng thuật toán Elo-MMR (kế thừa từ DMOJ); lần tham gia ảo không được tính. Mốc màu bắt đầu từ Newbie (dưới 1200) tới Legendary Grandmaster (từ 2900). Xem [Tham gia kỳ thi](/learn/contests).
:::

::: details Tôi quên cách đăng nhập hoặc quên mật khẩu thì làm sao?
Trên luyencode.net, tài khoản được tạo qua Google, nên chỉ cần bấm đăng nhập bằng Google với đúng tài khoản Google đã dùng. Liên kết **Quên mật khẩu?** chỉ dành cho tài khoản có mật khẩu (ví dụ tài khoản giáo viên tạo hàng loạt cho lớp) và cần site gửi được email. luyencode.net hiện chưa cấu hình gửi email, nên hãy nhờ quản trị viên đặt lại mật khẩu trong trang quản trị ([Quản lý người dùng](/admin/users)). Xem [Tài khoản và đăng nhập](/learn/account).
:::

::: details Tôi mất điện thoại có ứng dụng xác thực 2 yếu tố?
Khi bật xác thực 2 yếu tố, bạn nhận được một danh sách mã dự phòng (scratch code) dài 16 ký tự, mỗi mã dùng một lần. Nhập một mã này vào ô mã 6 chữ số để đăng nhập, rồi tắt hoặc tạo lại xác thực 2 yếu tố. Nếu không còn mã dự phòng, chỉ quản trị viên có quyền phù hợp mới tắt được 2FA cho bạn. Xem [Tài khoản và đăng nhập](/learn/account).
:::

## Người ra đề, giáo viên

::: details Làm sao tạo một lớp học trên LCOJ?
Lớp học là một **tổ chức**. Tạo tổ chức tại `/organizations/create` cần quyền `judge.add_organization`, và mỗi người mặc định chỉ làm quản trị tối đa 3 tổ chức. Trên luyencode.net, nếu chưa có quyền, hãy liên hệ đội ngũ LCOJ. Xem [Tổ chức (nhóm, lớp học)](/organize/organizations).
:::

::: details Làm sao ra bài chỉ học sinh trong lớp mới thấy?
Tạo bài ngay trong tổ chức (trang tổ chức, mục tạo bài, cần quyền `judge.create_organization_problem`). Bài riêng của tổ chức chỉ thành viên tổ chức thấy. Kỳ thi và bài kiểm tra trắc nghiệm cũng có thể đặt riêng cho tổ chức. Xem [Tổ chức (nhóm, lớp học)](/organize/organizations).
:::

::: details Vì sao bài tôi vừa tạo không ai thấy?
Bài mới tạo ở chế độ riêng tư cho tới khi người có quyền bật công khai. Nhờ vậy bạn có thể chuẩn bị test, nộp thử trước khi mở cho mọi người. Xem [Quản lý bài tập](/setter/managing-problems).
:::

::: details Nhập bài có sẵn từ nơi khác được không?
Được, nếu bài có gói **Codeforces Polygon**: nhập tại `/problems/import-polygon` (cần quyền `judge.import_polygon_package`). Bộ nhập tạo đề, test và checker. Với bài khác, tạo bài trên site rồi tải test lên dưới dạng file zip. Xem [Quản lý bài tập](/setter/managing-problems).
:::

::: details Nhập câu hỏi trắc nghiệm hàng loạt được không?
Được. Mở `/quizzes/import/`, tải lên file Excel (`.xlsx`) hoặc JSON, xem trước rồi xác nhận. Chỉ cần một câu lỗi là không câu nào được nhập, nên hãy sửa hết lỗi trong phần xem trước. Xem [Tạo bài trắc nghiệm](/setter/quiz-authoring).
:::

## Người vận hành, tự cài đặt

::: details Cần máy chủ cấu hình thế nào?
Tối thiểu 2 nhân CPU, 4 GB RAM, 20 GB ổ đĩa trống, Linux 64-bit (Ubuntu 22.04 trở lên là dễ nhất); khuyến nghị 4 nhân, 8 GB RAM, 50 GB SSD. Mỗi máy chấm dùng thêm khoảng một nhân CPU khi chấm. Xem [Cài đặt với Docker](/operate/installation).
:::

::: details Máy chấm có nằm sẵn trong Docker Compose không?
Không. Docker Compose chỉ chạy website và `bridged`; máy chấm chạy riêng (thường bằng image `vnoj/judge-tier3`) và kết nối vào cổng 9999. Xem [Cài đặt judge](/operate/judge-setup).
:::

::: details Thêm máy chấm để chấm nhanh hơn thế nào?
Mỗi máy chấm chỉ chấm một bài nộp tại một thời điểm. Muốn thêm, đăng ký thêm một judge trên website với tên và khóa riêng, tạo file cấu hình riêng rồi chạy thêm một container. Số judge không nên vượt quá số nhân CPU trừ đi phần dành cho website. Xem [Chạy nhiều judge](/operate/judge-setup#chay-nhieu-judge).
:::

::: details Cần sao lưu những gì?
Bốn thứ: cơ sở dữ liệu (dump bằng `mariadb-dump`), thư mục `problems/` (test), thư mục `media/` (file tải lên) và các file cấu hình. Hãy chép bản sao lưu sang máy khác. Xem [Sao lưu](/operate/operations#backup).
:::

::: details Cập nhật LCOJ lên bản mới thế nào?
Sao lưu cơ sở dữ liệu trước, rồi cập nhật cả hai repo (lcoj-docker và submodule `dmoj/repo`), chạy migration và khởi động lại các service liên quan. Việc cụ thể tùy phần nào thay đổi. Xem [Cập nhật hệ thống](/operate/updating).
:::

::: details Có bắt buộc HTTPS không?
Để chạy thử trên máy cá nhân thì không, `http://localhost:8071/` là đủ. Khi mở cho người dùng thật thì nên có: nginx trong Docker chỉ phục vụ HTTP, nên bạn đặt một reverse proxy có TLS phía trước trên máy chủ, ví dụ Caddy hoặc nginx kèm certbot. Xem [HTTPS](/operate/installation#https).
:::

::: details Tôi có thể đổi tên và logo thành của trường mình không?
Được. Tên site nằm ở `SITE_NAME` và `SITE_LONG_NAME` trong `local_settings.py`; logo đổi bằng mục cấu hình `site_logo` trong trang quản trị. LCOJ theo giấy phép AGPL-3.0, nên nếu bạn sửa mã nguồn và cho người khác dùng qua mạng thì phải công khai mã nguồn đã sửa. Xem [Biến môi trường](/operate/environment), [Cấu hình giao diện và nội dung](/admin/site-config) và [Giấy phép](/about/license).
:::

## Hỗ trợ và liên hệ

::: details Đề bài hoặc test bị sai thì báo ở đâu?
Dùng chức năng báo lỗi (**Báo cáo vấn đề**) ngay trên trang bài để gửi cho người ra đề và quản trị viên. Báo lỗi hữu ích còn được cộng điểm đóng góp. Xem [Blog, bình luận và báo lỗi](/learn/community).
:::

::: details Phát hiện lỗi phần mềm LCOJ thì báo ở đâu?
Tạo issue tại [GitHub Issues của lcoj-docker](https://github.com/luyencode/lcoj-docker/issues). Lỗi liên quan tới máy chấm (một ngôn ngữ chạy sai, lỗi sandbox) báo tại [luyencode/judge-server](https://github.com/luyencode/judge-server/issues).
:::

::: details Tôi cần người giúp cài đặt?
LCOJ hỗ trợ cài đặt miễn phí. Liên hệ qua [behitek.com](https://behitek.com) hoặc [luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he).
:::
