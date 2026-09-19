# LCOJ Documentation

Tài liệu hướng dẫn cho hệ thống [LCOJ](https://github.com/luyencode/lcoj-site). Truy cập tại <https://docs.luyencode.net>.

LCOJ được phát triển dựa trên [DMOJ](https://github.com/DMOJ/online-judge) và [VNOJ](https://github.com/VNOI-Admin/OJ).

## Chạy ở máy local

Cần Node.js 18 trở lên.

```sh
npm install
npm run dev      # http://localhost:5173, tự reload khi sửa file
npm run build    # build ra src/.vitepress/dist, báo lỗi nếu có link hỏng
npm run preview  # xem bản build
```

## Cấu trúc

```
src/
├── .vitepress/config.mts     # cấu hình chung
├── .vitepress/locales/       # menu, sidebar cho từng ngôn ngữ (vi, en)
├── public/                   # ảnh, logo, CNAME
├── index.md                  # trang chủ tiếng Việt
├── site/ judge/ problem_format/ about/
└── en/                       # bản tiếng Anh (đang dịch)
```

Thêm trang mới: tạo file `.md` trong `src/`, rồi thêm link vào sidebar trong `src/.vitepress/locales/vi.mts`.

## Triển khai

Mỗi lần push lên `master`, GitHub Actions (`.github/workflows/deploy.yml`) build và đăng lên GitHub Pages. Pull request chỉ build để kiểm tra.
