# Contest Formats

LCOJ supports 6 contest formats: Default, IOI, Legacy IOI, ECOO, AtCoder, and ICPC.

## Default

The standard and simplest format.

**Scoring:**
- Score = Sum of the highest score on each problem
- Tiebreaker: Time of the last scoring submission

**Note:** Every submission adds to the penalty time, even submissions that do not increase your score.

**Configuration:** No special options.

**Example:**

| Contestant | Problem A | Problem B | Problem C | Total score | Time |
|----------|-------|-------|-------|-----------|-----------|
| Alice    | 100 (10m) | 80 (25m) | 60 (40m) | 240 | 40m |
| Bob      | 100 (15m) | 80 (20m) | 60 (35m) | 240 | 35m |

Bob wins because his time is lower.

## IOI

The format of the International Olympiad in Informatics.

**Scoring:**
- Each problem has multiple subtasks
- Subtask score = Highest score on that subtask across all submissions
- Problem score = Sum of subtask scores
- Total score = Sum of problem scores
- No tiebreaker by default

**Example:**

Problem A has 2 subtasks (30 points and 70 points):

| Submission | Subtask 1 | Subtask 2 | Total |
|---------|-----------|-----------|------|
| Attempt 1   | 30        | 10        | 40   |
| Attempt 2   | 0         | 70        | 70   |
| **Final score** | **30** | **70** | **100** |

**Options:**

```json
{
  "cumtime": true
}
```

If `cumtime: true`, ties are broken by the total time of the first submission that passes each subtask.

## Legacy IOI

The format of the Codechef IOI Ranklist.

**Scoring:**
- Score = Sum of the highest score on each problem
- No tiebreaker by default

**Options:**

```json
{
  "cumtime": true
}
```

If `cumtime: true`, ties are broken by the total time of the most recent score-changing submissions.

## ECOO

The format of the ECOO contest.

**Scoring:**
- Score = Sum of the scores of the **last** submission on each problem
- No tiebreaker by default

**Options:**

```json
{
  "cumtime": true,
  "first_ac_bonus": 10,
  "time_bonus": 5
}
```

**`first_ac_bonus`:** Bonus points for getting AC on the first attempt (default 10).

**`time_bonus`:** Time-based bonus points. You earn 1 point for every `time_bonus` minutes remaining before the contest ends (default 5).

**time_bonus example:**

- A submission scores 50/100 points
- It is submitted with 23 minutes remaining
- Bonus = ⌊23/5⌋ = 4 points
- Total = 50 + 4 = 54 points

## AtCoder

The AtCoder format.

**Scoring:**
- Score = Sum of the highest score on each problem
- Tiebreaker: Time of the last score-changing submission + penalty

**Penalty:**

```json
{
  "penalty": 5
}
```

Penalty = Number of wrong submissions before the correct one × `penalty` minutes (default 5).

**Example:**

Problem A:
- Attempt 1 (5m): 0 points
- Attempt 2 (10m): 0 points
- Attempt 3 (15m): 100 points

Penalty = 2 × 5 = 10 minutes

Time = 15 + 10 = 25 minutes

## ICPC

The ACM-ICPC format.

**Scoring:**
- Score = Number of problems solved (AC)
- Tiebreaker 1: Total time + penalty
- Tiebreaker 2: Time of the last score-changing submission

**Penalty:**

```json
{
  "penalty": 20
}
```

Penalty = Number of wrong submissions before the AC submission × `penalty` minutes (default 20).

**Example:**

| Problem | AC time | Wrong attempts | Penalty | Total time |
|-----|--------------|------------|---------|----------------|
| A   | 10m          | 0          | 0       | 10m            |
| B   | 25m          | 2          | 40m     | 65m            |
| C   | 50m          | 1          | 20m     | 70m            |

Total: 3 problems, 145 minutes

## Format comparison

| Format | Score | Tiebreaker | Penalty | Best for |
|-----------|------|---------|---------|---------|
| Default | Sum of highest scores | Last time | Every submission | Regular contests |
| IOI | Sum of subtask scores | None | None | Olympiads, problems with subtasks |
| Legacy IOI | Sum of highest scores | Optional | None | Similar to IOI |
| ECOO | Last submission score | Optional | Has bonuses | ECOO contests |
| AtCoder | Sum of highest scores | Time + penalty | Wrong submissions | AtCoder-style contests |
| ICPC | Problems solved (AC) | Time + penalty | Wrong submissions | ACM-ICPC |

## Choosing a format

**Default:** Best for regular contests; easy to understand.

**IOI:** Use when problems have clear subtasks and you want contestants to earn partial points.

**ICPC:** Use when you want to focus on the number of problems solved and partial points do not matter.

**AtCoder:** Balances score and time, with a light penalty.

**ECOO:** Has special features such as a first-AC bonus and a time bonus.

## Configuring in the admin

1. Open the create/edit contest page
2. Select a _Contest format_
3. Enter a JSON config if needed (for example: `{"cumtime": true, "penalty": 10}`)
4. Save

**Example config:**

```json
{
  "cumtime": true,
  "penalty": 10,
  "first_ac_bonus": 15,
  "time_bonus": 3
}
```
