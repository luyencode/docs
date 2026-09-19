# Glossary

This page briefly explains the terms used in LCOJ and throughout these docs. The first column gives the English term followed by the Vietnamese label used on luyencode.net's interface (the site's default language is Vietnamese), so you can match the docs to what you see on screen. Follow the link in the last column for details.

::: tip Quick search
Press `Ctrl+F` (or `Cmd+F` on macOS) to find a term on this page.
:::

## Terms

| Term | Meaning | Read more |
|---|---|---|
| **API token** — API token | A personal secret that lets your own scripts call the LCOJ API instead of signing in through a browser. | [API](/en/reference/api#personal-api-token) |
| **Attempt** — Lượt làm bài (lần làm bài) | One run through a quiz, starting when you click start. Each attempt is graded separately; your best score counts for the ranking. | [Taking a quiz](/en/learn/quiz) |
| **Batch** — Nhóm test | Several test cases grouped together; you only get the batch's points if every test in it passes. | [Problem format](/en/setter/problem-format) |
| **Bridge** (`bridged`) — Bridge | The service between the website and the judges: it takes grading requests from the site, hands them to a free judge, and writes results to the database. | [Architecture](/en/operate/architecture) |
| **Checker** — Trình chấm | The program that compares a submission's output with the expected answer. The default is `standard`; setters can write their own. | [Checkers](/en/setter/checkers) |
| **Contest** — Kỳ thi | A set of problems solved within a fixed time window, with a scoreboard. It can be public or private to an organization. | [Taking part in contests](/en/learn/contests) |
| **Contest format** — Định dạng kỳ thi | The scoring and ranking rules of a contest: `default`, `ioi`, `ioi16`, `ecoo`, `atcoder`, `icpc`, `vnoj`. | [Contest formats](/en/organize/contest-formats) |
| **Contribution points** — Điểm đóng góp (Đóng góp) | A measure of community contribution: goes up when your comments and blog posts are upvoted or your tickets prove useful, and down when you open the editorial of a problem you haven't solved. | [Blog, comments and tickets](/en/learn/community) |
| **Docker Compose service** — Service Docker Compose | Each component runs in its own container: `nginx`, `site`, `celery`, `bridged`, `wsevent`, `db`, `redis`. | [Architecture](/en/operate/architecture) |
| **Editorial** — Lời giải | A write-up explaining how to solve a problem. If you haven't solved the problem yet, opening the editorial costs contribution points. | [Blog, comments and tickets](/en/learn/community) |
| **Env file** — File env | The `environment/*.env` files (`site.env`, `mysql.env`, `mysql-admin.env`) holding configuration and passwords for the Docker services. | [Environment variables](/en/operate/environment) |
| **Exam library** — Thư viện đề thi | The collection of official exam papers as PDFs (`/library/`), read in a page-turning viewer. | [Exam library](/en/learn/exam-library) |
| **Generator** — Trình sinh test | A program that produces test cases on the judge instead of uploading test files. | [Generators](/en/setter/generators) |
| **Grader** — Grader | The component that decides how a submission is run and graded: standard, interactive, function signature, output-only, and so on. | [Graders](/en/setter/graders) |
| **init.yml** — init.yml | The per-problem config file in the problem data folder: test list, points, checker, grader. The web test-data editor generates it for you. | [Problem format](/en/setter/problem-format) |
| **Integrity monitoring** — Giám sát liêm chính | A quiz option that records tab switches, window blur, copy attempts and similar events for the teacher to review. It never deducts points. | [Taking a quiz](/en/learn/quiz) |
| **Interactor** — Interactor | The setter's program that "talks" to a submission over stdin/stdout in an interactive problem and decides whether it's correct. | [Graders](/en/setter/graders) |
| **Judge** — Máy chấm | A machine (usually a Docker container) that compiles and runs submissions in a sandbox against the problem's tests and reports back to the bridge. It's installed separately from the site's Docker Compose stack. | [Setting up judges](/en/operate/judge-setup) |
| **local_settings.py** — local_settings.py | The Django config file for an installation (site name, language, time zone...). Environment variables override the values in it. | [Environment variables](/en/operate/environment) |
| **OAuth** — OAuth | Signing in with an outside account. luyencode.net only allows sign-up through Google (`OAUTH_ONLY = True`). | [Account and sign-in](/en/learn/account) |
| **Organization** — Tổ chức | A group of users such as a class, school or club. It can have problems, contests and quizzes that only its members see. | [Organizations (groups, classes)](/en/organize/organizations) |
| **Partial points** — Chấm điểm từng phần | A problem setting: you earn points in proportion to the tests you pass. Without it, you only score when every test passes. | [Managing problems](/en/setter/managing-problems) |
| **Permission, group** — Quyền, nhóm | A permission allows one specific action (for example `judge.edit_own_problem`). A group is a named set of permissions assigned to many users at once. | [Permission system](/en/admin/permissions) |
| **Points** — Điểm | The score value of a problem or a test case. A submission's score is computed from the tests it passes. | [Managing problems](/en/setter/managing-problems) |
| **Pretest** — Pretest | A small subset of the tests. In a contest set to "run pretests only", submissions are judged on pretests during the contest; final results come from the full test set, judged after the contest. | [Problem format](/en/setter/problem-format) |
| **Problem** — Bài tập (Bài) | A programming task with test data, time and memory limits, and grading rules. Each problem has a short code used in its URL, such as `/problem/aplusb`. | [Managing problems](/en/setter/managing-problems) |
| **Question bank** — Ngân hàng câu hỏi | The shared pool of quiz questions. One question can be reused in many quizzes. | [Creating quizzes](/en/setter/quiz-authoring) |
| **Quiz** — Bài kiểm tra (trắc nghiệm) | A test made of single-choice, true/false, multiple-answer or short-answer questions. The website grades it on submit; no judge is involved. | [Taking a quiz](/en/learn/quiz) |
| **Ranking, scoreboard** — Bảng xếp hạng | The live standings of a contest, updated as results come in. How ranks are computed depends on the contest format. | [Taking part in contests](/en/learn/contests) |
| **Rating** — Rating | A skill rating recalculated after each rated contest using the Elo-MMR algorithm. Virtual participations don't count. | [Taking part in contests](/en/learn/contests) |
| **Runtime, executor** — Runtime | A language's compiler or interpreter on a judge. The `/runtimes/` page lists the runtimes currently available. | [Supported languages](/en/reference/languages) |
| **Scoreboard freeze** — Đóng băng bảng xếp hạng | During the last minutes of a contest, contestants only see results of submissions made before the freeze. Only the `icpc` and `vnoj` formats support it. | [Contest formats](/en/organize/contest-formats#scoreboard-freeze) |
| **Staff, superuser** — Staff, superuser | Staff can open the admin panel at `/admin/` but can only do what they've been granted. A superuser has every permission. | [Permission system](/en/admin/permissions) |
| **Statement** — Đề bài | The problem description: task, input, output, samples. Written in Markdown with math support. | [Managing problems](/en/setter/managing-problems) |
| **Submission** — Bài nộp | One time you send source code for a problem. Each submission has a status, a verdict, run time, memory and points. | [Submitting and judging](/en/learn/submissions) |
| **Submodule** — Submodule | A Git repository nested inside another. The website code (lcoj-site) is the `dmoj/repo` submodule of lcoj-docker. | [Updating](/en/operate/updating) |
| **Test case, test data** — Test, bộ test | A test case is one input file plus its expected answer. Test data is the full set of tests for a problem, usually uploaded as a zip file. | [Problem format](/en/setter/problem-format) |
| **Ticket** — Vấn đề (báo lỗi) | A report sent to the problem setters or admins, for example about a wrong statement or test. Useful tickets earn contribution points. | [Blog, comments and tickets](/en/learn/community) |
| **Two-factor authentication (2FA)** — Xác thực 2 yếu tố | An extra sign-in step: besides your password you enter a 6-digit code from an authenticator app, or use a security key (WebAuthn). | [Account and sign-in](/en/learn/account) |
| **Verdict, status code** — Kết quả chấm (mã trạng thái) | A short code saying whether a submission passed and, if not, how it failed, such as `AC`, `WA`, `TLE`. See [Verdict codes](#verdict-codes) below. | [Status codes](/en/reference/status-codes) |
| **Virtual participation** — Tham gia ảo | Re-taking a finished contest on your own clock, as if it were live. It doesn't affect your rating. | [Taking part in contests](/en/learn/contests) |

## Verdict codes {#verdict-codes}

The most common verdicts. The full list, with fixes, is in [Status codes](/en/reference/status-codes).

| Code | Vietnamese UI label | English name | Meaning |
|---|---|---|---|
| `AC` | Kết quả đúng (AC) | Accepted | Correct |
| `WA` | Kết quả sai (WA) | Wrong Answer | Wrong output |
| `TLE` | Quá thời gian (TLE) | Time Limit Exceeded | Ran past the time limit |
| `MLE` | Tràn bộ nhớ (MLE) | Memory Limit Exceeded | Used more memory than allowed |
| `OLE` | Kết xuất dữ liệu ra quá nhiều (OLE) | Output Limit Exceeded | Printed too much |
| `RTE` | Lỗi Runtime (RE) | Runtime Error | The OS killed the program, for example on an invalid memory access |
| `IR` | Lỗi khi chạy chương trình (IR) | Invalid Return | The program exited with a non-zero code |
| `CE` | Lỗi dịch (CE) | Compile Error | The code didn't compile |
| `IE` | Lỗi nội bộ (máy chủ chấm bài lỗi) | Internal Error | A system-side error, not your fault |
