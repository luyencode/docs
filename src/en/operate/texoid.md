# TikZ Diagrams (Texoid)

> LCOJ doesn't render TikZ in statements; the recommended way is to draw figures as SVG/PNG images and embed them. Running Texoid is only for developers who want to rebuild this feature.
>
> ⏱ ~10 min (embedding an image) · 👤 Operators, problem setters · 🔑 Permission to edit problems; SSH + docker on a dev machine to try Texoid

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
| Rendering TikZ in statements | **Not supported**: the Markdown renderer doesn't call Texoid yet |

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

You only need this section if you plan to **wire** `TexoidRenderer` back into the Markdown renderer (`judge/jinja2/markdown/__init__.py` in `dmoj/repo`). Do it on a development machine, not in production.

### Before you start

- [ ] You have a separate development machine (not production) running the LCOJ Docker stack.
- [ ] You can SSH in and run `docker compose` in the `dmoj/` directory.
- [ ] You've changed the code so the Markdown renderer actually calls `TexoidRenderer` (otherwise the steps below have no effect on statements).

### Step 1: Build an image

Texoid is on PyPI (`pip install texoid`). Without Docker mode it needs `latex`, `dvisvgm`, and ImageMagick's `convert`. Example `dmoj/addons/texoid/Dockerfile` (a starting point; try it on a development machine first):

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

Defaults in `dmoj/settings.py`: `TEXOID_GZIP = False`, `TEXOID_META_CACHE = 'default'`, `TEXOID_META_CACHE_TTL = 86400`. To turn Texoid off, **remove** the `TEXOID_URL` line entirely: setting it to `None` still counts as enabled.

### Step 4: Start it

```sh
cd dmoj
docker compose up -d --build texoid
docker compose restart site
```

## Verify

- **Embedded image (recommended):** open the problem page and the figure shows; opening the image's `/martor/...` URL directly also shows it.
- **Texoid (dev machine):** test it from the `site` container:

  ```sh
  docker compose exec site curl -s -H 'Content-Type: application/x-tex' \
    --data-raw '\documentclass{standalone}\begin{document}$E=mc^2$\end{document}' http://texoid:8888/
  ```

  A working setup returns JSON with `"success": true`.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| A `$$tikz ... $$` block shows an error or raw text | LCOJ doesn't render TikZ | Convert the figure to an SVG/PNG image |
| `TEXOID_URL` is set but nothing changes | Texoid isn't wired into the renderer | LCOJ doesn't support this yet; use SVG/PNG images instead |
| `curl` to Texoid says `Connection refused` | Texoid only listens on `localhost` | Add `--address=0.0.0.0` |
| Texoid returns `"success": false` | LaTeX error or missing TeX package | Read the `error` field and install the missing TeX packages |

## Next steps

- [Math formulas](/en/operate/mathoid): the `~...~` and `$$...$$` syntax for regular math.
- [Problem format](/en/setter/problem-format): the other parts of a problem.
- [Environment and configuration](/en/operate/environment): where settings go if you try Texoid.

::: tip Need help?
Open an issue at [github.com/luyencode/lcoj-docker/issues](https://github.com/luyencode/lcoj-docker/issues), find more at [behitek.com](https://behitek.com), or contact us via [luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he).
:::
