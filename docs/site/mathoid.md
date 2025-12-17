# Hiển thị công thức toán học LaTeX

LCOJ hỗ trợ hiển thị công thức toán học LaTeX trong đề bài, giúp trình bày công thức đẹp và chuyên nghiệp.

**Lưu ý:** 
- Tính năng này tùy chọn, không bắt buộc
- Hướng dẫn này cho bare metal install
- Với Docker, cần setup Mathoid riêng trên host hoặc container khác

## Cài đặt Mathoid

Mathoid là dịch vụ render công thức LaTeX thành hình ảnh.

### Bước 1: Cài đặt Node.js

```sh
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install nodejs
```

### Bước 2: Cài đặt Mathoid

```sh
git clone https://github.com/wikimedia/mathoid.git
cd mathoid
npm install
```

### Bước 3: Chạy Mathoid

```sh
node server.js
```

Mặc định Mathoid chạy trên `localhost:10044`.

## Cấu hình LCOJ

Thêm vào `local_settings.py`:

```python
# URL của Mathoid
MATHOID_URL = 'http://localhost:10044'

# Thư mục cache hình ảnh công thức
# Cần có quyền ghi cho cả Mathoid và nginx
MATHOID_CACHE_ROOT = '/home/lcoj/mathoid_cache'

# URL để truy cập cache qua web
# Ví dụ: /home/lcoj/mathoid_cache/abc.png -> luyencode.net/mathoid/abc.png
MATHOID_CACHE_URL = '//luyencode.net/mathoid/'
```

### Cấu hình Nginx

Thêm vào file nginx config:

```nginx
location /mathoid/ {
    alias /home/lcoj/mathoid_cache/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Tạo thư mục cache

```sh
mkdir -p /home/lcoj/mathoid_cache
chown www-data:www-data /home/lcoj/mathoid_cache
chmod 755 /home/lcoj/mathoid_cache
```

### Khởi động lại

**Docker:**

```sh
docker compose restart site nginx
```

**Bare metal:**

```sh
supervisorctl restart site
service nginx reload
```

## Sử dụng trong đề bài

### Inline math (trong dòng)

Dùng `~...~` cho công thức nhỏ trong dòng:

```markdown
Cho hai số nguyên ~a~ và ~b~ ~(1 \le a, b \le 10^9)~.
```

Hiển thị: Cho hai số nguyên *a* và *b* (1 ≤ a, b ≤ 10⁹).

### Display math (công thức lớn)

Dùng `$...$` cho công thức lớn, riêng dòng:

```markdown
Dãy Fibonacci được định nghĩa:

$F(n) = \begin{cases} 
0, & \text{if } n = 0 \\ 
1, & \text{if } n = 1 \\ 
F(n-2) + F(n-1), & \text{if } n \ge 2 
\end{cases}$
```

### Ví dụ đầy đủ

```markdown
# Dãy Fibonacci

Dãy Fibonacci là dãy số nổi tiếng được định nghĩa:

$F(n) = \begin{cases} 
0, & \text{nếu } n = 0 \\ 
1, & \text{nếu } n = 1 \\ 
F(n-2) + F(n-1), & \text{nếu } n \ge 2 
\end{cases}$

Cho số nguyên ~N~ ~(1 \le N \le 10^{19})~, tìm số Fibonacci thứ ~N~, 
modulo ~1\,000\,000\,007~ ~(= 10^9 + 7)~.

**Lưu ý:** Với 30% số điểm, đảm bảo ~1 \le N \le 1\,000\,000~.
```

## Các ký hiệu LaTeX thường dùng

### Toán tử

```latex
~a + b~          # Cộng
~a - b~          # Trừ
~a \times b~     # Nhân
~a \div b~       # Chia
~a \le b~        # Nhỏ hơn hoặc bằng
~a \ge b~        # Lớn hơn hoặc bằng
~a \ne b~        # Khác
~a \equiv b~     # Đồng dư
```

### Phân số

```latex
~\frac{a}{b}~    # Phân số a/b
```

### Mũ và chỉ số

```latex
~a^2~            # a mũ 2
~a_i~            # a chỉ số i
~a^{10}~         # a mũ 10
~a_{i,j}~        # a chỉ số i,j
```

### Tổng và tích

```latex
~\sum_{i=1}^{n} a_i~     # Tổng
~\prod_{i=1}^{n} a_i~    # Tích
```

### Căn

```latex
~\sqrt{x}~       # Căn bậc 2
~\sqrt[3]{x}~    # Căn bậc 3
```

### Ký hiệu đặc biệt

```latex
~\infty~         # Vô cùng
~\pi~            # Pi
~\log n~         # Logarit
~\ln n~          # Logarit tự nhiên
~\lfloor x \rfloor~  # Làm tròn xuống
~\lceil x \rceil~    # Làm tròn lên
```

## Xử lý lỗi

**Công thức không hiển thị:**
- Kiểm tra Mathoid đang chạy: `curl http://localhost:10044`
- Kiểm tra cấu hình `MATHOID_URL`
- Xem log Mathoid

**Hình ảnh không load:**
- Kiểm tra cấu hình nginx
- Kiểm tra quyền thư mục cache
- Kiểm tra `MATHOID_CACHE_URL`

**Công thức bị lỗi:**
- Kiểm tra cú pháp LaTeX
- Test trên [LaTeX editor online](https://www.codecogs.com/latex/eqneditor.php)

## Tối ưu

### Cache

Mathoid tự động cache công thức đã render. Không cần xóa cache thủ công.

### Performance

Nếu có nhiều công thức, nên:
- Tăng bộ nhớ cho Mathoid
- Dùng CDN cho thư mục cache
- Tối ưu nginx cache

## Chạy Mathoid với Supervisor

Tạo file `/etc/supervisor/conf.d/mathoid.conf`:

```ini
[program:mathoid]
command=/usr/bin/node /path/to/mathoid/server.js
directory=/path/to/mathoid
user=mathoid
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/mathoid.log
```

Khởi động:

```sh
supervisorctl update
supervisorctl start mathoid
```
