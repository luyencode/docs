# Contest Data Download

LCOJ lets contest authors download contest data, including contestants' submissions.

This feature is disabled by default. To enable it, configure it in `local_settings.py`.

## Configuration

### With Docker (recommended)

The cache directory is already set up in the `contestdatacache` Docker volume.

Add the following to `environment/site.env`:

```env
DMOJ_CONTEST_DATA_DOWNLOAD=True
DMOJ_CONTEST_DATA_CACHE=/contestdatacache/
DMOJ_CONTEST_DATA_INTERNAL=/contestdatacache
```

Restart:

```sh
docker compose restart site celery nginx
```

### With bare metal

Configure it in `local_settings.py`:

```python
DMOJ_CONTEST_DATA_DOWNLOAD = True
DMOJ_CONTEST_DATA_CACHE = '/home/dmoj-uwsgi/contestdatacache'
DMOJ_CONTEST_DATA_INTERNAL = '/contestdatacache'
DMOJ_CONTEST_DATA_DOWNLOAD_RATELIMIT = datetime.timedelta(days=1)
```

Configure nginx and create the cache directory the same way as for user_data_download.

## Cleaning up old files

### With Docker

```sh
# Run manually
docker compose exec site find /contestdatacache/ -type f -mtime +2 -delete

# Cron job
0 */4 * * * docker compose -f /path/to/lcoj-docker/dmoj/docker-compose.yml exec -T site find /contestdatacache/ -type f -mtime +2 -delete
```

### With bare metal

```
0 */4 * * * find /home/dmoj-uwsgi/contestdatacache/ -type f -mtime +2 -delete
```

## Usage

### Access

Only the following users can download contest data:
- The contest's organizers
- Admins with the `edit_all_contest` permission

### How to download

1. Open the contest management page (admin)
2. Select the contest whose data you want to download
3. Click _Download contest data_
4. Choose the data type:
   - All submissions
   - Last submissions only
   - AC submissions only
5. Click _Request download_
6. Wait for the system to generate the file
7. Download the file

## Data format

### Submissions (submissions.csv)

A CSV file with submission details:

```csv
ID,User,Problem,Date,Language,Result,Points,Time,Memory
123456,user1,APLUSB,2024-01-01 00:00:00,CPP17,AC,100,0.1,2048
123457,user2,APLUSB,2024-01-01 00:01:00,PYTHON3,WA,0,0.2,4096
```

### Submissions with source code (submissions_with_source.zip)

A zip file containing:
- `submissions.csv`: Submission details
- `sources/`: Directory containing the source code
  - `123456_user1_APLUSB.cpp`
  - `123457_user2_APLUSB.py`

### Scoreboard (scoreboard.csv)

The contest ranking:

```csv
Rank,User,Score,Time,Problem1,Problem2,Problem3
1,user1,300,120,100,100,100
2,user2,200,150,100,100,0
```

## Download options

### Filter by time

Download only submissions within a time range:

```python
# In the admin, select:
Start time: 2024-01-01 00:00:00
End time: 2024-01-01 23:59:59
```

### Filter by user

Download only submissions from specific users:

```python
# Enter a list of usernames, one user per line
user1
user2
user3
```

### Filter by problem

Download only submissions for specific problems:

```python
# Enter a list of problem codes, one problem per line
APLUSB
SORTING
GRAPH
```

## Troubleshooting

**The file is not generated:**
- Check the cache directory permissions
- Check Celery (Docker): `docker compose ps celery`
- Check the logs (Docker): `docker compose logs -f celery`
- Check Celery (bare metal): `supervisorctl status celery`
- Check the logs (bare metal): `supervisorctl tail -f celery`

**The file is too large:**
- Filter by time or by problem
- Download the data in separate parts
- Increase the Celery timeout

**Rate limit errors:**
- Each contest can only be downloaded once per `RATELIMIT` period
- The default is 1 day
- Admins can delete old files to download again sooner

## Data analysis

### Python

```python
import pandas as pd

# Read the CSV file
df = pd.read_csv('submissions.csv')

# Per-user statistics
user_stats = df.groupby('User').agg({
    'ID': 'count',
    'Points': 'sum'
}).rename(columns={'ID': 'Submissions', 'Points': 'Total Points'})

print(user_stats)
```

### Excel

Open the CSV file in Excel to analyze it and create charts.

## Security

- Only organizers and admins can download the data
- Files have random, hard-to-guess names
- Clean up old files regularly
- Do not share files containing contestants' source code
- Respect contestants' privacy
