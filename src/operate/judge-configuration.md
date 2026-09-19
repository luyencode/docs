# Cấu hình Judge

Judge được cấu hình thông qua file YAML, chứa thông tin về ngôn ngữ lập trình, thư mục bài tập và các thiết lập khác.

File cấu hình mẫu: [judge_conf.yml](https://github.com/luyencode/docs/blob/master/sample_files/judge_conf.yml)

## Cấu trúc file cấu hình

### ID - Tên judge

Tên hiển thị của judge, phải trùng với tên đã tạo trên website:

```yaml
id: judge1
```

### Key - Mã xác thực

Mã bảo mật để judge kết nối với bridge, phải trùng với mã trên website:

```yaml
key: your_secret_key_here
```

### Problem Storage - Thư mục bài tập

Danh sách các thư mục chứa bài tập. Mỗi thư mục bài tập phải có file `init.yml`:

```yaml
problem_storage_globs:
  - /problems/*
  - /problems/archive/**
```

**Ví dụ:**
- `/problems/*` - Tìm tất cả thư mục con trực tiếp trong `/problems`
  - Khớp: `/problems/bai1`, `/problems/bai2`
  - Không khớp: `/problems/folder/bai3`

- `/problems/archive/**` - Tìm tất cả thư mục con (bao gồm thư mục lồng nhau)
  - Khớp: `/problems/archive/2023/bai1`, `/problems/archive/bai2`

- `/problems/year20[0-9][0-9]` - Tìm thư mục theo pattern
  - Khớp: `/problems/year2023`, `/problems/year2024`

### Runtimes - Ngôn ngữ lập trình

Cấu hình các ngôn ngữ lập trình được hỗ trợ:

```yaml
runtime:
  python3: /usr/bin/python3
  gcc: /usr/bin/gcc
  g++: /usr/bin/g++
```

**Lưu ý:** 
- Hầu hết ngôn ngữ được tự động phát hiện bằng lệnh `dmoj-autoconf`
- Chỉ cần cấu hình thủ công nếu chương trình không nằm trong `$PATH`

## File cấu hình đầy đủ

Ví dụ file `judge.yml` hoàn chỉnh:

```yaml
id: judge1
key: my_secret_authentication_key

problem_storage_globs:
  - /problems/*

runtime:
  python3: /usr/bin/python3
  python2: /usr/bin/python2
  gcc: /usr/bin/gcc
  g++: /usr/bin/g++
  java: /usr/bin/java
```

## Tự động phát hiện ngôn ngữ

Để tự động phát hiện các ngôn ngữ có sẵn trên hệ thống:

```sh
dmoj-autoconf > judge.yml
```

Sau đó chỉnh sửa file `judge.yml` để thêm `id`, `key` và `problem_storage_globs`.

## Kiểm tra cấu hình

Sau khi chỉnh sửa file cấu hình, khởi động lại judge:

```sh
docker restart judge
```

Kiểm tra log để đảm bảo không có lỗi:

```sh
docker logs judge
```
