# LCOJ Problem Skill Suite Design

Date: 2026-04-21

## Goal

Create a workspace-level Codex skill suite that guides agents through creating complete, reviewable LCOJ problem artifact packages from a short seed or source/example problem.

The suite must support continuous work until a package is ready for manual import review, while keeping all generated artifacts outside live LCOJ problem storage and avoiding automatic database mutations.

## Scope

The implementation will create skills under:

- `/home/hieu/workspaces/luyencode/.agents/skills/`

Generated problem packages will be written under:

- `/home/hieu/workspaces/luyencode/problem-packages/<problem-code>/`

The first version focuses on one problem at a time. Batch creation is out of scope for the initial skill suite.

## Core Decisions

- Artifact-first workflow: generated problem packages are reviewable files, not live database changes.
- Vietnamese is the default language for problem statements and editorials.
- A problem workflow can start from either a short seed or a source/example problem.
- The orchestrator must interact with the user like the existing `brainstorming` skill: ask one focused question at a time and use approval gates.
- The suite must support standard IO, custom checker, custom grader, interactive, signature, and generator-backed problem modes.
- Generated packages must include runnable validation automation.
- Generated packages must include a non-executing import artifact for later manual LCOJ creation.

## Architecture

Use one orchestrator skill plus focused specialist skills.

The top-level skill is `lcoj-create-problem`. Users invoke this skill directly. It owns the conversation, asks intake questions, gets design approval, and coordinates the specialist skills in the correct order.

Specialist skills:

- `lcoj-problem-design`: converts a seed or source/example into an approved problem design.
- `lcoj-statement-writing`: writes the Vietnamese LCOJ Markdown statement with compatible LaTeX.
- `lcoj-test-data`: creates generators, test data, `data.zip`, `init.yml`, and optional checker/grader/interactor files.
- `lcoj-solution-editorial`: creates an accepted reference solution and Vietnamese editorial.
- `lcoj-package-review`: validates the package and reports `PASS`, `WARN`, or `FAIL`.

The orchestrator is the only skill that should define the whole order. Specialist skills should stay narrow and should not duplicate the full workflow.

## Workflow

The workflow accepts either:

- a short seed containing topic, difficulty, and rough idea
- a source/example problem used for style and inspiration, while producing original LCOJ content

The orchestrator first classifies the judging mode:

- standard IO
- custom checker
- custom grader
- interactive
- signature
- generator-backed

If the mode is unclear, the orchestrator asks one focused question before proceeding.

The gated workflow is:

1. Intake and context: problem seed/example, audience, topic, difficulty, score, constraints, and judging mode.
2. Problem design: intended solution, rejected weaker approaches, edge cases, subtasks if any, and limits.
3. User approval of the problem design.
4. Statement generation: Vietnamese problem statement with input/output, constraints, samples, explanation, and LaTeX.
5. Test data generation: deterministic generator/reference logic, samples, edge cases, stress/random cases, `data.zip`, and `init.yml`.
6. Accepted solution: at least one reference solution, normally C++ unless the problem mode requires another language.
7. Editorial generation: Vietnamese explanation, insight/proof, complexity, pitfalls, and implementation notes.
8. Package review: run validation automation, inspect consistency, and report findings.
9. Final handoff: package path, validation result, and next manual import steps.

The workflow may loop after statement, tests, solution, editorial, or review if the artifacts do not match the approved design.

## Package Format

Each problem package should use this base structure:

```text
/home/hieu/workspaces/luyencode/problem-packages/<problem-code>/
  README.md
  problem.yml
  statement.md
  editorial.md
  solutions/
    ac.cpp
  tests/
    gen.py
    cases/
    data.zip
    init.yml
  validators/
    validate.py
  import/
    create_problem.py
```

Custom-mode files are added only when required:

```text
  checkers/
    checker.cpp | checker.py
  graders/
    grader.cpp | grader.py
    header.h
  interactors/
    interactor.cpp | interactor.py
```

`problem.yml` is the canonical metadata manifest. It must include:

- problem code
- title
- language
- source or inspiration note
- topic
- tags/types
- group/category
- score
- time limit
- memory limit
- judging mode
- checker/grader/interactor settings when applicable
- constraints
- sample tests
- package notes for later LCOJ import

`import/create_problem.py` is a reviewable Django shell/import artifact. The skill suite must not execute it automatically.

`validators/validate.py` is the package validation entry point. It should parse the manifest, check required files, inspect `init.yml`, verify `data.zip` contents, and run the accepted solution against generated cases when practical.

## Validation And Review

`lcoj-package-review` is the release gate for the artifact package.

Review checks:

- `problem.yml` has all required metadata for later LCOJ import.
- `statement.md` is Vietnamese and includes clear input/output, constraints, samples, and LCOJ-compatible LaTeX.
- `editorial.md` explains the intended algorithm, insight/proof, complexity, pitfalls, and implementation.
- `solutions/ac.cpp` matches the intended algorithm and passes all generated cases.
- `tests/init.yml` is valid DMOJ/LCOJ configuration and references files inside `tests/cases/data.zip`.
- Test data covers samples, edge cases, random/stress cases, and anti-wrong-solution cases.
- Custom checker/grader/interactor artifacts are present and match the selected judging mode.
- The package does not contain secrets, live database mutations, or production actions.

Review outcomes:

- `PASS`: package is ready for manual import review.
- `WARN`: package has accepted caveats; the user must explicitly accept the warning or request fixes.
- `FAIL`: package is blocked and must be fixed before handoff.

The orchestrator must not claim package completion without a fresh validation run and review result.

## Skill Authoring Requirements

The implementation must follow the local `writing-skills` guidance:

- Write skills as reusable process documentation, not one-off narratives.
- Keep frontmatter descriptions focused on trigger conditions.
- Avoid summarizing the full workflow in specialist skill descriptions.
- Use concise skill bodies with links to supporting files only where needed.
- Define pressure scenarios before writing the skills.
- Verify that the skills prevent common agent failures.

Required pressure scenarios:

- Standard IO problem from a short seed.
- Custom checker problem from a short seed.
- Problem from a source/example prompt.
- Ambiguous problem mode where the orchestrator must ask a clarifying question.
- Validation failure where the orchestrator must loop instead of handing off.

## Guardrails

- Ask one focused question at a time during intake and design.
- Do not write problem artifacts until the problem design is approved.
- Do not mutate LCOJ database records.
- Do not write generated packages into `lcoj-docker/dmoj/problems/`.
- Do not restart services or run production-impacting commands.
- Prefer deterministic generators with fixed seeds.
- Keep problem content original when using an example for inspiration.
- Stop and ask if the intended algorithm, constraints, or judging mode are ambiguous enough to affect test quality.
- Make generated import scripts non-executing by default and clearly marked for manual review.

## Out Of Scope

- Batch problem creation.
- Automatic import into the LCOJ database.
- Automatic upload to live `dmoj/problems`.
- Production deployment or service restarts.
- Full site UI changes.

## Success Criteria

The implementation is complete when:

- The six workspace skills exist under `.agents/skills/`.
- The orchestrator guides a user through one-problem artifact creation with approval gates.
- The suite supports all required judging modes at the design and package-structure level.
- A generated package follows the approved directory structure.
- Validation automation can be run from the package.
- The review skill reports `PASS`, `WARN`, or `FAIL` with concrete findings.
- Pressure scenarios show the suite avoids premature artifact writing, live DB mutation, skipped validation, and skipped user approval.
