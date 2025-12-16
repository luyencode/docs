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

LCOJ sử dụng Docker image `tierlcoj` với các ngôn ngữ lập trình phổ biến:
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
make judge-tierlcoj
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
- `key` phải trùng với mã xác thực đã tạo
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
    luyencode/judge-tierlcoj:latest \
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
docker run --name judge1 -v /mnt/problems:/problems --cap-add=SYS_PTRACE -d --restart=always --network="host" luyencode/judge-tierlcoj:latest run -p 9999 -c /problems/judge1.yml localhost -A 0.0.0.0 -a 12345
```

**Judge 2:**
```sh
docker run --name judge2 -v /mnt/problems:/problems --cap-add=SYS_PTRACE -d --restart=always --network="host" luyencode/judge-tierlcoj:latest run -p 9999 -c /problems/judge2.yml localhost -A 0.0.0.0 -a 12346
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
