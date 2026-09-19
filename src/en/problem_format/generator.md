# Generators

Generators are used when a problem has a large amount of test data, instead of creating input/output files by hand.

A generator is a program that takes command-line arguments and produces the input and output for each test case.

## The `generator` node

The `generator` node can be:

**1. A single file name:**

```yaml
generator: gen.cpp
```

**2. An array (main file + auxiliary files):**

```yaml
generator: [gen.cpp, testlib.h, utils.h]
```

**3. A YAML object with the following keys:**

```yaml
generator:
  source: gen.cpp  # Or [gen.cpp, testlib.h]
  language: CPP17
  flags: ['-O2', '-std=c++17']
  compiler_time_limit: 60
  time_limit: 10
  memory_limit: 256000
```

**Keys:**
- `source`: the generator file (or an array of files)
- `language`: the language (detected automatically if not specified)
- `flags`: compiler flags
- `compiler_time_limit`: compilation time limit (defaults to the value in `dmoj/judgeenv.py`)
- `time_limit`: the generator's time limit
- `memory_limit`: memory limit

**Note:** If you use `testlib.h`, set `compiler_time_limit: 60`.

## Generator arguments

Use `generator_args` to pass arguments to the generator:

```yaml
generator: gen.cpp
test_cases:
- {generator_args: [false, 123, "a b\nc"], points: 10}
- {generator_args: [true, 456], points: 20}
- {points: 30}  # generator_args defaults to []
```

**How it works:**
- The first argument is always `"_aux_file"`
- The remaining arguments are converted to strings
- Test case 1: `"_aux_file"`, `"False"`, `"123"`, `"a b\nc"`
- Test case 2: `"_aux_file"`, `"True"`, `"456"`
- Test case 3: `"_aux_file"`

## Generator output

The generator must:
- Print the **input** to `stdout`
- Print the **output** to `stderr`

**Example generator (C++):**

```cpp
#include <iostream>
#include <cstdlib>
using namespace std;

int main(int argc, char* argv[]) {
    // argv[1] = "_aux_file"
    // argv[2] = first argument
    // argv[3] = second argument
    
    int n = atoi(argv[2]);
    bool hard = string(argv[3]) == "True";
    
    // Print the input to stdout
    cout << n << endl;
    
    // Print the output to stderr
    int answer = n * 2;
    if (hard) answer *= 2;
    cerr << answer << endl;
    
    return 0;
}
```

## Per-test-case generators

You can use a different generator for each test case:

```yaml
test_cases:
- generator: gen_easy.cpp
  generator_args: [10]
  points: 30
- generator: gen_hard.cpp
  generator_args: [100]
  points: 70
```

## Combining generators and files

If a test case already has `in` and `out`, the generator does not run:

```yaml
generator: gen.cpp
test_cases:
- {in: manual.in, out: manual.out, points: 10}  # Does not use the generator
- {generator_args: [50], points: 20}  # Uses the generator
- {generator_args: [100], points: 30}  # Uses the generator
```

## Complete example

**init.yml:**

```yaml
archive: data.zip
generator:
  source: gen.cpp
  language: CPP17
  compiler_time_limit: 60
  time_limit: 5
test_cases:
- {generator_args: [10, easy], points: 20}
- {generator_args: [100, medium], points: 30}
- {generator_args: [1000, hard], points: 50}
```

**gen.cpp:**

```cpp
#include <iostream>
#include <string>
#include <cstdlib>
#include <ctime>
using namespace std;

int main(int argc, char* argv[]) {
    int n = atoi(argv[2]);
    string difficulty = argv[3];
    
    srand(time(0));
    
    // Print the input
    cout << n << endl;
    for (int i = 0; i < n; i++) {
        cout << rand() % 100 << " ";
    }
    cout << endl;
    
    // Compute the output
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += rand() % 100;
    }
    
    // Print the output to stderr
    cerr << sum << endl;
    
    return 0;
}
```

## Generators with testlib.h

`testlib.h` is a popular library for writing generators:

```cpp
#include "testlib.h"
#include <iostream>
using namespace std;

int main(int argc, char* argv[]) {
    registerGen(argc, argv, 1);
    
    int n = atoi(argv[2]);
    
    // Print the input
    cout << n << endl;
    for (int i = 0; i < n; i++) {
        cout << rnd.next(1, 100) << " ";
    }
    cout << endl;
    
    // Compute the output and print it to stderr
    // ...
    
    return 0;
}
```

**init.yml:**

```yaml
generator:
  source: [gen.cpp, testlib.h]
  compiler_time_limit: 60
test_cases:
- {generator_args: [10], points: 100}
```

## Benefits of generators

- **Saves storage**: No need to store large input/output files
- **Easy to manage**: Changing test cases only requires editing the generator
- **Random test cases**: Easily create many different test cases
- **Correctness checking**: The generator can compute the expected output
