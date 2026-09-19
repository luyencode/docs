# Cài đặt Judge

Hướng dẫn này giúp bạn cài đặt judge (hệ thống chấm bài) và kết nối với website. Hệ thống chỉ hỗ trợ Linux (bao gồm WSL), không hỗ trợ Windows.

**Yêu cầu:** Bạn cần đã cài đặt website và bridge đang chạy.

## Cấu hình trên Website

### Bước 1: Thêm judge mới

Truy cập trang quản trị tại `/admin/judge/` và thêm judge mới:
- Đặt tên cho judge
- Tạo mã xác thực (authentication key) - có thể dùng nút `Regenerate` để tự động tạo

### Bước 2: Kiểm tra địa chỉ kết nối

Trong file `local_settings.py`, tìm `BRIDGED_JUDGE_ADDRESS`. Đây là địa chỉ judge sẽ kết nối đến:
- Mặc định: `localhost:9999`
- Nếu judge chạy trên máy khác, đổi `localhost` thành địa chỉ IP thực
- **Quan trọng:** Đảm bảo port này đã được mở

### Bước 3: Kiểm tra bridge đang chạy

Chạy lệnh sau để kiểm tra:

```sh
supervisorctl status
```

Bạn sẽ thấy dòng tương tự:
```
bridged RUNNING pid <pid>, uptime <uptime>
```

## Cài đặt Judge

Chúng tôi khuyên dùng Docker để cài đặt judge vì đơn giản và dễ quản lý.

### Sử dụng Docker Image có sẵn

LCOJ sử dụng Docker image `tier3` với số lượng ngôn ngữ lập trình hỗ trợ nhiều nhất:
- Python 2/3
- C/C++ (GCC)
- Java 8
- Pascal
- Và một số ngôn ngữ khác

Xem danh sách đầy đủ tại [trang runtimes](https://luyencode.net/runtimes).

### Build từ mã nguồn

Nếu muốn tự build Docker image:

```sh
git clone --recursive https://github.com/luyencode/judge-server.git
cd judge/.docker
make judge-tier3
```

### Chạy Judge

#### Chuẩn bị

Tạo file cấu hình `judge.yml`:

```yaml
id: <tên judge>
key: <mã xác thực>
problem_storage_globs:
  - /problems/*
```

**Lưu ý:** 
- `id` phải trùng với tên judge đã tạo trên website
- `key` phải trùng với mã xác thực đã tạo trên website
- Thư mục `/problems` chứa dữ liệu bài tập

#### Khởi động judge

```sh
docker run \
    --name judge \
    --network="host" \
    -v /mnt/problems:/problems \
    --cap-add=SYS_PTRACE \
    -d \
    --restart=always \
    luyencode/judge-tier3:latest \
    run -p 9999 -c /problems/judge.yml localhost -A 0.0.0.0 -a 12345
```

**Giải thích các tham số:**
- `--name judge`: Tên container
- `-v /mnt/problems:/problems`: Gắn thư mục bài tập từ máy host vào container
- `-p 9999`: Port kết nối đến bridge (phải trùng với `BRIDGED_JUDGE_ADDRESS`)
- `-a 12345`: Port API của judge

**Lưu ý về port:**
- Nếu đã đổi port trong `BRIDGED_JUDGE_ADDRESS`, cần đổi `-p 9999` cho khớp
- Nếu chạy nhiều judge, mỗi judge cần:
  - Tên container khác nhau (`--name`)
  - File cấu hình riêng (`judge.yml`)
  - Port API khác nhau (`-a`)

### Chạy nhiều Judge

Để tăng khả năng xử lý, bạn có thể chạy nhiều judge cùng lúc:

**Judge 1:**
```sh
docker run --name judge1 -v /mnt/problems:/problems --cap-add=SYS_PTRACE -d --restart=always --network="host" luyencode/judge-tier3:latest run -p 9999 -c /problems/judge1.yml localhost -A 0.0.0.0 -a 12345
```

**Judge 2:**
```sh
docker run --name judge2 -v /mnt/problems:/problems --cap-add=SYS_PTRACE -d --restart=always --network="host" luyencode/judge-tier3:latest run -p 9999 -c /problems/judge2.yml localhost -A 0.0.0.0 -a 12346
```

Mỗi judge cần có file cấu hình riêng (`judge1.yml`, `judge2.yml`) với `id` khác nhau.

## Kiểm tra

Sau khi khởi động judge, kiểm tra trên trang quản trị website (`/admin/judge/`). Judge sẽ hiển thị trạng thái "online" nếu kết nối thành công.

## Xử lý lỗi thường gặp

**Judge không kết nối được:**
- Kiểm tra bridge đang chạy
- Kiểm tra port đã mở
- Kiểm tra `id` và `key` trong `judge.yml` khớp với website

**Judge bị disconnect liên tục:**
- Kiểm tra kết nối mạng
- Kiểm tra log của judge: `docker logs judge`

**Judge không nhận bộ test cho bài tập mới:**

Đây là lỗi phổ biến nhất, thường do đường dẫn đến thư mục problems không chính xác.

**Nguyên nhân:**
- Đường dẫn mount volume không đúng
- Thư mục problems trống hoặc không có quyền truy cập
- Cấu trúc thư mục bài tập không đúng

**Cách kiểm tra:**

1. Kiểm tra thư mục problems trong container:

```sh
docker exec judge ls -la /problems
```

Bạn sẽ thấy danh sách các thư mục bài tập. Ví dụ:
```
drwxr-xr-x 2 root root 4096 Jan 01 00:00 aplusb
drwxr-xr-x 2 root root 4096 Jan 01 00:00 hello
-rw-r--r-- 1 root root  123 Jan 01 00:00 judge.yml
```

2. Kiểm tra cấu trúc bài tập cụ thể:

```sh
docker exec judge ls -la /problems/aplusb
```

Phải có các file:
```
-rw-r--r-- 1 root root  100 Jan 01 00:00 init.yml
-rw-r--r-- 1 root root   10 Jan 01 00:00 1.in
-rw-r--r-- 1 root root   10 Jan 01 00:00 1.out
```

3. Kiểm tra quyền truy cập:

```sh
docker exec judge cat /problems/aplusb/init.yml
```

Nếu thấy lỗi "Permission denied", cần sửa quyền:

```sh
sudo chmod -R 755 /mnt/problems
```

**Cách sửa:**

Nếu thư mục trống hoặc không đúng, kiểm tra lại lệnh `docker run`:

```sh
# Sai - mount sai thư mục
docker run -v /wrong/path:/problems ...

# Đúng - mount đúng thư mục chứa bài tập
docker run -v /mnt/problems:/problems ...
```

Sau khi sửa, restart judge:

```sh
docker stop judge
docker rm judge
# Chạy lại lệnh docker run với đường dẫn đúng
```

**Kiểm tra judge đã nhận bài tập:**

Xem log của judge:

```sh
docker logs judge | grep "problem"
```

Bạn sẽ thấy các dòng tương tự:
```
[INFO] Loaded problem: aplusb
[INFO] Loaded problem: hello
```

Nếu không thấy, judge chưa nhận được bài tập.
