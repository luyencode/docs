# LCOJ LeetCode-Style Curriculum Track Design

**Date:** 2026-03-20
**Status:** Approved
**Target:** Mixed audience (beginners to competitive programmers)

---

## Problem Statement

LCOJ has 2206 public problems but lacks coverage in fundamental CS/algorithm topics
that are standard on platforms like LeetCode. Key issues:

- **8 completely missing topics:** Linked List, Binary Tree, BST, Fenwick Tree,
  Trie, Two Pointers, Sliding Window, Topological Sort, Monotonic Stack
- **557 uncategorized problems** (25% of the problem set)
- **Broken difficulty distribution:** 922 problems at 1.0p, only 5 in 11-75 range
- **No difficulty progression within topics** — most topics only have easy problems

## Solution: 150-Problem Curriculum Track

A new set of 150 original problems covering 15 topic areas with Easy/Medium/Hard
difficulty progression, modeled after LeetCode's problem organization.

### Distribution

| Difficulty | Count | Points |
|---|---|---|
| Easy | 50 | 1.0-2.0p |
| Medium | 55 | 3.0-5.0p |
| Hard | 45 | 6.0-10.0p |

### Problem Code Convention

Format: `lc_<topic_abbrev>_<difficulty><number>`

- Topic abbreviations: `arr`, `ll`, `stk`, `bt`, `bst`, `hp`, `tp`, `sw`, `bs`,
  `gb`, `dp`, `gr`, `btbk`, `dc`, `bm`, `srt`, `trie`, `seg`, `bit`, `dsu`,
  `ms`, `topo`, `nt`, `cmb`, `gt`, `str`, `hsh`
- Difficulty: `e` (easy), `m` (medium), `h` (hard)
- Number: 01-99 within each topic+difficulty

Examples: `lc_tp_e01`, `lc_tree_m03`, `lc_dp_h02`

### Test Cases

Each problem gets 10-20 test cases generated via automated Python scripts:
- Small examples (hand-verifiable)
- Edge cases (empty, single element, boundary values)
- Max constraint stress tests
- Random generated cases for coverage

---

## Complete Problem List

### Data Structures (40 problems)

#### Arrays & Strings (`arr`) — 8 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| arr_e01 | Best Time to Buy and Sell Stock | E | Max profit single transaction | n <= 10^5 |
| arr_e02 | Rotate Array | E | Rotate array by k steps | n <= 10^5 |
| arr_e03 | Plus One | E | Add one to digit array | n <= 100 |
| arr_m01 | Product of Array Except Self | M | Product without division | n <= 10^5, O(n) time |
| arr_m02 | Spiral Matrix | M | Read matrix in spiral order | m,n <= 100 |
| arr_m03 | Subarray Sum Equals K | M | Count subarrays with sum k | n <= 2*10^4 |
| arr_h01 | First Missing Positive | H | Smallest missing positive | n <= 10^5, O(n) time |
| arr_h02 | Maximum Rectangle of 1s | H | Max rectangle of 1s in binary matrix | m,n <= 200 |

#### Linked List (`ll`) — 8 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| ll_e01 | Reverse Linked List | E | Reverse a singly linked list | n <= 5000 |
| ll_e02 | Merge Two Sorted Lists | E | Merge two sorted linked lists | m,n <= 500 |
| ll_e03 | Linked List Cycle | E | Detect cycle in linked list | n <= 10^4 |
| ll_m01 | Remove Nth Node From End | M | Remove nth node from end | n <= 30 |
| ll_m02 | Add Two Numbers | M | Add numbers as linked lists | n <= 100 |
| ll_m03 | Flatten Multilevel List | M | Flatten nested linked list | n <= 10^4 |
| ll_h01 | Merge K Sorted Lists | H | Merge k sorted linked lists | k <= 10^4 |
| ll_h02 | LRU Cache | H | Implement LRU cache | capacity <= 3000 |

#### Stack & Queue (`stk`) — 8 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| stk_e01 | Valid Parentheses | E | Check balanced parentheses | n <= 10^4 |
| stk_e02 | Implement Queue using Stacks | E | Queue with two stacks | n <= 100 ops |
| stk_e03 | Min Stack | E | Stack with O(1) min | n <= 10^4 |
| stk_m01 | Evaluate Reverse Polish Notation | M | Evaluate postfix expression | n <= 10^4 |
| stk_m02 | Decode String | M | Decode nested encoded string | n <= 30 |
| stk_m03 | Asteroid Collision | M | Simulate asteroid collisions | n <= 10^4 |
| stk_h01 | Basic Calculator | H | Evaluate expression with +,-,(,) | n <= 10^4 |
| stk_h02 | Longest Valid Parentheses | H | Longest valid parentheses substring | n <= 3*10^4 |

#### Binary Tree (`bt`) — 8 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| bt_e01 | Maximum Depth of Binary Tree | E | Find max depth | n <= 10^4 |
| bt_e02 | Invert Binary Tree | E | Mirror a binary tree | n <= 1000 |
| bt_e03 | Symmetric Tree | E | Check if tree is symmetric | n <= 1000 |
| bt_m01 | Binary Tree Level Order Traversal | M | BFS level-order traversal | n <= 2000 |
| bt_m02 | Construct from Inorder and Preorder | M | Build tree from traversals | n <= 3000 |
| bt_m03 | Lowest Common Ancestor | M | Find LCA of two nodes | n <= 10^5 |
| bt_h01 | Binary Tree Maximum Path Sum | H | Max path sum in binary tree | n <= 3*10^4 |
| bt_h02 | Serialize and Deserialize Binary Tree | H | Encode/decode binary tree | n <= 10^4 |

#### BST (`bst`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| bst_e01 | Validate BST | E | Check if tree is valid BST | n <= 10^4 |
| bst_e02 | Kth Smallest Element in BST | E | Find kth smallest | n <= 10^4 |
| bst_m01 | BST Iterator | M | Inorder iterator for BST | n <= 10^5 |
| bst_h01 | Count of Range Sum | H | Count ranges in [lower, upper] | n <= 10^4 |

#### Heap/Priority Queue (`hp`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| hp_e01 | Kth Largest Element | E | Find kth largest in array | n <= 10^5 |
| hp_e02 | Last Stone Weight | E | Simulate stone smashing | n <= 30 |
| hp_m01 | Task Scheduler | M | Min intervals for task scheduling | n <= 10^4 |
| hp_h01 | Find Median from Data Stream | H | Running median with two heaps | n <= 5*10^4 |

---

### Algorithms (60 problems)

#### Two Pointers (`tp`) — 8 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| tp_e01 | Two Sum Sorted | E | Find pair with target sum in sorted array | n <= 10^5 |
| tp_e02 | Remove Duplicates from Sorted | E | Remove duplicates from sorted array | n <= 3*10^4 |
| tp_e03 | Move Zeroes | E | Move all zeroes to end | n <= 10^4 |
| tp_m01 | 3Sum | M | Find all triplets that sum to zero | n <= 3000 |
| tp_m02 | Container With Most Water | M | Max area between two vertical lines | n <= 10^5 |
| tp_m03 | Trapping Rain Water | M | Calculate trapped rain water | n <= 2*10^4 |
| tp_h01 | 4Sum Count | H | Count tuples summing to target | n <= 200 |
| tp_h02 | Minimum Window Subsequence | H | Min window containing subsequence | n <= 10^4 |

#### Sliding Window (`sw`) — 6 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| sw_e01 | Max Average Subarray | E | Max average of k-length subarray | n <= 10^5 |
| sw_e02 | Contains Duplicate II | E | Duplicate within distance k | n <= 10^5 |
| sw_m01 | Longest Substring Without Repeating | M | Max length substring without repeats | n <= 5*10^4 |
| sw_m02 | Minimum Size Subarray Sum | M | Smallest subarray with sum >= target | n <= 10^5 |
| sw_h01 | Minimum Window Substring | H | Smallest window containing all chars | n <= 10^5 |
| sw_h02 | Sliding Window Maximum | H | Max element in each window of size k | n <= 10^5 |

#### Binary Search (`bs`) — 6 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| bs_e01 | Binary Search | E | Standard binary search | n <= 10^4 |
| bs_e02 | Search Insert Position | E | Find insert position | n <= 10^4 |
| bs_m01 | Search in Rotated Sorted Array | M | Search in rotated array | n <= 5000 |
| bs_m02 | Find Peak Element | M | Find any peak element | n <= 1000 |
| bs_h01 | Median of Two Sorted Arrays | H | Find median in O(log(m+n)) | m,n <= 1000 |
| bs_h02 | Split Array Largest Sum | H | Minimize largest sum of m subarrays | n <= 1000 |

#### DFS/BFS (`gb`) — 8 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| gb_e01 | Number of Islands | E | Count islands in grid | m,n <= 300 |
| gb_e02 | Flood Fill | E | Fill connected region | m,n <= 50 |
| gb_e03 | Max Area of Island | E | Largest island area | m,n <= 50 |
| gb_m01 | Rotting Oranges | M | Time for all oranges to rot | m,n <= 10 |
| gb_m02 | Word Search | M | Find word in grid | m,n <= 6 |
| gb_m03 | Pacific Atlantic Water Flow | M | Cells flowing to both oceans | m,n <= 200 |
| gb_h01 | Word Ladder | H | Shortest transformation sequence | n <= 10, wordLen <= 10 |
| gb_h02 | Sudoku Solver | H | Solve sudoku with backtracking | 9x9 grid |

#### Dynamic Programming (`dp`) — 10 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| dp_e01 | Climbing Stairs | E | Ways to reach top | n <= 45 |
| dp_e02 | House Robber | E | Max sum without adjacent | n <= 100 |
| dp_e03 | Maximum Subarray | E | Kadane's algorithm | n <= 10^5 |
| dp_m01 | Coin Change | M | Min coins to make amount | amount <= 10^4 |
| dp_m02 | Longest Increasing Subsequence | M | LIS length | n <= 2500 |
| dp_m03 | Unique Paths | M | Count paths in grid | m,n <= 100 |
| dp_m04 | Word Break | M | Can string be segmented | n <= 300 |
| dp_h01 | Longest Common Subsequence | H | LCS of two strings | m,n <= 1000 |
| dp_h02 | Edit Distance | H | Min operations to transform | m,n <= 500 |
| dp_h03 | Burst Balloons | H | Max coins from bursting balloons | n <= 300 |

#### Greedy (`gr`) — 6 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| gr_e01 | Assign Cookies | E | Greedy cookie assignment | m,n <= 3*10^4 |
| gr_e02 | Lemonade Change | E | Can give correct change | n <= 100 |
| gr_m01 | Jump Game | M | Can reach last index | n <= 10^4 |
| gr_m02 | Partition Labels | M | Partition string into max parts | n <= 500 |
| gr_h01 | Candy | H | Min candies for ratings | n <= 2*10^4 |
| gr_h02 | IPO | H | Maximize capital | k <= 100, n <= 10^5 |

#### Backtracking (`btbk`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| btbk_e01 | Subsets | E | All subsets of array | n <= 10 |
| btbk_m01 | Permutations | M | All permutations | n <= 6 |
| btbk_m02 | Combination Sum | M | Combinations summing to target | n <= 30, target <= 40 |
| btbk_h01 | N-Queens | H | Place n queens on board | n <= 9 |

#### Divide & Conquer (`dc`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| dc_e01 | Merge Sort | E | Implement merge sort | n <= 10^5 |
| dc_e02 | Majority Element | E | Find majority element | n <= 5*10^4 |
| dc_m01 | Sort Colors | M | Dutch national flag | n <= 300 |
| dc_h01 | Count of Range Sum | H | Count ranges with merge sort | n <= 10^4 |

#### Bit Manipulation (`bm`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| bm_e01 | Single Number | E | Find unique element | n <= 3*10^4 |
| bm_e02 | Counting Bits | E | Count 1-bits for 0 to n | n <= 10^5 |
| bm_m01 | Subsets II | M | All unique subsets | n <= 10 |
| bm_h01 | Max XOR of Two Numbers | H | Max XOR in array | n <= 2*10^4 |

#### Sorting (`srt`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| srt_e01 | Sort Array by Parity | E | Evens before odds | n <= 5000 |
| srt_e02 | Squares of Sorted Array | E | Squares in sorted order | n <= 10^4 |
| srt_m01 | Merge Intervals | M | Merge overlapping intervals | n <= 10^4 |
| srt_m02 | Insert Interval | M | Insert and merge interval | n <= 10^4 |

---

### Advanced Data Structures (25 problems)

#### Trie (`trie`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| trie_e01 | Implement Trie | E | Insert, search, startsWith | n <= 2000 |
| trie_e02 | Longest Common Prefix | E | Find LCP of string array | n <= 200, len <= 200 |
| trie_m01 | Word Search II | M | Find words in board using trie | m,n <= 12 |
| trie_h01 | Design Search Autocomplete | H | Autocomplete system with ranking | n <= 100 |

#### Segment Tree (`seg`) — 6 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| seg_e01 | Range Sum Query Mutable | E | Point update, range sum | n <= 3*10^4 |
| seg_e02 | Range Minimum Query | E | Point update, range min | n <= 3*10^4 |
| seg_m01 | Count of Range Sum | M | Count ranges with segment tree | n <= 10^4 |
| seg_m02 | My Calendar I | M | Booking without overlap | n <= 1000 |
| seg_h01 | Falling Squares | H | Max height from falling squares | n <= 1000 |
| seg_h02 | Rectangle Area II | H | Total area of overlapping rectangles | n <= 200 |

#### Fenwick Tree/BIT (`bit`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| bit_e01 | Range Sum Query Mutable (BIT) | E | Point update, range sum | n <= 3*10^4 |
| bit_e02 | Count Inversions | E | Count inversions in array | n <= 10^5 |
| bit_m01 | Count of Smaller Numbers | M | Count smaller elements to right | n <= 10^4 |
| bit_h01 | 2D Range Sum Query | H | 2D BIT for rectangle queries | m,n <= 1000 |

#### DSU/Union-Find (`dsu`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| dsu_e01 | Number of Connected Components | E | Count connected components | n <= 2000 |
| dsu_e02 | Redundant Connection | E | Find redundant edge | n <= 1000 |
| dsu_m01 | Accounts Merge | M | Merge accounts with common email | n <= 1000 |
| dsu_h01 | Largest Component Size by Factor | H | Largest component by common factor | n <= 2*10^4 |

#### Monotonic Stack (`ms`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| ms_e01 | Next Greater Element | E | Next greater element for each | n <= 10^4 |
| ms_e02 | Daily Temperatures | E | Days until warmer temperature | n <= 10^5 |
| ms_m01 | Largest Rectangle in Histogram | M | Max rectangle in histogram | n <= 10^5 |
| ms_h01 | Maximal Rectangle | H | Max rectangle in binary matrix | m,n <= 200 |

#### Topological Sort (`topo`) — 3 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| topo_e01 | Course Schedule | E | Can finish all courses | n <= 5000 |
| topo_m01 | Course Schedule II | M | Find valid course order | n <= 2000 |
| topo_h01 | Alien Dictionary | H | Derive character order from sorted words | n <= 100, wordLen <= 20 |

---

### Math & Strings (25 problems)

#### Number Theory (`nt`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| nt_e01 | Count Primes | E | Count primes less than n | n <= 5*10^6 |
| nt_e02 | Happy Number | E | Detect cycle in digit square sum | n <= 2^31-1 |
| nt_m01 | Super Pow | M | a^b mod 1337 | a <= 2^31-1, b digits <= 2000 |
| nt_h01 | Ugly Number III | H | Count ugly numbers in range | n <= 10^9 |

#### Combinatorics (`cmb`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| cmb_e01 | Pascal's Triangle | E | Generate pascal triangle | n <= 30 |
| cmb_e02 | Fibonacci Number | E | Nth fibonacci | n <= 30 |
| cmb_m01 | Unique Binary Search Trees | M | Catalan number | n <= 19 |
| cmb_h01 | Count Palindromic Subsequences | H | Count distinct palindromes | n <= 1000 |

#### Game Theory (`gt`) — 3 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| gt_e01 | Nim Game | E | Can win nim game | n <= 2^31-1 |
| gt_m01 | Stone Game | M | Optimal stone game strategy | n <= 500 |
| gt_h01 | Can I Win | H | Can first player win with maxTotal | maxTotal <= 200 |

#### String Algorithms (`str`) — 8 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| str_e01 | Valid Palindrome | E | Check palindrome ignoring non-alphanumeric | n <= 2*10^5 |
| str_e02 | Valid Anagram | E | Check anagram | n <= 5*10^4 |
| str_e03 | First Unique Character | E | First non-repeating char | n <= 10^5 |
| str_m01 | Group Anagrams | M | Group strings by anagram | n <= 10^4, len <= 100 |
| str_m02 | Longest Palindromic Substring | M | Find longest palindrome | n <= 1000 |
| str_m03 | Multiply Strings | M | Multiply two number strings | n <= 200 |
| str_h01 | Shortest Palindrome | H | Min chars to make palindrome | n <= 5*10^4 |
| str_h02 | Minimum Window Subsequence | H | Min window containing subsequence | n <= 10^4 |

#### Hashing (`hsh`) — 4 problems

| Code | Name | Diff | Description | Constraints |
|---|---|---|---|---|
| hsh_e01 | Two Sum | E | Find two indices summing to target | n <= 10^4 |
| hsh_e02 | Ransom Note | E | Can construct from magazine | m,n <= 10^5 |
| hsh_m01 | Longest Consecutive Sequence | M | Longest consecutive sequence | n <= 10^5 |
| hsh_h01 | Max Points on a Line | H | Max collinear points | n <= 300 |

---

## Implementation Approach

### Phase 1: Problem Creator Infrastructure
- Use the `problem-creator` skill for each problem
- Each problem: DB record + test generator script + init.yml + data.zip
- Problems marked as "manually managed"

### Phase 2: Batch Creation
- Create problems in topic batches (e.g., all Linked List problems first)
- Generate test data with Python scripts per topic
- Create AC submissions for problem author (admin)

### Phase 3: Quality Assurance
- Use `problem-review` skill to verify each batch
- Check: solution correctness, test coverage, difficulty calibration
- Ensure only intended algorithms pass (strictness)

### Phase 4: Cleanup
- Tag the 557 uncategorized existing problems
- Organize into proper ProblemGroup (Easy/mid/hard)
- Link related problems with editorial references

---

## Success Criteria

1. All 150 problems created and public on the site
2. Each problem has 10-20 test cases covering edge cases and max constraints
3. No previously-missing topic has 0 problems
4. Difficulty distribution improved (more problems in 11-75 range)
5. Automated test generation scripts are reusable for future problems
