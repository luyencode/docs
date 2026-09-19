# Preventing Spam with reCAPTCHA

Once your site has been running for a while, spam bots will start registering accounts automatically. reCAPTCHA helps prevent this.

## Getting API keys

### Step 1: Register for reCAPTCHA

1. Go to the [reCAPTCHA admin](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account
3. Click _Create_ (+)

### Step 2: Configure

- **Label**: Your site name (for example: LCOJ)
- **reCAPTCHA type**: Select _reCAPTCHA v2_ > _"I'm not a robot" Checkbox_
- **Domains**: Enter your domain (for example: `luyencode.net`)
- Accept the terms of service
- Click _Submit_

### Step 3: Get the keys

Once it is created, you will receive:
- **Site key**: The public key
- **Secret key**: The private key

## Installation

### With Docker (recommended)

**Step 1:** Add the following to `environment/site.env`:

```env
RECAPTCHA_PUBLIC_KEY=your_site_key_here
RECAPTCHA_PRIVATE_KEY=your_secret_key_here
```

**Step 2:** Restart the site:

```sh
cd lcoj-docker/dmoj
docker compose restart site
```

### With bare metal

**Step 1:** Install the library:

```sh
source lcojsite/bin/activate
pip3 install django-recaptcha2
```

**Step 2:** Add the following to `local_settings.py`:

```python
# reCAPTCHA keys
RECAPTCHA_PUBLIC_KEY = 'your_site_key_here'
RECAPTCHA_PRIVATE_KEY = 'your_secret_key_here'

# Add to INSTALLED_APPS
INSTALLED_APPS += (
    'snowpenguin.django.recaptcha2',
)
```

**Step 3:** Restart:

```sh
supervisorctl restart site
```

## Verification

1. Open the registration page
2. You should see the "I'm not a robot" checkbox
3. Try registering to test it

## Advanced options

### reCAPTCHA v3

reCAPTCHA v3 does not need a checkbox; it detects bots automatically.

**Installation:**

```sh
pip3 install django-recaptcha
```

**Configuration:**

```python
RECAPTCHA_PUBLIC_KEY = 'your_v3_site_key'
RECAPTCHA_PRIVATE_KEY = 'your_v3_secret_key'
RECAPTCHA_REQUIRED_SCORE = 0.5  # Minimum score (0-1)

INSTALLED_APPS += (
    'django_recaptcha',
)
```

### Customizing the theme

```python
RECAPTCHA_THEME = 'dark'  # Or 'light'
```

### Test mode

To test without an internet connection:

```python
RECAPTCHA_TESTING = True  # Use only during development
```

## Troubleshooting

**reCAPTCHA does not appear:**
- Check the domains in the reCAPTCHA admin
- Check `RECAPTCHA_PUBLIC_KEY`
- Check the browser console for errors

**It always reports an error:**
- Check `RECAPTCHA_PRIVATE_KEY`
- Check that the server has internet access
- Check the logs (Docker): `docker compose logs -f site`
- Check the logs (bare metal): `supervisorctl tail -f site`

**Blocked while testing:**
- Use `RECAPTCHA_TESTING = True` during development
- Or add localhost to the domains in the reCAPTCHA admin

## Security

- Do not commit keys to git
- Store keys in environment variables or a separate file
- Rotate keys periodically
- Monitor the number of registrations to detect spam

## Statistics

View reCAPTCHA statistics in the [reCAPTCHA admin](https://www.google.com/recaptcha/admin):
- Number of requests
- Bot rate
- Success rate
