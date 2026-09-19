# Problem format

Each problem is stored in its own directory, which must contain an `init.yml` file.

## The `init.yml` file

This file is a YAML object and must contain a `test_cases` key.

`test_cases` can be either:
- A list of test cases
- Two regexes for matching input and output files

There is usually also an `archive` key, which lets you store the problem data in a `.zip` file instead of directly in the directory.

## `test_cases`

There are two ways to specify test cases.

### Option 1: A list of test cases

Each test case is a YAML object containing a `points` key (the number of points the test case is worth).

**Note on `points: 0`:**
- If a test case with `points: 0` fails, all subsequent test cases are skipped
- This also applies to batched test cases

**Incorrect example:**
```yaml
test_cases:
- {in: case1.1.in, out: case1.1.out, points: 100}
- {in: case1.0.in, out: case1.0.out, points: 0}
```

Test case `case1.1` runs before `case1.0`. If `case1.0` fails, the result is `100/100 (WA)`.

**Correct example:**
```yaml
test_cases:
- {in: case1.0.in, out: case1.0.out, points: 0}
- {in: case1.1.in, out: case1.1.out, points: 100}
```

### Normal test cases

A normal test case contains:
- `in`: path to the input file
- `out`: path to the output file
- `points`: the number of points

Paths are relative to the zip file (if `archive` is set) or to the problem directory.

### Batched test cases

A batch contains:
- `points`: the total points for the batch
- `batched`: the list of test cases in the batch

Each test case in a batch contains `in` and `out`.

**Dependencies (optional):**

You can add a `dependencies` key containing a list of the (1-indexed) numbers of the batches this batch depends on. The batch runs only if all the batches it depends on pass.

**Example:**

```yaml
archive: tle16p4.zip
test_cases:
- {points: 0, in: tle16p4.p0.in, out: tle16p4.p0.out}
- {points: 10, in: tle16p4.p1.in, out: tle16p4.p1.out}
- points: 10
  batched:
  - {in: tle16p4.0.in, out: tle16p4.0.out}
  - {in: tle16p4.1.in, out: tle16p4.1.out}
- points: 10
  batched:
  - {in: tle16p4.2.in, out: tle16p4.2.out}
  - {in: tle16p4.3.in, out: tle16p4.3.out}
- points: 10
  batched:
  - {in: tle16p4.4.in, out: tle16p4.4.out}
  - {in: tle16p4.5.in, out: tle16p4.5.out}
  dependencies: [1, 2]
```

The last batch runs only if batches 1 and 2 both pass.

### Option 2: Specifying test cases with regexes

If your test case files follow a consistent naming format, you can use regexes.

Default regex for input files: `^(?=.*?\.in|in).*?(?:(?:^|\W)(?P<batch>\d+)[^\d\s]+)?(?P<case>\d+)[^\d\s]*`

Default regex for output files: `^(?=.*?\.out|out).*?(?:(?:^|\W)(?P<batch>\d+)[^\d\s]+)?(?P<case>\d+)[^\d\s]*`

**Examples of matching file names:**

```
test.1.in
test-1.in
test-case-1.in

test-1-2.in
test-batch-1-case-2.in
1.2.in
problem-1-case-1-batch-2.in
```

The first three files are standalone test cases; the last four are batched.

**Note:** A test case without a batch uses its case number as its batch number. For example:

```
1.in
2.1.in
2.2.in
3.in
```

These are ordered as shown above.

**Customization:**

You can override the regexes with `input_format` and `output_format` in `test_cases`.

By default, each test case is worth 1 point. Set `case_points` or `points` to change this.

**Example:**

```yaml
archive: data.zip
test_cases:
  input_format: test-{case}.in
  output_format: test-{case}.out
  case_points: 10
```
