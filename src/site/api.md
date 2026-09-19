# API

LCOJ cung cấp JSON API để truy cập dữ liệu từ backend.

## API Tokens

### Tạo API Token

1. Vào trang _Edit profile_
2. Tìm phần API Token
3. Click _Generate_ để tạo token mới

### Sử dụng API Token

Thêm header sau vào mỗi request:

```http
Authorization: Bearer <API Token>
```

### Lỗi thường gặp

- `400 Invalid authorization header` - Header sai format
- `401 Invalid token` - Token không hợp lệ
- `403 Admin inaccessible` - Không thể truy cập trang admin qua API

## Rate Limiting

**Giới hạn: 90 requests/phút**

Nếu vượt quá, bạn sẽ phải giải captcha. Captcha tự động xóa sau 3 ngày.

## Format Response

Tất cả response có cấu trúc:

```json
{
    "api_version": "2.0",
    "method": "GET",
    "fetched": "2024-01-01T00:00:00Z",
    "data": {},
    "error": null
}
```

Chỉ có `data` hoặc `error`, không có cả hai.

### Format lỗi

```json
{
    "error": {
        "code": 404,
        "message": "Not found"
    }
}
```

### Format dữ liệu

**Single object:**

```json
{
    "data": {
        "object": {}
    }
}
```

**List objects:**

```json
{
    "data": {
        "current_object_count": 10,
        "objects_per_page": 50,
        "total_objects": 100,
        "page_index": 1,
        "total_pages": 2,
        "objects": []
    }
}
```

## Filtering

Hỗ trợ 2 loại filter:

**Basic filter:** Lọc một giá trị
```
/api/v2/problems?partial=True
```

**List filter:** Lọc nhiều giá trị
```
/api/v2/problems?organization=1&organization=2&type=Implementation
```

## Endpoints

### Contests

**`GET /api/v2/contests`**

Lấy danh sách kỳ thi.

**Filters:**
- `is_rated` (boolean)
- `tag` (list)
- `organization` (list)

**Response:**
```json
{
    "key": "contest_key",
    "name": "Contest Name",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-01T05:00:00Z",
    "is_rated": true,
    "tags": ["seasonal"]
}
```

**`GET /api/v2/contest/<key>`**

Lấy chi tiết kỳ thi, bao gồm bảng xếp hạng.

### Problems

**`GET /api/v2/problems`**

Lấy danh sách bài tập.

**Filters:**
- `partial` (boolean)
- `group` (list)
- `type` (list)
- `organization` (list)
- `search` (text)

**Response:**
```json
{
    "code": "APLUSB",
    "name": "A Plus B",
    "types": ["Uncategorized"],
    "group": "Intro",
    "points": 100,
    "partial": true,
    "is_public": true
}
```

**`GET /api/v2/problem/<code>`**

Lấy chi tiết bài tập.

### Users

**`GET /api/v2/users`**

Lấy danh sách người dùng.

**Filters:**
- `organization` (list)

**Response:**
```json
{
    "id": 1,
    "username": "user123",
    "points": 1500,
    "performance_points": 1200,
    "problem_count": 50,
    "rank": "Expert",
    "rating": 1800
}
```

**`GET /api/v2/user/<username>`**

Lấy chi tiết người dùng, bao gồm bài đã giải và lịch sử contest.

### Submissions

**`GET /api/v2/submissions`**

Lấy danh sách bài nộp.

**Filters:**
- `user` (username)
- `problem` (code)
- `language` (list)
- `result` (list)

**Response:**
```json
{
    "id": 123456,
    "problem": "APLUSB",
    "user": "user123",
    "date": "2024-01-01T00:00:00Z",
    "language": "CPP17",
    "time": 0.1,
    "memory": 2048,
    "points": 100,
    "result": "AC"
}
```

**`GET /api/v2/submission/<id>`**

Lấy chi tiết bài nộp, bao gồm kết quả từng test case.

### Organizations

**`GET /api/v2/organizations`**

Lấy danh sách tổ chức.

**Filters:**
- `is_open` (boolean)

### Languages

**`GET /api/v2/languages`**

Lấy danh sách ngôn ngữ lập trình.

**Filters:**
- `common_name` (text)

### Judges

**`GET /api/v2/judges`**

Lấy danh sách judge servers và trạng thái.

## Ví dụ sử dụng

### Python

```python
import requests

API_TOKEN = "your_token_here"
headers = {"Authorization": f"Bearer {API_TOKEN}"}

# Lấy danh sách bài tập
response = requests.get(
    "https://luyencode.net/api/v2/problems",
    headers=headers
)
problems = response.json()["data"]["objects"]

# Lấy chi tiết bài tập
response = requests.get(
    "https://luyencode.net/api/v2/problem/APLUSB",
    headers=headers
)
problem = response.json()["data"]["object"]
```

### JavaScript

```javascript
const API_TOKEN = "your_token_here";
const headers = {
    "Authorization": `Bearer ${API_TOKEN}`
};

// Lấy danh sách bài tập
fetch("https://luyencode.net/api/v2/problems", { headers })
    .then(res => res.json())
    .then(data => {
        const problems = data.data.objects;
        console.log(problems);
    });
```

### cURL

```bash
curl -H "Authorization: Bearer your_token_here" \
     https://luyencode.net/api/v2/problems
```

## Lưu ý

- Không chia sẻ API token với người khác
- Lưu token an toàn, không commit vào git
- Tôn trọng rate limit
- API có thể thay đổi, kiểm tra `api_version`
