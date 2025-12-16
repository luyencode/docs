# Hiển thị sơ đồ LaTeX

LCOJ hỗ trợ hiển thị sơ đồ TikZ/PGF trong đề bài, giúp vẽ đồ thị, hình học, và sơ đồ phức tạp.

**Lưu ý:** Tính năng này tùy chọn và nâng cao. Nếu chỉ cần công thức toán, dùng [Mathoid](/site/mathoid.md).

## Cài đặt Texoid

Texoid render sơ đồ TikZ thành hình ảnh.

### Bước 1: Cài đặt LaTeX

```sh
apt update
apt install texlive-full
```

**Lưu ý:** `texlive-full` rất lớn (~5GB). Nếu muốn nhẹ hơn:

```sh
apt install texlive-latex-base texlive-latex-extra texlive-pictures
```

### Bước 2: Clone Texoid

```sh
git clone https://github.com/DMOJ/texoid.git
cd texoid
```

### Bước 3: Cài đặt dependencies

```sh
python3 -m venv env
source env/bin/activate
pip install -e .
```

### Bước 4: Chạy Texoid

```sh
env/bin/texoid --port=8886
```

## Cấu hình LCOJ

Thêm vào `local_settings.py`:

```python
# URL của Texoid
TEXOID_URL = 'http://localhost:8886'

# Thư mục cache
TEXOID_CACHE_ROOT = '/home/lcoj/texoid_cache'

# URL cache
TEXOID_CACHE_URL = '//luyencode.net/texoid/'
```

### Cấu hình Nginx

```nginx
location /texoid/ {
    alias /home/lcoj/texoid_cache/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Tạo thư mục cache

```sh
mkdir -p /home/lcoj/texoid_cache
chown www-data:www-data /home/lcoj/texoid_cache
chmod 755 /home/lcoj/texoid_cache
```

### Khởi động lại

```sh
supervisorctl restart site
service nginx reload
```

## Sử dụng

### Cú pháp cơ bản

Dùng `$$tikz...$$` để vẽ sơ đồ:

```markdown
$$tikz
\begin{tikzpicture}
\draw (0,0) -- (2,0) -- (2,2) -- (0,2) -- cycle;
\end{tikzpicture}
$$
```

### Ví dụ: Vẽ đồ thị

```markdown
$$tikz
\begin{tikzpicture}[node distance=2cm]
\node[circle,draw] (1) {1};
\node[circle,draw] (2) [right of=1] {2};
\node[circle,draw] (3) [below of=1] {3};
\draw[->] (1) -- (2);
\draw[->] (1) -- (3);
\draw[->] (2) -- (3);
\end{tikzpicture}
$$
```

### Ví dụ: Vẽ cây

```markdown
$$tikz
\begin{tikzpicture}[level distance=1.5cm,
  level 1/.style={sibling distance=3cm},
  level 2/.style={sibling distance=1.5cm}]
\node[circle,draw] {1}
  child {node[circle,draw] {2}
    child {node[circle,draw] {4}}
    child {node[circle,draw] {5}}
  }
  child {node[circle,draw] {3}
    child {node[circle,draw] {6}}
    child {node[circle,draw] {7}}
  };
\end{tikzpicture}
$$
```

### Ví dụ: Hình học

```markdown
$$tikz
\begin{tikzpicture}
\coordinate (A) at (0,0);
\coordinate (B) at (4,0);
\coordinate (C) at (2,3);
\draw (A) -- (B) -- (C) -- cycle;
\node[below left] at (A) {A};
\node[below right] at (B) {B};
\node[above] at (C) {C};
\end{tikzpicture}
$$
```

## Chạy với Supervisor

Tạo file `/etc/supervisor/conf.d/texoid.conf`:

```ini
[program:texoid]
command=/path/to/texoid/env/bin/texoid --port=8886
directory=/path/to/texoid
user=texoid
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/texoid.log
```

Khởi động:

```sh
supervisorctl update
supervisorctl start texoid
```

## Xử lý lỗi

**Sơ đồ không hiển thị:**
- Kiểm tra Texoid đang chạy
- Kiểm tra LaTeX đã cài đặt: `pdflatex --version`
- Xem log Texoid

**Lỗi compile:**
- Kiểm tra cú pháp TikZ
- Test trên [Overleaf](https://www.overleaf.com/)
- Cài đặt package LaTeX thiếu

**Timeout:**
- Sơ đồ phức tạp có thể mất thời gian
- Tăng timeout trong Texoid config
- Đơn giản hóa sơ đồ

## Tài nguyên học TikZ

- [TikZ Tutorial](https://www.overleaf.com/learn/latex/TikZ_package)
- [TikZ Examples](https://texample.net/tikz/examples/)
- [PGF Manual](http://mirrors.ctan.org/graphics/pgf/base/doc/pgfmanual.pdf)

## Lưu ý

- TikZ phức tạp, cần thời gian học
- Nếu chỉ cần hình đơn giản, dùng hình ảnh thông thường
- Cache giúp tăng tốc độ load
- Không nên vẽ sơ đồ quá phức tạp
