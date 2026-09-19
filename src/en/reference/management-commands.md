# Management Commands

LCOJ provides many management commands for administering the system. Run them with `./manage.py <command>`.

## Usage

```sh
cd /path/to/site
source ../lcojsite/bin/activate
./manage.py <command> [options]
```

## User Management

### adduser - Add a user

Quickly create a new user.

```sh
./manage.py adduser <username> <email> <password>
```

**Example:**
```sh
./manage.py adduser alice alice@example.com password123
```

**Options:**
- `--superuser` - Create a superuser
- `--staff` - Create a staff user

### batchadduser - Add multiple users

Add multiple users from a CSV file.

```sh
./manage.py batchadduser <csv_file>
```

**CSV format:**
```csv
username,email,password,first_name,last_name
user1,user1@example.com,pass1,John,Doe
user2,user2@example.com,pass2,Jane,Smith
```

**Example:**
```sh
./manage.py batchadduser users.csv
```

### move_user_content - Move user content

Move all content (submissions, comments) from one user to another.

```sh
./manage.py move_user_content <from_user> <to_user>
```

**Example:**
```sh
./manage.py move_user_content old_account new_account
```

**Note:** This command does not delete the old user; it only moves the content.

## Judge Management

### addjudge - Add a judge

Create a new judge with an authentication key.

```sh
./manage.py addjudge <judge_name>
```

**Example:**
```sh
./manage.py addjudge judge1
```

The command automatically generates and displays the authentication key.

### runbridged - Run the bridge

Run the bridge server that judges connect to.

```sh
./manage.py runbridged
```

**Options:**
- `--host <host>` - Host to bind to (default: localhost)
- `--port <port>` - Port to bind to (default: 9999)

**Example:**
```sh
./manage.py runbridged --host 0.0.0.0 --port 9999
```

**Note:** This usually runs under supervisor rather than directly.

### runbalancer - Run the load balancer

Run a load balancer for multiple judges.

```sh
./manage.py runbalancer
```

## Problem Management

### generate_editorials - Generate editorials automatically

Generate editorials for problems automatically using AI, with Pydantic structured output to guarantee a consistent format.

```sh
./manage.py generate_editorials [options]
```

**Requirements:**
- Install the packages: `pip install openai pydantic`
- Set the API key: `export OPENAI_API_KEY="sk-..."`
- Or configure it in `environment/openai.env`

**Options:**

| Option | Description | Default |
|----------|-------|----------|
| `--problem CODE`, `-p CODE` | Process a specific problem | All problems without an editorial |
| `--limit N`, `-l N` | Maximum number of problems to process | 10 |
| `--offset N` | Start from position N | 0 |
| `--dry-run` | Preview mode; nothing is saved to the DB | False |
| `--verbose` | Show detailed progress | False |
| `--model MODEL` | OpenAI model to use | mimo-v2-flash |
| `--temperature T` | Creativity (0.0-2.0) | 0.7 |
| `--max-retries N` | Number of retries on API errors | 3 |
| `--retry-delay S` | Delay between retries (seconds) | 2 |
| `--log-file PATH` | Write logs to a file | None |

**Examples:**

```sh
# Step 1: Test with one problem (dry run - IMPORTANT)
./manage.py generate_editorials --problem cb01 --dry-run --verbose

# Step 2: Generate the editorial for one problem
./manage.py generate_editorials --problem cb01 --verbose

# Step 3: Process multiple problems with logging
./manage.py generate_editorials --limit 20 --log-file /tmp/editorials.log --verbose

# Step 4: Resume from the 50th problem
./manage.py generate_editorials --limit 50 --offset 50

# Use a different model
./manage.py generate_editorials --problem cb01 --model gpt-4 --temperature 0.5
```

**How it works:**

1. Finds problems that do not have an editorial yet (is_public=True)
2. Picks 3 distinct AC submissions (C/C++ preferred)
3. Sends them to the OpenAI API with Pydantic structured output
4. Builds the editorial in a standard format with these sections:
   - Understanding the problem
   - Approaches (from simplest to optimal)
   - Complexity analysis
   - Key takeaways
   - Common pitfalls
5. Saves it to the database with PUBLIC status

**Editorial format:**

````markdown
## Hiểu bài toán
[Clear explanation of the problem]

## Các cách tiếp cận

### Cách Brute Force
```cpp
[code]
```
* **Time Complexity**: O(n²)
* **Space Complexity**: O(1)
[Detailed explanation]

### Cách Hash Map
[code + explanation]

## Phân tích độ phức tạp
| Cách tiếp cận | Time | Space | Tên |
|--------------|------|-------|-----|
| 1 | O(n²) | O(1) | Brute Force |
| 2 | O(n) | O(n) | Hash Map |

## Bài học kinh nghiệm
- [Insight 1]
- [Insight 2]

## Lỗi thường gặp
- [Pitfall 1]
- [Pitfall 2]
````

**Review and publish:**

```sh
# Check in the database
./manage.py shell
>>> from judge.models import Solution
>>> s = Solution.objects.get(problem__code='cb01')
>>> print(s.content[:500])
>>> print(f"Is public: {s.is_public}")
>>> print(f"Authors: {[a.user.username for a in s.authors.all()]}")

# View on the website
# https://luyencode.net/problem/cb01/editorial
```

**Batch processing:**

```sh
# Run in the background with nohup
nohup ./manage.py generate_editorials --limit 100 --log-file /tmp/editorials.log > /tmp/output.log 2>&1 &

# Monitor progress
tail -f /tmp/output.log

# Check the results
grep "✓" /tmp/editorials.log | wc -l  # Number of successful problems
grep "✗" /tmp/editorials.log | wc -l  # Number of failed problems
```

**Rolling back if needed:**

```sh
./manage.py shell
>>> from judge.models import Solution

# Delete the editorial for a specific problem
>>> Solution.objects.filter(problem__code='cb01').delete()

# Delete all PUBLIC editorials (careful!)
>>> Solution.objects.filter(is_public=True).delete()

# Delete the 10 most recent editorials
>>> from django.db.models import Max
>>> last_id = Solution.objects.aggregate(Max('id'))['id__max']
>>> Solution.objects.filter(id__gte=last_id - 10).delete()
```

**Notes:**
- Editorials are created with PUBLIC status (is_public=True)
- The system automatically adds the admin and the authors of the source solutions to the authors list
- Use `--dry-run` to test before generating for real
- The API may be rate-limited; lower `--limit` if you hit errors
- Processing time: ~5-15 seconds per problem

**Troubleshooting:**

```sh
# Error: "OpenAI package not installed"
pip install openai pydantic

# Error: "OPENAI_API_KEY not set"
export OPENAI_API_KEY="sk-..."

# Error: "No AC solutions found"
# Check whether the problem has any AC submissions
./manage.py shell
>>> from judge.models import Submission
>>> Submission.objects.filter(problem__code='xxx', result='AC').count()

# Error: API rate limit
# Reduce the batch size and increase the delay
./manage.py generate_editorials --limit 5 --retry-delay 5
```

### create_problem - Create a problem

Quickly create a new problem.

```sh
./manage.py create_problem <code> <name>
```

**Example:**
```sh
./manage.py create_problem APLUSB "A Plus B"
```

**Options:**
- `--time-limit <seconds>` - Time limit
- `--memory-limit <kb>` - Memory limit
- `--points <points>` - Problem points

### import_polygon_package - Import from Polygon

Import a problem from a Polygon (Codeforces) package.

```sh
./manage.py import_polygon_package <zip_file>
```

**Example:**
```sh
./manage.py import_polygon_package problem.zip
```

### submit_polygon_solutions - Test solutions

Submit all solutions from a Polygon package for testing.

```sh
./manage.py submit_polygon_solutions <problem_code>
```

### copy_language - Copy languages

Copy the language configuration from one problem to another.

```sh
./manage.py copy_language <from_problem> <to_problem>
```

**Example:**
```sh
./manage.py copy_language APLUSB SORTING
```

## Contest Management

### export_contest_submissions - Export submissions

Export all submissions of a contest to CSV.

```sh
./manage.py export_contest_submissions <contest_key> <output_file>
```

**Example:**
```sh
./manage.py export_contest_submissions contest2024 submissions.csv
```

### export_contest_submissions_details - Export details

Export submissions along with their source code.

```sh
./manage.py export_contest_submissions_details <contest_key> <output_dir>
```

**Example:**
```sh
./manage.py export_contest_submissions_details contest2024 ./export/
```

### export_event_feed - Export the event feed

Export the event feed for ICPC tools.

```sh
./manage.py export_event_feed <contest_key> <output_file>
```

**Example:**
```sh
./manage.py export_event_feed icpc2024 events.json
```

### runmoss - Run MOSS

Run MOSS to detect cheating in a contest.

```sh
./manage.py runmoss <contest_key>
```

**Example:**
```sh
./manage.py runmoss contest2024
```

**Requirement:** A MOSS user ID must be configured in settings.

## API & Tokens

### generate_api_token - Generate an API token

Generate an API token for a user.

```sh
./manage.py generate_api_token <username>
```

**Example:**
```sh
./manage.py generate_api_token alice
```

The token is printed to the console.

## Utilities

### render_pdf - Render a PDF

Render a problem statement to PDF.

```sh
./manage.py render_pdf <problem_code> <output_file>
```

**Example:**
```sh
./manage.py render_pdf APLUSB aplusb.pdf
```

**Requirement:** Pdfoid must be configured.

### generate_sitemap - Generate the sitemap

Generate sitemap.xml for SEO.

```sh
./manage.py generate_sitemap
```

The sitemap is saved in the static directory.

### camo - Camo proxy

Run the Camo proxy for images.

```sh
./manage.py camo
```

**Note:** Rarely used; use standalone Camo instead.

### makedmojmessages - Generate translation files

Generate translation files for localization.

```sh
./manage.py makedmojmessages
```

Then compile them:

```sh
./manage.py compilemessages
```

## Permissions & Credits

### update_permissions - Update permissions

Update permissions for all users based on their groups.

```sh
./manage.py update_permissions
```

### backfill_current_credit - Backfill current credit

Update the current credit for users.

```sh
./manage.py backfill_current_credit
```

### backfill_monthly_credit - Backfill monthly credit

Update the monthly credit for users.

```sh
./manage.py backfill_monthly_credit
```

## Real-world examples

### Initial setup

```sh
# Create a superuser
./manage.py createsuperuser

# Create a judge
./manage.py addjudge judge1

# Create a sample problem
./manage.py create_problem HELLO "Hello World" --time-limit 1 --memory-limit 65536 --points 100
```

### Generate editorials automatically

```sh
# Step 1: Install dependencies
pip install openai pydantic

# Step 2: Set the API key
export OPENAI_API_KEY="sk-..."

# Step 3: Test with one problem (dry run)
./manage.py generate_editorials --problem cb01 --dry-run --verbose

# Step 4: Generate the editorial for real
./manage.py generate_editorials --problem cb01 --verbose

# Step 5: Check the result
./manage.py shell
>>> from judge.models import Solution
>>> s = Solution.objects.get(problem__code='cb01')
>>> print(f"Editorial created: {s.is_public}")
>>> print(f"Content length: {len(s.content)} chars")

# Step 6: Batch processing
./manage.py generate_editorials --limit 50 --log-file /tmp/editorials.log

# Step 7: Monitor progress
tail -f /tmp/editorials.log
```

### Contest management

```sh
# Export submissions after the contest
./manage.py export_contest_submissions contest2024 submissions.csv

# Run MOSS to check for cheating
./manage.py runmoss contest2024

# Export the event feed for ICPC tools
./manage.py export_event_feed contest2024 events.json
```

### Batch operations

```sh
# Add multiple users from CSV
./manage.py batchadduser students.csv

# Generate API tokens for all users
for user in $(cat users.txt); do
    ./manage.py generate_api_token $user >> tokens.txt
done
```

### Maintenance

```sh
# Update permissions
./manage.py update_permissions

# Regenerate the sitemap
./manage.py generate_sitemap

# Render all problem statements to PDF
for problem in APLUSB SORTING GRAPH; do
    ./manage.py render_pdf $problem pdfs/$problem.pdf
done
```

## Tips

### Run in the background

```sh
nohup ./manage.py runbridged > bridged.log 2>&1 &
```

### Run with a timeout

```sh
timeout 3600 ./manage.py runmoss contest2024
```

### Run periodically with cron

```cron
# Generate the sitemap every day at 2 AM
0 2 * * * cd /path/to/site && ./manage.py generate_sitemap

# Backfill credit every month
0 0 1 * * cd /path/to/site && ./manage.py backfill_monthly_credit
```

## See also

To list all available commands:

```sh
./manage.py help
```

To view help for a specific command:

```sh
./manage.py help <command>
```

**Example:**
```sh
./manage.py help adduser
```
