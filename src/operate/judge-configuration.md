# Cấu hình judge

> Mỗi judge đọc một file YAML khi khởi động, truyền vào bằng tham số `-c`. Trang này giải thích các khóa trong file đó và cách áp dụng thay đổi.
>
> ⏱ ~10 phút · 👤 Người vận hành · 🔑 SSH vào máy chủ (sửa `dmoj/problems/`) + quyền chạy `docker` trên máy chấm

Cách chạy judge xem tại [Cài đặt judge](/operate/judge-setup). *YAML* là định dạng file cấu hình dạng `khóa: giá trị`; *glob* là mẫu đường dẫn có ký tự đại diện như `*`. Thuật ngữ khác xem ở [Thuật ngữ](/start/glossary).

## Trước khi bắt đầu

- [ ] Đã có ít nhất một judge đăng ký trên website và chạy được theo [Cài đặt judge](/operate/judge-setup).
- [ ] Biết tên container judge (ví dụ `judge_judge1`) và tên file cấu hình của nó.
- [ ] Có SSH vào máy chủ để sửa file trong `lcoj-docker/dmoj/problems/`.

## File cấu hình nằm ở đâu

Trong LCOJ, file cấu hình được đặt ngay trong thư mục bài dùng chung `dmoj/problems` trên máy chủ, đặt tên theo mẫu `judge_<tên>.yml`. Thư mục này được mount vào container judge tại `/problems`, nên judge đọc file qua đường dẫn trong container:

| Trên máy chủ | Trong container judge | Tham số khi chạy |
|---|---|---|
| `lcoj-docker/dmoj/problems/judge_judge1.yml` | `/problems/judge_judge1.yml` | `-c /problems/judge_judge1.yml` |
| `lcoj-docker/dmoj/problems/<mã bài>/init.yml` | `/problems/<mã bài>/init.yml` | (judge tự tìm qua `problem_storage_globs`) |

## File cấu hình mẫu

Cấu hình tối thiểu cho một judge chạy bằng image `vnoj/judge-tier3`:

```yaml
# Tên judge, trùng với tên đã tạo trong trang quản trị (/admin/judge/judge/)
id: "judge1"

# Khóa xác thực, trùng với "Authentication key" của judge đó trên website
key: "<key>"

# Nơi tìm bài: mọi thư mục khớp một glob dưới đây và có file init.yml là một bài
problem_storage_globs:
  - /problems/*
```

Ba khóa này là đủ cho hầu hết trường hợp. Ngôn ngữ lập trình đã được image Docker tự dò sẵn (xem [Runtime](#runtime-ngon-ngu-lap-trinh)).

::: warning Không đưa khóa thật lên Git
File `judge_*.yml` chứa khóa xác thực. Đừng commit file này, đừng dán nội dung thật của nó vào issue hay tài liệu.
:::

## Giải thích từng khóa

### `id`: tên judge

```yaml
id: "judge1"
```

Phải trùng **chính xác** (phân biệt hoa thường) với trường **Name** của judge trên website. Nếu truyền tên trên dòng lệnh (`... localhost judge1 "<key>"`) hoặc qua biến môi trường `DMOJ_JUDGE_NAME`, giá trị đó sẽ ghi đè `id` trong file.

### `key`: khóa xác thực

```yaml
key: "<key>"
```

Phải trùng với trường **Authentication key** trên website. Nên để trong ngoặc kép, vì khóa có thể chứa `+`, `/`, `=`. Tương tự `id`, khóa truyền trên dòng lệnh hoặc qua biến môi trường `DMOJ_JUDGE_KEY` sẽ ghi đè giá trị trong file.

### `problem_storage_globs`: thư mục bài

```yaml
problem_storage_globs:
  - /problems/*
```

Danh sách các mẫu glob. Judge tìm file `init.yml` trong mọi thư mục khớp mẫu; thư mục nào có `init.yml` là một bài, và **tên thư mục chính là mã bài**. Khóa này **bắt buộc**: nếu thiếu, judge thoát với thông báo `no problems available to grade`.

| Mẫu | Khớp | Không khớp |
|---|---|---|
| `/problems/*` | `/problems/aplusb`, `/problems/hello` | `/problems/archive/aplusb` |
| `/problems/archive/**` | `/problems/archive/aplusb`, `/problems/archive/2024/hello` (mọi cấp con) | `/problems/aplusb` |
| `/problems/year20[0-9][0-9]/*` | `/problems/year2024/aplusb` | `/problems/year24/aplusb` |

::: tip Dùng `/problems/*` với LCOJ
Website lưu dữ liệu bài ở `/problems/<mã bài>/` (`DMOJ_PROBLEM_DATA_ROOT = '/problems/'`), nên `/problems/*` khớp đúng mọi bài tải lên từ website. Judge theo dõi thư mục này, nên bài mới hoặc test mới được nhận mà không cần khởi động lại judge.
:::

### `runtime`: ngôn ngữ lập trình {#runtime-ngon-ngu-lap-trinh}

Khóa `runtime` ánh xạ tên chương trình tới đường dẫn của nó, ví dụ:

```yaml
runtime:
  gcc: /usr/bin/gcc
  g++: /usr/bin/g++
  python3: /usr/bin/python3
```

**Với image Docker, bạn không cần khóa này.** Lúc build, image chạy `dmoj-autoconf` và lưu kết quả vào `/judge-runtime-paths.yml`. Khi judge khởi động trong Docker, file đó được nạp trước, rồi mới đến file cấu hình của bạn.

::: danger Khai báo `runtime` sẽ thay thế toàn bộ runtime tự dò
File cấu hình được gộp theo **khóa cấp cao nhất**. Nếu bạn viết một khối `runtime:` trong `judge_*.yml`, khối đó **thay thế hoàn toàn** danh sách runtime mà image đã dò, chứ không bổ sung vào. Judge sẽ chỉ còn những ngôn ngữ bạn liệt kê. Nếu chỉ muốn bớt ngôn ngữ, hãy dùng tham số `-e`/`-x` (xem [bên dưới](#chon-ngon-ngu-khi-chay)).
:::

Nếu cài judge trực tiếp (không dùng Docker), chạy `dmoj-autoconf` để in ra khối `runtime` phù hợp với máy, rồi chép vào file cấu hình.

### Các khóa tùy chọn khác

Các khóa sau đều có giá trị mặc định. Chỉ thêm vào khi thật sự cần.

| Khóa | Mặc định | Ý nghĩa |
|---|---|---|
| `compiler_time_limit` | `10` | Giây tối đa cho một lần biên dịch |
| `compiler_output_character_limit` | `65536` | Số ký tự tối đa của thông báo biên dịch |
| `compiled_binary_cache_dir` | (thư mục tạm) | Nơi lưu các file thực thi đã biên dịch để dùng lại |
| `compiled_binary_cache_size` | `100` | Số file biên dịch giữ trong bộ đệm |
| `test_size_limit` | `262144` | Kích thước tối đa của một test (KB, tức 256 MB) |
| `tempdir` | (mặc định hệ thống, ví dụ `/tmp`) | Thư mục tạm để lưu bài nộp khi chấm |
| `submission_cpu_affinity` | (không đặt) | Danh sách nhân CPU (đánh số từ 0) để chạy bài nộp, ví dụ `[2, 3]` |
| `generator_time_limit`, `generator_memory_limit` | `20`, `524288` | Giới hạn thời gian (giây) và bộ nhớ (KB) cho generator |
| `validator_time_limit`, `validator_memory_limit` | `20`, `524288` | Giới hạn thời gian (giây) và bộ nhớ (KB) cho validator |
| `selftest_time_limit`, `selftest_memory_limit` | `10`, `131072` | Giới hạn cho bước tự kiểm tra ngôn ngữ lúc khởi động |

## Chọn ngôn ngữ khi chạy {#chon-ngon-ngu-khi-chay}

Thay vì sửa `runtime`, bạn có thể giới hạn ngôn ngữ bằng tham số dòng lệnh của `dmoj`. Tên ngôn ngữ là mã executor, ví dụ `CPP17`, `PY3`, `PAS`:

| Tham số | Ý nghĩa |
|---|---|
| `-e CPP17,PY3` | Chỉ nạp các ngôn ngữ được liệt kê |
| `-x JAVA8,PYPY` | Nạp mọi ngôn ngữ trừ các ngôn ngữ được liệt kê |
| `--skip-self-test` | Bỏ qua bước tự kiểm tra ngôn ngữ (khởi động nhanh hơn, nhưng ngôn ngữ lỗi sẽ không bị loại) |

Hai tham số `-e` và `-x` không dùng chung được. Ví dụ, chạy một judge chỉ chấm C++17 và Python 3:

```sh
docker run ... vnoj/judge-tier3 \
    run -p 9999 -c /problems/judge_judge1.yml -a 12345 -e CPP17,PY3 \
    localhost judge1 "<key>"
```

## Áp dụng thay đổi

1. Sửa file `dmoj/problems/judge_<tên>.yml` trên máy chủ.
2. Khởi động lại judge:

   ```sh
   docker restart judge_judge1
   ```

## Kiểm tra kết quả

Xem log để chắc không có lỗi và judge đã kết nối lại:

```sh
docker logs -f judge_judge1
```

Dòng `Judge "judge1" online: [localhost]:9999` nghĩa là judge đã sẵn sàng. Kiểm tra thêm danh sách judge và ngôn ngữ tại trang `/status/` của website.

## Sự cố thường gặp

| Triệu chứng | Cách xử lý |
|---|---|
| Judge thoát với `no problems available to grade` | Thêm khóa `problem_storage_globs` (ví dụ `/problems/*`) |
| Bridge báo `Judge authentication failure` | So `id` (phân biệt hoa thường) và `key` với bản ghi ở `/admin/judge/judge/`; nhớ tham số dòng lệnh và biến `DMOJ_JUDGE_NAME`/`DMOJ_JUDGE_KEY` sẽ ghi đè file |
| Sau khi sửa cấu hình, judge chỉ còn vài ngôn ngữ | Bạn đã thêm khối `runtime:`, khối này thay thế runtime tự dò. Xóa nó và dùng `-e`/`-x` để lọc ngôn ngữ |
| Judge không khởi động khi dùng cả `-e` và `-x` | Hai tham số này không dùng chung được, chỉ giữ một |
| Bài trong thư mục con không được nhận | Glob `/problems/*` chỉ khớp một cấp; dùng `**` cho mọi cấp con |
| Sửa file nhưng không có tác dụng | Chưa khởi động lại: `docker restart judge_judge1` |

Các sự cố kết nối khác xem [Cài đặt judge](/operate/judge-setup).

## Tiếp theo

- [Cài đặt judge](/operate/judge-setup): chạy thêm judge hoặc chạy judge ở máy khác.
- [Ngôn ngữ được hỗ trợ](/reference/languages): mã executor (`CPP17`, `PY3`…) dùng với `-e`/`-x`.
- [Vận hành LCOJ](/operate/operations): xem log `bridged` và các thao tác hằng ngày.

::: tip Cần hỗ trợ?
- Tạo issue tại [GitHub Issues](https://github.com/luyencode/lcoj-docker/issues)
- Tham khảo thêm tại [behitek.com](https://behitek.com)
- LCOJ hỗ trợ cài đặt miễn phí: [luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he)
:::
