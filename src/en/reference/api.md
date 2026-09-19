# API

> LCOJ has two machine-facing interfaces: personal API tokens (scripts acting as a user) and the contest sync API (external tools reading contest data as JSON). There is no public data API like `/api/v2/problems`.
>
> ⏱ ~15 min read · 👤 Developers, administrators · 🔑 An API token or the `GLOBAL_API_KEY`

## When you need this page

- You want to write a script that acts on the site as a particular account.
- You run a contest and want to connect a live scoreboard or an ICPC-style resolver.
- You tried calling `/api/v2/...` from the DMOJ docs and got a 404.

LCOJ exposes two machine-facing interfaces:

| Interface | What it is for | Authentication | Enabled by default? |
|---|---|---|---|
| [Personal API token](#personal-api-token) | Scripts that act **as a specific user** on regular site pages | `Authorization: Bearer <token>` | Yes |
| [Contest sync API](#contest-sync-api) | External scoreboards / resolvers that read a contest's problems, ranking and submissions as JSON | `X-Global-API-Key` header (one site-wide key) | No (`VNOJ_ENABLE_SYNC_API = False`) |

::: warning No public data API
Upstream DMOJ has a public JSON API under `/api/v2/` (`/api/v2/problems`, `/api/v2/users`, `/api/v2/contests`, ...). **LCOJ does not ship these endpoints**: those URLs return 404 on luyencode.net. The only JSON API under `/api/v2/` is the contest sync API described below.
:::

## Personal API token {#personal-api-token}

A personal API token lets a script log in as you without a password or two-factor authentication. The token is sent as an HTTP header, and the request is then handled exactly as if you were logged in on a browser.

### Getting a token

| Method | Who | How |
|---|---|---|
| Management command | Server administrators | `./scripts/manage.py generate_api_token <username>` (run from `dmoj/`). Prints the token. See [Management commands](/en/reference/management-commands). |
| HTTP endpoint | The logged-in user | `POST /accounts/api/token/generate/` (needs a logged-in session and a CSRF token). Returns `{"data": {"token": "..."}}`. |

- A token is 48 URL-safe base64 characters. It encodes your user ID plus a random secret; the site stores only an HMAC of the secret, so **a token cannot be shown again**. Store it when you get it.
- Generating a new token **invalidates the previous one**.
- To revoke a token: `POST /accounts/api/token/remove/` as the logged-in user.

::: info
The LCOJ profile editing page does not currently show an API token section, so regular users cannot generate a token from the UI. Ask an administrator if you need one.
:::

### Using a token

Add this header to every request:

```http
Authorization: Bearer <API token>
```

```bash
curl -H "Authorization: Bearer $LCOJ_TOKEN" https://luyencode.net/user
```

The token is checked by `judge.middleware.APIMiddleware`. When valid, the request is authenticated as the token's owner, counts as having passed 2FA, and skips CSRF checks.

### Errors

| HTTP status | Body | Cause |
|---|---|---|
| `400` | `Invalid authorization header` | The header is not exactly `Bearer ` followed by 48 characters `[A-Za-z0-9_-]` |
| `401` | `Invalid token` | Unknown user, the user has no token, or the secret does not match (for example, the token was regenerated) |
| `403` | `Admin inaccessible` | Tokens can never be used for the Django admin (`/admin/`) |

::: danger Treat the token like a password
The token bypasses two-factor authentication. Never share it, never commit it to git, and regenerate it if it leaks.
:::

## Contest sync API {#contest-sync-api}

The sync API lets an external tool (for example, an ICPC-style resolver or a live scoreboard) poll a contest's data. It is read-only and returns plain JSON.

### Enabling it

Both settings live in `dmoj/local_settings.py` (see [Environment configuration](/en/operate/environment)); restart `site` after changing them.

| Setting | Default | Meaning |
|---|---|---|
| `VNOJ_ENABLE_SYNC_API` | `False` | When `True`, the `/api/v2/sync/...` URLs are registered. When `False` they return 404. |
| `GLOBAL_API_KEY` | a test value in `settings.py` | Shared secret that every sync request must present. If it is empty/`None`, every request is rejected with 403. |

::: danger Change `GLOBAL_API_KEY` before enabling
The default value in `dmoj/settings.py` is a public placeholder used by tests. Set a long random key in `local_settings.py` before turning on `VNOJ_ENABLE_SYNC_API`. Anyone who knows the key can read **any** contest by its code, including private and hidden contests: the sync API does not check contest visibility.
:::

### Authentication

Send the key in a header (preferred) or as a query parameter:

```http
X-Global-API-Key: <GLOBAL_API_KEY>
```

```
/api/v2/sync/contest/<contest_code>?global_api_key=<GLOBAL_API_KEY>
```

A missing or wrong key returns `403` `api key required`.

### Endpoints

All endpoints are `GET`. `<contest_code>` is the contest key (the code in the contest URL `/contest/<key>`).

| Endpoint | Returns |
|---|---|
| `/api/v2/sync/contest/<contest_code>` | Contest timing (object) |
| `/api/v2/sync/contest/<contest_code>/problems` | Problems in contest order (array) |
| `/api/v2/sync/contest/<contest_code>/participants` | Current ranking (array) |
| `/api/v2/sync/contest/<contest_code>/submissions` | Submissions judged since a timestamp (array) |

Timestamps are ISO 8601 strings with a UTC offset, for example `2026-03-01T08:00:00+00:00`.

#### Contest detail

`GET /api/v2/sync/contest/<contest_code>`

```json
{
  "code": "icpc2026",
  "start_time": "2026-03-01T08:00:00+00:00",
  "end_time": "2026-03-01T13:00:00+00:00",
  "frozen_at": "2026-03-01T12:00:00+00:00"
}
```

| Field | Description |
|---|---|
| `code` | Contest key |
| `start_time`, `end_time` | Contest window |
| `frozen_at` | `end_time` minus the contest's _frozen last minutes_; `null` when the contest has no freeze |

#### Problems

`GET /api/v2/sync/contest/<contest_code>/problems`

```json
[
  {"code": "sum2", "contest": "icpc2026"},
  {"code": "maxpath", "contest": "icpc2026"}
]
```

Problems are sorted by their order in the contest. `code` is the problem code.

#### Participants (ranking)

`GET /api/v2/sync/contest/<contest_code>/participants`

```json
[
  {"user": "alice", "contest": "icpc2026", "rank": 1},
  {"user": "bob", "contest": "icpc2026", "rank": 1},
  {"user": "carol", "contest": "icpc2026", "rank": 3}
]
```

- Includes only **live** participations (no virtual participants or spectators) that are not disqualified.
- Sorted by score (descending), then cumulative time, then the format's tie-breaker. Equal (score, time, tie-breaker) share a rank; the next rank skips (1, 1, 3).
- While the scoreboard is frozen (only for the `icpc` and `vnoj` formats with _frozen last minutes_ > 0, from `frozen_at` onwards, including after the contest ends), the ranking uses the **frozen** score and time. See [Contest formats](/en/organize/contest-formats).

#### Submissions

`GET /api/v2/sync/contest/<contest_code>/submissions?from_timestamp=...`

| Query parameter | Required | Default | Description |
|---|---|---|---|
| `from_timestamp` | Yes | — | ISO 8601 time. Returns submissions with a judge time `>=` this value. A time without an offset is treated as UTC. URL-encode `+` as `%2B`. |
| `limit` | No | `2000` | Maximum number of rows; must be a positive integer, capped at 2000 |
| `status` | No | `final` | `final` skips submissions still queued/processing/grading (`QU`, `P`, `G`); `all` includes them |

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

| Field | Description |
|---|---|
| `id` | Submission ID, **as a string** |
| `submittedAt` | Submission time |
| `judgedAt` | Judge time |
| `author` | Username |
| `submissionStatus` | Result code (`AC`, `WA`, `TLE`, ...), or the status code if there is no result yet. See [Status codes](/en/reference/status-codes). |
| `contest_code`, `problem_code` | Contest key and problem code |

Rows are sorted by judge time, then ID. To poll incrementally, pass the last `judgedAt` you received as the next `from_timestamp` and de-duplicate by `id` (the boundary row is returned again because the filter is `>=`). Rejudged submissions reappear with a new judge time.

::: warning Freeze is not applied to submissions
The submissions endpoint returns real verdicts even while the scoreboard is frozen. Keep the API key away from anything that is shown to contestants.
:::

### Errors

Successful sync responses are the bare object or array shown above. Errors are wrapped:

```json
{
  "api_version": "2.0",
  "method": "get",
  "fetched": "2026-03-01T09:00:00.123456+00:00",
  "error": {"code": 400, "message": "invalid filter value type"}
}
```

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `invalid filter value type` | Missing or unparseable `from_timestamp`, bad `limit`, or `status` other than `final`/`all` |
| `403` | `api key required` | Missing or wrong key, or `GLOBAL_API_KEY` is not set |
| `404` | `page/object not found` | No contest with this code |

### Example

```python
import requests

BASE = "https://luyencode.net/api/v2/sync/contest/icpc2026"
HEADERS = {"X-Global-API-Key": "<your key>"}

contest = requests.get(BASE, headers=HEADERS).json()
ranking = requests.get(f"{BASE}/participants", headers=HEADERS).json()
subs = requests.get(
    f"{BASE}/submissions",
    headers=HEADERS,
    params={"from_timestamp": contest["start_time"], "status": "final"},
).json()
print(len(subs), "judged submissions")
```

```bash
curl -H "X-Global-API-Key: $LCOJ_SYNC_KEY" \
  "https://luyencode.net/api/v2/sync/contest/icpc2026/submissions?from_timestamp=2026-03-01T08:00:00Z&limit=500"
```

## Next steps

- [Management commands](/en/reference/management-commands): `generate_api_token` and other commands.
- [Environment and configuration](/en/operate/environment): where to set `VNOJ_ENABLE_SYNC_API` and `GLOBAL_API_KEY`.
- [Contest formats](/en/organize/contest-formats): how a frozen scoreboard affects the sync API.
- [Status codes](/en/reference/status-codes): what `submissionStatus` values mean.
