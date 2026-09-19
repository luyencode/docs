# API

LCOJ provides a JSON API for accessing backend data.

## API Tokens

### Generate an API token

1. Go to the _Edit profile_ page
2. Find the API Token section
3. Click _Generate_ to create a new token

### Use an API token

Add the following header to every request:

```http
Authorization: Bearer <API Token>
```

### Common errors

- `400 Invalid authorization header` - The header is malformed
- `401 Invalid token` - The token is invalid
- `403 Admin inaccessible` - The admin pages cannot be accessed through the API

## Rate Limiting

**Limit: 90 requests/minute**

If you exceed it, you will have to solve a captcha. The captcha is cleared automatically after 3 days.

## Response Format

Every response has the following structure:

```json
{
    "api_version": "2.0",
    "method": "GET",
    "fetched": "2024-01-01T00:00:00Z",
    "data": {},
    "error": null
}
```

A response contains either `data` or `error`, never both.

### Error format

```json
{
    "error": {
        "code": 404,
        "message": "Not found"
    }
}
```

### Data format

**Single object:**

```json
{
    "data": {
        "object": {}
    }
}
```

**List of objects:**

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

Two kinds of filters are supported:

**Basic filter:** Filter on a single value
```
/api/v2/problems?partial=True
```

**List filter:** Filter on multiple values
```
/api/v2/problems?organization=1&organization=2&type=Implementation
```

## Endpoints

### Contests

**`GET /api/v2/contests`**

Get the list of contests.

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

Get contest details, including the ranking.

### Problems

**`GET /api/v2/problems`**

Get the list of problems.

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

Get problem details.

### Users

**`GET /api/v2/users`**

Get the list of users.

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

Get user details, including solved problems and contest history.

### Submissions

**`GET /api/v2/submissions`**

Get the list of submissions.

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

Get submission details, including the result of each test case.

### Organizations

**`GET /api/v2/organizations`**

Get the list of organizations.

**Filters:**
- `is_open` (boolean)

### Languages

**`GET /api/v2/languages`**

Get the list of programming languages.

**Filters:**
- `common_name` (text)

### Judges

**`GET /api/v2/judges`**

Get the list of judge servers and their status.

## Usage Examples

### Python

```python
import requests

API_TOKEN = "your_token_here"
headers = {"Authorization": f"Bearer {API_TOKEN}"}

# Get the list of problems
response = requests.get(
    "https://luyencode.net/api/v2/problems",
    headers=headers
)
problems = response.json()["data"]["objects"]

# Get problem details
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

// Get the list of problems
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

## Notes

- Do not share your API token with anyone
- Store your token securely and never commit it to git
- Respect the rate limit
- The API may change; check `api_version`
