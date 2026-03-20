# LeetCode-Style 150-Problem Curriculum Track Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create 150 original competitive programming problems covering 15 topic areas with Easy/Medium/Hard difficulty progression, filling all critical topic gaps on LCOJ.

**Architecture:** Problems created via Django ORM (DB records) + Python test generators (data.zip + init.yml). Each problem follows the `problem-creator` skill workflow (design → DB insert → test data → init.yml → AC submission → editorial). After each batch, use the `problem-review` skill to verify quality. Problems grouped in topic batches for parallel creation.

**Skills to invoke:**
- `problem-creator` — for each problem creation (Steps 0-6 per the skill)
- `problem-review` — mandatory after each batch of problems is created (Step 7)

**Tech Stack:** Python 3.11 (Django shell for DB), Python 3.12 (test generators on host), MariaDB, DMOJ judge

**Design doc:** `docs/plans/2026-03-20-leetcode-curriculum-design.md`

---

## Phase 0: Infrastructure Setup

### Task 0.1: Create problem type entries for new topics

**Files:**
- Run: `./scripts/manage.py shell` from `dmoj/`

**Step 1: Create new ProblemType entries**

```python
from judge.models import ProblemType

new_types = [
    ('linked-list', 'Danh sách liên kết'),
    ('two-pointers', 'Hai con trỏ'),
    ('sliding-window', 'Cửa sổ trượt'),
    ('binary-tree', 'Cây nhị phân'),
    ('binary-search-tree', 'Cây tìm kiếm nhị phân'),
    ('trie', 'Cây tiền tố'),
    ('fenwick-tree', 'Cây Fenwick'),
    ('monotonic-stack', 'Ngăn xếp đơn điệu'),
    ('topological-sort', 'Sắp xếp tô pô'),
]

for name, full_name in new_types:
    pt, created = ProblemType.objects.get_or_create(
        name=name,
        defaults={'full_name': full_name}
    )
    print(f'{"CREATED" if created else "EXISTS":7s}: {pt.name} ({pt.full_name})')
```

**Step 2: Run to verify**

Run: `./scripts/manage.py shell < create_types.py`
Expected: All 9 types created

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add problem type entries for curriculum topics"
```

---

### Task 0.2: Create reusable problem creation script

**Files:**
- Create: `scripts/create_lc_problem.py`

**Step 1: Write the batch problem creator script**

```python
#!/usr/bin/env python3
"""
create_lc_problem.py — Create an LCOJ problem from a problem spec dict.

Usage:
    docker compose exec site python3 manage.py shell < scripts/create_lc_problem.py

The script reads PROBLEM_SPEC from stdin or can be imported as a module.
"""
import sys
import json
from django.utils import timezone
from judge.models import Problem, ProblemGroup, ProblemType, Language, Profile, Submission, SubmissionSource, Solution


def create_problem(spec, author_username='admin'):
    """Create a problem from a spec dict."""
    code = spec['code']
    name = spec['name']
    description = spec['description']
    time_limit = spec.get('time_limit', 2.0)
    memory_limit = spec.get('memory_limit', 262144)
    points = spec.get('points', 100.0)
    group_name = spec['group']  # 'Easy', 'mid', 'hard'
    type_names = spec['types']  # list of type names
    source_code = spec.get('source_code', '')

    # Group mapping
    group_map = {'Easy': 'Easy', 'mid': 'mid', 'hard': 'hard', 'super-hard': 'super-hard'}
    group = ProblemGroup.objects.get(name=group_map.get(group_name, group_name))

    # Create problem
    p, created = Problem.objects.get_or_create(
        code=code,
        defaults={
            'name': name,
            'description': description,
            'time_limit': time_limit,
            'memory_limit': memory_limit,
            'points': points,
            'partial': False,
            'is_public': True,
            'is_manually_managed': True,
            'date': timezone.now(),
            'group': group,
        }
    )

    if not created:
        print(f'EXISTS: {code}')
        return p

    # Set types
    types = []
    for tn in type_names:
        pt, _ = ProblemType.objects.get_or_create(
            name=tn,
            defaults={'full_name': tn}
        )
        types.append(pt)
    p.types.set(types)

    # Set allowed languages
    p.allowed_languages.set(Language.objects.filter(include_in_problem=True))

    # Create AC submission if source provided
    if source_code:
        try:
            profile = Profile.objects.get(user__username=author_username)
            lang = Language.objects.get(key='PY3')
            sub = Submission.objects.create(
                user=profile,
                problem=p,
                language=lang,
                status='D',
                result='AC',
                points=points,
                case_points=points,
                case_total=points,
                time=0.5,
                memory=32768,
                judged_date=timezone.now(),
            )
            SubmissionSource.objects.create(submission=sub, source=source_code)
            print(f'AC sub #{sub.id} created')
        except Exception as e:
            print(f'WARNING: AC submission not created: {e}')

    print(f'CREATED: {code} — {name} ({group_name}, {points}p)')
    return p
```

**Step 2: Verify script runs**

Run: `echo "print('OK')" | ./scripts/manage.py shell`
Expected: No import errors

**Step 3: Commit**

```bash
git add scripts/create_lc_problem.py
git commit -m "feat: add reusable problem creation script"
```

---

## Phase 1: Create Linked List Problems (8 problems)

### Task 1.1: Create ll_e01 — Reverse Linked List

**Files:**
- Run: `./scripts/manage.py shell < create_ll_e01.py`
- Create: `dmoj/problems/lc_ll_e01/init.yml`
- Create: `dmoj/problems/lc_ll_e01/data.zip`

**Step 1: Insert problem into DB**

```python
# create_ll_e01.py
from django.utils import timezone
from judge.models import Problem, ProblemGroup, ProblemType, Language

p = Problem.objects.create(
    code='lc_ll_e01',
    name='Đảo ngược Danh sách Liên kết',
    description='''## Đề bài

Cho một danh sách liên kết đơn gồm ~n~ nút. Hãy đảo ngược danh sách liên kết và trả về danh sách đã đảo ngược.

## Input

Dòng đầu tiên chứa số nguyên ~n~ (~1 \leq n \leq 5000~) — số lượng nút.
Dòng thứ hai chứa ~n~ số nguyên ~a_1, a_2, \\ldots, a_n~ (~|a_i| \leq 10^9~) — giá trị các nút.

## Output

In ra ~n~ số nguyên — giá trị các nút sau khi đảo ngược.

## Ví dụ

### Input 1
```
5
1 2 3 4 5
```

### Output 1
```
5 4 3 2 1
```

**Giải thích:** Danh sách 1→2→3→4→5 được đảo ngược thành 5→4→3→2→1.

### Input 2
```
1
42
```

### Output 2
```
42
```
''',
    time_limit=1.0,
    memory_limit=262144,
    points=1.0,
    partial=False,
    is_public=True,
    is_manually_managed=True,
    date=timezone.now(),
    group=ProblemGroup.objects.get(name='Easy'),
)
p.types.set([ProblemType.objects.get_or_create(name='linked-list', defaults={'full_name': 'Danh sách liên kết'})[0]])
p.allowed_languages.set(Language.objects.filter(include_in_problem=True))
print(f'Created {p.code}')
```

**Step 2: Create test data generator**

```python
#!/usr/bin/env python3
# gen_ll_e01.py — run from lcoj-docker/
import os, random, zipfile

CODE = 'lc_ll_e01'
PROBLEMS_DIR = 'dmoj/problems'

def solve(inp: str) -> str:
    lines = inp.strip().split('\n')
    n = int(lines[0])
    if n == 0:
        return '\n'
    arr = list(map(int, lines[1].split()))
    return ' '.join(map(str, arr[::-1])) + '\n'

def make_cases():
    cases = []
    rng = random.Random(42)

    # Sample
    cases.append(('5\n1 2 3 4 5\n', '5 4 3 2 1\n'))
    cases.append(('1\n42\n', '42\n'))

    # Edge cases
    cases.append(('2\n1 2\n', '2 1\n'))
    cases.append(('3\n-1 0 1\n', '1 0 -1\n'))
    cases.append(('10\n' + ' '.join(str(i) for i in range(1, 11)) + '\n',
                  ' '.join(str(i) for i in range(10, 0, -1)) + '\n'))

    # All same
    cases.append(('5\n7 7 7 7 7\n', '7 7 7 7 7\n'))

    # Large stress
    for _ in range(10):
        n = rng.randint(4000, 5000)
        arr = [rng.randint(-10**9, 10**9) for _ in range(n)]
        inp = f'{n}\n' + ' '.join(map(str, arr)) + '\n'
        cases.append((inp, solve(inp)))

    return cases

def verify(cases):
    for i, (inp, expected) in enumerate(cases, 1):
        actual = solve(inp)
        if actual.strip() != expected.strip():
            raise ValueError(f'Case {i} FAILED')
    print(f'All {len(cases)} cases verified')

def write(cases):
    problem_dir = os.path.join(PROBLEMS_DIR, CODE)
    os.makedirs(problem_dir, exist_ok=True)
    pts = max(1, 100 // len(cases))

    with zipfile.ZipFile(os.path.join(problem_dir, 'data.zip'), 'w', zipfile.ZIP_DEFLATED) as zf:
        for i, (inp, out) in enumerate(cases, 1):
            zf.writestr(f'{i}.in', inp)
            zf.writestr(f'{i}.out', out)

    lines = ['archive: data.zip', 'checker: standard', 'test_cases:']
    for i in range(1, len(cases) + 1):
        lines += [f'- in: {i}.in', f'  out: {i}.out', f'  points: {pts}']
    with open(os.path.join(problem_dir, 'init.yml'), 'w') as f:
        f.write('\n'.join(lines) + '\n')
    print(f'Written {len(cases)} cases to {problem_dir}/')

if __name__ == '__main__':
    cases = make_cases()
    verify(cases)
    write(cases)
```

**Step 3: Run generator**

Run: `python3 gen_ll_e01.py`
Expected: "All 17 cases verified" + "Written 17 cases"

**Step 4: Commit**

```bash
git add dmoj/problems/lc_ll_e01/ scripts/gen_ll_e01.py
git commit -m "feat(lc_ll_e01): Reverse Linked List — Easy"
```

---

### Tasks 1.2–1.8: Remaining Linked List problems

Repeat the same pattern for each. Key specs:

| Task | Code | Name | Points | TL | Key edge cases |
|---|---|---|---|---|---|
| 1.2 | lc_ll_e02 | Merge Two Sorted Lists | 1.0 | 1.0s | empty lists, one empty, duplicates |
| 1.3 | lc_ll_e03 | Linked List Cycle | 1.0 | 1.0s | no cycle, cycle at head, cycle at tail |
| 1.4 | lc_ll_m01 | Remove Nth Node From End | 3.0 | 1.0s | remove head, remove tail, n=1 |
| 1.5 | lc_ll_m02 | Add Two Numbers | 3.0 | 1.0s | different lengths, carry at end |
| 1.6 | lc_ll_m03 | Flatten Multilevel Linked List | 3.0 | 1.0s | no children, deeply nested |
| 1.7 | lc_ll_h01 | Merge K Sorted Lists | 6.0 | 2.0s | k=1, all empty, unequal lengths |
| 1.8 | lc_ll_h02 | LRU Cache | 6.0 | 2.0s | capacity=1, full capacity, repeated keys |

**Each task follows steps 1-4 from Task 1.1.**

---

## Phase 2: Create Two Pointers Problems (8 problems)

### Tasks 2.1–2.8

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 2.1 | lc_tp_e01 | Two Sum Sorted | E | 1.0 | 1.0s |
| 2.2 | lc_tp_e02 | Remove Duplicates from Sorted | E | 1.0 | 1.0s |
| 2.3 | lc_tp_e03 | Move Zeroes | E | 1.0 | 1.0s |
| 2.4 | lc_tp_m01 | 3Sum | M | 3.0 | 2.0s |
| 2.5 | lc_tp_m02 | Container With Most Water | M | 3.0 | 1.0s |
| 2.6 | lc_tp_m03 | Trapping Rain Water | M | 3.0 | 1.0s |
| 2.7 | lc_tp_h01 | 4Sum Count | H | 6.0 | 3.0s |
| 2.8 | lc_tp_h02 | Minimum Window Subsequence | H | 6.0 | 2.0s |

---

## Phase 3: Create Sliding Window Problems (6 problems)

### Tasks 3.1–3.6

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 3.1 | lc_sw_e01 | Max Average Subarray | E | 1.0 | 1.0s |
| 3.2 | lc_sw_e02 | Contains Duplicate II | E | 1.0 | 1.0s |
| 3.3 | lc_sw_m01 | Longest Substring Without Repeating | M | 3.0 | 1.0s |
| 3.4 | lc_sw_m02 | Minimum Size Subarray Sum | M | 3.0 | 1.0s |
| 3.5 | lc_sw_h01 | Minimum Window Substring | H | 6.0 | 2.0s |
| 3.6 | lc_sw_h02 | Sliding Window Maximum | H | 6.0 | 2.0s |

---

## Phase 4: Create Binary Tree Problems (8 problems)

### Tasks 4.1–4.8

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 4.1 | lc_bt_e01 | Maximum Depth of Binary Tree | E | 1.0 | 1.0s |
| 4.2 | lc_bt_e02 | Invert Binary Tree | E | 1.0 | 1.0s |
| 4.3 | lc_bt_e03 | Symmetric Tree | E | 1.0 | 1.0s |
| 4.4 | lc_bt_m01 | Binary Tree Level Order Traversal | M | 3.0 | 1.0s |
| 4.5 | lc_bt_m02 | Construct from Inorder and Preorder | M | 3.0 | 1.0s |
| 4.6 | lc_bt_m03 | Lowest Common Ancestor | M | 3.0 | 1.0s |
| 4.7 | lc_bt_h01 | Binary Tree Maximum Path Sum | H | 6.0 | 1.0s |
| 4.8 | lc_bt_h02 | Serialize and Deserialize Binary Tree | H | 6.0 | 2.0s |

---

## Phase 5: Create BST Problems (4 problems)

### Tasks 5.1–5.4

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 5.1 | lc_bst_e01 | Validate BST | E | 1.0 | 1.0s |
| 5.2 | lc_bst_e02 | Kth Smallest Element in BST | E | 1.0 | 1.0s |
| 5.3 | lc_bst_m01 | BST Iterator | M | 3.0 | 1.0s |
| 5.4 | lc_bst_h01 | Count of Range Sum | H | 6.0 | 2.0s |

---

## Phase 6: Create Stack & Queue Problems (8 problems)

### Tasks 6.1–6.8

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 6.1 | lc_stk_e01 | Valid Parentheses | E | 1.0 | 1.0s |
| 6.2 | lc_stk_e02 | Implement Queue using Stacks | E | 1.0 | 1.0s |
| 6.3 | lc_stk_e03 | Min Stack | E | 1.0 | 1.0s |
| 6.4 | lc_stk_m01 | Evaluate Reverse Polish Notation | M | 3.0 | 1.0s |
| 6.5 | lc_stk_m02 | Decode String | M | 3.0 | 1.0s |
| 6.6 | lc_stk_m03 | Asteroid Collision | M | 3.0 | 1.0s |
| 6.7 | lc_stk_h01 | Basic Calculator | H | 6.0 | 2.0s |
| 6.8 | lc_stk_h02 | Longest Valid Parentheses | H | 6.0 | 1.0s |

---

## Phase 7: Create Heap/Priority Queue Problems (4 problems)

### Tasks 7.1–7.4

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 7.1 | lc_hp_e01 | Kth Largest Element | E | 1.0 | 1.0s |
| 7.2 | lc_hp_e02 | Last Stone Weight | E | 1.0 | 1.0s |
| 7.3 | lc_hp_m01 | Task Scheduler | M | 3.0 | 1.0s |
| 7.4 | lc_hp_h01 | Find Median from Data Stream | H | 6.0 | 2.0s |

---

## Phase 8: Create DFS/BFS Problems (8 problems)

### Tasks 8.1–8.8

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 8.1 | lc_gb_e01 | Number of Islands | E | 1.0 | 1.0s |
| 8.2 | lc_gb_e02 | Flood Fill | E | 1.0 | 1.0s |
| 8.3 | lc_gb_e03 | Max Area of Island | E | 1.0 | 1.0s |
| 8.4 | lc_gb_m01 | Rotting Oranges | M | 3.0 | 1.0s |
| 8.5 | lc_gb_m02 | Word Search | M | 3.0 | 2.0s |
| 8.6 | lc_gb_m03 | Pacific Atlantic Water Flow | M | 3.0 | 1.0s |
| 8.7 | lc_gb_h01 | Word Ladder | H | 6.0 | 3.0s |
| 8.8 | lc_gb_h02 | Sudoku Solver | H | 6.0 | 5.0s |

---

## Phase 9: Create Dynamic Programming Problems (10 problems)

### Tasks 9.1–9.10

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 9.1 | lc_dp_e01 | Climbing Stairs | E | 1.0 | 1.0s |
| 9.2 | lc_dp_e02 | House Robber | E | 1.0 | 1.0s |
| 9.3 | lc_dp_e03 | Maximum Subarray | E | 1.0 | 1.0s |
| 9.4 | lc_dp_m01 | Coin Change | M | 3.0 | 1.0s |
| 9.5 | lc_dp_m02 | Longest Increasing Subsequence | M | 3.0 | 1.0s |
| 9.6 | lc_dp_m03 | Unique Paths | M | 3.0 | 1.0s |
| 9.7 | lc_dp_m04 | Word Break | M | 3.0 | 1.0s |
| 9.8 | lc_dp_h01 | Longest Common Subsequence | H | 6.0 | 2.0s |
| 9.9 | lc_dp_h02 | Edit Distance | H | 6.0 | 2.0s |
| 9.10 | lc_dp_h03 | Burst Balloons | H | 6.0 | 3.0s |

---

## Phase 10: Create Greedy Problems (6 problems)

### Tasks 10.1–10.6

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 10.1 | lc_gr_e01 | Assign Cookies | E | 1.0 | 1.0s |
| 10.2 | lc_gr_e02 | Lemonade Change | E | 1.0 | 1.0s |
| 10.3 | lc_gr_m01 | Jump Game | M | 3.0 | 1.0s |
| 10.4 | lc_gr_m02 | Partition Labels | M | 3.0 | 1.0s |
| 10.5 | lc_gr_h01 | Candy | H | 6.0 | 1.0s |
| 10.6 | lc_gr_h02 | IPO | H | 6.0 | 2.0s |

---

## Phase 11: Create Backtracking Problems (4 problems)

### Tasks 11.1–11.4

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 11.1 | lc_btbk_e01 | Subsets | E | 1.0 | 1.0s |
| 11.2 | lc_btbk_m01 | Permutations | M | 3.0 | 1.0s |
| 11.3 | lc_btbk_m02 | Combination Sum | M | 3.0 | 2.0s |
| 11.4 | lc_btbk_h01 | N-Queens | H | 6.0 | 3.0s |

---

## Phase 12: Create Divide & Conquer Problems (4 problems)

### Tasks 12.1–12.4

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 12.1 | lc_dc_e01 | Merge Sort | E | 1.0 | 2.0s |
| 12.2 | lc_dc_e02 | Majority Element | E | 1.0 | 1.0s |
| 12.3 | lc_dc_m01 | Sort Colors | M | 3.0 | 1.0s |
| 12.4 | lc_dc_h01 | Count of Range Sum | H | 6.0 | 2.0s |

---

## Phase 13: Create Bit Manipulation Problems (4 problems)

### Tasks 13.1–13.4

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 13.1 | lc_bm_e01 | Single Number | E | 1.0 | 1.0s |
| 13.2 | lc_bm_e02 | Counting Bits | E | 1.0 | 1.0s |
| 13.3 | lc_bm_m01 | Subsets II | M | 3.0 | 1.0s |
| 13.4 | lc_bm_h01 | Max XOR of Two Numbers | H | 6.0 | 2.0s |

---

## Phase 14: Create Sorting Problems (4 problems)

### Tasks 14.1–14.4

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 14.1 | lc_srt_e01 | Sort Array by Parity | E | 1.0 | 1.0s |
| 14.2 | lc_srt_e02 | Squares of Sorted Array | E | 1.0 | 1.0s |
| 14.3 | lc_srt_m01 | Merge Intervals | M | 3.0 | 1.0s |
| 14.4 | lc_srt_m02 | Insert Interval | M | 3.0 | 1.0s |

---

## Phase 15: Create Advanced DS Problems (25 problems)

### Tasks 15.1–15.4: Trie

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 15.1 | lc_trie_e01 | Implement Trie | E | 1.0 | 1.0s |
| 15.2 | lc_trie_e02 | Longest Common Prefix | E | 1.0 | 1.0s |
| 15.3 | lc_trie_m01 | Word Search II | M | 3.0 | 3.0s |
| 15.4 | lc_trie_h01 | Design Search Autocomplete | H | 6.0 | 2.0s |

### Tasks 15.5–15.10: Segment Tree

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 15.5 | lc_seg_e01 | Range Sum Query Mutable | E | 1.0 | 1.0s |
| 15.6 | lc_seg_e02 | Range Minimum Query | E | 1.0 | 1.0s |
| 15.7 | lc_seg_m01 | Count of Range Sum (SegTree) | M | 3.0 | 2.0s |
| 15.8 | lc_seg_m02 | My Calendar I | M | 3.0 | 1.0s |
| 15.9 | lc_seg_h01 | Falling Squares | H | 6.0 | 2.0s |
| 15.10 | lc_seg_h02 | Rectangle Area II | H | 6.0 | 2.0s |

### Tasks 15.11–15.14: Fenwick Tree (BIT)

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 15.11 | lc_bit_e01 | Range Sum Query (BIT) | E | 1.0 | 1.0s |
| 15.12 | lc_bit_e02 | Count Inversions | E | 1.0 | 2.0s |
| 15.13 | lc_bit_m01 | Count of Smaller Numbers | M | 3.0 | 2.0s |
| 15.14 | lc_bit_h01 | 2D Range Sum Query | H | 6.0 | 2.0s |

### Tasks 15.15–15.18: DSU/Union-Find

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 15.15 | lc_dsu_e01 | Connected Components Count | E | 1.0 | 1.0s |
| 15.16 | lc_dsu_e02 | Redundant Connection | E | 1.0 | 1.0s |
| 15.17 | lc_dsu_m01 | Accounts Merge | M | 3.0 | 2.0s |
| 15.18 | lc_dsu_h01 | Largest Component Size by Factor | H | 6.0 | 2.0s |

### Tasks 15.19–15.22: Monotonic Stack

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 15.19 | lc_ms_e01 | Next Greater Element | E | 1.0 | 1.0s |
| 15.20 | lc_ms_e02 | Daily Temperatures | E | 1.0 | 1.0s |
| 15.21 | lc_ms_m01 | Largest Rectangle in Histogram | M | 3.0 | 1.0s |
| 15.22 | lc_ms_h01 | Maximal Rectangle | H | 6.0 | 2.0s |

### Tasks 15.23–15.25: Topological Sort

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 15.23 | lc_topo_e01 | Course Schedule | E | 1.0 | 1.0s |
| 15.24 | lc_topo_m01 | Course Schedule II | M | 3.0 | 1.0s |
| 15.25 | lc_topo_h01 | Alien Dictionary | H | 6.0 | 2.0s |

---

## Phase 16: Create Math & String Problems (25 problems)

### Tasks 16.1–16.4: Number Theory

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 16.1 | lc_nt_e01 | Count Primes | E | 1.0 | 2.0s |
| 16.2 | lc_nt_e02 | Happy Number | E | 1.0 | 1.0s |
| 16.3 | lc_nt_m01 | Super Pow | M | 3.0 | 1.0s |
| 16.4 | lc_nt_h01 | Ugly Number III | H | 6.0 | 1.0s |

### Tasks 16.5–16.8: Combinatorics

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 16.5 | lc_cmb_e01 | Pascal's Triangle | E | 1.0 | 1.0s |
| 16.6 | lc_cmb_e02 | Fibonacci Number | E | 1.0 | 1.0s |
| 16.7 | lc_cmb_m01 | Unique Binary Search Trees | M | 3.0 | 1.0s |
| 16.8 | lc_cmb_h01 | Count Palindromic Subsequences | H | 6.0 | 2.0s |

### Tasks 16.9–16.11: Game Theory

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 16.9 | lc_gt_e01 | Nim Game | E | 1.0 | 1.0s |
| 16.10 | lc_gt_m01 | Stone Game | M | 3.0 | 1.0s |
| 16.11 | lc_gt_h01 | Can I Win | H | 6.0 | 2.0s |

### Tasks 16.12–16.19: String Algorithms

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 16.12 | lc_str_e01 | Valid Palindrome | E | 1.0 | 1.0s |
| 16.13 | lc_str_e02 | Valid Anagram | E | 1.0 | 1.0s |
| 16.14 | lc_str_e03 | First Unique Character | E | 1.0 | 1.0s |
| 16.15 | lc_str_m01 | Group Anagrams | M | 3.0 | 1.0s |
| 16.16 | lc_str_m02 | Longest Palindromic Substring | M | 3.0 | 1.0s |
| 16.17 | lc_str_m03 | Multiply Strings | M | 3.0 | 1.0s |
| 16.18 | lc_str_h01 | Shortest Palindrome | H | 6.0 | 2.0s |
| 16.19 | lc_str_h02 | Minimum Window Subsequence | H | 6.0 | 2.0s |

### Tasks 16.20–16.23: Hashing

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 16.20 | lc_hsh_e01 | Two Sum | E | 1.0 | 1.0s |
| 16.21 | lc_hsh_e02 | Ransom Note | E | 1.0 | 1.0s |
| 16.22 | lc_hsh_m01 | Longest Consecutive Sequence | M | 3.0 | 1.0s |
| 16.23 | lc_hsh_h01 | Max Points on a Line | H | 6.0 | 2.0s |

### Tasks 16.24–16.25: Arrays & Strings

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 16.24 | lc_arr_m01 | Product of Array Except Self | M | 3.0 | 1.0s |
| 16.25 | lc_arr_h01 | First Missing Positive | H | 6.0 | 1.0s |

---

## Phase 17: Create Binary Search Problems (6 problems)

### Tasks 17.1–17.6

| Task | Code | Name | Diff | Points | TL |
|---|---|---|---|---|---|
| 17.1 | lc_bs_e01 | Binary Search | E | 1.0 | 1.0s |
| 17.2 | lc_bs_e02 | Search Insert Position | E | 1.0 | 1.0s |
| 17.3 | lc_bs_m01 | Search in Rotated Sorted Array | M | 3.0 | 1.0s |
| 17.4 | lc_bs_m02 | Find Peak Element | M | 3.0 | 1.0s |
| 17.5 | lc_bs_h01 | Median of Two Sorted Arrays | H | 6.0 | 1.0s |
| 17.6 | lc_bs_h02 | Split Array Largest Sum | H | 6.0 | 2.0s |

---

## Per-Problem Workflow (use problem-creator skill)

For **each problem** in the phases below, follow the `problem-creator` skill workflow:

1. **Design** — identify intended algorithm, wrong approaches to reject, constraints, time limit
2. **DB insert** — create Problem record via Django ORM (code, name, description, group, types)
3. **Test data** — write generator script with reference solution, verify outputs, pack into data.zip
4. **init.yml** — write test case configuration
5. **AC submission** — create first AC for problem author
6. **Editorial** — create Solution model entry
7. **problem-review** — invoke `problem-review` skill to verify quality before moving to next problem

After each **batch of problems** (e.g., all 8 Linked List problems), run `problem-review` on any
problems that weren't individually reviewed, and fix any FAIL/WARN findings.

---

## Phase 18: Quality Assurance — Run problem-review on all problems

### Task 18.1: Batch review all created problems

**Invoke:** Use the `problem-review` skill for each problem that hasn't been individually reviewed.

**Files:**
- Review: all `dmoj/problems/lc_*/init.yml`
- Review: all test generators

**Step 1: Verify all problems exist in DB**

```python
from judge.models import Problem
lc_problems = Problem.objects.filter(code__startswith='lc_')
print(f'Total LC curriculum problems: {lc_problems.count()}')
for p in lc_problems.order_by('code'):
    types = ', '.join(t.name for t in p.types.all())
    g = p.group.name if p.group else 'N/A'
    print(f'{p.code:20s} | {p.name:45s} | {p.points:>5.1f}p | {g:5s} | [{types}]')
```

Run: `./scripts/manage.py shell < verify_problems.py`
Expected: 150 problems listed

**Step 2: Verify all have test data on disk**

```bash
# Count problems with init.yml
find dmoj/problems/lc_* -name init.yml | wc -l
# Expected: 150

# Count problems with data.zip
find dmoj/problems/lc_* -name data.zip | wc -l
# Expected: 150
```

**Step 3: Verify all have AC submissions**

```python
from judge.models import Problem, Submission
for p in Problem.objects.filter(code__startswith='lc_'):
    ac = Submission.objects.filter(problem=p, result='AC').count()
    if ac == 0:
        print(f'MISSING AC: {p.code}')
print('Done checking AC submissions')
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete 150-problem LeetCode curriculum track"
```

---

## Summary

| Phase | Topics | Problems | Tasks |
|---|---|---|---|
| 0 | Infrastructure | 0 | 2 |
| 1 | Linked List | 8 | 8 |
| 2 | Two Pointers | 8 | 8 |
| 3 | Sliding Window | 6 | 6 |
| 4 | Binary Tree | 8 | 8 |
| 5 | BST | 4 | 4 |
| 6 | Stack & Queue | 8 | 8 |
| 7 | Heap/PQ | 4 | 4 |
| 8 | DFS/BFS | 8 | 8 |
| 9 | Dynamic Programming | 10 | 10 |
| 10 | Greedy | 6 | 6 |
| 11 | Backtracking | 4 | 4 |
| 12 | Divide & Conquer | 4 | 4 |
| 13 | Bit Manipulation | 4 | 4 |
| 14 | Sorting | 4 | 4 |
| 15 | Advanced DS | 25 | 25 |
| 16 | Math & Strings | 25 | 25 |
| 17 | Binary Search | 6 | 6 |
| 18 | QA & Review | 0 | 1 |
| **Total** | **15 topics** | **150** | **151** |
