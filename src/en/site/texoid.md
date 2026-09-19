# Rendering LaTeX Diagrams

LCOJ can render TikZ/PGF diagrams in problem statements, which lets you draw graphs, geometric figures, and complex diagrams.

**Note:** 
- This feature is optional and advanced
- This guide covers bare metal installs
- With Docker, you need to set up Texoid separately
- If you only need math formulas, use [Mathoid](/en/site/mathoid)

## Installing Texoid

Texoid renders TikZ diagrams as images.

### Step 1: Install LaTeX

```sh
apt update
apt install texlive-full
```

**Note:** `texlive-full` is very large (~5GB). For a lighter install:

```sh
apt install texlive-latex-base texlive-latex-extra texlive-pictures
```

### Step 2: Clone Texoid

```sh
git clone https://github.com/DMOJ/texoid.git
cd texoid
```

### Step 3: Install dependencies

```sh
python3 -m venv env
source env/bin/activate
pip install -e .
```

### Step 4: Run Texoid

```sh
env/bin/texoid --port=8886
```

## Configuring LCOJ

Add the following to `local_settings.py`:

```python
# Texoid URL
TEXOID_URL = 'http://localhost:8886'

# Cache directory
TEXOID_CACHE_ROOT = '/home/lcoj/texoid_cache'

# Cache URL
TEXOID_CACHE_URL = '//luyencode.net/texoid/'
```

### Configure Nginx

```nginx
location /texoid/ {
    alias /home/lcoj/texoid_cache/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Create the cache directory

```sh
mkdir -p /home/lcoj/texoid_cache
chown www-data:www-data /home/lcoj/texoid_cache
chmod 755 /home/lcoj/texoid_cache
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

## Usage

### Basic syntax

Use `$$tikz...$$` to draw a diagram:

```markdown
$$tikz
\begin{tikzpicture}
\draw (0,0) -- (2,0) -- (2,2) -- (0,2) -- cycle;
\end{tikzpicture}
$$
```

### Example: Drawing a graph

```markdown
$$tikz
\begin{tikzpicture}[node distance=2cm]
\node[circle,draw] (1) {1};
\node[circle,draw] (2) [right of=1] {2};
\node[circle,draw] (3) [below of=1] {3};
\draw[->] (1) -- (2);
\draw[->] (1) -- (3);
\draw[->] (2) -- (3);
\end{tikzpicture}
$$
```

### Example: Drawing a tree

```markdown
$$tikz
\begin{tikzpicture}[level distance=1.5cm,
  level 1/.style={sibling distance=3cm},
  level 2/.style={sibling distance=1.5cm}]
\node[circle,draw] {1}
  child {node[circle,draw] {2}
    child {node[circle,draw] {4}}
    child {node[circle,draw] {5}}
  }
  child {node[circle,draw] {3}
    child {node[circle,draw] {6}}
    child {node[circle,draw] {7}}
  };
\end{tikzpicture}
$$
```

### Example: Geometry

```markdown
$$tikz
\begin{tikzpicture}
\coordinate (A) at (0,0);
\coordinate (B) at (4,0);
\coordinate (C) at (2,3);
\draw (A) -- (B) -- (C) -- cycle;
\node[below left] at (A) {A};
\node[below right] at (B) {B};
\node[above] at (C) {C};
\end{tikzpicture}
$$
```

## Running with Supervisor

Create the file `/etc/supervisor/conf.d/texoid.conf`:

```ini
[program:texoid]
command=/path/to/texoid/env/bin/texoid --port=8886
directory=/path/to/texoid
user=texoid
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/texoid.log
```

Start it:

```sh
supervisorctl update
supervisorctl start texoid
```

## Troubleshooting

**Diagrams do not render:**
- Check that Texoid is running
- Check that LaTeX is installed: `pdflatex --version`
- Check the Texoid logs

**Compilation errors:**
- Check your TikZ syntax
- Test it on [Overleaf](https://www.overleaf.com/)
- Install any missing LaTeX packages

**Timeouts:**
- Complex diagrams can take a while to render
- Increase the timeout in the Texoid config
- Simplify the diagram

## TikZ learning resources

- [TikZ Tutorial](https://www.overleaf.com/learn/latex/TikZ_package)
- [TikZ Examples](https://texample.net/tikz/examples/)
- [PGF Manual](http://mirrors.ctan.org/graphics/pgf/base/doc/pgfmanual.pdf)

## Notes

- TikZ is complex and takes time to learn
- For simple figures, use regular images instead
- Caching speeds up loading
- Avoid overly complex diagrams
