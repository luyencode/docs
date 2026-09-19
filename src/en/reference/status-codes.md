# Status codes

This page lists all the status codes (verdicts) you may get when submitting on LCOJ.

**Note:** A single test case can have multiple errors, but only the one with the highest priority is displayed. The status codes below are listed in increasing order of priority.

## AC - Accepted

Your program is correct! Sometimes the judge includes additional feedback.

## WA - Wrong Answer

Your program ran without errors, but its output is incorrect. Details about the error may be included.

## IR - Invalid Return

Your program exited with an error (a non-zero exit code), meaning it crashed:
- Python: usually includes the exception name, such as `NameError` or `IndexError`
- Java: usually includes the exception name, such as `java.lang.NullPointerException`

## RTE - Runtime Error

Your program encountered an error during execution. This usually happens with C/C++.

### Common RTE errors:

| Message | Cause |
|-----------|-------------|
| `segmentation fault`, `bus error` | Invalid memory access. Usually caused by out-of-bounds array access, dereferencing a NULL pointer, or running out of memory |
| `floating point exception` | Invalid arithmetic operation, for example division by zero |
| `killed` | The program was terminated by the system (cause unknown) |
| `{} syscall disallowed` | The program attempted a system call that is not allowed. If you get this error without doing anything unusual, please [report a bug](https://github.com/luyencode/judge-server/issues) |
| `std::bad_alloc` | Memory could not be allocated (C++) |
| `failed initializing` | Too much memory used for global variables. For example, `int arr[10000][10000]` takes 381MB, exceeding the 64MB limit |

**Common error examples:**

```cpp
// Segmentation fault - Array index out of bounds
int a[100];
a[1000] = 5;  // Error!

// Floating point exception - Division by zero
int x = 10 / 0;  // Error!

// Failed initializing - Array too large
int arr[100000][100000];  // Error if the memory limit is small!
```

## OLE - Output Limit Exceeded

Your program printed too much output (usually > 256MB). Some problems may have a different limit.

**Common causes:**
- An infinite printing loop
- Printing too much debug output

## MLE - Memory Limit Exceeded

Your program used too much memory. This is sometimes reported as an RTE with `segmentation fault` or `std::bad_alloc`.

**How to fix:**
- Reduce array sizes
- Optimize the algorithm to use less memory
- Free memory that is no longer needed

## TLE - Time Limit Exceeded

Your program ran too long and exceeded the time limit.

**How to fix:**
- Optimize the algorithm (reduce its complexity)
- Remove unnecessary loops
- Use more efficient data structures

## IE - Internal Error

An error on the judge's side, or an incorrectly configured problem. If you get this error, please notify an admin.
