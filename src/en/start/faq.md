# FAQ

The most common questions, grouped by role. Each answer is short and links to the page with the full details. For the meaning of any term, see the [Glossary](/en/start/glossary).

## Students and learners

::: details Why do I get Wrong Answer (WA) when my output looks exactly right?
The usual culprit is extra text such as `Enter n:` or `The answer is:`. The default checker ignores extra spaces but not extra words, and line breaks between numbers must match. Also check for integer overflow (`int` only holds up to about 2·10⁹) and for reading or writing files when the problem uses standard input and output. See [Troubleshooting](/en/learn/submissions#troubleshooting).
:::

::: details Which languages does LCOJ support, and which compiler versions?
Open `/runtimes/` on the site to see the languages that currently have a judge, with their real versions. The language dropdown on the submit page shows versions too. For C++ pick C++17 or C++20; for heavy Python problems, try PyPy 3. See [Supported languages](/en/reference/languages).
:::

::: details Can I see a problem's test cases?
By default only the problem's authors can. A setter can make tests visible to everyone, or visible only when you're not in a contest; the submission page then shows the input, the expected answer and your output for each test. See [Per-test results](/en/learn/submissions#per-test-results).
:::

::: details Do I lose points for submitting many times?
Not in practice: the system keeps only your best score for each problem. In contests, penalties depend on the [contest format](/en/organize/contest-formats), and some contests cap the number of submissions per problem.
:::

::: details Why is my submission stuck on "Queued"?
It's waiting for a free judge that supports your language and has the problem's data. Each user can have at most 2 submissions queued or being graded at once. If it waits too long, tell an admin. See [Submitting and judging](/en/learn/submissions).
:::

::: details Can I read other people's code?
By default you can read other people's code only for problems you have solved. Setters can change this per problem. See [Viewing other people's solutions](/en/learn/submissions#viewing-other-people-s-solutions).
:::

::: details How does rating work?
Your rating only changes after contests marked as **rated**, once the contest has ended and an admin runs the rating calculation. LCOJ uses the Elo-MMR algorithm (inherited from DMOJ); virtual participations don't count. The color tiers range from Newbie (below 1200) to Legendary Grandmaster (2900 and up). See [Taking part in contests](/en/learn/contests).
:::

::: details I can't remember how I signed in, or I forgot my password. What now?
On luyencode.net, accounts are created through Google, so just sign in with Google using the same Google account. The **Quên mật khẩu?** (Forgot your password?) link only applies to password accounts (for example, accounts a teacher bulk-created for a class) and needs the site to send email. luyencode.net doesn't have email sending configured, so ask an admin to reset the password in the admin site ([Managing users](/en/admin/users)). See [Account and sign-in](/en/learn/account).
:::

::: details I lost the phone with my two-factor authentication app. What now?
When you turned on two-factor authentication, you were given a list of one-time 16-character scratch codes. Enter one of them in the 6-digit code field to sign in, then turn 2FA off or set it up again. If you have no scratch codes left, only an admin with the right permission can turn off 2FA for you. See [Account and sign-in](/en/learn/account).
:::

## Problem setters and teachers

::: details How do I create a class on LCOJ?
A class is an **organization**. Creating one at `/organizations/create` requires the `judge.add_organization` permission, and by default each user can administer at most 3 organizations. On luyencode.net, contact the LCOJ team if you don't have the permission yet. See [Organizations (groups, classes)](/en/organize/organizations).
:::

::: details How do I make problems that only my class can see?
Create the problem inside the organization (from the organization's page; this needs the `judge.create_organization_problem` permission). An organization's private problems are visible only to its members. Contests and quizzes can also be restricted to an organization. See [Organizations (groups, classes)](/en/organize/organizations).
:::

::: details Why can't anyone see the problem I just created?
New problems stay private until someone with the right permission makes them public. That gives you time to prepare tests and test-submit before anyone sees it. See [Managing problems](/en/setter/managing-problems).
:::

::: details Can I import existing problems?
Yes, if the problem has a **Codeforces Polygon** package: import it at `/problems/import-polygon` (requires `judge.import_polygon_package`). The importer creates the statement, tests and checker. For anything else, create the problem on the site and upload the tests as a zip file. See [Managing problems](/en/setter/managing-problems).
:::

::: details Can I bulk-import quiz questions?
Yes. Open `/quizzes/import/`, upload an Excel (`.xlsx`) or JSON file, check the preview and confirm. A single invalid question means nothing is imported, so fix every error shown in the preview. See [Creating quizzes](/en/setter/quiz-authoring).
:::

## Operators and self-hosters

::: details What server do I need?
At minimum 2 CPU cores, 4 GB RAM, 20 GB free disk and 64-bit Linux (Ubuntu 22.04 or newer is easiest); 4 cores, 8 GB RAM and a 50 GB SSD are recommended. Each judge uses roughly one extra CPU core while grading. See [Installing with Docker](/en/operate/installation).
:::

::: details Is the judge included in Docker Compose?
No. Docker Compose runs the website and `bridged` only; judges run separately (usually from the `vnoj/judge-tier3` image) and connect on port 9999. See [Setting up judges](/en/operate/judge-setup).
:::

::: details How do I add judges to grade faster?
Each judge grades one submission at a time. To add one, register another judge on the website with its own name and key, create its own config file, and start another container. Keep the number of judges below your CPU core count, leaving some cores for the website. See [Running multiple judges](/en/operate/judge-setup#running-multiple-judges).
:::

::: details What do I need to back up?
Four things: the database (dumped with `mariadb-dump`), the `problems/` folder (test data), the `media/` folder (uploads) and your config files. Copy the backups to another machine. See [Backups](/en/operate/operations#backup).
:::

::: details How do I update LCOJ?
Back up the database first, then update both repositories (lcoj-docker and the `dmoj/repo` submodule), run migrations and restart the affected services. The exact steps depend on what changed. See [Updating](/en/operate/updating).
:::

::: details Is HTTPS required?
Not for a local trial: `http://localhost:8071/` is enough. For real users you should have it. nginx inside Docker only serves HTTP, so put a TLS reverse proxy in front of it on your server, such as Caddy or nginx with certbot. See [HTTPS](/en/operate/installation#https).
:::

::: details Can I rebrand LCOJ with my school's name and logo?
Yes. The site name lives in `SITE_NAME` and `SITE_LONG_NAME` in `local_settings.py`; the logo is set with the `site_logo` configuration item in the admin panel. LCOJ is AGPL-3.0, so if you modify the code and let others use it over a network, you must publish your modified source. See [Environment variables](/en/operate/environment), [Site configuration and content](/en/admin/site-config) and [License](/en/about/license).
:::

## Support and contact

::: details Where do I report a mistake in a statement or its tests?
Use the **Báo cáo vấn đề** (Report an issue) feature on the problem page to open a ticket for the setters and admins. Useful tickets also earn contribution points. See [Blog, comments and tickets](/en/learn/community).
:::

::: details Where do I report a bug in LCOJ itself?
Open an issue on [lcoj-docker's GitHub Issues](https://github.com/luyencode/lcoj-docker/issues). Judge problems (a language misbehaving, sandbox errors) go to [luyencode/judge-server](https://github.com/luyencode/judge-server/issues).
:::

::: details I need help installing LCOJ.
LCOJ offers free installation help. Get in touch through [behitek.com](https://behitek.com) or [luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he).
:::
