# SSL Proxy for User Content

When the site is served over HTTPS but users embed images over HTTP, browsers block them (mixed content). An SSL proxy solves this problem.

**Note:** This feature is optional and only needed if you allow users to embed images from external sources.

## Installing Camo

Camo is a proxy server that serves HTTP content over HTTPS.

### Step 1: Install Node.js

```sh
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install nodejs
```

### Step 2: Install Camo

```sh
npm install -g camo
```

### Step 3: Generate a secret key

```sh
openssl rand -hex 32
```

Save this key; you will need it in a later step.

### Step 4: Run Camo

```sh
PORT=8081 CAMO_KEY="your_secret_key_here" camo
```

## Configuring LCOJ

### With Docker

Add to `environment/site.env`:

```env
DMOJ_CAMO_URL=https://luyencode.net/camo
DMOJ_CAMO_KEY=your_secret_key_here
DMOJ_CAMO_EXCLUDE=luyencode.net,cdn.luyencode.net
```

### With bare metal

Add to `local_settings.py`:

```python
# Camo URL
DMOJ_CAMO_URL = "https://luyencode.net:8081"

# Secret key (must match CAMO_KEY)
DMOJ_CAMO_KEY = "your_secret_key_here"

# Domains that do not need proxying (your own domains)
DMOJ_CAMO_EXCLUDE = ["luyencode.net", "cdn.luyencode.net"]
```

## Configuring Nginx

### Reverse proxy for Camo

```nginx
location /camo/ {
    proxy_pass http://localhost:8081/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Restart

**Docker:**

```sh
docker compose restart nginx site
```

**Bare metal:**

```sh
service nginx reload
supervisorctl restart site
```

## Running Camo with Supervisor

Create the file `/etc/supervisor/conf.d/camo.conf`:

```ini
[program:camo]
command=/usr/bin/camo
directory=/tmp
user=camo
environment=PORT="8081",CAMO_KEY="your_secret_key_here"
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/camo.log
```

Start it:

```sh
supervisorctl update
supervisorctl start camo
```

## How It Works

### Without Camo

```
User -> HTTPS -> Website -> HTTP image -> ❌ Blocked
```

### With Camo

```
User -> HTTPS -> Website -> HTTPS -> Camo -> HTTP image -> ✓ OK
```

### Example

**Original URL:**
```
http://example.com/image.png
```

**URL through Camo:**
```
https://luyencode.net/camo/abc123.../image.png
```

## Verification

### Test Camo

```sh
curl http://localhost:8081/
```

If you see "hwhat", Camo is running.

### Test the proxy

1. Post a comment containing an HTTP image
2. Inspect the page source
3. The image URL should go through Camo

## Troubleshooting

**Images do not load:**
- Check that Camo is running
- Check `DMOJ_CAMO_URL` and `DMOJ_CAMO_KEY`
- View Camo logs (Docker): `docker compose logs -f camo` (if running in Docker)
- View Camo logs (bare metal): `supervisorctl tail -f camo`

**Mixed content warning:**
- Check that `DMOJ_CAMO_URL` uses HTTPS
- Check the nginx config

**Images are blocked:**
- Some sites block proxies
- There is no workaround; users must upload the image to the server

## Security

### Size limit

Add to the Camo config:

```sh
CAMO_MAX_SIZE=5242880  # 5MB
```

### File type limit

Allow images only:

```sh
CAMO_ALLOWED_CONTENT_TYPES="image/*"
```

### Rate limiting

Use nginx to limit requests:

```nginx
location /camo/ {
    limit_req zone=camo burst=10;
    proxy_pass http://localhost:8081/;
}
```

## Optimization

### Cache

Camo caches automatically. To increase the cache time:

```sh
CAMO_TIMING_ALLOW_ORIGIN="*"
CAMO_HEADER_VIA="Camo"
```

### CDN

If you have a CDN, put Camo behind it:

```
User -> CDN -> Camo -> HTTP image
```

## Notes

- Camo uses a lot of bandwidth because it proxies every image
- Limit file size and file type
- Do not proxy video (too heavy)
- Encourage users to upload images to the server instead of linking to external ones
