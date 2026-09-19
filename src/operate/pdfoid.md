# Tạo PDF cho đề bài

LCOJ hỗ trợ xuất đề bài ra file PDF, hữu ích cho kỳ thi onsite khi thí sinh nhận đề bài giấy.

**Lưu ý:** 
- Tính năng này tùy chọn, không bắt buộc
- Hướng dẫn này cho bare metal install
- Với Docker, cần setup Pdfoid riêng trên host hoặc container khác

## Cài đặt Pdfoid

Pdfoid là dịch vụ chuyển đổi HTML thành PDF.

### Bước 1: Cài đặt dependencies

```sh
apt update
apt install chromium-driver exiftool
```

### Bước 2: Clone Pdfoid

```sh
git clone https://github.com/DMOJ/pdfoid.git
cd pdfoid
```

### Bước 3: Tạo virtual environment

```sh
python3 -m venv env
source env/bin/activate
pip install -e .
```

### Bước 4: Chạy Pdfoid

```sh
export CHROME_PATH=/usr/bin/chromium
export CHROMEDRIVER_PATH=/usr/bin/chromedriver
export EXIFTOOL_PATH=/usr/bin/exiftool
env/bin/pdfoid --port=8888
```

Nếu các chương trình đã có trong `$PATH`, không cần export.

## Cấu hình LCOJ

Thêm vào `local_settings.py`:

```python
# URL của Pdfoid
DMOJ_PDF_PDFOID_URL = 'http://localhost:8888'

# Timeout (giây)
DMOJ_PDF_PROBLEM_TIMEOUT = 30
```

### Khởi động lại

**Docker:**

```sh
docker compose restart site
```

**Bare metal:**

```sh
supervisorctl restart site
```

## Sử dụng

### Tạo PDF cho bài tập

Truy cập: `https://luyencode.net/problem/<problem_code>/pdf`

Ví dụ: `https://luyencode.net/problem/APLUSB/pdf`

### Tạo PDF cho nhiều bài

Tạo PDF cho tất cả bài trong contest:

1. Vào trang contest
2. Click _Download problems as PDF_
3. Chọn bài muốn tải
4. Click _Generate PDF_

## Chạy Pdfoid với Supervisor

Tạo file `/etc/supervisor/conf.d/pdfoid.conf`:

```ini
[program:pdfoid]
command=/path/to/pdfoid/env/bin/pdfoid --port=8888
directory=/path/to/pdfoid
user=pdfoid
environment=CHROME_PATH="/usr/bin/chromium",CHROMEDRIVER_PATH="/usr/bin/chromedriver",EXIFTOOL_PATH="/usr/bin/exiftool"
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/pdfoid.log
```

Khởi động:

```sh
supervisorctl update
supervisorctl start pdfoid
```

## Tùy chỉnh PDF

### CSS tùy chỉnh

Thêm CSS riêng cho PDF trong `local_settings.py`:

```python
DMOJ_PDF_PROBLEM_EXTRA_CSS = """
@page {
    size: A4;
    margin: 2cm;
}
body {
    font-family: "Times New Roman", serif;
    font-size: 12pt;
}
"""
```

### Header/Footer

```python
DMOJ_PDF_PROBLEM_HEADER = """
<div style="text-align: center; font-size: 10pt;">
    LuyenCode Online Judge
</div>
"""

DMOJ_PDF_PROBLEM_FOOTER = """
<div style="text-align: center; font-size: 10pt;">
    Trang <span class="pageNumber"></span> / <span class="totalPages"></span>
</div>
"""
```

## Xử lý lỗi

**PDF không tạo được:**
- Kiểm tra Pdfoid đang chạy: `curl http://localhost:8888`
- Kiểm tra Chrome/Chromium đã cài đặt
- Xem log Pdfoid Docker: `docker compose logs -f pdfoid` (nếu chạy trong Docker)
- Xem log Pdfoid bare metal: `supervisorctl tail -f pdfoid`

**PDF bị lỗi font:**
- Cài đặt font cần thiết:
```sh
apt install fonts-liberation fonts-dejavu
```

**Timeout:**
- Tăng `DMOJ_PDF_PROBLEM_TIMEOUT`
- Kiểm tra server có đủ RAM

**Hình ảnh không hiển thị:**
- Đảm bảo hình ảnh có URL đầy đủ (không dùng relative path)
- Kiểm tra hình ảnh accessible từ server

## Tối ưu

### Cache PDF

Để tránh tạo lại PDF nhiều lần:

```python
DMOJ_PDF_PROBLEM_CACHE = '/home/lcoj/pdf_cache'
DMOJ_PDF_PROBLEM_CACHE_TIME = 3600  # 1 giờ
```

Tạo thư mục:

```sh
mkdir -p /home/lcoj/pdf_cache
chown www-data:www-data /home/lcoj/pdf_cache
```

### Giảm kích thước PDF

```python
DMOJ_PDF_PROBLEM_COMPRESS = True
```

### Parallel processing

Nếu cần tạo nhiều PDF cùng lúc, chạy nhiều instance Pdfoid:

```sh
# Instance 1
env/bin/pdfoid --port=8888

# Instance 2
env/bin/pdfoid --port=8889
```

Cấu hình load balancer trong `local_settings.py`:

```python
DMOJ_PDF_PDFOID_URLS = [
    'http://localhost:8888',
    'http://localhost:8889',
]
```

## In PDF

### Cài đặt in

Khi in PDF, nên:
- Chọn khổ giấy A4
- Margin: 2cm mỗi cạnh
- In 2 mặt để tiết kiệm giấy
- Kiểm tra preview trước khi in

### Số lượng

Tính số bản in cần thiết:
- Số thí sinh × Số bài
- Thêm 10% dự phòng
- Thêm bản cho giám khảo

## Ví dụ workflow

### Chuẩn bị kỳ thi onsite

1. Tạo contest với các bài tập
2. Kiểm tra đề bài hiển thị đúng
3. Tạo PDF cho từng bài
4. Review PDF
5. In PDF
6. Đóng gói đề bài

### Script tự động

```bash
#!/bin/bash
CONTEST="contest_key"
PROBLEMS=("APLUSB" "SORTING" "GRAPH")

for problem in "${PROBLEMS[@]}"; do
    curl "https://luyencode.net/problem/$problem/pdf" \
         -o "${problem}.pdf"
    echo "Downloaded $problem.pdf"
done
```
