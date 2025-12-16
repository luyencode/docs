# Chống spam với reCAPTCHA

Nếu website chạy lâu, bot spam sẽ tự động đăng ký tài khoản. reCAPTCHA giúp ngăn chặn điều này.

## Lấy API key

### Bước 1: Đăng ký reCAPTCHA

1. Truy cập [reCAPTCHA admin](https://www.google.com/recaptcha/admin)
2. Đăng nhập bằng tài khoản Google
3. Click _Create_ (+)

### Bước 2: Cấu hình

- **Label**: Tên website (ví dụ: LCOJ)
- **reCAPTCHA type**: Chọn _reCAPTCHA v2_ > _"I'm not a robot" Checkbox_
- **Domains**: Nhập domain của bạn (ví dụ: `luyencode.net`)
- Chấp nhận điều khoản
- Click _Submit_

### Bước 3: Lấy keys

Sau khi tạo, bạn sẽ nhận được:
- **Site key**: Key công khai
- **Secret key**: Key bí mật

## Cài đặt

### Bước 1: Cài đặt thư viện

```sh
source lcojsite/bin/activate
pip3 install django-recaptcha2
```

### Bước 2: Cấu hình

Thêm vào `local_settings.py`:

```python
# reCAPTCHA keys
RECAPTCHA_PUBLIC_KEY = 'your_site_key_here'
RECAPTCHA_PRIVATE_KEY = 'your_secret_key_here'

# Thêm vào INSTALLED_APPS
INSTALLED_APPS += (
    'snowpenguin.django.recaptcha2',
)
```

### Bước 3: Khởi động lại

```sh
supervisorctl restart site
```

## Kiểm tra

1. Truy cập trang đăng ký
2. Bạn sẽ thấy checkbox "I'm not a robot"
3. Thử đăng ký để kiểm tra

## Tùy chọn nâng cao

### reCAPTCHA v3

reCAPTCHA v3 không cần checkbox, tự động phát hiện bot.

**Cài đặt:**

```sh
pip3 install django-recaptcha
```

**Cấu hình:**

```python
RECAPTCHA_PUBLIC_KEY = 'your_v3_site_key'
RECAPTCHA_PRIVATE_KEY = 'your_v3_secret_key'
RECAPTCHA_REQUIRED_SCORE = 0.5  # Điểm tối thiểu (0-1)

INSTALLED_APPS += (
    'django_recaptcha',
)
```

### Tùy chỉnh theme

```python
RECAPTCHA_THEME = 'dark'  # Hoặc 'light'
```

### Test mode

Để test không cần internet:

```python
RECAPTCHA_TESTING = True  # Chỉ dùng khi development
```

## Xử lý lỗi

**reCAPTCHA không hiển thị:**
- Kiểm tra domain trong reCAPTCHA admin
- Kiểm tra `RECAPTCHA_PUBLIC_KEY`
- Xem console browser có lỗi không

**Luôn báo lỗi:**
- Kiểm tra `RECAPTCHA_PRIVATE_KEY`
- Kiểm tra server có kết nối internet
- Xem log: `supervisorctl tail -f site`

**Bị block khi test:**
- Dùng `RECAPTCHA_TESTING = True` khi development
- Hoặc thêm localhost vào domains trong reCAPTCHA admin

## Bảo mật

- Không commit keys vào git
- Lưu keys trong biến môi trường hoặc file riêng
- Định kỳ rotate keys
- Monitor số lượng đăng ký để phát hiện spam

## Thống kê

Xem thống kê reCAPTCHA tại [reCAPTCHA admin](https://www.google.com/recaptcha/admin):
- Số request
- Tỷ lệ bot
- Tỷ lệ thành công
