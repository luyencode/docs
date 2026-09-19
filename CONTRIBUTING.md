# Đóng góp cho tài liệu LCOJ / Contributing to the LCOJ docs

*English below.*

Cảm ơn bạn muốn cải thiện tài liệu! Mọi trang đều có **hai ngôn ngữ** (tiếng Việt và tiếng Anh), và mọi thay đổi phải cập nhật cả hai trong cùng một pull request.

## Cấu trúc

```
src/
├── .vitepress/
│   ├── config.mts        # cấu hình chung, metadata, chuyển hướng URL cũ
│   ├── sidebar.mts       # sidebar + menu cho CẢ HAI ngôn ngữ (một nơi duy nhất)
│   └── locales/          # nhãn giao diện, footer theo ngôn ngữ
├── start/  tutorials/  learn/  setter/  organize/  admin/  operate/  reference/  about/
└── en/                   # bản tiếng Anh, cùng cấu trúc với bản tiếng Việt
```

| Thư mục | Dành cho |
|---|---|
| `start/`, `tutorials/` | Người mới: giới thiệu, thuật ngữ, FAQ, bài hướng dẫn từng bước |
| `learn/` | Học sinh |
| `setter/` | Người ra đề |
| `organize/` | Người tổ chức kỳ thi, giáo viên |
| `admin/` | Quản trị viên website |
| `operate/` | Người tự cài đặt và vận hành LCOJ |
| `reference/` | Tra cứu: mã trạng thái, ngôn ngữ, lệnh, API |

## Thêm hoặc sửa một trang

1. Sửa (hoặc tạo) `src/<thư-mục>/<tên-trang>.md` **và** `src/en/<thư-mục>/<tên-trang>.md`. Tên file dùng chữ thường, nối bằng dấu gạch ngang.
2. Trang mới: thêm một dòng vào `src/.vitepress/sidebar.mts` (gồm nhãn tiếng Việt và tiếng Anh).
3. Đổi tên hoặc chuyển trang: thêm đường dẫn cũ vào `LEGACY_PATHS` trong `src/.vitepress/config.mts` để link cũ vẫn dùng được.
4. Chạy kiểm tra:
   ```sh
   npm install
   npm run check:locales   # mỗi trang phải có đủ hai ngôn ngữ
   npm run build           # báo lỗi nếu có link hỏng
   npm run dev             # xem thử tại http://localhost:5173
   ```

## Cách viết

- **Đúng với code.** Mọi lệnh, đường dẫn, biến môi trường, URL và nhãn giao diện phải khớp với [lcoj-docker](https://github.com/luyencode/lcoj-docker) và [lcoj-site](https://github.com/luyencode/lcoj-site). Nhãn giao diện lấy từ `locale/vi/LC_MESSAGES/django.po` của lcoj-site (msgid là tiếng Anh, msgstr là tiếng Việt).
- **Viết cho người mới.** Trang hướng dẫn theo mẫu: tóm tắt (⏱ thời gian · 👤 đối tượng · 🔑 quyền cần có) → *Trước khi bắt đầu* → các bước đánh số → *Kiểm tra kết quả* → *Sự cố thường gặp* → *Tiếp theo*.
- **Không dùng ảnh chụp màn hình.** Dùng sơ đồ Mermaid (khối ` ```mermaid `), bảng và hộp lưu ý (`::: tip`, `::: warning`, `::: danger` cho lệnh nguy hiểm).
- **Không đưa bí mật vào tài liệu.** Mật khẩu, khóa judge, `SECRET_KEY`… luôn viết dạng `<placeholder>`.
- **Thương hiệu.** Dùng LCOJ / luyencode.net. Giữ nguyên phần ghi công DMOJ, VNOJ và các định danh trong code (`dmoj`, `VNOJ_*`, định dạng `vnoj`, image `vnoj/judge-tier3`).
- Trang tiếng Việt viết tự nhiên, không dịch từng chữ. Thuật ngữ thống nhất theo trang [Thuật ngữ](https://docs.luyencode.net/start/glossary).

## Triển khai

Pull request chỉ build để kiểm tra. Khi merge vào `master`, GitHub Actions build và đăng lên <https://docs.luyencode.net>.

---

## English

Thanks for helping improve the docs! Every page exists in **two languages** (Vietnamese and English), and every change must update both in the same pull request.

### Adding or editing a page

1. Edit (or create) `src/<section>/<page>.md` **and** `src/en/<section>/<page>.md`. File names are lowercase, hyphen-separated.
2. New page: add one entry to `src/.vitepress/sidebar.mts` (with both the Vietnamese and English label).
3. Renamed or moved page: add the old path to `LEGACY_PATHS` in `src/.vitepress/config.mts` so old links keep working.
4. Check your work: `npm run check:locales`, `npm run build` (fails on dead links), `npm run dev` to preview at http://localhost:5173.

### Writing guidelines

- **Match the code.** Commands, paths, env vars, URLs and UI labels must match [lcoj-docker](https://github.com/luyencode/lcoj-docker) and [lcoj-site](https://github.com/luyencode/lcoj-site). UI labels come from lcoj-site's `locale/vi/LC_MESSAGES/django.po` (msgid = English, msgstr = Vietnamese).
- **Write for newcomers.** How-to pages follow the template: summary (⏱ time · 👤 audience · 🔑 permission) → *Before you start* → numbered steps → *Verify* → *Troubleshooting* → *Next steps*.
- **No screenshots.** Use Mermaid diagrams, tables and callouts (`::: tip`, `::: warning`, `::: danger` for destructive commands).
- **No secrets.** Passwords, judge keys, `SECRET_KEY`, etc. are always `<placeholder>`.
- **Branding.** Use LCOJ / luyencode.net. Keep the DMOJ and VNOJ credits and code identifiers (`dmoj`, `VNOJ_*`, the `vnoj` format, the `vnoj/judge-tier3` image).

### Deployment

Pull requests only build. Merging into `master` builds and publishes <https://docs.luyencode.net> via GitHub Actions.
