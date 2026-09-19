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

## Cấu trúc

```
src/
├── .vitepress/config.mts     # cấu hình chung
├── .vitepress/locales/       # menu, sidebar cho từng ngôn ngữ (vi, en)
├── public/                   # ảnh, logo, CNAME
├── index.md                  # trang chủ tiếng Việt
├── features/ site/ judge/ problem_format/ about/
└── en/                       # bản tiếng Anh, cùng cấu trúc với bản tiếng Việt
```

**Mỗi trang phải có đủ hai ngôn ngữ.** Thêm trang mới:

1. Tạo `src/<đường-dẫn>.md` (tiếng Việt) và `src/en/<đường-dẫn>.md` (tiếng Anh).
2. Thêm link vào sidebar trong cả `src/.vitepress/locales/vi.mts` và `en.mts`.
3. Chạy `npm run check:locales`. CI sẽ báo lỗi nếu một trang chỉ có một ngôn ngữ.

Tài liệu không dùng ảnh chụp màn hình. Hãy dùng sơ đồ Mermaid (khối ` ```mermaid `), bảng và hộp lưu ý (`::: tip`, `::: warning`).

## Triển khai

Mỗi lần push lên `master`, GitHub Actions (`.github/workflows/deploy.yml`) build và đăng lên GitHub Pages. Pull request chỉ build để kiểm tra.
