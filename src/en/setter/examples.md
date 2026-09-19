# Problem examples

This repository contains real-world problem examples. See [problem_examples on GitHub](https://github.com/luyencode/docs/tree/master/problem_examples) for details.

## List of examples

| Grading type | Directory | Description |
|----------------|---------|-------|
| [Standard grading](https://github.com/luyencode/docs/tree/master/problem_examples/standard/aplusb) | `standard/aplusb` | A simple A+B problem |
| [Batched grading](https://github.com/luyencode/docs/tree/master/problem_examples/batched/hungry) | `batched/hungry` | A problem with multiple subtasks |
| [Custom Grading](https://github.com/luyencode/docs/tree/master/problem_examples/grader/shortest1) | `grader/shortest1` | A problem that needs special grading logic |
| [Interactive Grading](https://github.com/luyencode/docs/tree/master/problem_examples/interactive/seed2) | `interactive/seed2` | An interactive problem (Python) |
| [Native Interactive](https://github.com/luyencode/docs/tree/master/problem_examples/interactive/seed2native) | `interactive/seed2native` | An interactive problem (C++) |
| [Signature Grading](https://github.com/luyencode/docs/tree/master/problem_examples/signature/fastbit) | `signature/fastbit` | A function-implementation problem (IOI-style) |
| [Generator](https://github.com/luyencode/docs/tree/master/problem_examples/generator/ds3) | `generator/ds3` | A problem that uses a generator to create test data |

## Directory structure

```
problem_examples/
├── standard/          # Standard grading problems
│   └── aplusb/
├── batched/          # Problems with batches/subtasks
│   └── hungry/
├── grader/           # Problems using a custom grader
│   └── shortest1/
├── interactive/      # Interactive problems
│   ├── seed2/        # Python interactor
│   └── seed2native/  # C++ interactor
├── signature/        # IOI-style problems
│   └── fastbit/
└── generator/        # Problems using a generator
    └── ds3/
```

## Usage

Each example directory contains:
- `init.yml` - The problem configuration file
- `README.md` - Detailed instructions
- Test data or a generator
- Checker/grader (if any)

## Details

### 1. Standard grading

The simplest kind of problem: the contestant reads input from stdin and prints output to stdout.

**Example:** Compute A + B

```yaml
archive: aplusb.zip
test_cases:
- {in: aplusb.1.in, out: aplusb.1.out, points: 50}
- {in: aplusb.2.in, out: aplusb.2.out, points: 50}
```

### 2. Batched grading

A problem with multiple subtasks, each containing multiple test cases. All test cases in a subtask must pass to earn its points.

**Example:**

```yaml
test_cases:
- points: 30
  batched:
  - {in: test1.1.in, out: test1.1.out}
  - {in: test1.2.in, out: test1.2.out}
- points: 70
  batched:
  - {in: test2.1.in, out: test2.1.out}
  - {in: test2.2.in, out: test2.2.out}
  - {in: test2.3.in, out: test2.3.out}
```

### 3. Custom Grading

A problem that needs special grading logic beyond comparing output.

**Example:** A shortest-path problem with multiple correct answers.

```yaml
custom_judge: grader.py
test_cases:
- {in: test1.in, out: test1.out, points: 100}
```

### 4. Interactive Grading

An interactive problem, where the contestant's program exchanges data with the grader.

**Example:** A number-guessing problem

```yaml
custom_judge: interactor.py
unbuffered: true
test_cases:
- {in: test1.in, points: 100}
```

### 5. Native Interactive Grading

Like interactive grading, but the interactor is written in C/C++ for high performance.

```yaml
unbuffered: true
interactive:
  files: interactor.cpp
  type: testlib
test_cases:
- {in: test1.in, points: 100}
```

### 6. Signature Grading (IOI-style)

The contestant implements a function and does not need to read input or write output.

**Example:** Implement the function `is_valid(n)`

```yaml
signature_grader:
  entry: handler.c
  header: header.h
test_cases:
- {in: test1.in, out: test1.out, points: 100}
```

### 7. Generator

Use a generator to create test data automatically.

```yaml
generator: gen.cpp
test_cases:
- {generator_args: [10], points: 30}
- {generator_args: [100], points: 30}
- {generator_args: [1000], points: 40}
```

## References

- [DMOJ Problem Examples](https://github.com/DMOJ/docs/tree/master/problem_examples)
- [Testlib Documentation](https://github.com/MikeMirzayanov/testlib)
- [Polygon System](https://polygon.codeforces.com/)

## Notes

- The full source code for all of the examples above is available in the DMOJ repository
- You can combine multiple techniques in a single problem
- Test thoroughly before publishing a problem on the production system
