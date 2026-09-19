# Custom checkers

Custom checkers are used for problems that have multiple correct answers or that award points based on accuracy.

A checker is a Python script that runs after the contestant's program finishes. It grades the output but does not interact with the program.

## Built-in checkers

LCOJ ships with many built-in checkers. To use one:

```yaml
checker:
  name: <checker name>
  args: {}
```

If no arguments are needed:

```yaml
checker: <checker name>
```

## Standard checker - `standard`

This is the default checker if `checker` is not specified.

It compares the contestant's output with the expected output, ignoring whitespace. Specifically, it:
- Splits each line into tokens
- Ignores blank lines
- Compares the tokens one by one

## Easy checker - `easy`

Ignores all whitespace and letter case, and only checks how many times each character occurs.

## Floating point checker - `floats`

Used for problems with floating-point output, allowing for some error.

**Arguments:**
- `precision`: epsilon = 10^(-precision), defaults to 6
- `error_mode`: 
  - `default`: allows either absolute or relative error
  - `relative`: relative error only
  - `absolute`: absolute error only

**Example:**

```yaml
checker:
  name: floats
  args:
    precision: 4
    error_mode: relative
```

### Floatsabs - `floatsabs`

An alias for `floats` with `error_mode: absolute`.

### Floatsrel - `floatsrel`

An alias for `floats` with `error_mode: relative`.

## Identical checker - `identical`

Checks that the output is exactly identical, including whitespace.

**Arguments:**
- `pe_allowed`: defaults to `True`. If `True`, reports "Presentation Error" when the output is correct but the whitespace differs.

## Linecount checker - `linecount`

A special-purpose checker, mainly used for ECOO problems.

**Arguments:**
- `feedback`: defaults to `True`. If `True`, shows ✓ for correct lines and ✗ for incorrect lines.

## Sorted checker - `sorted`

Checks that the outputs are the same, ignoring order.

**Arguments:**
- `split_on`: defaults to `lines`
  - `lines`: ignores the order of lines
  - `whitespace`: ignores the order of tokens

### Unordered checker - `unordered`

An alias for `sorted` with `split_on: whitespace`.

## Writing a custom checker

A checker must implement this function:

```python
def check(process_output, judge_output, **kwargs):
    pass
```

**Arguments in `**kwargs`:**
- `submission_source`: the contestant's source code
- `judge_input`: the test case input
- `point_value`: the test case's point value
- `case_position`: the test case's position (0-indexed)
- `batch`: the test case's batch (0 if not batched)
- `submission_language`: the submission language
- `binary_data`: True if the data has not been normalized
- `execution_time`: execution time (in seconds)
- `problem_id`: the problem code
- `result`: the preliminary result

**The `run_on_error` flag:**

If you set `check.run_on_error = True`, the checker runs even on IR/TLE/RTE/MLE.

**Return value:**

Return a `CheckerResult` or a boolean:

```python
from dmoj.result import CheckerResult

# Return a CheckerResult
return CheckerResult(True, 100, feedback='Correct!')

# Or return a boolean
return True  # AC
return False  # WA
```

**Example:**

```python
def check(process_output, judge_output, **kwargs):
    # Check whether the output contains "Hello"
    if "Hello" in process_output:
        return CheckerResult(True, kwargs['point_value'], feedback='Correct!')
    return CheckerResult(False, 0, feedback='Missing "Hello"')
```

## Native checkers (bridged)

Used for checkers that need heavy computation, written in C/C++.

**Arguments:**
- `files`: the checker's file name or list of files
- `lang`: the language (C/C++)
- `time_limit`: time limit
- `memory_limit`: memory limit
- `compiler_time_limit`: compilation time limit
- `feedback`: show stdout as feedback (defaults to true)
- `flags`: compiler flags
- `type`: the checker type
  - `default`: arguments are `input_file output_file judge_file`. Return 0 = AC, 1 = WA
  - `testlib`: same as default. Return 0 = AC, 1 = WA, 2 = PE, 3 = assertion failure, 7 = partial (with `points X` on stderr)
  - `coci`: like testlib, but the partial format is `partial X/Y`
  - `peg`: compatible with the WCIPEG judge

**Example:**

```yaml
checker:
  name: bridged
  args:
    files: checker.cpp
    lang: CPP17
    type: testlib
```

**Example checker.cpp (testlib):**

```cpp
#include "testlib.h"

int main(int argc, char* argv[]) {
    registerTestlibCmd(argc, argv);
    
    int ja = ans.readInt();  // Expected answer
    int pa = ouf.readInt();  // Contestant's answer
    
    if (ja == pa) {
        quitf(_ok, "Correct!");
    } else {
        quitf(_wa, "Wrong answer: expected %d, got %d", ja, pa);
    }
}
```
