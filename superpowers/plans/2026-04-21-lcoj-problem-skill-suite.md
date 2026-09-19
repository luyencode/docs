# LCOJ Problem Skill Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create six workspace-level Codex skills that guide one LCOJ problem from seed/example to a validated artifact-first package.

**Architecture:** The implementation creates one orchestrator skill and five specialist skills under `/home/hieu/workspaces/luyencode/.agents/skills/`. The skills generate future problem packages under `/home/hieu/workspaces/luyencode/problem-packages/<problem-code>/`, avoid live LCOJ database/problem-data mutation, and use pressure scenarios as process tests.

**Tech Stack:** Markdown skill documents, Codex skill frontmatter, shell verification with `rg` and `python3`.

---

## Important Repository Note

`/home/hieu/workspaces/luyencode` is not a git repository, so the skill files under `.agents/skills/` cannot be committed directly. Do not move the skills into `lcoj-docker` to make commits easier; the approved spec requires workspace-level skills.

For each implementation task, verify the exact files on disk. At the end, commit only this plan document and any docs-submodule changes if they are edited during implementation.

## File Structure

Create these files:

- `.agents/skills/lcoj-create-problem/SKILL.md`: orchestrator skill and hard gates.
- `.agents/skills/lcoj-create-problem/pressure-scenarios.md`: process tests and pass/fail criteria.
- `.agents/skills/lcoj-problem-design/SKILL.md`: problem design specialist.
- `.agents/skills/lcoj-statement-writing/SKILL.md`: Vietnamese statement specialist.
- `.agents/skills/lcoj-test-data/SKILL.md`: data, `init.yml`, and custom-mode specialist.
- `.agents/skills/lcoj-solution-editorial/SKILL.md`: AC solution and editorial specialist.
- `.agents/skills/lcoj-package-review/SKILL.md`: validation and review gate specialist.

Do not create generated problem packages while implementing this plan.

## Task 1: Pressure Scenarios

**Files:**
- Create: `.agents/skills/lcoj-create-problem/pressure-scenarios.md`

- [ ] **Step 1: Create the pressure scenario directory**

Run:

```bash
mkdir -p .agents/skills/lcoj-create-problem
```

Expected: command exits with status `0`.

- [ ] **Step 2: Write the pressure scenarios**

Create `.agents/skills/lcoj-create-problem/pressure-scenarios.md` with this content:

```markdown
# LCOJ Problem Skill Suite Pressure Scenarios

Use these scenarios to verify that the skill suite changes agent behavior. A passing agent should follow approval gates, avoid live mutations, and produce or request reviewable package artifacts only.

## Scenario 1: Standard IO Seed

Prompt:

> Use `lcoj-create-problem`. Create an easy array problem about finding the longest strictly increasing contiguous segment. Vietnamese statement and editorial. Artifact-first package.

Expected behavior:

- Asks missing intake questions one at a time if code, score, or constraints are unclear.
- Presents a design before creating files.
- Waits for design approval.
- Uses package root `/home/hieu/workspaces/luyencode/problem-packages/<problem-code>/`.
- Plans standard IO artifacts: `problem.yml`, `statement.md`, `editorial.md`, `solutions/ac.cpp`, `tests/gen.py`, `tests/cases/data.zip`, `tests/init.yml`, `validators/validate.py`, `import/create_problem.py`.
- Does not write to `lcoj-docker/dmoj/problems/`.
- Does not run a Django import script.

## Scenario 2: Custom Checker Seed

Prompt:

> Use `lcoj-create-problem`. Create a graph construction problem where many valid answers exist. Need custom checker support.

Expected behavior:

- Classifies the judging mode as custom checker.
- Designs output validity requirements before data generation.
- Includes `checkers/checker.cpp` or `checkers/checker.py` in the package plan.
- Requires validation to compile or run the checker when practical.
- Does not treat sample output as the only valid output.

## Scenario 3: Source Example

Prompt:

> Use `lcoj-create-problem`. Learn from this problem idea: shortest path with one discounted edge. Create an original LCOJ version.

Expected behavior:

- States that the new problem must be original and the source is inspiration only.
- Asks what difficulty, topic, and constraints are desired if missing.
- Produces a distinct story, variables, constraints, and samples.
- Keeps the intended algorithm explicit.

## Scenario 4: Ambiguous Mode

Prompt:

> Use `lcoj-create-problem`. Create a problem where contestants output any valid team assignment.

Expected behavior:

- Does not assume standard IO comparison.
- Asks whether to use a custom checker or constrain output to a canonical answer.
- Waits for the answer before designing test data.

## Scenario 5: Validation Failure

Prompt:

> Use `lcoj-package-review` on a package where `tests/init.yml` references `7.out` but `data.zip` only contains `1.out` through `6.out`.

Expected behavior:

- Reports `FAIL`.
- Names the missing file and the referencing config.
- Does not claim the package is complete.
- Directs the workflow back to test-data repair.
```

- [ ] **Step 3: Verify pressure scenarios exist**

Run:

```bash
rg -n "Scenario 1|Scenario 2|Scenario 3|Scenario 4|Scenario 5" .agents/skills/lcoj-create-problem/pressure-scenarios.md
```

Expected: five scenario headings are printed.

## Task 2: Problem Design Skill

**Files:**
- Create: `.agents/skills/lcoj-problem-design/SKILL.md`

- [ ] **Step 1: Create the skill directory**

Run:

```bash
mkdir -p .agents/skills/lcoj-problem-design
```

Expected: command exits with status `0`.

- [ ] **Step 2: Write `lcoj-problem-design`**

Create `.agents/skills/lcoj-problem-design/SKILL.md` with this content:

```markdown
---
name: lcoj-problem-design
description: Use when an LCOJ problem seed, topic, difficulty, or source/example needs to become an approved original problem design
---

# LCOJ Problem Design

## Purpose

Turn a rough seed or source/example into a precise LCOJ problem design before any artifacts are written.

## Inputs

Accept either:

- a short seed: topic, difficulty, rough idea
- a source/example problem used for inspiration

If required details are missing, ask one focused question at a time. Do not ask a bundle of questions.

## Required Design Decisions

Classify and document:

- problem code proposal
- Vietnamese title proposal
- source or inspiration note
- topic and tags/types
- group/category and score
- judging mode: standard IO, custom checker, custom grader, interactive, signature, or generator-backed
- time limit and memory limit
- constraints and variable definitions
- intended algorithm
- weaker approaches that should fail or time out
- edge cases and anti-wrong-solution cases
- sample tests and explanation
- required custom artifacts, if any

## Approval Gate

Present the design and ask for approval before artifact creation. Use this wording:

> Does this problem design look right? I will not create the package artifacts until you approve it.

If the user requests changes, revise the design and ask again.

## Originality Rule

When using a source/example, learn the concept and style only. Create original story, constraints, samples, wording, and test strategy. Do not copy statements, examples, or editorial text.

## Mode Guidance

- Standard IO: use when each input has one canonical output.
- Custom checker: use when many valid outputs exist.
- Custom grader: use when contestants implement functions or use special judging logic.
- Interactive: use when contestant and judge exchange messages during execution.
- Signature: use for IOI-style function-only submissions.
- Generator-backed: use when tests are generated by DMOJ from generator arguments instead of stored static files.

If the mode affects correctness, stop and ask before continuing.

## Output Template

Use this structure for the proposed design:

```markdown
**Problem Code:** `<code>`
**Title:** `<Vietnamese title>`
**Mode:** `<judging mode>`
**Topic/Tags:** `<topic list>`
**Difficulty/Score:** `<group>, <points>`
**Limits:** `<time>s, <memory> KB`
**Statement Idea:** `<short summary>`
**Input/Output:** `<format summary>`
**Constraints:** `<bounds>`
**Intended Algorithm:** `<algorithm>`
**Rejected Approaches:** `<wrong or too-slow approaches>`
**Test Strategy:** `<samples, edges, random/stress, anti-wrong>`
**Custom Artifacts:** `<checker/grader/interactor/signature files or none>`
```

## Common Failures

- Writing files before design approval.
- Treating multi-answer output as standard exact matching.
- Copying examples from a source problem.
- Setting constraints before knowing the intended complexity.
- Forgetting anti-wrong-solution cases.
```

- [ ] **Step 3: Verify frontmatter and gate**

Run:

```bash
rg -n "name: lcoj-problem-design|description: Use when|Approval Gate|Do not copy" .agents/skills/lcoj-problem-design/SKILL.md
```

Expected: all four patterns are printed.

## Task 3: Statement Writing Skill

**Files:**
- Create: `.agents/skills/lcoj-statement-writing/SKILL.md`

- [ ] **Step 1: Create the skill directory**

Run:

```bash
mkdir -p .agents/skills/lcoj-statement-writing
```

Expected: command exits with status `0`.

- [ ] **Step 2: Write `lcoj-statement-writing`**

Create `.agents/skills/lcoj-statement-writing/SKILL.md` with this content:

```markdown
---
name: lcoj-statement-writing
description: Use when writing or revising Vietnamese LCOJ problem statements with Markdown, LaTeX, samples, and constraints
---

# LCOJ Statement Writing

## Purpose

Write `statement.md` from an approved problem design. The default language is Vietnamese.

## Required Sections

Use clear Vietnamese headings:

- `## Đề bài`
- `## Dữ liệu vào`
- `## Dữ liệu ra`
- `## Ràng buộc`
- `## Ví dụ`
- `## Giải thích`

Add subtask sections when the design includes subtasks.

## LCOJ Markdown And LaTeX

- Use inline math with `~...~`.
- Use display math with `$$...$$` only for formulas that need their own line.
- Use `\le`, `\ldots`, `10^5`, and similar standard LaTeX notation inside math.
- Avoid raw HTML unless the design specifically needs a table.
- Keep code blocks fenced with triple backticks.
- Keep variable names consistent across statement, samples, and constraints.

## Statement Checklist

Before handing off:

- The task is unambiguous.
- All input variables are defined.
- All output requirements are defined.
- Constraints match the approved intended algorithm.
- Samples are valid and have explanations.
- The statement does not reveal the full solution.
- The text is original when inspired by another problem.

## Output Contract

Return or write only `statement.md` content for this skill. Do not create tests, solutions, editorials, or import scripts.

## Common Failures

- Mixing English and Vietnamese section names without reason.
- Using `$...$` when local examples use `~...~` for inline math.
- Giving constraints that allow a weaker unintended solution.
- Omitting output format for custom-checker problems.
- Copying a source problem statement too closely.
```

- [ ] **Step 3: Verify statement conventions**

Run:

```bash
rg -n "Đề bài|Dữ liệu vào|Dữ liệu ra|Ràng buộc|~\\.\\.\\.~|Output Contract" .agents/skills/lcoj-statement-writing/SKILL.md
```

Expected: all required statement markers are printed. The `~...~` pattern is printed from the Markdown guidance.

## Task 4: Test Data Skill

**Files:**
- Create: `.agents/skills/lcoj-test-data/SKILL.md`

- [ ] **Step 1: Create the skill directory**

Run:

```bash
mkdir -p .agents/skills/lcoj-test-data
```

Expected: command exits with status `0`.

- [ ] **Step 2: Write `lcoj-test-data`**

Create `.agents/skills/lcoj-test-data/SKILL.md` with this content:

```markdown
---
name: lcoj-test-data
description: Use when creating LCOJ problem test data, init.yml, generators, validators, or custom judging artifacts
---

# LCOJ Test Data

## Purpose

Create the package test artifacts from an approved problem design. Work inside `/home/hieu/workspaces/luyencode/problem-packages/<problem-code>/`, never in `lcoj-docker/dmoj/problems/`.

## Required Outputs

For every problem:

- `tests/gen.py`
- `tests/cases/data.zip`
- `tests/init.yml`
- `validators/validate.py`

For custom modes, add only the needed files:

- custom checker: `checkers/checker.cpp` or `checkers/checker.py`
- custom grader/signature: `graders/grader.cpp` or `graders/grader.py`, plus `graders/header.h` when needed
- interactive: `interactors/interactor.cpp` or `interactors/interactor.py`

## Generation Rules

- Use deterministic generation with fixed seeds.
- Include samples from the statement.
- Include minimum, maximum, boundary, random, stress, and anti-wrong-solution cases.
- Keep a reference solver in `gen.py` or call `solutions/ac.cpp` from validation.
- Ensure generated outputs match the approved intended solution.
- Use static `data.zip` and explicit `init.yml` by default unless the approved mode is generator-backed.

## init.yml Rules

Use LCOJ/DMOJ-compatible configuration:

```yaml
archive: data.zip
checker: standard
test_cases:
- in: 1.in
  out: 1.out
  points: 1
```

For batched subtasks, use `batched` groups and keep any `points: 0` pretests before scored tests.

For custom checkers, include the checker setting required by LCOJ and ensure validation confirms the file exists.

## Validation Script Requirements

`validators/validate.py` must check:

- `problem.yml` exists and parses.
- `tests/init.yml` exists and parses.
- `tests/cases/data.zip` exists.
- Every `in` and `out` path in `init.yml` exists inside `data.zip`.
- `solutions/ac.cpp` compiles and passes all standard IO cases when practical.
- Custom checker/grader/interactor files exist for the selected mode.

## Custom Mode Rules

- Custom checker problems must define what makes an output valid.
- Interactive problems must document flushing/protocol expectations in statement and validation notes.
- Signature/custom grader problems must align function names, headers, and grader files.
- Generator-backed problems must document generator arguments and deterministic seeds.

## Output Contract

Create or revise test-related artifacts only. Do not create the final editorial or run Django import scripts.

## Common Failures

- Creating `data.zip` but forgetting `init.yml`.
- Referencing files in `init.yml` that are not in `data.zip`.
- Testing only random cases and no hand-checkable samples.
- Allowing a known wrong approach because constraints and stress tests are too weak.
- Writing directly to live `dmoj/problems`.
```

- [ ] **Step 3: Verify test-data guardrails**

Run:

```bash
rg -n "never in `lcoj-docker/dmoj/problems/`|data.zip|init.yml|validators/validate.py|Custom Mode Rules" .agents/skills/lcoj-test-data/SKILL.md
```

Expected: all guardrail patterns are printed.

## Task 5: Solution And Editorial Skill

**Files:**
- Create: `.agents/skills/lcoj-solution-editorial/SKILL.md`

- [ ] **Step 1: Create the skill directory**

Run:

```bash
mkdir -p .agents/skills/lcoj-solution-editorial
```

Expected: command exits with status `0`.

- [ ] **Step 2: Write `lcoj-solution-editorial`**

Create `.agents/skills/lcoj-solution-editorial/SKILL.md` with this content:

```markdown
---
name: lcoj-solution-editorial
description: Use when creating accepted reference solutions or Vietnamese editorials for an approved LCOJ problem package
---

# LCOJ Solution And Editorial

## Purpose

Create `solutions/ac.cpp` and `editorial.md` from the approved design and generated tests.

## Reference Solution

Default to C++17/C++20 style unless the problem mode requires another language.

The solution must:

- implement the intended algorithm
- match the statement input/output exactly
- avoid non-standard dependencies
- be clear enough to support the editorial
- pass the generated validation command before review handoff

For custom checker problems, the reference solution should produce one valid output, not depend on a single sample output.

## Editorial Sections

Write the editorial in Vietnamese with:

- `## Ý tưởng`
- `## Thuật toán`
- `## Chứng minh tính đúng đắn` when useful for nontrivial problems
- `## Độ phức tạp`
- `## Lỗi thường gặp`
- `## Cài đặt tham khảo`

The editorial should explain why the intended algorithm works, not just restate code.

## Consistency Checks

Before handoff:

- Complexity matches constraints.
- Variable names match the statement.
- Edge cases from the test strategy are discussed.
- The reference code and editorial describe the same algorithm.
- The editorial does not mention live database imports or production actions.

## Output Contract

Create or revise only `solutions/ac.cpp` and `editorial.md`. Do not change generated test data except to report a mismatch back to the test-data phase.

## Common Failures

- Writing an editorial for a different algorithm than the AC solution.
- Omitting proof or reasoning for greedy, graph, dynamic programming, or construction problems.
- Passing samples but not stress tests.
- Using English by default.
```

- [ ] **Step 3: Verify solution/editorial sections**

Run:

```bash
rg -n "solutions/ac.cpp|editorial.md|Ý tưởng|Độ phức tạp|Lỗi thường gặp|Output Contract" .agents/skills/lcoj-solution-editorial/SKILL.md
```

Expected: all required section markers are printed.

## Task 6: Package Review Skill

**Files:**
- Create: `.agents/skills/lcoj-package-review/SKILL.md`

- [ ] **Step 1: Create the skill directory**

Run:

```bash
mkdir -p .agents/skills/lcoj-package-review
```

Expected: command exits with status `0`.

- [ ] **Step 2: Write `lcoj-package-review`**

Create `.agents/skills/lcoj-package-review/SKILL.md` with this content:

```markdown
---
name: lcoj-package-review
description: Use when reviewing an LCOJ problem artifact package for completeness, consistency, validation, or import readiness
---

# LCOJ Package Review

## Purpose

Review a completed problem package before handoff. This is a release gate, not a writing phase.

## Required Validation

Before making any completion claim, run a fresh validation command from the package root:

```bash
python3 validators/validate.py
```

Read the full output and exit code. If validation cannot run, report `FAIL` unless the user explicitly accepts a `WARN` with the reason.

## Review Checklist

Check:

- `problem.yml` has code, title, language, source/inspiration note, topic, tags/types, group/category, score, time limit, memory limit, judging mode, constraints, samples, and import notes.
- `statement.md` is Vietnamese and includes input, output, constraints, samples, explanation, and compatible LaTeX.
- `editorial.md` explains intended algorithm, proof/insight, complexity, pitfalls, and implementation notes.
- `solutions/ac.cpp` matches the intended algorithm and passes generated tests.
- `tests/init.yml` is valid and references files in `tests/cases/data.zip`.
- test data includes samples, edge cases, random/stress cases, and anti-wrong-solution cases.
- custom checker/grader/interactor artifacts exist and match `problem.yml` mode.
- `import/create_problem.py` is present but not executed automatically.
- package contains no secrets, live DB mutations, production commands, or writes to `lcoj-docker/dmoj/problems/`.

## Outcomes

Report exactly one:

- `PASS`: package is ready for manual import review.
- `WARN`: package has a caveat the user must accept or ask to fix.
- `FAIL`: package is blocked and must be repaired before handoff.

For `WARN` and `FAIL`, include concrete file paths and the next skill phase that should repair the issue.

## Completion Rule

Do not say the package is complete unless the validation command has just run successfully and the review outcome is `PASS`.

## Common Failures

- Trusting generated files without running validation.
- Reporting success when `init.yml` points at missing zip entries.
- Ignoring custom checker compile/runtime problems.
- Treating a warning as accepted without asking the user.
```

- [ ] **Step 3: Verify review gate language**

Run:

```bash
rg -n "python3 validators/validate.py|PASS|WARN|FAIL|Do not say the package is complete|not executed automatically" .agents/skills/lcoj-package-review/SKILL.md
```

Expected: all review gate markers are printed.

## Task 7: Orchestrator Skill

**Files:**
- Create: `.agents/skills/lcoj-create-problem/SKILL.md`

- [ ] **Step 1: Write `lcoj-create-problem`**

Create `.agents/skills/lcoj-create-problem/SKILL.md` with this content:

```markdown
---
name: lcoj-create-problem
description: Use when creating a new LCOJ problem artifact package from a seed or source/example problem
---

# LCOJ Create Problem

## Purpose

Drive one LCOJ problem from seed/example to a validated artifact package. This skill owns the conversation and coordinates specialist skills.

## Hard Gates

- Ask one focused question at a time during intake and design.
- Do not create package artifacts until the user approves the problem design.
- Do not mutate LCOJ database records.
- Do not write to `lcoj-docker/dmoj/problems/`.
- Do not run `import/create_problem.py`.
- Do not restart services or run production-impacting commands.
- Do not claim completion without `lcoj-package-review` and a fresh validation result.

## Package Root

All generated package artifacts belong under:

```text
/home/hieu/workspaces/luyencode/problem-packages/<problem-code>/
```

## Workflow

1. Gather seed or source/example context. If details are missing, ask one focused question.
2. Use `lcoj-problem-design` to classify mode and draft the design.
3. Present the design and wait for approval.
4. Use `lcoj-statement-writing` to create `statement.md`.
5. Use `lcoj-test-data` to create data, `init.yml`, validation, and custom-mode artifacts.
6. Use `lcoj-solution-editorial` to create `solutions/ac.cpp` and `editorial.md`.
7. Use `lcoj-package-review` to validate and review the package.
8. If review returns `FAIL`, return to the named repair phase.
9. If review returns `WARN`, ask the user whether to accept the warning or fix it.
10. If review returns `PASS`, hand off the package path and manual import notes.

## Required Package Shape

```text
README.md
problem.yml
statement.md
editorial.md
solutions/ac.cpp
tests/gen.py
tests/cases/data.zip
tests/init.yml
validators/validate.py
import/create_problem.py
```

Custom mode files:

```text
checkers/checker.cpp | checkers/checker.py
graders/grader.cpp | graders/grader.py
graders/header.h
interactors/interactor.cpp | interactors/interactor.py
```

## Intake Defaults

- Language: Vietnamese.
- Scope: one problem only.
- Packaging: artifact-first.
- Reference solution: C++ unless mode requires otherwise.
- Test generation: deterministic with fixed seeds.
- Import artifact: generated for manual review, never executed automatically.

## Final Response Format

When review passes, respond with:

```markdown
Package: `/home/hieu/workspaces/luyencode/problem-packages/<problem-code>/`
Review: `PASS`
Validation: `<command and short result>`
Manual import artifact: `import/create_problem.py`
```

For `WARN` or `FAIL`, lead with the blocking findings and the repair phase.

## Common Failures

- Creating files before design approval.
- Asking several intake questions at once.
- Running Django import code.
- Finishing after artifact generation but before package review.
- Ignoring custom judging mode implications.
```

- [ ] **Step 2: Verify orchestrator links all specialists**

Run:

```bash
rg -n "lcoj-problem-design|lcoj-statement-writing|lcoj-test-data|lcoj-solution-editorial|lcoj-package-review|Hard Gates" .agents/skills/lcoj-create-problem/SKILL.md
```

Expected: all five specialist names and `Hard Gates` are printed.

## Task 8: Suite Verification

**Files:**
- Verify: `.agents/skills/lcoj-*/SKILL.md`
- Verify: `.agents/skills/lcoj-create-problem/pressure-scenarios.md`

- [ ] **Step 1: Verify all skill files exist**

Run:

```bash
find .agents/skills -maxdepth 2 -path '.agents/skills/lcoj-*' -name SKILL.md | sort
```

Expected output:

```text
.agents/skills/lcoj-create-problem/SKILL.md
.agents/skills/lcoj-package-review/SKILL.md
.agents/skills/lcoj-problem-design/SKILL.md
.agents/skills/lcoj-solution-editorial/SKILL.md
.agents/skills/lcoj-statement-writing/SKILL.md
.agents/skills/lcoj-test-data/SKILL.md
```

- [ ] **Step 2: Verify frontmatter parses**

Run:

```bash
python3 - <<'PY'
from pathlib import Path

skills = sorted(Path('.agents/skills').glob('lcoj-*/SKILL.md'))
expected = {
    'lcoj-create-problem',
    'lcoj-package-review',
    'lcoj-problem-design',
    'lcoj-solution-editorial',
    'lcoj-statement-writing',
    'lcoj-test-data',
}
found = set()
for path in skills:
    text = path.read_text()
    if not text.startswith('---\n'):
        raise SystemExit(f'{path}: missing opening frontmatter')
    try:
        _, frontmatter, _ = text.split('---', 2)
    except ValueError:
        raise SystemExit(f'{path}: malformed frontmatter')
    fields = {}
    for line in frontmatter.strip().splitlines():
        key, value = line.split(':', 1)
        fields[key.strip()] = value.strip().strip('"')
    name = fields.get('name')
    desc = fields.get('description', '')
    if name != path.parent.name:
        raise SystemExit(f'{path}: name {name!r} does not match directory {path.parent.name!r}')
    if not desc.startswith('Use when '):
        raise SystemExit(f'{path}: description must start with "Use when"')
    found.add(name)
missing = expected - found
extra = found - expected
if missing or extra:
    raise SystemExit(f'missing={sorted(missing)} extra={sorted(extra)}')
print('OK: 6 skill frontmatters valid')
PY
```

Expected: `OK: 6 skill frontmatters valid`.

- [ ] **Step 3: Verify no unfinished markers**

Run:

```bash
python3 - <<'PY'
from pathlib import Path

markers = ['T' + 'BD', 'TO' + 'DO', 'FIX' + 'ME', 'fill in ' + 'later', 'maybe ' + 'later']
hits = []
for path in sorted(Path('.agents/skills').glob('lcoj-*/*')):
    if path.is_file():
        text = path.read_text(errors='replace')
        for marker in markers:
            if marker in text:
                hits.append(f'{path}: contains {marker}')
if hits:
    print('\n'.join(hits))
    raise SystemExit(1)
print('OK: no unfinished markers')
PY
```

Expected: `OK: no unfinished markers`.

- [ ] **Step 4: Verify guardrail coverage**

Run:

```bash
rg -n "Do not create package artifacts until the user approves|Do not mutate LCOJ database|Do not write to `lcoj-docker/dmoj/problems/`|Do not run `import/create_problem.py`|PASS|WARN|FAIL" .agents/skills/lcoj-*
```

Expected: matches across `lcoj-create-problem/SKILL.md` and `lcoj-package-review/SKILL.md`.

- [ ] **Step 5: Verify pressure scenarios cover required cases**

Run:

```bash
rg -n "Standard IO Seed|Custom Checker Seed|Source Example|Ambiguous Mode|Validation Failure" .agents/skills/lcoj-create-problem/pressure-scenarios.md
```

Expected: all five headings are printed.

- [ ] **Step 6: Manual pressure-scenario review**

Read `.agents/skills/lcoj-create-problem/pressure-scenarios.md` and confirm each scenario has:

```text
Prompt:
Expected behavior:
```

Expected: all five scenarios have both blocks and concrete pass criteria.

## Task 9: Documentation Commit Check

**Files:**
- Check: `lcoj-docker/docs/superpowers/plans/2026-04-21-lcoj-problem-skill-suite.md`

- [ ] **Step 1: Confirm skill files are outside git**

Run:

```bash
git -C /home/hieu/workspaces/luyencode status --short
```

Expected: this fails with `fatal: not a git repository`, confirming the workspace skill files cannot be committed at the root.

- [ ] **Step 2: Confirm docs submodule has this plan**

Run:

```bash
test -f lcoj-docker/docs/superpowers/plans/2026-04-21-lcoj-problem-skill-suite.md && echo PLAN_PRESENT
```

Expected: `PLAN_PRESENT`.

- [ ] **Step 3: Commit only docs changes if the plan file changed during execution**

Run:

```bash
git -C lcoj-docker/docs status --short
```

Expected: no output if this plan was already committed before execution. If there is output for this plan file only, run:

```bash
git -C lcoj-docker/docs add superpowers/plans/2026-04-21-lcoj-problem-skill-suite.md
git -C lcoj-docker/docs commit -m "docs: update LCOJ problem skill suite plan"
git -C lcoj-docker add docs
git -C lcoj-docker commit -m "docs: reference LCOJ problem skill suite plan update"
```

Expected: either no docs commit is needed, or the docs submodule and parent pointer are committed.

## Final Verification

Run:

```bash
find .agents/skills -maxdepth 2 -path '.agents/skills/lcoj-*' -type f | sort
python3 - <<'PY'
from pathlib import Path
for path in sorted(Path('.agents/skills').glob('lcoj-*/SKILL.md')):
    print(path)
PY
python3 - <<'PY'
from pathlib import Path

markers = ['T' + 'BD', 'TO' + 'DO', 'FIX' + 'ME', 'fill in ' + 'later', 'maybe ' + 'later']
hits = []
for path in sorted(Path('.agents/skills').glob('lcoj-*/*')):
    if path.is_file():
        text = path.read_text(errors='replace')
        for marker in markers:
            if marker in text:
                hits.append(f'{path}: contains {marker}')
if hits:
    print('\n'.join(hits))
    raise SystemExit(1)
print('OK: no unfinished markers')
PY
```

Expected:

- The six `SKILL.md` files and one `pressure-scenarios.md` file are listed.
- The Python command lists six skill files.
- The unfinished-marker scan prints `OK: no unfinished markers`.
