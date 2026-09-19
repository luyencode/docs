# Supported languages

> The languages LCOJ can judge, how to see which ones are actually available on a site, and how administrators add a new one.
>
> ⏱ ~5 min read · 👤 Everyone, administrators

## When you need this page

- You want to know whether the site judges your language, or which compiler version it uses.
- A language doesn't appear in the language picker when submitting.
- You are an administrator and want to enable more languages on the site.

LCOJ's judge code ([luyencode/judge-server](https://github.com/luyencode/judge-server), based on DMOJ and VNOJ) ships executors for close to 70 languages. However, **the languages you can actually use on a given site are the ones that site's judges report**, not the full list below.

## Checking available languages

On an LCOJ site (for example, `https://luyencode.net`), open:

| Page | Contents |
|---|---|
| `/runtimes/` | Languages supported by at least one online judge, with compiler/interpreter versions |
| `/runtimes/matrix/` | Runtime versions per judge |
| `/status/` | Online judges and each judge's runtimes |

When you submit, the language dropdown only lists languages that meet **all three** conditions:

1. An online judge has loaded that language's executor (judges self-test every language at startup and drop the ones that fail).
2. The site database has a **Language** record whose **key** matches the executor name (for example, `CPP17` or `PY3`). If a judge reports an executor that has no matching record, the language doesn't appear.
3. The problem setter allowed that language for the problem, and a judge has the problem's data.

## Languages on a fresh install

During installation, `./scripts/manage.py loaddata language_small` (see [Installing with Docker](/en/operate/installation)) creates these languages:

| Key | Display name | Notes |
|---|---|---|
| `C`, `C11` | C, C11 | GCC |
| `CPP03`, `CPP11`, `CPP14`, `CPP17`, `CPP20` | C++03 … C++20 | GCC with the matching C++ standard |
| `PAS` | Pascal | Free Pascal |
| `PY2`, `PY3` | Python 2, Python 3 | CPython |
| `PYPY`, `PYPY3` | PyPy 2, PyPy 3 | Faster Python thanks to a JIT |
| `JAVA8`, `JAVA` | Java 8, Java 19 | `JAVA` uses the newest Java on the judge; the display name is set by administrators |
| `KOTLIN` | Kotlin | |
| `TEXT` | TEXT | Submit the output text directly |
| `OUTPUT` | Output Only | File upload only: a `.zip` of outputs (up to 10 MB) |
| `SCRATCH` | Scratch | File upload only: an `.sb3` file (up to 1 MB) |

To add other languages, an administrator adds a record at `/admin/judge/language/` whose **key** matches the executor name (see the table below).

::: warning Don't load `language_all` on top of `language_small`
The repo also ships a `language_all` fixture, but its primary keys (ids) overlap with `language_small` while the contents differ. Loading it on top would overwrite existing languages incorrectly. Only consider `language_all` **instead of** `language_small` on a fresh database.
:::

::: tip Real versions live on `/runtimes/`
Display names such as "Java 19" are just labels stored in the database. The actual compiler/interpreter versions are reported by the judges and shown on `/runtimes/` and in the language dropdown when you submit.
:::

## All judge executors

This list comes from the judge's [`dmoj/executors/`](https://github.com/luyencode/judge-server/tree/master/dmoj/executors) directory. An executor only works when the judge image has the matching runtime installed.

| Group | Key (language) |
|---|---|
| C/C++ | `C`, `C11`, `CLANG` (Clang), `CPP03`, `CPP11`, `CPP14`, `CPP17`, `CPP20`, `CLANGX` (Clang++), `CICPC`, `CPPICPC` (C/C++ with ICPC-style compiler flags), `CPPTHEMIS` (Themis-style C++) |
| Pascal | `PAS` (Free Pascal), `PASTHEMIS` (Themis-style Pascal) |
| Python | `PY2`, `PY3`, `PYPY`, `PYPY3` |
| JVM | `JAVA8`, `JAVA`, `KOTLIN`, `SCALA`, `GROOVY` |
| .NET (Mono) | `MONOCS` (C#), `MONOFS` (F#), `MONOVB` (Visual Basic) |
| JavaScript | `NODEJS` (Node.js), `V8JS` (V8), `COFFEE` (CoffeeScript) |
| Assembly | `GAS32`, `GAS64`, `GASARM` (GNU as), `NASM`, `NASM64`, `LLC` (LLVM IR) |
| Systems | `GO`, `RUST`, `D`, `ZIG`, `SWIFT`, `OBJC` (Objective-C), `DART` |
| Functional and logic | `HASK` (Haskell), `OCAML`, `SBCL` (Common Lisp), `SCM` (Scheme), `RKT` (Racket), `PRO` (Prolog), `LEAN4` (Lean 4) |
| Scripting | `RUBY`, `PERL`, `PHP`, `LUA`, `TCL`, `BASH`, `AWK`, `SED`, `PIKE` |
| Classic and other | `ADA`, `CBL` (COBOL), `F95` (Fortran), `FORTH`, `ALGL68` (Algol 68), `TUR` (Turing), `BF` (Brain\*\*\*\*), `ICK` (INTERCAL) |
| Special | `TEXT`, `OUTPUT` (output-only), `SCRATCH` |

## Notes

- The most common competitive programming languages are C++ (prefer `CPP17` or `CPP20`), Python 3 (try `PYPY3` for heavy problems), Java, and Pascal.
- A problem can set time and memory limits **per language**. The limits that apply are shown on the problem page.
- Rarely used languages may have undiscovered bugs. If you hit a problem with a language, please [report it to the judge project](https://github.com/luyencode/judge-server/issues).

## Next steps

- [Submitting and judging](/en/learn/submissions): how to pick a language and submit.
- [Status codes](/en/reference/status-codes): what results such as `CE`, `RTE`, and `IR` mean.
- [Setting up judges](/en/operate/judge-setup): for operators, running a judge so the site has languages.
- [Glossary](/en/start/glossary): terms such as judge, executor, and runtime.
