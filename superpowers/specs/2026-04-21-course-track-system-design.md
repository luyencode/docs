# LCOJ Course and Track System Design

**Date:** 2026-04-21
**Status:** Approved for implementation planning
**Target repo:** `lcoj-docker/dmoj/repo`

## Problem Statement

LCOJ has hundreds of standalone problems, but learners cannot currently follow an ordered course or track. Existing problem taxonomy can group problems by type or category, but it does not support a guided curriculum with lessons, ordered concepts, required and optional practice, homepage discovery, or progress through a learning path.

The first concrete use case is an interactive Python course inspired by concept tracks and beginner exercise collections. The platform feature should be generic so future courses can cover C++, algorithms, data structures, or other topics without Python-specific schema.

## Goals

- Add first-class courses/tracks with ordered learning items.
- Support optional course modules/chapters.
- Let each course item contain a mini lesson written in Markdown.
- Link each item to ordered required and optional LCOJ problems.
- Infer learner progress from existing accepted submissions so historical solves count.
- Display courses on `/courses/` and highlight featured courses on the homepage.
- Keep linked problems as normal `Problem` records so they remain usable across the rest of the site.
- Support an initial Python course that reuses suitable existing problems and leaves room for newly created beginner Python exercises.

## Non-Goals

- Do not build quizzes, checkpoints, or a separate interactive code runner in this first version.
- Do not add a per-user course progress table in the MVP.
- Do not lock users out of later lessons; prerequisites are guidance only.
- Do not create the full Python problem set as part of the platform feature. New Python exercises should be handled by a follow-up content plan.

## Recommended Approach

Add first-class course models inside the existing `judge` Django app. This is more work than static pages or overloading `ProblemGroup`, but it gives the site clean ordering, admin-managed content, required versus optional problems, featured homepage display, and future tracks without Python-specific assumptions.

The alternatives rejected were:

- Use existing `ProblemGroup`/`ProblemType` only. This is faster, but cannot cleanly store lesson Markdown, ordered items, optional problems, or course-level metadata.
- Store course definitions in YAML or JSON files. This is version-control friendly, but weak for admin editing and still requires model-like parsing for progress and visibility.

## Data Model

Add the following models to `judge.models`.

### `Course`

Represents a public learning track.

Fields:

- `key`: unique slug used in URLs, for example `python-basics`.
- `title`: display title.
- `summary`: short card/list description.
- `description`: Markdown course overview.
- `language`: optional short label such as `Python`.
- `is_public`: public visibility flag.
- `is_featured`: homepage visibility flag.
- `display_order`: ordering for list and homepage display.
- `og_image`: optional OpenGraph image path or URL.

URL:

- `/courses/<course.key>/`

### `CourseModule`

Optional grouping inside a course.

Fields:

- `course`: foreign key to `Course`.
- `title`: module title.
- `summary`: short module description.
- `order`: order within the course.

Modules are optional. A course can have ungrouped items, grouped items, or both.

### `CourseItem`

The core lesson unit.

Fields:

- `course`: foreign key to `Course`.
- `module`: nullable foreign key to `CourseModule`.
- `slug`: unique within the course for lesson URLs.
- `title`: item title.
- `summary`: short concept description.
- `lesson`: Markdown mini lesson.
- `order`: order within its module or course.
- `is_public`: public visibility flag.
- `prerequisite`: nullable self foreign key for soft prerequisite guidance.

URL:

- `/courses/<course.key>/<item.slug>/`

### `CourseItemProblem`

Ordered link between a course item and a normal LCOJ problem.

Fields:

- `item`: foreign key to `CourseItem`.
- `problem`: foreign key to `Problem`.
- `order`: order within the item.
- `is_required`: required problems count toward item completion; optional problems are extra practice.
- `note`: optional short guidance shown near the linked problem.

Constraints:

- A problem should appear at most once per course item.
- Ordering should be stable for admin and public display.

## User-Facing Pages

### Course List: `/courses/`

Show all public courses ordered by `display_order` and title.

Each card shows:

- title
- summary
- language label
- module/item count
- required problem count
- progress for logged-in users

Anonymous users see the same course cards without progress.

### Course Overview: `/courses/<course_key>/`

Show:

- course title, summary, and Markdown description
- modules if present
- ordered items
- progress badges: `Not started`, `In progress`, `Completed`
- required/optional problem counts per item
- soft prerequisite text such as `Recommended after: Variables and Input`

Soft prerequisites do not block navigation.

### Course Item Detail: `/courses/<course_key>/<item_slug>/`

Show:

- lesson title and rendered Markdown lesson
- prerequisite guidance if the prerequisite is incomplete
- required problems in order
- optional practice problems in order
- previous/next item navigation
- solved/attempted indicators using `completed_problem_ids` and `attempted_problem_ids`, matching the existing problem-list semantics

Problem links go to the existing problem detail pages. Submissions and judging remain unchanged.

### Homepage

Add a compact featured courses section to the existing homepage.

Selection:

- `Course.objects.filter(is_public=True, is_featured=True)`
- ordered by `display_order`, then title
- limited to 4 courses in the first version

The homepage section links to `/courses/` and individual course pages. It should not replace the current blog/news homepage.

### Navigation

Add a top-level `Courses` navigation item through the existing `NavigationBar` fixture/admin mechanism.

Suggested path:

- `/courses/`

Suggested highlight regex:

- `^/courses/`

## Progress and Prerequisites

Progress is inferred from existing submissions.

For logged-in users:

```python
completed_problem_ids = user_completed_ids(request.profile)
attempted_problem_ids = user_attempted_ids(request.profile)
```

For each visible course item:

- `required_problem_ids`: linked problems where `is_required=True`
- `completed_required`: required IDs present in `completed_problem_ids`

Item status:

- `Completed`: all required visible problems are solved.
- `In progress`: at least one linked visible problem is attempted or solved.
- `Not started`: no linked visible problem is attempted or solved.

Course progress:

- numerator: solved required visible problems across visible items
- denominator: required visible problems across visible items
- optional problems do not affect completion

Edge case:

- If an item has no required visible problems, it should not be marked completed automatically. It should display as `Not started` unless another explicit rule is added later.

Soft prerequisites:

- If an item has a prerequisite and the prerequisite is not completed, show guidance on overview and item detail pages.
- Access remains open.

## Visibility and Access

Public pages show only:

- public courses
- public course items
- linked problems accessible to the current user

Linked private or organization-private problems must not leak through course pages. Use existing `Problem.is_accessible_by(user)` semantics or an equivalent query filter.

Admin users manage draft/private course content through Django admin.

## Admin and Content Workflow

Add Django admin registrations for:

- `Course`
- `CourseModule`
- `CourseItem`
- `CourseItemProblem`

Admin behavior:

- Course modules are ordered within a course.
- Course items are ordered within a course/module.
- Course item problems are editable inline from the course item admin page.
- Problem selection should use `AdminHeavySelect2Widget(data_view='problem_select2')` so attaching problems scales to the current problem set.
- Markdown lesson fields should use `AdminMartorWidget` with the existing preview pattern.

The first Python course should use a mixed content workflow:

1. Create the course and modules.
2. Reuse existing beginner-friendly problems where they fit the lesson order.
3. Create only missing beginner Python exercises in a later content plan.
4. Link new problems as normal `Problem` rows when they exist.

## Query Design

Course detail and item pages should prefetch related content:

- course modules
- course items
- item-problem links
- linked problems

Progress should reuse cached helpers:

- `user_completed_ids`
- `user_attempted_ids`

Avoid per-row database queries while rendering course overviews. A small service/helper module such as `judge.utils.courses` can compute visible item/problem structures and progress summaries for views and tests.

## Testing Plan

Add focused tests for:

- course list shows only public courses and orders them correctly
- course detail hides private items
- course pages do not expose inaccessible linked problems
- item detail renders Markdown lesson content, required problems, optional problems, and previous/next links
- progress uses existing accepted submissions
- item completion counts only required linked problems
- optional problems affect attempted display but not completion percentage
- soft prerequisites display guidance and do not block access
- homepage featured course section shows only public featured courses
- admin registrations and string representations are usable for content management

## Rollout Plan

1. Add models, migrations, admin registration, and helper functions.
2. Add course list/detail/item views, URLs, and templates.
3. Add homepage featured-course query and template block.
4. Add navigation fixture/admin entry for `Courses`.
5. Add tests for visibility, ordering, progress, and rendering.
6. Seed an initial Python course skeleton with modules/items and a small curated set of existing problems.
7. Create a follow-up content plan for missing Python beginner problem packages.

## Open Decisions Resolved

- Course system is generic, not Python-only.
- Course items contain mini lessons, not full checkpoint/quizzes.
- Progress is inferred from submissions only.
- Prerequisites are soft guidance.
- Courses get both `/courses/` and homepage exposure.
- Modules are optional.
- Python content strategy is mixed reuse plus new missing exercises.
- Completion uses required plus optional problem links, with required problems determining item/course completion.
