# Managing Problems

LCOJ provides a web interface for creating and editing problems, including both problem statements and test data.

## Configuration

### With Docker (recommended)

Test data is stored in the `dmoj/problems/` directory, which is mounted into the container automatically.

No extra configuration is needed; this is already set up in Docker.

### With bare metal

In `local_settings.py`, set `DMOJ_PROBLEM_DATA_ROOT`:

```python
DMOJ_PROBLEM_DATA_ROOT = '/home/lcoj/problems'
```

## Adding a New Problem

### Step 1: Open the admin site

Go to `/admin/` and log in with an admin account.

### Step 2: Create the problem

Click the _Add_ button in the _Problems_ section.

![Add Problem](https://i.imgur.com/RFPQaUi.png)

### Step 3: Fill in the basic information

**Required fields:**
- **Problem code**: The problem code (must be unique, e.g. `APLUSB`)
- **Title**: The problem name (e.g. "Sum of Two Numbers")
- **Authors**: **Important!** You must add yourself as an author, otherwise you will not be able to edit the problem

![Problem Info](https://i.imgur.com/bPlNZUR.png)

### Step 4: Write the problem statement

LCOJ supports Markdown with extended features:
- LaTeX for math formulas
- Syntax highlighting for code
- Images and tables

**Example problem statement:**

````markdown
# Problem

Given two integers $a$ and $b$, compute their sum.

## Input

A single line containing two integers $a$ and $b$ ($-10^9 \le a, b \le 10^9$).

## Output

Print a single integer, $a + b$.

## Example

### Input
```
3 5
```

### Output
```
8
```

## Limits

- Time: 1 second
- Memory: 256 MB
````

See the [full template](https://raw.githubusercontent.com/luyencode/docs/master/sample_files/problem_markdown_example.md.txt).

### Step 5: Configure the problem

**Key options:**

- **Time limit**: Time limit (seconds)
- **Memory limit**: Memory limit (KB)
- **Points**: Points for the problem (usually 100)
- **Partial**: Allow partial points
- **Group**: Problem group
- **Types**: Problem types (DP, Graph, Math, ...)
- **Allowed languages**: Allowed languages

### Step 6: Save and view

Click _Save_, then click _View on site_ to view the problem.

![View on site](https://i.imgur.com/ZgO5xcY.png)

## Managing Test Data

### Step 1: Open the test data editor

On the problem page, click _Edit test data_.

![Edit test data](https://i.imgur.com/eDWEEJk.png)

### Step 2: Upload test data

Prepare a zip file containing the test data. Naming convention:

```
<problem_code>.<test_number>.in   # Input file
<problem_code>.<test_number>.out  # Output file
```

**Example:** For problem `APLUSB`:

```
APLUSB.1.in
APLUSB.1.out
APLUSB.2.in
APLUSB.2.out
APLUSB.3.in
APLUSB.3.out
```

Upload the zip file.

![Upload zip](https://i.imgur.com/w5ytsgi.png)

### Step 3: Configure test cases

**Key fields:**

- **Input file**: Path to the input file inside the zip
- **Output file**: Path to the output file inside the zip
- **Points**: Points for the test case

**Example configuration:**

```
Test 1: APLUSB.1.in, APLUSB.1.out, 30 points
Test 2: APLUSB.2.in, APLUSB.2.out, 30 points
Test 3: APLUSB.3.in, APLUSB.3.out, 40 points
```

### Scoring

If _Partial points_ is enabled:

**Formula:**

```
Score = (Points of passed tests / Points of all tests) × Problem points
```

**Example:**

- The problem is worth 100 points
- 3 tests: 1/2/7 points
- A contestant passes tests 1 and 2 and fails test 3
- Score = (1+2)/(1+2+7) × 100 = 30 points

## Batched Test Cases

Use these for problems with subtasks. All tests in a subtask must pass to earn its points.

**How to create:**

1. Click _Add batch_
2. Set the points for the batch
3. Add test cases to the batch

**Example:**

```
Batch 1 (30 points):
  - Test 1.1
  - Test 1.2
  
Batch 2 (70 points):
  - Test 2.1
  - Test 2.2
  - Test 2.3
```

## Custom Checkers

If a problem has multiple correct answers, use a custom checker.

**Built-in checkers:**

- `standard`: Exact comparison (default)
- `floats`: Allows floating-point error
- `sorted`: Ignores order
- `identical`: Character-by-character comparison

**Choosing a checker:**

In the _Checker_ section, select the appropriate checker and configure its parameters.

## Generator

If there are many tests, you can use a generator instead of uploading files.

**How to use:**

1. Upload the generator file (C/C++)
2. Configure the parameters for each test
3. The system generates the input/output automatically

See also: [Generator](/en/setter/generators)

## Test Submission

Once the test data is ready, go back to the problem page and click _Submit solution_ to try a submission.

## Updating Test Data

To modify test data:

1. Open _Edit test data_
2. Upload a new zip file or edit the configuration
3. Click _Save_
4. The test data is updated automatically

## Rejudge

After changing test data, you should rejudge existing submissions:

1. Go to the problem page
2. Click _Rejudge all submissions_
3. Choose the rejudge scope (all submissions, or from a certain point in time)

## Tips

- **Name tests clearly**: Easier to manage and debug
- **Test thoroughly**: Include edge cases and corner cases
- **Check the outputs**: Make sure the expected outputs are correct
- **Try multiple languages**: Test with C++, Python, and Java
- **Read the logs carefully**: If something fails, check the logs for the cause

## Troubleshooting

**Test data does not load:**
- Check the file paths inside the zip
- Check the permissions of the `DMOJ_PROBLEM_DATA_ROOT` directory

**Checker does not work:**
- Check the checker syntax
- Check the error log in the admin

**Rejudge does not run:**
- Check that Celery is running (Docker): `docker compose ps celery`
- View Celery logs (Docker): `docker compose logs -f celery`
- Check Celery (bare metal): `supervisorctl status celery`
- View Celery logs (bare metal): `supervisorctl tail -f celery`
