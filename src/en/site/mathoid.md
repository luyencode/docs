# Rendering LaTeX Math

LCOJ supports rendering LaTeX math formulas in problem statements, so formulas look clean and professional.

**Note:** 
- This feature is optional
- This guide covers bare metal installs
- With Docker, you need to set up Mathoid separately on the host or in another container

## Installing Mathoid

Mathoid is a service that renders LaTeX formulas as images.

### Step 1: Install Node.js

```sh
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install nodejs
```

### Step 2: Install Mathoid

```sh
git clone https://github.com/wikimedia/mathoid.git
cd mathoid
npm install
```

### Step 3: Run Mathoid

```sh
node server.js
```

By default, Mathoid runs on `localhost:10044`.

## Configuring LCOJ

Add to `local_settings.py`:

```python
# Mathoid URL
MATHOID_URL = 'http://localhost:10044'

# Cache directory for rendered formula images
# Must be writable by both Mathoid and nginx
MATHOID_CACHE_ROOT = '/home/lcoj/mathoid_cache'

# URL for accessing the cache over the web
# Example: /home/lcoj/mathoid_cache/abc.png -> luyencode.net/mathoid/abc.png
MATHOID_CACHE_URL = '//luyencode.net/mathoid/'
```

### Configure Nginx

Add to your nginx config file:

```nginx
location /mathoid/ {
    alias /home/lcoj/mathoid_cache/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Create the cache directory

```sh
mkdir -p /home/lcoj/mathoid_cache
chown www-data:www-data /home/lcoj/mathoid_cache
chmod 755 /home/lcoj/mathoid_cache
```

### Restart

**Docker:**

```sh
docker compose restart site nginx
```

**Bare metal:**

```sh
supervisorctl restart site
service nginx reload
```

## Using Math in Problem Statements

### Inline math

Use `~...~` for small formulas within a line:

```markdown
Given two integers ~a~ and ~b~ ~(1 \le a, b \le 10^9)~.
```

Renders as: Given two integers *a* and *b* (1 ≤ a, b ≤ 10⁹).

### Display math

Use `$...$` for large formulas on their own line:

```markdown
The Fibonacci sequence is defined as:

$F(n) = \begin{cases} 
0, & \text{if } n = 0 \\ 
1, & \text{if } n = 1 \\ 
F(n-2) + F(n-1), & \text{if } n \ge 2 
\end{cases}$
```

### Full example

```markdown
# Fibonacci Sequence

The Fibonacci sequence is a well-known sequence defined as:

$F(n) = \begin{cases} 
0, & \text{if } n = 0 \\ 
1, & \text{if } n = 1 \\ 
F(n-2) + F(n-1), & \text{if } n \ge 2 
\end{cases}$

Given an integer ~N~ ~(1 \le N \le 10^{19})~, find the ~N~-th Fibonacci number
modulo ~1\,000\,000\,007~ ~(= 10^9 + 7)~.

**Note:** For 30% of the points, ~1 \le N \le 1\,000\,000~.
```

## Common LaTeX Symbols

### Operators

```latex
~a + b~          # Addition
~a - b~          # Subtraction
~a \times b~     # Multiplication
~a \div b~       # Division
~a \le b~        # Less than or equal to
~a \ge b~        # Greater than or equal to
~a \ne b~        # Not equal to
~a \equiv b~     # Congruent to
```

### Fractions

```latex
~\frac{a}{b}~    # Fraction a/b
```

### Superscripts and subscripts

```latex
~a^2~            # a to the power of 2
~a_i~            # a subscript i
~a^{10}~         # a to the power of 10
~a_{i,j}~        # a subscript i,j
```

### Sums and products

```latex
~\sum_{i=1}^{n} a_i~     # Sum
~\prod_{i=1}^{n} a_i~    # Product
```

### Roots

```latex
~\sqrt{x}~       # Square root
~\sqrt[3]{x}~    # Cube root
```

### Special symbols

```latex
~\infty~         # Infinity
~\pi~            # Pi
~\log n~         # Logarithm
~\ln n~          # Natural logarithm
~\lfloor x \rfloor~  # Floor
~\lceil x \rceil~    # Ceiling
```

## Troubleshooting

**Formulas do not render:**
- Check that Mathoid is running: `curl http://localhost:10044`
- Check the `MATHOID_URL` setting
- Check the Mathoid logs

**Images do not load:**
- Check the nginx configuration
- Check the cache directory permissions
- Check `MATHOID_CACHE_URL`

**Formulas render incorrectly:**
- Check the LaTeX syntax
- Test it in an [online LaTeX editor](https://www.codecogs.com/latex/eqneditor.php)

## Optimization

### Cache

Mathoid caches rendered formulas automatically. You do not need to clear the cache manually.

### Performance

If you have many formulas, we recommend that you:
- Give Mathoid more memory
- Use a CDN for the cache directory
- Tune nginx caching

## Running Mathoid with Supervisor

Create the file `/etc/supervisor/conf.d/mathoid.conf`:

```ini
[program:mathoid]
command=/usr/bin/node /path/to/mathoid/server.js
directory=/path/to/mathoid
user=mathoid
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/mathoid.log
```

Start it:

```sh
supervisorctl update
supervisorctl start mathoid
```
