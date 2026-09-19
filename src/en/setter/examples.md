# Problem examples

The LCOJ documentation repository ([luyencode/docs](https://github.com/luyencode/docs)) includes complete, working example problems in its [`problem_examples`](https://github.com/luyencode/docs/tree/master/problem_examples) folder. Each one shows a different way of grading, with a real `init.yml` and all the files it needs. The examples are adapted from the [DMOJ problem examples](https://github.com/DMOJ/docs/tree/master/problem_examples).

## List of examples

| Example | Grading type | What it shows |
|---|---|---|
| [`standard/aplusb`](https://github.com/luyencode/docs/tree/master/problem_examples/standard/aplusb) | Standard | Test data in a zip, three cases worth 5, 20, and 75 points. |
| [`batched/hungry`](https://github.com/luyencode/docs/tree/master/problem_examples/batched/hungry) | Batched | Three subtasks worth 5, 20, and 25 points. |
| [`generator/ds3`](https://github.com/luyencode/docs/tree/master/problem_examples/generator/ds3) | Generator | 20 cases created by a C++ generator, 5 points each. |
| [`grader/shortest1`](https://github.com/luyencode/docs/tree/master/problem_examples/grader/shortest1) | Custom Python grader | A code-golf puzzle graded by a `StandardGrader` subclass. |
| [`interactive/seed2`](https://github.com/luyencode/docs/tree/master/problem_examples/interactive/seed2) | Python interactive grader | A number-guessing game written with `InteractiveGrader`. |
| [`interactive/seed2native`](https://github.com/luyencode/docs/tree/master/problem_examples/interactive/seed2native) | Native interactive | The same game with a C++ interactor. |
| [`signature/fastbit`](https://github.com/luyencode/docs/tree/master/problem_examples/signature/fastbit) | Function signature (IOI-style) + Python checker | The contestant implements one C function. |

Each folder contains an `init.yml`, a `README.md` (in Vietnamese), the test data or generator, and any checker or grader files.

## Trying an example on your own LCOJ

1. Download the example folder, for example `standard/aplusb`.
2. Copy it into your problem data directory, using the folder name as the problem code: `dmoj/problems/aplusb/`.
3. Create a problem with the **same code** (`aplusb`) in the admin and enable **manually managed**, so the web test data editor does not replace the example's `init.yml`.
4. Make sure the judges can see the new directory (see [Judge setup](/en/operate/judge-setup)).
5. Submit a solution and check the results.

## Details

### 1. Standard grading: `standard/aplusb`

The contestant reads the input from stdin and prints the answer to stdout. All test files are inside `aplusb.zip`, and the default `standard` checker compares the output.

```yaml
archive: aplusb.zip
test_cases:
- {in: aplusb.1.in, out: aplusb.1.out, points: 5}
- {in: aplusb.2.in, out: aplusb.2.out, points: 20}
- {in: aplusb.3.in, out: aplusb.3.out, points: 75}
```

See [Problem format](/en/setter/problem-format).

### 2. Batched grading: `batched/hungry`

Cases are grouped into three batches. A batch earns its points only if all of its cases pass.

```yaml
archive: hungry.zip
test_cases:
- batched:
  - {in: hungry.1a.in, out: hungry.1a.out}
  - {in: hungry.1b.in, out: hungry.1b.out}
  - {in: hungry.1c.in, out: hungry.1c.out}
  points: 5
- batched:
  - {in: hungry.2a.in, out: hungry.2a.out}
  - {in: hungry.2b.in, out: hungry.2b.out}
  - {in: hungry.2c.in, out: hungry.2c.out}
  - {in: hungry.2d.in, out: hungry.2d.out}
  points: 20
- batched:
  - {in: hungry.3a.in, out: hungry.3a.out}
  - {in: hungry.3b.in, out: hungry.3b.out}
  - {in: hungry.3c.in, out: hungry.3c.out}
  - {in: hungry.3d.in, out: hungry.3d.out}
  points: 25
```

See [Batched test cases](/en/setter/problem-format#batched-test-cases).

### 3. Generator: `generator/ds3`

There are no stored test files. `generator.cpp` receives the case number in `argv[1]`, prints the input to stdout and the expected output to stderr. The top-level `points: 5` applies to every case.

```yaml
generator: generator.cpp
points: 5
test_cases:
- generator_args: [1]
- generator_args: [2]
# ... up to
- generator_args: [20]
```

See [Generators](/en/setter/generators).

### 4. Custom Python grader: `grader/shortest1`

A code-golf puzzle: the submission is expected to run until the time limit, so a TLE counts as success, and shorter source code earns more points (`min((9 / source length)^5 × points, points)`). The grader subclasses `StandardGrader` and overrides `check_result` and `_interact_with_process`.

```yaml
custom_judge: shortest1.py
test_cases:
- {points: 10}
```

See [Custom Python graders](/en/setter/graders#custom-python-graders-custom-judge).

### 5. Python interactive grader: `interactive/seed2`

Each input file contains a secret number `N`. The contestant guesses; the grader answers `OK`, `FLOATS` (guess too high), or `SINKS` (guess too low). The case passes if the number is found within 31 guesses.

```yaml
custom_judge: seed2.py
unbuffered: true
archive: seed2.zip
test_cases:
- {in: seed2.1.in, points: 20}
- {in: seed2.2.in, points: 20}
- {in: seed2.3.in, points: 20}
- {in: seed2.4.in, points: 20}
- {in: seed2.5.in, points: 20}
```

See [Python interactive grader](/en/setter/graders#python-interactive-grader).

### 6. Native interactive grading: `interactive/seed2native`

The same game, but the interactor is a C++ program. It reads `N` from the input file (`argv[1]`), talks to the contestant through stdin and stdout, and exits with code 0 (accepted) or 1 (wrong answer).

```yaml
unbuffered: True
archive: seed2.zip
interactive: {files: interactor.cpp, type: testlib}
test_cases:
- {in: seed2.1.in, points: 20}
- {in: seed2.2.in, points: 20}
- {in: seed2.3.in, points: 20}
- {in: seed2.4.in, points: 20}
- {in: seed2.5.in, points: 20}
```

See [Native interactive grading](/en/setter/graders#native-interactive-grading-interactive).

### 7. Function signature grading: `signature/fastbit`

The contestant implements `int setbits(unsigned long long)`, declared in `fastbit.h`. The entry file `grader.c` calls it on many random numbers and prints `Correct.` if every answer is right. Every case shares the expected output `correct.txt` (an inherited top-level `out`), and `checker.py` gives full points to sources shorter than 560 bytes and half points otherwise.

```yaml
output_prefix_length: 0
checker: checker.py
signature_grader: {entry: grader.c, header: fastbit.h}
out: correct.txt
test_cases:
- {in: 1.txt, points: 20}
- {in: 2.txt, points: 30}
- {in: 3.txt, points: 50}
```

See [Function signature grading](/en/setter/graders#function-signature-grading-signature-grader) and [Python checkers](/en/setter/checkers#python-checkers).

## References

- [DMOJ problem examples](https://github.com/DMOJ/docs/tree/master/problem_examples), the original source of these examples
- [testlib](https://github.com/VNOI-Admin/testlib), the version installed on LCOJ judges
- [Codeforces Polygon](https://polygon.codeforces.com/), which LCOJ can import from (see [Managing problems](/en/setter/managing-problems))
