# Your first problem in 15 minutes

> You will build the "Sum of Two Numbers" (A + B) problem on LCOJ end to end: write the statement, upload tests, pick a checker, test it with real submissions, and make it public.
>
> ⏱ ~15 min · 👤 New problem setters, teachers · 🔑 `judge.add_problem` (to create); making it public needs an admin or `judge.change_public_visibility`

## What you'll do

- Create the problem `aplusb` in the web UI, with a Markdown statement and math.
- Prepare 5 tiny tests, zip them, and upload them in the test data editor.
- Pick the standard checker and save, so the site generates `init.yml`.
- Submit two correct solutions (C++ and Python) and one deliberately wrong one to see `WA`.
- Make the problem public so everyone can solve it.

```mermaid
flowchart LR
  A[Create problem] --> B[Write statement]
  B --> C[Prepare tests + zip]
  C --> D[Upload tests, pick checker, Save]
  D --> E[Test submissions: AC and WA]
  E --> F[Make public]
```

## Before you start

- [ ] You are signed in to luyencode.net and your account has `judge.add_problem`. If `/problems/create` refuses you, ask an administrator to grant it (see [Permissions](/en/admin/permissions)).
- [ ] You have a zip tool (built into Windows, macOS, and most Linux distributions).
- [ ] (Optional) A C++ compiler or Python to run the solutions locally before submitting.

## Step 1: Create the problem

Goal: a private problem with the code `aplusb`.

1. Open `https://luyencode.net/problems/create` (or go to **Problems** and click the **Create new problem** tab).
2. Fill in:

   | Field | Value |
   |---|---|
   | **Problem code** | `aplusb` |
   | **Problem name** | `Sum of Two Numbers` |
   | **Time limit** | `1` (seconds) |
   | **Memory limit** | keep the default `262144` (KB = 256 MB) |
   | **Points** | `1` |
   | **Allows partial points** | leave it checked (on by default) |

3. Leave the statement field for now; you will write it in step 2 on this same form.

::: warning Problem code rules
A problem code may contain only **lowercase** letters, digits, and underscores (`^[a-z0-9_]+$`), at most 32 characters, and must be unique across LCOJ. `APlusB`, `a-plus-b`, and `a+b` are all rejected. If `aplusb` is taken, add a suffix such as `aplusb_class10a` and use that code in every later step.
:::

✅ **Result:** the form has the code, name, and limits filled in; you have not clicked **Create** yet.

## Step 2: Write the statement

Goal: a clear statement with math and a sample.

1. Scroll to the **Problem body** field. It is pre-filled with a sample statement; delete it.
2. Paste this statement:

````markdown
You are given two integers ~a~ and ~b~. Compute ~a + b~.

## Input

A single line containing two integers ~a~ and ~b~ (~-10^9 \le a, b \le 10^9~).

## Output

Print a single integer, the value of ~a + b~.

## Example

### Input

```
3 5
```

### Output

```
8
```

### Explanation

~3 + 5 = 8~.
````

3. Use the live preview next to the editor to check that the math renders.
4. Click **Create** at the bottom of the page.

::: tip Math uses `~`
On LCOJ, inline math is `~a+b~` and display math is `$$...$$`. `$a+b$` is shown as plain text. You do not need to write the time and memory limits in the statement; the problem sidebar shows them.
:::

✅ **Result:** you land on `/problem/aplusb`. The right sidebar shows **Edit problem** and **Edit test data**. The problem is private: only you (as curator) and administrators can see it.

## Step 3: Prepare the tests

Goal: a file `aplusb.zip` with 5 input/output pairs named in Themis style (`N.inp` / `N.out`) so the test data editor fills in the table for you.

Create these 10 files in an empty folder:

| Test | `N.inp` | `N.out` | What it checks |
|---|---|---|---|
| 1 | `3 5` | `8` | The sample from the statement |
| 2 | `-7 2` | `-5` | Negative numbers |
| 3 | `0 0` | `0` | Zero |
| 4 | `1000000000 1000000000` | `2000000000` | Sum beyond the `int` range |
| 5 | `-1000000000 -1000000000` | `-2000000000` | Largest negative sum |

Create them quickly and zip them:

::: code-group

```bash [Linux / macOS]
mkdir aplusb-tests && cd aplusb-tests
printf '3 5\n'                     > 1.inp; printf '8\n'           > 1.out
printf -- '-7 2\n'                 > 2.inp; printf -- '-5\n'       > 2.out
printf '0 0\n'                     > 3.inp; printf '0\n'           > 3.out
printf '1000000000 1000000000\n'   > 4.inp; printf '2000000000\n'  > 4.out
printf -- '-1000000000 -1000000000\n' > 5.inp; printf -- '-2000000000\n' > 5.out
zip ../aplusb.zip *.inp *.out
```

```powershell [Windows (PowerShell)]
mkdir aplusb-tests; cd aplusb-tests
"3 5"                     | Out-File -Encoding ascii 1.inp; "8"           | Out-File -Encoding ascii 1.out
"-7 2"                    | Out-File -Encoding ascii 2.inp; "-5"          | Out-File -Encoding ascii 2.out
"0 0"                     | Out-File -Encoding ascii 3.inp; "0"           | Out-File -Encoding ascii 3.out
"1000000000 1000000000"   | Out-File -Encoding ascii 4.inp; "2000000000"  | Out-File -Encoding ascii 4.out
"-1000000000 -1000000000" | Out-File -Encoding ascii 5.inp; "-2000000000" | Out-File -Encoding ascii 5.out
Compress-Archive -Path *.inp,*.out -DestinationPath ..\aplusb.zip
```

:::

::: tip Naming rules for automatic filling
- Use **one** naming style for the whole zip: here `1.inp` + `1.out`. `aplusb.1.in` + `aplusb.1.out` also works, but do not mix styles.
- Put the files at the **root** of the zip, not inside a folder.
- Inputs and outputs are sorted naturally (1, 2, …, 10) and paired in order, so there must be as many `.inp` files as `.out` files.
:::

✅ **Result:** you have `aplusb.zip` containing exactly 10 files.

## Step 4: Upload the tests and pick the checker

Goal: save the tests so the site generates `init.yml` for the judges.

1. On the problem page, click **Edit test data** (URL `/problem/aplusb/test_data`).
2. In **Data zip file**, choose `aplusb.zip`.
   If you only have loose files, click **or click here to build zip file** and pick all 10 files; the browser zips them for you.
3. The table fills in 5 **Normal case** rows worth 1 point each, and a yellow notice **Test cases have been filled automatically!** appears. The table is **not saved yet**.
4. Check the **Input file** / **Output file** columns: row 1 is `1.inp` / `1.out`, …, row 5 is `5.inp` / `5.out`.
5. In the **Checker** drop-down, keep **Standard** (`standard`): it compares token by token and ignores extra whitespace. That is the right choice for a problem that prints one integer.
6. Click **Save**.

✅ **Result:** the page reloads without errors, and a **View YAML** link appears next to the title. It shows:

```yaml
archive: aplusb.zip
checker: standard
test_cases:
- in: 1.inp
  out: 1.out
  points: 1
- in: 2.inp
  out: 2.out
  points: 1
- in: 3.inp
  out: 3.out
  points: 1
- in: 4.inp
  out: 4.out
  points: 1
- in: 5.inp
  out: 5.out
  points: 1
```

(The zip name on the `archive` line may differ slightly depending on how the site stores the file; the `test_cases` part should match.)

## Step 5: Test with real submissions

Goal: make sure correct solutions get `AC` and the tests catch a wrong one.

1. On the problem page, click **Submit solution**.
2. Choose the language, paste the code, and click **Submit!**. Do this for each of the three solutions below (wait for each one to finish; by default you can have at most 2 submissions waiting to be judged).

::: code-group

```cpp [Correct: C++ (CPP17)]
#include <bits/stdc++.h>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << a + b << '\n';
    return 0;
}
```

```python [Correct: Python 3 (PY3)]
a, b = map(int, input().split())
print(a + b)
```

```cpp [Deliberately wrong: uses int]
#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b;          // wrong: a + b can exceed 2^31 - 1
    cin >> a >> b;
    cout << a + b << '\n';
    return 0;
}
```

:::

✅ **Result:**

| Solution | What you see |
|---|---|
| C++ with `long long` | All 5 tests **Accepted (AC)**, score `5/5` |
| Python 3 | All 5 tests **Accepted (AC)**, score `5/5` |
| C++ with `int` | Test 4 is **Wrong Answer (WA)** because of overflow (it prints a negative number), the rest are AC; score `4/5`, i.e. 0.8 of the problem's 1 point, because partial points are allowed |

If the wrong solution still passes every test, your tests are too weak; add edge cases. For how to read the results page, see [Submitting and judging](/en/learn/submissions).

## Step 6: Make the problem public

Goal: everyone can see the problem in the list and submit.

A problem created on the site always starts private, and the site's edit form has no public checkbox. Publishing happens in the admin, by an administrator or someone with `judge.change_public_visibility` (the account must be staff):

1. Open `/admin/judge/problem/` and find `aplusb`.
2. Option A: open the problem, tick **Publicly visible**, and click **Save**.
   Option B: tick the problem's checkbox in the list, choose the action **Mark problems as public and set publish date to now**, and run it.

::: info No permission to publish?
Send the problem code (`aplusb`) to an LCOJ administrator and ask them to publish it. If you plan to use the problem in a contest, **do not** publish it first: anyone can read a public problem without joining the contest. See [Your first contest](/en/tutorials/first-contest).
:::

✅ **Result:** sign out (or use a private window) and open `https://luyencode.net/problem/aplusb`: the statement shows normally.

## Verify

- [ ] `/problem/aplusb` shows the statement with rendered math (no `~` around `a + b`).
- [ ] **View YAML** lists 5 tests and `checker: standard`.
- [ ] At least one C++ and one Python submission are `AC` 5/5.
- [ ] The `int` submission is `WA` on test 4.
- [ ] A guest (signed out) can open the problem page after publishing.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| The form says the problem code is invalid | Uppercase letters, `-`, spaces, or the code already exists | Use lowercase letters, digits, `_`; add a suffix if taken |
| Dialog "Files are not in the same format!" after choosing the zip | Mixed naming styles, e.g. `1.inp` with `aplusb.2.in` | Rename everything to one style and zip again |
| Dialog "The number of input files (…) do not match the number of output files (…)!" | A missing `.out` file or a stray extra file | Check the folder; every `N.inp` needs an `N.out` |
| Dialog "No input/output files. Make sure your files are following themis/polygon/cms test format" | File extensions not recognized (`.inp`, `.in`, `.out`, `.ok`, `.ans`) | Rename files as described in [Managing problems](/en/setter/managing-problems) |
| No **View YAML** after saving, with an error at the top | A row is missing a file or points | Read the error, fix the row, and click **Save** again |
| A submission stays queued forever | No judge has picked up the problem or language | Tell an administrator; see [Judge setup](/en/operate/judge-setup) |
| A submission gets `IE` | The judge cannot read the problem data | Check that **View YAML** exists; tell an administrator if it persists |
| A correct solution gets `WA` | The expected output is wrong, or the `.out` file has odd bytes (a BOM) | Reopen the `.out` file and save it as ASCII / UTF-8 without BOM |
| No public checkbox on the edit form | The site form does not have it (except for organization problems) | Publish in the admin as in Step 6 |

## Next steps

- [Managing problems](/en/setter/managing-problems): every problem field, subtasks (batches), rejudging.
- [Problem format](/en/setter/problem-format): writing `init.yml` by hand.
- [Checkers](/en/setter/checkers): floating-point output, multiple answers, custom checkers.
- [Graders](/en/setter/graders) and [Generators](/en/setter/generators): interactive problems and generated tests.
- [Example problems](/en/setter/examples): complete sample problems.
- [Your first contest](/en/tutorials/first-contest): use the problem in a contest.
