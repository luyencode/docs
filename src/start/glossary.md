# Thuật ngữ

Trang này giải thích ngắn gọn các thuật ngữ dùng trong LCOJ và trong bộ tài liệu này. Cột đầu ghi tên tiếng Việt (đúng như trên giao diện luyencode.net khi có) kèm tên tiếng Anh, vì nhiều trang quản trị và file cấu hình vẫn dùng tiếng Anh. Bấm vào liên kết ở cột cuối để đọc chi tiết.

::: tip Tìm nhanh
Nhấn `Ctrl+F` (hoặc `Cmd+F` trên macOS) để tìm một thuật ngữ trong trang.
:::

## Bảng thuật ngữ

| Thuật ngữ | Nghĩa | Đọc thêm |
|---|---|---|
| **API token** — API token | Chuỗi bí mật cá nhân để chương trình của bạn gọi API của LCOJ thay cho việc đăng nhập bằng trình duyệt. | [API](/reference/api#personal-api-token) |
| **Bài kiểm tra** (trắc nghiệm) — Quiz | Bài gồm các câu hỏi trắc nghiệm, đúng/sai, nhiều đáp án hoặc trả lời ngắn. Website chấm ngay khi nộp, không cần máy chấm. | [Làm bài trắc nghiệm](/learn/quiz) |
| **Bài nộp** — Submission | Một lần gửi mã nguồn cho một bài tập. Mỗi bài nộp có trạng thái xử lý, kết quả, thời gian chạy, bộ nhớ và điểm. | [Nộp bài và chấm bài](/learn/submissions) |
| **Bài tập** (Bài) — Problem | Một đề lập trình kèm bộ test, giới hạn thời gian, bộ nhớ và cách chấm. Mỗi bài có một mã ngắn dùng trong URL, ví dụ `/problem/aplusb`. | [Quản lý bài tập](/setter/managing-problems) |
| **Bảng xếp hạng** — Ranking, scoreboard | Bảng thứ hạng thí sinh trong một kỳ thi, cập nhật trực tiếp khi có kết quả chấm. Cách tính thứ hạng phụ thuộc định dạng kỳ thi. | [Tham gia kỳ thi](/learn/contests) |
| **Bridge** (`bridged`) — Bridge | Dịch vụ trung gian giữa website và các máy chấm: nhận yêu cầu chấm từ website, giao cho máy chấm rảnh, ghi kết quả vào cơ sở dữ liệu. | [Kiến trúc hệ thống](/operate/architecture) |
| **Chấm điểm từng phần** — Partial points | Chế độ của bài tập: được điểm theo tỉ lệ số test đúng. Bài không bật chế độ này chỉ được điểm khi đúng mọi test. | [Quản lý bài tập](/setter/managing-problems#cach-tinh-diem) |
| **Đề bài** — Statement | Phần mô tả bài tập: yêu cầu, dữ liệu vào, kết quả, ví dụ. Viết bằng Markdown, hỗ trợ công thức toán. | [Quản lý bài tập](/setter/managing-problems) |
| **Điểm** — Points | Số điểm của một bài tập hoặc một test. Điểm bài nộp được tính từ điểm các test đã qua. | [Quản lý bài tập](/setter/managing-problems#cach-tinh-diem) |
| **Điểm đóng góp** (Đóng góp) — Contribution points | Điểm thể hiện mức đóng góp cho cộng đồng: tăng khi bình luận, bài blog được bình chọn hoặc khi báo lỗi hữu ích, giảm khi mở lời giải của bài chưa giải được. | [Blog, bình luận và báo lỗi](/learn/community) |
| **Định dạng kỳ thi** — Contest format | Luật tính điểm và xếp hạng của kỳ thi: `default`, `ioi`, `ioi16`, `ecoo`, `atcoder`, `icpc`, `vnoj`. | [Các định dạng kỳ thi](/organize/contest-formats) |
| **Đóng băng bảng xếp hạng** — Scoreboard freeze | Trong những phút cuối kỳ thi, thí sinh chỉ thấy kết quả của các lần nộp trước thời điểm đóng băng. Chỉ định dạng `icpc` và `vnoj` hỗ trợ. | [Các định dạng kỳ thi](/organize/contest-formats#dong-bang-bang-xep-hang) |
| **File env** — Env file | Các file `environment/*.env` (`site.env`, `mysql.env`, `mysql-admin.env`) chứa cấu hình và mật khẩu cho các service Docker. | [Biến môi trường](/operate/environment) |
| **Giám sát liêm chính** — Integrity monitoring | Tùy chọn của bài kiểm tra: ghi lại khi học sinh chuyển tab, rời cửa sổ, sao chép... để giáo viên xem. Không trừ điểm. | [Làm bài trắc nghiệm](/learn/quiz) |
| **Grader** — Grader | Thành phần quyết định cách chạy và chấm bài nộp: chấm chuẩn, tương tác, theo chữ ký hàm, chỉ nộp output... | [Grader](/setter/graders) |
| **init.yml** — init.yml | File cấu hình của một bài trong thư mục dữ liệu: danh sách test, điểm, checker, grader. Trình sửa test trên web tự sinh file này. | [Cấu trúc bài tập](/setter/problem-format) |
| **Interactor** — Interactor | Chương trình của người ra đề "trò chuyện" với bài nộp qua stdin/stdout trong bài tương tác, rồi quyết định đúng sai. | [Grader](/setter/graders) |
| **Kết quả chấm** (mã trạng thái) — Verdict, status code | Mã ngắn cho biết bài đúng hay sai và sai kiểu gì, ví dụ `AC`, `WA`, `TLE`. Xem bảng [Mã kết quả](#ma-ket-qua) bên dưới. | [Mã trạng thái](/reference/status-codes) |
| **Kỳ thi** — Contest | Một nhóm bài tập làm trong khoảng thời gian xác định, có bảng xếp hạng. Có thể công khai hoặc riêng cho một tổ chức. | [Tham gia kỳ thi](/learn/contests) |
| **local_settings.py** — local_settings.py | File cấu hình Django của bản cài (tên site, ngôn ngữ, múi giờ...). Biến môi trường ghi đè giá trị trong file này. | [Biến môi trường](/operate/environment) |
| **Lời giải** — Editorial | Bài hướng dẫn giải của một bài tập. Nếu chưa giải được bài, mở lời giải sẽ bị trừ điểm đóng góp. | [Blog, bình luận và báo lỗi](/learn/community) |
| **Lượt làm bài** (lần làm bài) — Attempt | Một lần bấm bắt đầu làm bài kiểm tra. Mỗi lượt được chấm riêng; điểm cao nhất được dùng để xếp hạng. | [Làm bài trắc nghiệm](/learn/quiz) |
| **Máy chấm** — Judge | Máy (thường là một container Docker) biên dịch và chạy bài nộp trong sandbox trên test của bài, rồi gửi kết quả về bridge. Cài riêng, không nằm trong Docker Compose của site. | [Cài đặt judge](/operate/judge-setup) |
| **Ngân hàng câu hỏi** — Question bank | Kho câu hỏi trắc nghiệm dùng chung. Một câu hỏi có thể được dùng lại trong nhiều bài kiểm tra. | [Tạo bài trắc nghiệm](/setter/quiz-authoring) |
| **Nhóm test** (batch) — Batch | Nhiều test gộp lại thành một nhóm; chỉ được điểm của nhóm khi đúng mọi test trong nhóm. | [Cấu trúc bài tập](/setter/problem-format) |
| **OAuth** — OAuth | Cách đăng nhập bằng tài khoản bên ngoài. luyencode.net chỉ cho đăng ký qua Google (`OAUTH_ONLY = True`). | [Tài khoản và đăng nhập](/learn/account) |
| **Pretest** — Pretest | Một phần nhỏ của bộ test. Ở kỳ thi bật "chỉ chấm pretest", bài chỉ được chấm trên pretest trong lúc thi; kết quả cuối cùng dựa trên bộ test đầy đủ, chấm sau kỳ thi. | [Cấu trúc bài tập](/setter/problem-format) |
| **Quyền, nhóm** — Permission, group | Quyền cho phép một hành động cụ thể (ví dụ `judge.edit_own_problem`). Nhóm là một tập quyền có tên để gán cho nhiều người. | [Hệ thống phân quyền](/admin/permissions) |
| **Rating** — Rating | Chỉ số năng lực tính sau mỗi kỳ thi có tính rating, theo thuật toán Elo-MMR. Lần tham gia ảo không được tính. | [Tham gia kỳ thi](/learn/contests) |
| **Runtime** (executor) — Runtime, executor | Trình biên dịch hoặc thông dịch của một ngôn ngữ trên máy chấm. Trang `/runtimes/` liệt kê runtime đang dùng được. | [Ngôn ngữ được hỗ trợ](/reference/languages) |
| **Service Docker Compose** — Docker Compose service | Mỗi thành phần chạy trong một container riêng: `nginx`, `site`, `celery`, `bridged`, `wsevent`, `db`, `redis`. | [Kiến trúc hệ thống](/operate/architecture) |
| **Staff, superuser** — Staff, superuser | Staff được vào trang quản trị `/admin/` nhưng chỉ làm được những gì đã được cấp quyền. Superuser có mọi quyền. | [Hệ thống phân quyền](/admin/permissions) |
| **Submodule** — Submodule | Repo Git lồng trong repo khác. Mã nguồn website (lcoj-site) là submodule `dmoj/repo` của lcoj-docker. | [Cập nhật hệ thống](/operate/updating) |
| **Test, bộ test** — Test case, test data | Mỗi test gồm một file input và một file đáp án. Bộ test (test data) là toàn bộ test của bài, thường được tải lên dưới dạng file zip. | [Cấu trúc bài tập](/setter/problem-format) |
| **Tham gia ảo** — Virtual participation | Làm lại một kỳ thi đã kết thúc với đồng hồ riêng, như đang thi thật. Kết quả không ảnh hưởng rating. | [Tham gia kỳ thi](/learn/contests) |
| **Thư viện đề thi** — Exam library | Nơi lưu đề thi chính thức dạng PDF (`/library/`), đọc bằng trình xem lật trang. | [Thư viện đề thi](/learn/exam-library) |
| **Tổ chức** — Organization | Nhóm người dùng như lớp học, trường, câu lạc bộ. Có thể có bài tập, kỳ thi, bài kiểm tra chỉ thành viên mới thấy. | [Tổ chức (nhóm, lớp học)](/organize/organizations) |
| **Trình chấm** (checker) — Checker | Chương trình so sánh output của bài nộp với đáp án. Mặc định là `standard`; người ra đề có thể viết checker riêng. | [Checker](/setter/checkers) |
| **Trình sinh test** (generator) — Generator | Chương trình sinh test ngay trên máy chấm thay vì tải file test lên. | [Generator](/setter/generators) |
| **Vấn đề** (báo lỗi) — Ticket | Báo cáo lỗi gửi cho người ra đề hoặc quản trị viên, ví dụ đề sai hoặc test sai. Báo lỗi hữu ích được cộng điểm đóng góp. | [Blog, bình luận và báo lỗi](/learn/community) |
| **Xác thực 2 yếu tố** — Two-factor authentication (2FA) | Lớp bảo vệ thêm khi đăng nhập: ngoài mật khẩu còn cần mã 6 chữ số từ ứng dụng xác thực, hoặc khóa bảo mật (WebAuthn). | [Tài khoản và đăng nhập](/learn/account) |

## Mã kết quả {#ma-ket-qua}

Các mã kết quả thường gặp nhất. Danh sách đầy đủ và cách khắc phục có tại [Mã trạng thái](/reference/status-codes).

| Mã | Giao diện tiếng Việt | Tiếng Anh | Nghĩa |
|---|---|---|---|
| `AC` | Kết quả đúng (AC) | Accepted | Đúng |
| `WA` | Kết quả sai (WA) | Wrong Answer | Output sai |
| `TLE` | Quá thời gian (TLE) | Time Limit Exceeded | Chạy quá giới hạn thời gian |
| `MLE` | Tràn bộ nhớ (MLE) | Memory Limit Exceeded | Dùng quá giới hạn bộ nhớ |
| `OLE` | Kết xuất dữ liệu ra quá nhiều (OLE) | Output Limit Exceeded | In ra quá nhiều |
| `RTE` | Lỗi Runtime (RE) | Runtime Error | Chương trình bị hệ điều hành dừng, ví dụ truy cập bộ nhớ sai |
| `IR` | Lỗi khi chạy chương trình (IR) | Invalid Return | Chương trình thoát với mã lỗi khác 0 |
| `CE` | Lỗi dịch (CE) | Compile Error | Không biên dịch được |
| `IE` | Lỗi nội bộ (máy chủ chấm bài lỗi) | Internal Error | Lỗi phía hệ thống, không phải lỗi của bạn |
