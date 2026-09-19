# Permission System

LCOJ has a fine-grained permission system that lets you control what users can do.

## Basic permissions

Django provides 4 default permissions for each model:
- `can_add_<model>`: Add
- `can_change_<model>`: Change
- `can_delete_<model>`: Delete
- `can_view_<model>`: View

## Blog Posts

**`edit_all_post`** - Edit all posts

The user can edit any post in the admin.

## Comments

**`override_comment_lock`** - Override comment lock

The user can comment even when comments on a page are locked.

## Contests

**`see_private_contest`** - See private contests

The user can see all contests without being an organizer. They can also see hidden rankings.

**`edit_own_contest`** - Edit own contests

The user can edit contests they organize.

**`edit_all_contest`** - Edit all contests

The user can see and edit any contest without being an organizer.

**`clone_contest`** - Clone contest

The user can clone contests they are allowed to edit.

**`moss_contest`** - Run MOSS

The user can run MOSS (plagiarism detection) on a contest.

**`contest_rating`** - View ratings

The user can see contestants' ratings in a contest.

**`contest_access_code`** - View access codes

The user can see a contest's access code.

**`create_private_contest`** - Create private contests

The user can create private contests.

## Problems

**`see_private_problem`** - See private problems

The user can see all problems, including private ones.

**`edit_own_problem`** - Edit own problems

The user can edit problems they author or curate.

**`edit_all_problem`** - Edit all problems

The user can edit any problem.

**`edit_public_problem`** - Edit public problems

The user can edit public problems.

**`problem_full_markup`** - Use full markup

The user can use HTML/JavaScript in problem statements.

**`clone_problem`** - Clone problem

The user can clone problems.

## Submissions

**`abort_any_submission`** - Abort any submission

The user can abort anyone's submission.

**`rejudge_submission`** - Rejudge submissions

The user can rejudge submissions.

**`rejudge_submission_lot`** - Batch rejudge

The user can rejudge many submissions at once.

**`spam_submission`** - Mark as spam

The user can mark submissions as spam.

**`view_all_submission`** - View all submissions

The user can see the source code of any submission.

**`resubmit_other`** - Resubmit for others

The user can resubmit other users' submissions.

## Organizations

**`organization_admin`** - Administer organizations

The user can manage organizations they are an admin of.

**`edit_all_organization`** - Edit all organizations

The user can edit any organization.

## Users

**`edit_profile`** - Edit profiles

The user can edit other users' profiles.

**`totp`** - Manage 2FA

The user can manage other users' 2FA.

## Judges

**`test_site`** - Test judge

The user can test judges.

## Granting permissions

### Option 1: Via groups

1. Go to `/admin/auth/group/`
2. Create a new group (for example: "Problem Setters")
3. Select the required permissions
4. Add users to the group

### Option 2: Per user

1. Go to `/admin/judge/profile/`
2. Select a user
3. Select permissions in the "User permissions" section

## Common roles

### Admin

Has all permissions and manages the entire system.

### Problem Setter

Required permissions:
- `edit_own_problem`
- `see_private_problem`
- `view_all_submission`
- `rejudge_submission`

### Contest Organizer

Required permissions:
- `edit_own_contest`
- `see_private_contest`
- `clone_contest`
- `contest_rating`

### Moderator

Required permissions:
- `edit_all_post`
- `override_comment_lock`
- `spam_submission`
- `view_all_submission`

## Notes

- Grant permissions carefully and avoid granting more than necessary
- Use groups to make permissions easier to manage
- Review user permissions regularly
- Some permissions require other permissions (prerequisites)
