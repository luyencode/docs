# Custom graders

Custom graders are used when you need special interaction with the contestant's program, beyond simply comparing input and output.

## When should you use a custom grader?

- **Interactive problems**: Data must be exchanged back and forth with the program
- **IOI-style problems**: The contestant implements a function; there is no conventional input/output
- **Complex scoring**: Special grading logic is required

**Note:** In most cases, a built-in checker or a custom checker is enough. A custom grader is only needed when the usual interaction is not sufficient.

## Basic custom grader

In `init.yml`, add:

```yaml
custom_judge: grader.py
```

The `grader.py` file:

```python
from dmoj.graders.standard import StandardGrader
from dmoj.result import Result

class Grader(StandardGrader):
    def grade(self, case):
        # Grading logic
        pass
```

### The `case` parameter

- `case.position`: the test case's position (0-indexed)
- `case.input_data()`: the contents of the input file
- `case.output_data()`: the contents of the expected output file
- `case.points`: the maximum points for the test case

### Return value

Return a `Result` object:

```python
from dmoj.result import Result

result = Result(case)
result.result_flag = Result.AC  # Or Result.WA, Result.TLE, etc.
result.points = case.points
result.feedback = 'Short feedback'
result.extended_feedback = 'Detailed feedback'
result.proc_output = 'Program output'
```

### Example

Problem: Print the line "Hello, World!"

```python
import subprocess
from dmoj.graders.standard import StandardGrader
from dmoj.result import Result

class Grader(StandardGrader):
    def grade(self, case):
        result = Result(case)
        case_input = b'Hello, World!\n'

        # Run the program
        self._current_proc = self.binary.launch(
            time=self.problem.time_limit,
            memory=self.problem.memory_limit,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        output, error = self._current_proc.communicate(case_input)
        self.binary.populate_result(error, result, self._current_proc)

        # Check the output
        if output == case_input:
            result.extended_feedback = 'Correct!'
            if result.result_flag == Result.AC:
                result.points = case.points
        else:
            result.result_flag |= Result.WA
            result.feedback = 'Wrong!'

        return result
```

The `init.yml` file:

```yaml
custom_judge: grader.py
unbuffered: true
test_cases:
- points: 100
```

**Note on `unbuffered`:** Set it to `true` to disable buffering, so contestants don't need to call `flush()`.

## Interactive grading

Used for problems that require back-and-forth interaction with the program.

```python
from dmoj.graders.interactive import InteractiveGrader
from dmoj.utils.unicode import utf8text

class Grader(InteractiveGrader):
    def interact(self, case, interactor):
        # Send data to the contestant
        interactor.writeln('Hello, World!')
        
        # Receive the response
        response = utf8text(interactor.readln())
        
        # Return True if correct, False otherwise
        return response == 'Hello, World!'
```

### `interactor` methods

**Reading data:**
- `interactor.read()`: reads all output
- `interactor.readln(strip_newline=True)`: reads a line
- `interactor.readtoken(delim=None)`: reads a token
- `interactor.readint(lo=-inf, hi=inf, delim=None)`: reads an integer (automatically WA if invalid)
- `interactor.readfloat(lo=-inf, hi=inf, delim=None)`: reads a floating-point number

**Writing data:**
- `interactor.write(val)`: writes data
- `interactor.writeln(val)`: writes data followed by a newline
- `interactor.close()`: closes stdin

### Example: Guess the number

```python
from dmoj.graders.interactive import InteractiveGrader

class Grader(InteractiveGrader):
    def interact(self, case, interactor):
        secret = 42
        attempts = 0
        max_attempts = 10
        
        while attempts < max_attempts:
            guess = interactor.readint(1, 100)
            attempts += 1
            
            if guess == secret:
                interactor.writeln('Correct!')
                return True
            elif guess < secret:
                interactor.writeln('Higher')
            else:
                interactor.writeln('Lower')
        
        interactor.writeln('Out of attempts!')
        return False
```

## Native interactive grading

Uses an interactor written in C/C++ for high performance.

In `init.yml`:

```yaml
unbuffered: true
archive: data.zip
interactive:
  files: interactor.cpp
  type: testlib
test_cases:
- {in: test1.in, points: 50}
- {in: test2.in, points: 50}
```

**Arguments:**
- `files`: the interactor file (or list of files)
- `lang`: the language (automatically detected from the file extension)
- `flags`: compiler flags
- `compiler_time_limit`: compilation time limit
- `preprocessing_time`: extra time for the interactor (defaults to 2s)
- `memory_limit`: memory limit
- `type`: the interactor type (`default`, `testlib`, `coci`, `peg`)

**Example interactor.cpp (testlib):**

```cpp
#include "testlib.h"
#include <iostream>

int main(int argc, char* argv[]) {
    registerInteraction(argc, argv);
    
    int secret = inf.readInt();  // Read from the input file
    int attempts = 0;
    
    while (attempts < 10) {
        int guess = ouf.readInt(1, 100);  // Read from the contestant
        attempts++;
        
        if (guess == secret) {
            std::cout << "Correct!" << std::endl;
            quitf(_ok, "Solved in %d attempts", attempts);
        } else if (guess < secret) {
            std::cout << "Higher" << std::endl;
        } else {
            std::cout << "Lower" << std::endl;
        }
    }
    
    quitf(_wa, "Too many attempts");
}
```

## Function signature grading (IOI-style)

Used for IOI-style problems, where the contestant implements a function instead of reading input and writing output.

In `init.yml`:

```yaml
signature_grader:
  entry: handler.c
  header: header.h
test_cases:
- {in: test1.in, out: test1.out, points: 50}
- {in: test2.in, out: test2.out, points: 50}
```

**Supported languages:** C, C++, Clang

### Example

**header.h:**

```c
#ifndef _GRADER_HEADER_INCLUDED
#define _GRADER_HEADER_INCLUDED
#include <stdbool.h>
bool is_valid(int n);
#endif
```

**handler.c (entry):**

```c
#include "header.h"
#include <stdio.h>

static int n;

int main() {
    scanf("%d", &n);
    bool valid = is_valid(n);  // Function implemented by the contestant
    printf(valid ? "correct" : "wrong");
    return 0;
}
```

**Contestant's submission:**

```c
#include <stdbool.h>

bool is_valid(int n) {
    return n > 0 && n % 2 == 0;
}
```

The system automatically:
- Includes `header.h` in the submission
- Renames the contestant's `main` to `main_GUID`
- Compiles and links it with `handler.c`
