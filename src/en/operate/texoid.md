# TikZ Diagrams (Texoid)

::: info Do you need this?
Texoid is a DMOJ service that compiles LaTeX documents (such as TikZ drawings) into SVG/PNG images.

- **LCOJ does not currently use Texoid when rendering statements.** Installing Texoid and setting `TEXOID_URL` will **not** make TikZ render.
- LCOJ works fine without Texoid. For illustrations (graphs, trees, geometry), **draw them as images and embed them in the statement** (see [Recommended alternative](#recommended-alternative)).
- Regular math is already handled by MathJax; see [Math formulas](/en/operate/mathoid).
:::

## Status in LCOJ

| Component | Status |
|---|---|
| `TEXOID_URL` in `dmoj/config/local_settings.py` | **Not set** (disabled) |
| Texoid service in `docker-compose.yml` | **Not present** |
| Code that calls Texoid while rendering Markdown | **None**: `judge/jinja2/markdown/__init__.py` imports `TexoidRenderer` but never calls it |

## What happens if you write TikZ in a statement?

The Markdown renderer only recognizes `~...~` and `$$...$$` and hands them to MathJax in the browser. A block like:

```markdown
$$tikz
\begin{tikzpicture}
\draw (0,0) -- (2,0) -- (2,2) -- cycle;
\end{tikzpicture}
$$
```

is treated as **display math** and sent to MathJax. MathJax doesn't understand `tikzpicture`, so readers see an error or raw text. **Don't use this syntax.**

## Recommended alternative

1. Draw the figure with a tool you like: TikZ on [Overleaf](https://www.overleaf.com/), [draw.io](https://app.diagrams.net/), [Graphviz](https://graphviz.org/), and so on.
2. Export it as **SVG** or **PNG**.
3. In the statement editor, use the image button to upload it. LCOJ accepts `.jpg`, `.png`, `.gif`, and `.svg`. Images are stored in `media/martor/` and served under `/martor/...`.
4. Or embed it with Markdown:

   ```markdown
   ![Directed graph with 3 vertices](/martor/image-name.svg)
   ```

::: tip
SVG stays sharp when zoomed and is usually smaller than PNG. Prefer SVG for graphs and geometry.
:::

## For developers: running Texoid (optional)

You only need this section if you plan to **wire** `TexoidRenderer` back into the Markdown renderer. Do it on a development machine, not in production.

### Step 1: Build an image

Texoid is on PyPI (`pip install texoid`). Without Docker mode it needs `latex`, `dvisvgm`, and ImageMagick's `convert`. Example `dmoj/addons/texoid/Dockerfile` (a sample, not tested on LCOJ):

```dockerfile
FROM python:3.11-slim
RUN apt-get update && \
    apt-get install -y --no-install-recommends texlive-latex-base texlive-binaries imagemagick && \
    rm -rf /var/lib/apt/lists/* && \
    pip install --no-cache-dir texoid
USER nobody
EXPOSE 8888
CMD ["texoid", "--port=8888", "--address=0.0.0.0"]
```

::: warning
- Texoid listens on `localhost` by default, so `--address=0.0.0.0` is required inside a container.
- Texoid also has a `--docker` mode (it uses the `texbox` image to isolate LaTeX), but that mode needs access to the Docker daemon. Don't mount the Docker socket into the container.
- To draw TikZ you also need a TeX package that includes TikZ (for example `texlive-pictures`).
:::

### Step 2: Add it to Compose

Create `dmoj/docker-compose.override.yml` (Compose merges it automatically when run from `dmoj/`):

```yaml
services:
  texoid:
    build: ./addons/texoid
    restart: unless-stopped
    networks: [site]   # lets the site container reach http://texoid:8888
```

### Step 3: Configure settings

Add to your settings file (see [Environment and configuration](/en/operate/environment)):

```python
TEXOID_URL = 'http://texoid:8888/'
TEXOID_CACHE_ROOT = '/cache/texoid/'   # a directory the site can write to
TEXOID_CACHE_URL = '/texoid/'          # public URL for that directory (needs an nginx location)
```

Defaults in `dmoj/settings.py`: `TEXOID_GZIP = False`, `TEXOID_META_CACHE = 'default'`, `TEXOID_META_CACHE_TTL = 86400`. Note that the code checks `hasattr(settings, 'TEXOID_URL')`, so to disable it you must **remove** the `TEXOID_URL` line entirely, not set it to `None`.

### Step 4: Start it

```sh
cd dmoj
docker compose up -d --build texoid
docker compose restart site
```

Test it from the `site` container:

```sh
docker compose exec site curl -s -H 'Content-Type: application/x-tex' \
  --data-raw '\documentclass{standalone}\begin{document}$E=mc^2$\end{document}' http://texoid:8888/
```

A working setup returns JSON with `"success": true`.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| A `$$tikz ... $$` block shows an error or raw text | LCOJ doesn't render TikZ | Convert the figure to an SVG/PNG image |
| `TEXOID_URL` is set but nothing changes | Texoid isn't wired into the renderer | Expected with the current code; not a configuration error |
| `curl` to Texoid says `Connection refused` | Texoid only listens on `localhost` | Add `--address=0.0.0.0` |
| Texoid returns `"success": false` | LaTeX error or missing TeX package | Read the `error` field and install the missing TeX packages |

::: tip Need help?
Open an issue at [github.com/luyencode/lcoj-docker/issues](https://github.com/luyencode/lcoj-docker/issues), find more at [behitek.com](https://behitek.com), or contact us via [luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he).
:::
