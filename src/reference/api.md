# API

> LCOJ có hai giao diện cho chương trình: API token cá nhân (script hành động như một người dùng) và API đồng bộ kỳ thi (công cụ bên ngoài đọc dữ liệu kỳ thi dạng JSON). Không có API dữ liệu công khai kiểu `/api/v2/problems`.
>
> ⏱ ~15 phút đọc · 👤 Lập trình viên, quản trị viên · 🔑 API token hoặc `GLOBAL_API_KEY`

## Khi nào cần trang này

- Bạn muốn viết script tự động thao tác trên site dưới tên một tài khoản.
- Bạn tổ chức kỳ thi và muốn nối bảng xếp hạng trực tiếp hoặc resolver kiểu ICPC.
- Bạn thử gọi `/api/v2/...` theo tài liệu DMOJ và nhận về 404.

LCOJ cung cấp hai giao diện cho máy/chương trình:

| Giao diện | Dùng để làm gì | Xác thực | Bật sẵn? |
|---|---|---|---|
| [API token cá nhân](#personal-api-token) | Script thao tác **dưới danh nghĩa một người dùng** trên các trang thông thường của site | `Authorization: Bearer <token>` | Có |
| [API đồng bộ kỳ thi](#contest-sync-api) | Bảng xếp hạng / resolver bên ngoài đọc danh sách bài, bảng xếp hạng và bài nộp của một kỳ thi dưới dạng JSON | Header `X-Global-API-Key` (một khoá chung cho toàn site) | Không (`VNOJ_ENABLE_SYNC_API = False`) |

::: warning Không có API dữ liệu công khai
Nếu bạn quen với DMOJ: LCOJ **không có** các endpoint JSON công khai như `/api/v2/problems`, `/api/v2/users`, `/api/v2/contests`; gọi các URL này sẽ nhận 404. API JSON duy nhất dưới `/api/v2/` là API đồng bộ kỳ thi mô tả bên dưới.
:::

## API token cá nhân {#personal-api-token}

API token cá nhân cho phép một script đăng nhập như bạn mà không cần mật khẩu hay xác thực hai lớp (2FA). Token được gửi trong header HTTP, và request được xử lý giống hệt như khi bạn đã đăng nhập trên trình duyệt.

### Lấy token

| Cách | Ai dùng | Thực hiện |
|---|---|---|
| Lệnh quản trị | Quản trị viên máy chủ | `./scripts/manage.py generate_api_token <username>` (chạy trong `dmoj/`). Lệnh in ra token. Xem [Lệnh quản trị](/reference/management-commands). |
| Endpoint HTTP | Người dùng đang đăng nhập | `POST /accounts/api/token/generate/` (cần phiên đăng nhập và CSRF token). Trả về `{"data": {"token": "..."}}`. |

- Token gồm 48 ký tự base64 an toàn cho URL, mã hoá ID người dùng cùng một chuỗi bí mật ngẫu nhiên. Site chỉ lưu HMAC của chuỗi bí mật nên **không thể xem lại token**. Hãy lưu token ngay khi nhận được.
- Tạo token mới sẽ **vô hiệu hoá token cũ**.
- Thu hồi token: `POST /accounts/api/token/remove/` khi đang đăng nhập.

::: info
Trang chỉnh sửa hồ sơ của LCOJ hiện không hiển thị mục API token, nên người dùng thường không tự tạo token từ giao diện được. Hãy liên hệ quản trị viên nếu cần.
:::

### Sử dụng token

Thêm header sau vào mọi request:

```http
Authorization: Bearer <API token>
```

```bash
curl -H "Authorization: Bearer $LCOJ_TOKEN" https://luyencode.net/user
```

Nếu token hợp lệ, request được xác thực là chủ token, được coi như đã qua 2FA và bỏ qua kiểm tra CSRF.

### Lỗi

| Mã HTTP | Nội dung | Nguyên nhân |
|---|---|---|
| `400` | `Invalid authorization header` | Header không đúng dạng `Bearer ` + 48 ký tự `[A-Za-z0-9_-]` |
| `401` | `Invalid token` | Không có người dùng tương ứng, người dùng chưa có token, hoặc chuỗi bí mật không khớp (ví dụ token đã được tạo lại) |
| `403` | `Admin inaccessible` | Không bao giờ dùng được token cho trang quản trị Django (`/admin/`) |

::: danger Giữ token như mật khẩu
Token bỏ qua xác thực hai lớp. Không chia sẻ, không commit vào git, và tạo lại ngay nếu bị lộ.
:::

## API đồng bộ kỳ thi {#contest-sync-api}

API đồng bộ cho phép công cụ bên ngoài (ví dụ resolver kiểu ICPC hoặc bảng xếp hạng trực tiếp) định kỳ lấy dữ liệu của một kỳ thi. API chỉ đọc và trả về JSON thuần.

### Bật API

Cả hai thiết lập nằm trong `dmoj/local_settings.py` (xem [Cấu hình môi trường](/operate/environment)); khởi động lại `site` sau khi thay đổi.

| Thiết lập | Mặc định | Ý nghĩa |
|---|---|---|
| `VNOJ_ENABLE_SYNC_API` | `False` | Khi `True`, các URL `/api/v2/sync/...` được đăng ký. Khi `False` chúng trả về 404. |
| `GLOBAL_API_KEY` | một giá trị thử nghiệm trong `settings.py` | Khoá bí mật dùng chung mà mọi request đồng bộ phải gửi kèm. Nếu rỗng/`None`, mọi request đều bị từ chối với mã 403. |

::: danger Đổi `GLOBAL_API_KEY` trước khi bật
Giá trị mặc định trong `dmoj/settings.py` là giá trị mẫu công khai dùng cho test. Hãy đặt một khoá ngẫu nhiên đủ dài trong `local_settings.py` trước khi bật `VNOJ_ENABLE_SYNC_API`. Ai biết khoá đều đọc được **mọi** kỳ thi theo mã, kể cả kỳ thi riêng tư hay ẩn: API đồng bộ không kiểm tra quyền xem kỳ thi.
:::

### Xác thực

Gửi khoá qua header (khuyến nghị) hoặc tham số query:

```http
X-Global-API-Key: <GLOBAL_API_KEY>
```

```
/api/v2/sync/contest/<contest_code>?global_api_key=<GLOBAL_API_KEY>
```

Thiếu khoá hoặc sai khoá sẽ nhận `403` `api key required`.

### Các endpoint

Tất cả đều là `GET`. `<contest_code>` là mã kỳ thi (phần mã trong URL `/contest/<key>`).

| Endpoint | Trả về |
|---|---|
| `/api/v2/sync/contest/<contest_code>` | Thời gian kỳ thi (object) |
| `/api/v2/sync/contest/<contest_code>/problems` | Danh sách bài theo thứ tự trong kỳ thi (mảng) |
| `/api/v2/sync/contest/<contest_code>/participants` | Bảng xếp hạng hiện tại (mảng) |
| `/api/v2/sync/contest/<contest_code>/submissions` | Bài nộp được chấm từ một thời điểm (mảng) |

Thời gian là chuỗi ISO 8601 có múi giờ, ví dụ `2026-03-01T08:00:00+00:00`.

#### Thông tin kỳ thi

`GET /api/v2/sync/contest/<contest_code>`

```json
{
  "code": "icpc2026",
  "start_time": "2026-03-01T08:00:00+00:00",
  "end_time": "2026-03-01T13:00:00+00:00",
  "frozen_at": "2026-03-01T12:00:00+00:00"
}
```

| Trường | Mô tả |
|---|---|
| `code` | Mã kỳ thi |
| `start_time`, `end_time` | Thời gian bắt đầu và kết thúc |
| `frozen_at` | `end_time` trừ đi số _phút đóng băng cuối_ của kỳ thi; `null` nếu kỳ thi không đóng băng |

#### Danh sách bài

`GET /api/v2/sync/contest/<contest_code>/problems`

```json
[
  {"code": "sum2", "contest": "icpc2026"},
  {"code": "maxpath", "contest": "icpc2026"}
]
```

Các bài được sắp theo thứ tự trong kỳ thi. `code` là mã bài.

#### Thí sinh (bảng xếp hạng)

`GET /api/v2/sync/contest/<contest_code>/participants`

```json
[
  {"user": "alice", "contest": "icpc2026", "rank": 1},
  {"user": "bob", "contest": "icpc2026", "rank": 1},
  {"user": "carol", "contest": "icpc2026", "rank": 3}
]
```

- Chỉ gồm lượt tham gia **chính thức** (không tính thi ảo hay khán giả) và không bị loại.
- Sắp theo điểm (giảm dần), rồi tổng thời gian, rồi tiêu chí phụ của thể thức. Các thí sinh bằng nhau cả (điểm, thời gian, tiêu chí phụ) có cùng hạng; hạng tiếp theo nhảy cóc (1, 1, 3).
- Khi bảng xếp hạng đang đóng băng (chỉ với thể thức `icpc` và `vnoj` có _phút đóng băng cuối_ > 0, tính từ `frozen_at`, kể cả sau khi kỳ thi kết thúc), bảng xếp hạng dùng điểm và thời gian **lúc đóng băng**. Xem [Thể thức kỳ thi](/organize/contest-formats).

#### Bài nộp

`GET /api/v2/sync/contest/<contest_code>/submissions?from_timestamp=...`

| Tham số query | Bắt buộc | Mặc định | Mô tả |
|---|---|---|---|
| `from_timestamp` | Có | — | Thời điểm ISO 8601. Trả về bài nộp có thời gian chấm `>=` giá trị này. Nếu không có múi giờ thì coi là UTC. Mã hoá `+` thành `%2B` trong URL. |
| `limit` | Không | `2000` | Số dòng tối đa; phải là số nguyên dương, tối đa 2000 |
| `status` | Không | `final` | `final` bỏ qua bài đang chờ/xử lý/chấm (`QU`, `P`, `G`); `all` lấy cả chúng |

```json
[
  {
    "id": "123456",
    "submittedAt": "2026-03-01T08:15:02+00:00",
    "judgedAt": "2026-03-01T08:15:04+00:00",
    "author": "alice",
    "submissionStatus": "AC",
    "contest_code": "icpc2026",
    "problem_code": "sum2"
  }
]
```

| Trường | Mô tả |
|---|---|
| `id` | ID bài nộp, **dạng chuỗi** |
| `submittedAt` | Thời điểm nộp |
| `judgedAt` | Thời điểm chấm |
| `author` | Tên đăng nhập |
| `submissionStatus` | Mã kết quả (`AC`, `WA`, `TLE`, ...), hoặc mã trạng thái nếu chưa có kết quả. Xem [Mã trạng thái](/reference/status-codes). |
| `contest_code`, `problem_code` | Mã kỳ thi và mã bài |

Kết quả sắp theo thời gian chấm, rồi theo ID. Để lấy dần, truyền `judgedAt` cuối cùng nhận được làm `from_timestamp` cho lần sau và loại trùng theo `id` (dòng ở biên được trả lại vì điều kiện là `>=`). Bài được chấm lại sẽ xuất hiện lại với thời gian chấm mới.

::: warning Bài nộp không bị đóng băng
Endpoint bài nộp trả về kết quả thật ngay cả khi bảng xếp hạng đang đóng băng. Không để khoá API lọt vào bất cứ thứ gì hiển thị cho thí sinh.
:::

### Lỗi

Khi thành công, API đồng bộ trả về trực tiếp object hoặc mảng như trên. Khi lỗi, phản hồi có dạng:

```json
{
  "api_version": "2.0",
  "method": "get",
  "fetched": "2026-03-01T09:00:00.123456+00:00",
  "error": {"code": 400, "message": "invalid filter value type"}
}
```

| Mã HTTP | `message` | Nguyên nhân |
|---|---|---|
| `400` | `invalid filter value type` | Thiếu hoặc sai định dạng `from_timestamp`, `limit` không hợp lệ, hoặc `status` khác `final`/`all` |
| `403` | `api key required` | Thiếu hoặc sai khoá, hoặc chưa đặt `GLOBAL_API_KEY` |
| `404` | `page/object not found` | Không có kỳ thi với mã này |

### Ví dụ

```python
import requests

BASE = "https://luyencode.net/api/v2/sync/contest/icpc2026"
HEADERS = {"X-Global-API-Key": "<khoá của bạn>"}

contest = requests.get(BASE, headers=HEADERS).json()
ranking = requests.get(f"{BASE}/participants", headers=HEADERS).json()
subs = requests.get(
    f"{BASE}/submissions",
    headers=HEADERS,
    params={"from_timestamp": contest["start_time"], "status": "final"},
).json()
print(len(subs), "bài nộp đã chấm")
```

```bash
curl -H "X-Global-API-Key: $LCOJ_SYNC_KEY" \
  "https://luyencode.net/api/v2/sync/contest/icpc2026/submissions?from_timestamp=2026-03-01T08:00:00Z&limit=500"
```

## Tiếp theo

- [Lệnh quản trị](/reference/management-commands): `generate_api_token` và các lệnh khác.
- [Biến môi trường và cấu hình](/operate/environment): nơi đặt `VNOJ_ENABLE_SYNC_API` và `GLOBAL_API_KEY`.
- [Thể thức kỳ thi](/organize/contest-formats): cách đóng băng bảng xếp hạng ảnh hưởng tới API đồng bộ.
- [Mã trạng thái](/reference/status-codes): ý nghĩa `submissionStatus`.
- [Tham khảo cấu hình](/reference/settings): giá trị mặc định của `VNOJ_ENABLE_SYNC_API`, `GLOBAL_API_KEY` và các thiết lập khác.
