# Status codes

> Look up every submission processing status (`QU`, `G`, `D`, ...) and result code (`AC`, `WA`, `TLE`, ...) on LCOJ, with what each means and how to fix it.
>
> ⏱ ~10 min read · 👤 Everyone

## When you need this page

- You see an unfamiliar code on a submission page (for example `IR` or `SC`) and want to know what it means.
- You want to understand why a whole submission is marked `TLE` even though only one test was slow.
- You are writing a tool that reads submission data (for example via the [API](/en/reference/api)) and need the full list of codes.

Every submission on LCOJ carries two pieces of information: a **processing status** (which stage the submission is at) and a **result** (the verdict: whether it passed, and if not, how it failed). This page lists every code, exactly as defined in the site's source (`judge/models/submission.py`) and the judge.

For how to submit and read the submission page, see [Submitting and judging](/en/learn/submissions).

## Processing status

| Code | English name | Vietnamese UI label | Meaning |
|---|---|---|---|
| `QU` | Queued | Đang chờ | Received and waiting for a free judge |
| `P` | Processing | Đang xử lý | A judge picked it up and is compiling |
| `G` | Grading | Chấm điểm | The judge is running test cases |
| `D` | Completed | Đã Hoàn Thành | Grading finished. See the result for the verdict |
| `CE` | Compile Error | Lỗi dịch (CE) | Compilation failed, so nothing was run |
| `IE` | Internal Error | Lỗi Nội Bộ | Something went wrong on the system side, not your fault |
| `AB` | Aborted | Bị hủy bỏ | The submission was cancelled before grading finished |

## Results (verdicts)

| Code | English name | Vietnamese UI label | Summary |
|---|---|---|---|
| `AC` | Accepted | Kết quả đúng (AC) | Correct |
| `PAC` | Partially Accepted | Partially Accepted | Partly correct (only part of the test's points) |
| `WA` | Wrong Answer | Kết quả sai (WA) | Wrong output |
| `TLE` | Time Limit Exceeded | Quá thời gian (TLE) | Ran too long |
| `MLE` | Memory Limit Exceeded | Tràn bộ nhớ (MLE) | Used too much memory |
| `OLE` | Output Limit Exceeded | Kết xuất dữ liệu ra quá nhiều (OLE) | Printed too much |
| `IR` | Invalid Return | Lỗi khi chạy chương trình (IR) | The program exited with a non-zero code |
| `RTE` | Runtime Error | Lỗi Runtime (RE) | The OS killed the program with an error signal |
| `CE` | Compile Error | Lỗi dịch (CE) | Didn't compile |
| `IE` | Internal Error | Lỗi nội bộ (máy chủ chấm bài lỗi) | System-side error |
| `SC` | Short Circuited | Ngắn Mạch | Test skipped, not run |
| `AB` | Aborted | Bị hủy bỏ | Cancelled |

## How the final result is chosen

Grading works on two levels:

1. **Each test case** gets exactly one result. If a test hits several errors at once, the judge picks by priority: `TLE` → `MLE` → `OLE` → `RTE` → `IR` → `WA` → `SC`. A test with no errors is `AC`, or `PAC` if the checker awarded only part of its points.
2. **The whole submission** takes the "worst" result among its tests, in increasing order:

   `SC` < `AC` < `PAC` < `WA` < `MLE` < `TLE` < `IR` < `RTE` < `OLE`

   For example, a submission with one `WA` test and one `TLE` test gets `TLE` overall.

`CE`, `IE`, and `AB` apply to the whole submission, not to individual tests.

::: info Points and results are separate
A `WA` submission can still earn points if the problem allows **partial scoring**. Conversely, on a problem **without** partial scoring you only get points when you pass every test; failing one test means 0 points.
:::

## Result details

### AC: Accepted

Your program was correct on the test. The checker sometimes adds a line of feedback.

### PAC: Partially Accepted

Your program ran without errors, but the checker awarded only **part** of the test's points (common with custom checkers that score by how correct the answer is). On the submission page, `PAC` is colored like `AC`.

### WA: Wrong Answer

Your program finished, but its output didn't match the expected answer.

The default checker (`standard`) compares output token by token and is lenient about whitespace: extra spaces and leading or trailing blank lines are fine. However, **line breaks between tokens must match**, and any extra text (such as `Enter n:`) counts as wrong.

### TLE: Time Limit Exceeded

Your program ran longer than the time limit. On the submission page, a `TLE` test shows its time as `[>1.000s]`.

How to fix it:
- Lower your algorithm's complexity (for example, from O(n²) to O(n log n)).
- Use fast I/O: in C++ add `ios::sync_with_stdio(false); cin.tie(nullptr);`, in Python use `sys.stdin.readline`.
- Check for infinite loops, or a program waiting for input that never comes.

### MLE: Memory Limit Exceeded

Your program used more memory than allowed. Running out of memory sometimes shows up as an `RTE` instead (for example, `std::bad_alloc` or `segmentation fault`).

How to fix it: shrink arrays, avoid copying large data, and use more compact data structures.

### OLE: Output Limit Exceeded

Your program printed too much. By default, the judge limits each test's output to about **24 MB** (`output_limit_length: 25165824` bytes); problem setters can change this per problem.

Common causes: an infinite printing loop, or leftover debug output.

### IR: Invalid Return

Your program exited with a **non-zero** exit code. This usually happens when:
- Python or Java throws an uncaught exception. The judge usually includes the exception name, such as `IndexError` or `java.lang.NullPointerException`.
- C/C++ returns `1` from `main` or calls `exit(1)`. When no error name can be found, the feedback reads `Exit code 1`.

### RTE: Runtime Error

The operating system stopped your program with an error signal. This is most common in C/C++. The judge adds a message:

| Message | Common cause |
|---|---|
| `segmentation fault`, `bus error` | Invalid memory access: out-of-bounds array index, `NULL` pointer dereference, recursion too deep, or out of memory |
| `floating point exception` | Invalid arithmetic, usually integer division or modulo by 0 |
| `aborted` | The program stopped itself, for example because an `assert` failed |
| `killed` | The system killed the program, usually for exceeding a resource limit |
| `std::bad_alloc` | Memory allocation failed (C++) |
| `failed initializing` | The program couldn't even start, usually because global variables are too large for the memory limit (for example, `int a[10000][10000]` needs about 381 MB) |
| `<name> syscall disallowed` | The program made a system call the sandbox forbids (such as opening a file or spawning a process). If you get this without doing anything unusual, please [report it](https://github.com/luyencode/judge-server/issues) |

```cpp
int a[100];
a[1000] = 5;               // segmentation fault: index out of bounds

int x = 10, y = 0;
int z = x / y;             // floating point exception: division by zero

int big[100000][100000];   // failed initializing: global array too large
```

### CE: Compile Error

Your code didn't compile. The compiler's error message appears right on the submission page. Double-check that you picked the **right language** (for example, C++17 code submitted as C) and the right version.

::: warning
In contests with a submission limit, a `CE` submission **still counts** as an attempt. Compile locally before you submit.
:::

### IE: Internal Error

A system-side error: a misconfigured problem, a broken checker, or a judge failure. It's not your fault. Let the problem setter or an administrator know; once the problem is fixed, they can rejudge your submission. `IE` submissions don't count toward a contest's submission limit.

### SC: Short Circuited

The test was **skipped** without running and shows as `—` on the submission page. The judge skips the remaining tests when:
- You fail a test inside a **batch**: the rest of that batch doesn't need to run.
- The problem has **short circuit** enabled: the first failed test ends grading.
- You fail a **0-point** test (usually a sample test).
- A batch depends on another batch you didn't pass.

### AB: Aborted

The submission was cancelled before grading finished, either because you clicked **Abort** while it was being graded or because an administrator cancelled it. Aborted submissions get 0 points.

## Next steps

- [Submitting and judging](/en/learn/submissions): how to submit and read the submission page.
- [Supported languages](/en/reference/languages): pick the right language to avoid `CE`.
- [Checkers](/en/setter/checkers): for problem setters, how a checker decides between `AC`, `PAC`, and `WA`.
- [Glossary](/en/start/glossary): terms such as judge, checker, and test case.
