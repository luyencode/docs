# Hệ thống phân quyền

LCOJ có hệ thống phân quyền chi tiết, cho phép kiểm soát những gì người dùng có thể làm.

## Các quyền cơ bản

Django cung cấp 4 quyền mặc định cho mỗi model:
- `can_add_<model>`: Thêm mới
- `can_change_<model>`: Chỉnh sửa
- `can_delete_<model>`: Xóa
- `can_view_<model>`: Xem

## Blog Posts

**`edit_all_post`** - Chỉnh sửa tất cả bài viết

Người dùng có thể chỉnh sửa mọi bài viết trên trang admin.

## Comments (Bình luận)

**`override_comment_lock`** - Bỏ qua khóa bình luận

Người dùng có thể bình luận ngay cả khi trang đã bị khóa bình luận.

## Contests (Kỳ thi)

**`see_private_contest`** - Xem kỳ thi riêng tư

Người dùng có thể xem tất cả kỳ thi mà không cần là organizer. Cũng có thể xem bảng xếp hạng ẩn.

**`edit_own_contest`** - Chỉnh sửa kỳ thi của mình

Người dùng có thể chỉnh sửa kỳ thi mà họ là organizer.

**`edit_all_contest`** - Chỉnh sửa tất cả kỳ thi

Người dùng có thể xem và chỉnh sửa mọi kỳ thi, không cần là organizer.

**`clone_contest`** - Nhân bản kỳ thi

Người dùng có thể nhân bản kỳ thi mà họ có quyền chỉnh sửa.

**`moss_contest`** - Chạy MOSS

Người dùng có thể chạy MOSS (phát hiện gian lận) trên kỳ thi.

**`contest_rating`** - Xem rating

Người dùng có thể xem rating của thí sinh trong kỳ thi.

**`contest_access_code`** - Xem mã truy cập

Người dùng có thể xem mã truy cập của kỳ thi.

**`create_private_contest`** - Tạo kỳ thi riêng tư

Người dùng có thể tạo kỳ thi riêng tư.

## Problems (Bài tập)

**`see_private_problem`** - Xem bài tập riêng tư

Người dùng có thể xem tất cả bài tập, kể cả bài riêng tư.

**`edit_own_problem`** - Chỉnh sửa bài tập của mình

Người dùng có thể chỉnh sửa bài tập mà họ là tác giả hoặc curator.

**`edit_all_problem`** - Chỉnh sửa tất cả bài tập

Người dùng có thể chỉnh sửa mọi bài tập.

**`edit_public_problem`** - Chỉnh sửa bài tập công khai

Người dùng có thể chỉnh sửa bài tập công khai.

**`problem_full_markup`** - Dùng full markup

Người dùng có thể dùng HTML/JavaScript trong đề bài.

**`clone_problem`** - Nhân bản bài tập

Người dùng có thể nhân bản bài tập.

## Submissions (Bài nộp)

**`abort_any_submission`** - Hủy bất kỳ bài nộp

Người dùng có thể hủy bài nộp của bất kỳ ai.

**`rejudge_submission`** - Chấm lại bài nộp

Người dùng có thể chấm lại bài nộp.

**`rejudge_submission_lot`** - Chấm lại hàng loạt

Người dùng có thể chấm lại nhiều bài nộp cùng lúc.

**`spam_submission`** - Đánh dấu spam

Người dùng có thể đánh dấu bài nộp là spam.

**`view_all_submission`** - Xem tất cả bài nộp

Người dùng có thể xem mã nguồn của mọi bài nộp.

**`resubmit_other`** - Nộp lại cho người khác

Người dùng có thể nộp lại bài của người khác.

## Organizations (Tổ chức)

**`organization_admin`** - Quản trị tổ chức

Người dùng có thể quản lý tổ chức mà họ là admin.

**`edit_all_organization`** - Chỉnh sửa tất cả tổ chức

Người dùng có thể chỉnh sửa mọi tổ chức.

## Users (Người dùng)

**`edit_profile`** - Chỉnh sửa profile

Người dùng có thể chỉnh sửa profile của người khác.

**`totp`** - Quản lý 2FA

Người dùng có thể quản lý 2FA của người khác.

## Judges

**`test_site`** - Test judge

Người dùng có thể test judge.

## Cách cấp quyền

### Cách 1: Qua Groups

1. Vào `/admin/auth/group/`
2. Tạo group mới (ví dụ: "Problem Setters")
3. Chọn các quyền cần thiết
4. Thêm người dùng vào group

### Cách 2: Qua User

1. Vào `/admin/judge/profile/`
2. Chọn người dùng
3. Chọn các quyền trong phần "User permissions"

## Các role thường dùng

### Admin

Có tất cả quyền, quản lý toàn bộ hệ thống.

### Problem Setter

Quyền cần thiết:
- `edit_own_problem`
- `see_private_problem`
- `view_all_submission`
- `rejudge_submission`

### Contest Organizer

Quyền cần thiết:
- `edit_own_contest`
- `see_private_contest`
- `clone_contest`
- `contest_rating`

### Moderator

Quyền cần thiết:
- `edit_all_post`
- `override_comment_lock`
- `spam_submission`
- `view_all_submission`

## Lưu ý

- Cấp quyền cẩn thận, tránh cấp quá nhiều quyền
- Dùng groups để quản lý quyền dễ dàng hơn
- Thường xuyên review quyền của người dùng
- Một số quyền yêu cầu quyền khác (prerequisite)
