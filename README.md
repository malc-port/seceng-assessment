# Coinflow — Security Engineer Practical Assessment

Thanks for making it to this stage. This is a short, self-contained exercise
built around a stripped-down version of a service we actually run: a payments
API that takes card pay-ins, exposes transaction and settlement data to
merchants, and accepts settlement callbacks from our PSP.

Everything you need is in this repository. You do not need AWS access, a
database, or any credentials, and you do not need to run the service.

**It is built to take about two hours, including the write-up — as a guide, not a limit.**

## Read these in order

1. **[`INSTRUCTIONS.md`](INSTRUCTIONS.md)** — the ground rules. What is in and out of scope, what you may use, how to submit. About three minutes.
2. **[`ASSESSMENT.md`](ASSESSMENT.md)** — the four tasks.

## Setup

Worth doing before you start on the tasks.

```bash
git clone <this-repo> coinflow-assessment && cd coinflow-assessment
./setup.sh
```

`setup.sh` unpacks the log bundle and checks the working copy is complete. It
installs nothing and writes nothing outside the repository directory. It should
finish with `Ready.`

Before you run it: **treat this repository the way you would treat any
third-party code that showed up in your environment.** Reading `setup.sh`
before executing it is part of the exercise. If anything about the setup
process would give you pause in a real engagement, note it — there is a place
for that in the report.

If you would rather not run the script at all, `gunzip -k data/*.jsonl.gz` gets
you to the same place.

Requirements are Python 3.8+ and `gunzip`. That is the whole list. If setup
fails, tell us rather than spending your time debugging our packaging.

## What's here

| Path | What it is |
|------|------------|
| `INSTRUCTIONS.md` | Rules of engagement. Read first. |
| `ASSESSMENT.md` | The tasks. |
| `service/` | The `paylink-api` source, its manifests, and its CI configuration |
| `scans/` | Output from our SAST/SCA tool's most recent run against the service |
| `siem/` | Detection rules, the rule schema, and a 30-day alert console export |
| `data/` | 24 hours of authentication and API gateway logs |
| `submission/` | The two files you fill in and send back |

## The short version

- Budget roughly two hours including the write-up. It's a guide — depth on a few things beats thin coverage of everything.
- Use AI freely. `submission/AI_USAGE.md` asks you to account for what it did.
- If something is ambiguous, assume, write the assumption down, and keep going.
- Send back `submission/REPORT.md` and `submission/AI_USAGE.md`. Don't open a PR against this repo — it's public.

All of that is expanded in [`INSTRUCTIONS.md`](INSTRUCTIONS.md).
