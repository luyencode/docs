# LCOJ Documentation

Tài liệu hướng dẫn cho hệ thống [LCOJ](https://github.com/luyencode/lcoj-site). Truy cập tại <https://docs.luyencode.net>.

LCOJ được phát triển dựa trên [DMOJ](https://github.com/DMOJ/online-judge) và [VNOJ](https://github.com/VNOI-Admin/OJ).

## Chạy ở máy local

Cần Node.js 18 trở lên.

```sh
npm install
npm run dev      # http://localhost:5173, tự reload khi sửa file
npm run build    # build ra src/.vitepress/dist, báo lỗi nếu có link hỏng
npm run check:locales  # kiểm tra mỗi trang có đủ bản tiếng Việt và tiếng Anh
npm run preview  # xem bản build
```

## Đóng góp

Mọi trang có đủ hai ngôn ngữ (tiếng Việt ở `src/`, tiếng Anh ở `src/en/`), sidebar của cả hai nằm ở `src/.vitepress/sidebar.mts`. Cách thêm trang, quy tắc viết và kiểm tra: xem [CONTRIBUTING.md](CONTRIBUTING.md).

## Triển khai

Mỗi lần push lên `master`, GitHub Actions (`.github/workflows/deploy.yml`) build và đăng lên GitHub Pages. Pull request chỉ build để kiểm tra.
