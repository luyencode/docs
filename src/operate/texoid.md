# Sơ đồ TikZ (Texoid)

> LCOJ không render TikZ trong đề bài; cách nên dùng là vẽ hình thành ảnh SVG/PNG rồi chèn vào đề. Phần chạy Texoid chỉ dành cho lập trình viên muốn phát triển lại tính năng này.
>
> ⏱ ~10 phút (chèn ảnh) · 👤 Người vận hành, người ra đề · 🔑 Quyền sửa đề bài; SSH + docker trên máy dev nếu thử Texoid

::: info Bạn có cần trang này không?
Texoid là dịch vụ của DMOJ, biên dịch tài liệu LaTeX (ví dụ hình vẽ TikZ) thành ảnh SVG/PNG.

- **LCOJ hiện không dùng Texoid khi render đề bài.** Cài Texoid và đặt `TEXOID_URL` sẽ **không** làm TikZ hiển thị được.
- LCOJ vẫn chạy bình thường khi không có Texoid. Để có hình minh họa (đồ thị, cây, hình học), hãy **vẽ sẵn thành ảnh rồi chèn vào đề** (xem [Cách thay thế](#cach-thay-the-nen-dung)).
- Công thức toán thông thường đã được MathJax hỗ trợ sẵn, xem [Công thức toán học](/operate/mathoid).
:::

## Trạng thái trong LCOJ

| Thành phần | Trạng thái |
|---|---|
| `TEXOID_URL` trong `dmoj/config/local_settings.py` | **Không khai báo** (tắt) |
| Dịch vụ Texoid trong `docker-compose.yml` | **Không có** |
| Code gọi Texoid khi render Markdown | **Không có**: `judge/jinja2/markdown/__init__.py` chỉ import `TexoidRenderer` mà không gọi |

## Điều gì xảy ra nếu viết TikZ trong đề?

Bộ render Markdown chỉ nhận diện `~...~` và `$$...$$`, rồi giao cho MathJax trong trình duyệt. Một khối như:

```markdown
$$tikz
\begin{tikzpicture}
\draw (0,0) -- (2,0) -- (2,2) -- cycle;
\end{tikzpicture}
$$
```

sẽ bị coi là **công thức riêng dòng** và gửi cho MathJax. MathJax không hiểu `tikzpicture`, nên người đọc thấy lỗi hoặc văn bản thô. **Đừng dùng cú pháp này.**

## Cách thay thế nên dùng

1. Vẽ hình bằng công cụ bạn quen: TikZ trên [Overleaf](https://www.overleaf.com/), [draw.io](https://app.diagrams.net/), [Graphviz](https://graphviz.org/)...
2. Xuất ra **SVG** hoặc **PNG**.
3. Trong trình soạn thảo đề bài, dùng nút chèn ảnh để tải ảnh lên. LCOJ nhận `.jpg`, `.png`, `.gif`, `.svg`. Ảnh được lưu trong `media/martor/` và phục vụ qua đường dẫn `/martor/...`.
4. Hoặc chèn bằng Markdown:

   ```markdown
   ![Đồ thị có hướng 3 đỉnh](/martor/ten-anh.svg)
   ```

::: tip
SVG giữ nét sắc khi phóng to và thường nhẹ hơn PNG. Nên dùng SVG cho đồ thị và hình học.
:::

## Dành cho lập trình viên: chạy Texoid (tùy chọn)

Chỉ cần phần này nếu bạn định **nối lại** `TexoidRenderer` vào bộ render Markdown. Làm trên máy dev, không làm trên production.

### Trước khi bắt đầu

- [ ] Có máy dev riêng (không phải máy production) chạy stack LCOJ bằng Docker.
- [ ] Có quyền SSH và chạy `docker compose` trong thư mục `dmoj/`.
- [ ] Đã sửa code để bộ render Markdown thực sự gọi `TexoidRenderer` (nếu không, các bước dưới không có tác dụng gì với đề bài).

### Bước 1: Tạo image

Texoid có trên PyPI (`pip install texoid`). Chế độ không dùng Docker cần `latex`, `dvisvgm` và `convert` của ImageMagick. Ví dụ `dmoj/addons/texoid/Dockerfile` (mẫu, chưa được kiểm thử trên LCOJ):

```dockerfile
FROM python:3.11-slim
RUN apt-get update && \
    apt-get install -y --no-install-recommends texlive-latex-base texlive-binaries imagemagick && \
    rm -rf /var/lib/apt/lists/* && \
    pip install --no-cache-dir texoid
USER nobody
EXPOSE 8888
CMD ["texoid", "--port=8888", "--address=0.0.0.0"]
```

::: warning
- Texoid mặc định chỉ nghe trên `localhost`, nên phải có `--address=0.0.0.0` khi chạy trong container.
- Texoid còn có chế độ `--docker` (dùng image `texbox` để cô lập LaTeX), nhưng chế độ đó cần quyền truy cập Docker daemon. Đừng gắn Docker socket vào container.
- Muốn vẽ TikZ thì phải cài thêm gói TeX chứa TikZ (ví dụ `texlive-pictures`).
:::

### Bước 2: Thêm vào Compose

Tạo `dmoj/docker-compose.override.yml` (Compose tự gộp file này khi chạy trong `dmoj/`):

```yaml
services:
  texoid:
    build: ./addons/texoid
    restart: unless-stopped
    networks: [site]   # để container site gọi được http://texoid:8888
```

### Bước 3: Khai báo settings

Thêm vào file settings (xem [Biến môi trường và cấu hình](/operate/environment)):

```python
TEXOID_URL = 'http://texoid:8888/'
TEXOID_CACHE_ROOT = '/cache/texoid/'   # thư mục site ghi được
TEXOID_CACHE_URL = '/texoid/'          # URL public của thư mục trên (cần thêm location nginx)
```

Mặc định trong `dmoj/settings.py`: `TEXOID_GZIP = False`, `TEXOID_META_CACHE = 'default'`, `TEXOID_META_CACHE_TTL = 86400`. Lưu ý code kiểm tra `hasattr(settings, 'TEXOID_URL')`, nên muốn tắt thì phải **xóa hẳn** dòng `TEXOID_URL`, không phải đặt thành `None`.

### Bước 4: Khởi động

```sh
cd dmoj
docker compose up -d --build texoid
docker compose restart site
```

## Kiểm tra kết quả

- **Chèn ảnh (cách nên dùng):** mở trang đề bài, hình hiển thị đúng; mở trực tiếp đường dẫn `/martor/...` của ảnh cũng thấy ảnh.
- **Texoid (máy dev):** gọi thử từ container `site`:

  ```sh
  docker compose exec site curl -s -H 'Content-Type: application/x-tex' \
    --data-raw '\documentclass{standalone}\begin{document}$E=mc^2$\end{document}' http://texoid:8888/
  ```

  Kết quả đúng là JSON có `"success": true`.

## Sự cố thường gặp

| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Khối `$$tikz ... $$` hiện lỗi hoặc văn bản thô | LCOJ không render TikZ | Chuyển hình thành ảnh SVG/PNG |
| Đã đặt `TEXOID_URL` nhưng không có gì thay đổi | Texoid chưa được nối vào bộ render | Đúng với code hiện tại, không phải lỗi cấu hình |
| `curl` tới Texoid báo `Connection refused` | Texoid chỉ nghe `localhost` | Thêm `--address=0.0.0.0` |
| Texoid trả `"success": false` | Lỗi LaTeX hoặc thiếu gói TeX | Đọc trường `error`, cài thêm gói TeX cần thiết |

## Tiếp theo

- [Công thức toán học](/operate/mathoid): cú pháp `~...~` và `$$...$$` cho công thức thông thường.
- [Định dạng bài tập](/setter/problem-format): các thành phần khác của một bài tập.
- [Biến môi trường và cấu hình](/operate/environment): nơi khai báo settings nếu bạn thử Texoid.

::: tip Cần hỗ trợ?
Tạo issue tại [github.com/luyencode/lcoj-docker/issues](https://github.com/luyencode/lcoj-docker/issues), xem thêm tại [behitek.com](https://behitek.com) hoặc liên hệ qua [luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he).
:::
