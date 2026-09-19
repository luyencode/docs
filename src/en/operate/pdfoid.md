# Generating PDFs for Problem Statements

LCOJ can export problem statements to PDF, which is useful for onsite contests where contestants receive printed problem statements.

**Note:** 
- This feature is optional
- This guide covers bare metal installs
- With Docker, you need to set up Pdfoid separately on the host or in another container

## Installing Pdfoid

Pdfoid is a service that converts HTML to PDF.

### Step 1: Install dependencies

```sh
apt update
apt install chromium-driver exiftool
```

### Step 2: Clone Pdfoid

```sh
git clone https://github.com/DMOJ/pdfoid.git
cd pdfoid
```

### Step 3: Create a virtual environment

```sh
python3 -m venv env
source env/bin/activate
pip install -e .
```

### Step 4: Run Pdfoid

```sh
export CHROME_PATH=/usr/bin/chromium
export CHROMEDRIVER_PATH=/usr/bin/chromedriver
export EXIFTOOL_PATH=/usr/bin/exiftool
env/bin/pdfoid --port=8888
```

If these programs are already in your `$PATH`, you do not need the exports.

## Configuring LCOJ

Add to `local_settings.py`:

```python
# Pdfoid URL
DMOJ_PDF_PDFOID_URL = 'http://localhost:8888'

# Timeout (seconds)
DMOJ_PDF_PROBLEM_TIMEOUT = 30
```

### Restart

**Docker:**

```sh
docker compose restart site
```

**Bare metal:**

```sh
supervisorctl restart site
```

## Usage

### Generate a PDF for a problem

Go to: `https://luyencode.net/problem/<problem_code>/pdf`

Example: `https://luyencode.net/problem/APLUSB/pdf`

### Generate PDFs for multiple problems

To generate PDFs for all problems in a contest:

1. Go to the contest page
2. Click _Download problems as PDF_
3. Select the problems to download
4. Click _Generate PDF_

## Running Pdfoid with Supervisor

Create the file `/etc/supervisor/conf.d/pdfoid.conf`:

```ini
[program:pdfoid]
command=/path/to/pdfoid/env/bin/pdfoid --port=8888
directory=/path/to/pdfoid
user=pdfoid
environment=CHROME_PATH="/usr/bin/chromium",CHROMEDRIVER_PATH="/usr/bin/chromedriver",EXIFTOOL_PATH="/usr/bin/exiftool"
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/pdfoid.log
```

Start it:

```sh
supervisorctl update
supervisorctl start pdfoid
```

## Customizing PDFs

### Custom CSS

Add PDF-specific CSS in `local_settings.py`:

```python
DMOJ_PDF_PROBLEM_EXTRA_CSS = """
@page {
    size: A4;
    margin: 2cm;
}
body {
    font-family: "Times New Roman", serif;
    font-size: 12pt;
}
"""
```

### Header/Footer

```python
DMOJ_PDF_PROBLEM_HEADER = """
<div style="text-align: center; font-size: 10pt;">
    LuyenCode Online Judge
</div>
"""

DMOJ_PDF_PROBLEM_FOOTER = """
<div style="text-align: center; font-size: 10pt;">
    Page <span class="pageNumber"></span> / <span class="totalPages"></span>
</div>
"""
```

## Troubleshooting

**PDF generation fails:**
- Check that Pdfoid is running: `curl http://localhost:8888`
- Check that Chrome/Chromium is installed
- View Pdfoid logs (Docker): `docker compose logs -f pdfoid` (if running in Docker)
- View Pdfoid logs (bare metal): `supervisorctl tail -f pdfoid`

**PDF has font issues:**
- Install the required fonts:
```sh
apt install fonts-liberation fonts-dejavu
```

**Timeout:**
- Increase `DMOJ_PDF_PROBLEM_TIMEOUT`
- Check that the server has enough RAM

**Images do not appear:**
- Make sure images use absolute URLs (not relative paths)
- Check that the images are accessible from the server

## Optimization

### Cache PDFs

To avoid regenerating PDFs repeatedly:

```python
DMOJ_PDF_PROBLEM_CACHE = '/home/lcoj/pdf_cache'
DMOJ_PDF_PROBLEM_CACHE_TIME = 3600  # 1 hour
```

Create the directory:

```sh
mkdir -p /home/lcoj/pdf_cache
chown www-data:www-data /home/lcoj/pdf_cache
```

### Reduce PDF size

```python
DMOJ_PDF_PROBLEM_COMPRESS = True
```

### Parallel processing

If you need to generate many PDFs at once, run multiple Pdfoid instances:

```sh
# Instance 1
env/bin/pdfoid --port=8888

# Instance 2
env/bin/pdfoid --port=8889
```

Configure load balancing in `local_settings.py`:

```python
DMOJ_PDF_PDFOID_URLS = [
    'http://localhost:8888',
    'http://localhost:8889',
]
```

## Printing PDFs

### Print settings

When printing PDFs, we recommend that you:
- Choose A4 paper
- Set 2cm margins on each side
- Print double-sided to save paper
- Check the print preview before printing

### Quantity

Calculate the number of copies needed:
- Number of contestants × Number of problems
- Add 10% as a buffer
- Add copies for the judges

## Example Workflow

### Preparing an onsite contest

1. Create a contest with the problems
2. Check that the problem statements render correctly
3. Generate a PDF for each problem
4. Review the PDFs
5. Print the PDFs
6. Package the problem statements

### Automation script

```bash
#!/bin/bash
CONTEST="contest_key"
PROBLEMS=("APLUSB" "SORTING" "GRAPH")

for problem in "${PROBLEMS[@]}"; do
    curl "https://luyencode.net/problem/$problem/pdf" \
         -o "${problem}.pdf"
    echo "Downloaded $problem.pdf"
done
```
