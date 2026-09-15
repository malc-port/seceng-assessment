# Instructions

Everything procedural lives here: roughly how long this should take, what is
in scope, what you may use, and how to send it back. The tasks themselves are in
[`ASSESSMENT.md`](ASSESSMENT.md).

Read this page first — it takes about three minutes.

---

## Before you start

- [ ] Somewhere you can work without interruption for a couple of hours.
- [ ] A machine you can clone a git repository onto. No AWS, no database, no credentials, no VPN.
- [ ] Python 3.8+ and `gunzip` on your PATH — that is the entire dependency list.
- [ ] Whatever AI tooling you normally work with, signed in and ready.
- [ ] `./setup.sh` run and finishing with `Ready.`

Get setup out of the way before you start on the tasks. If it fails, tell us
rather than spending your time debugging our packaging.

---

## How long this should take

**We designed it to take about two hours, including the write-up.** That is a
guide, not a rule, and nobody is timing you.

It is there so you know roughly what we think we are asking for. If you finish
comfortably inside it, good — don't pad it out. If you want to spend longer on
something you find interesting, that is your call.

What we would ask is that you don't turn it into a weekend. Not because of a
rule, but because it won't help you: past a certain point the extra hours show
up as volume rather than insight, and volume is not what we are reading for. A
submission that goes deep on three things beats one that touches everything
thinly, regardless of how long either took.

You do not need to account for your time, and there is no penalty for taking
more or less of it. If it is useful context for something in your report — "I
spent most of my time in the logs and it came at the expense of the compliance
mapping" — say so, because it tells us how you prioritise. That is genuinely
interesting to us. Clock-watching is not.

---

## Scope

**In scope: this repository, and nothing else.**

Everything you need to complete every task is in the files you cloned. The
service, the scan output, the logs, the detection rules and the alert export
are all self-contained.

**Explicitly out of scope — do not do these:**

- Do not test, scan, probe or otherwise touch any real Coinflow system, including `coinflow.cash`, any subdomain, our API, our SDKs, our cloud accounts, or anything else you can find that belongs to us. This is not a live-fire exercise and there is no bug bounty attached to it. Unsolicited testing against our production estate ends the process.
- Do not resolve, connect to, or investigate the hostnames, IP addresses, ASNs or domains that appear inside the repository. They are props. Some are deliberately chosen to look suspicious because noticing that is part of the exercise — noticing is the whole point, and connecting adds nothing.
- Do not contact Coinflow employees for help with the exercise. Asking your recruiter a clarifying question is fine and expected; DMing an engineer for a hint is not.
- Do not attack, poll, or interfere with the repository host, and do not try to find other candidates' forks.

The service in `service/` is a reduced copy with pieces missing. You are not
expected to run it, and you cannot. Nothing in this exercise requires executing
the application.

---

## What you may use

Anything you would use on a normal working day:

- **AI tooling.** Encouraged. See the section below.
- **The internet.** Documentation, advisories, framework texts, your own notes, previous work.
- **Your own tooling.** If you have scripts or queries you have written before, use them.

The one thing you may not do is have another person do the work or review it
before you submit. This needs to be yours, because you are going to be asked to
defend it line by line.

---

## On AI

Use it. We use Claude Code and Claude Security daily and it would be strange if
you didn't reach for something similar. There is no hidden penalty here and
nothing in this exercise is designed to catch you out for using a model.

What we care about is whether you know what the tool did on your behalf.
`submission/AI_USAGE.md` asks you to show that: where it helped, where it was
wrong or unverifiable, how you checked, and what you deliberately kept for
yourself.

A candidate who used AI heavily and can account for all of it scores higher
than one who avoided it, and much higher than one who pasted output they cannot
defend. That file is weighted the same as the technical tasks, and it only
works if you are straight in it.

**Assume every claim in your report may be picked apart in conversation.**

---

## When something is ambiguous

Make a reasonable assumption, write it down, and carry on. There is a section
at the end of the report template for exactly this.

Flagging an ambiguity and stating how you resolved it earns marks — real
incidents come with worse information than this one does, and we want to see
how you move through uncertainty rather than how you wait it out.

If you are genuinely blocked — setup will not run, a file appears corrupt —
reply to the email that sent you this link.

---

## What to send back

Two files, both already in `submission/`:

| File | What goes in it |
|------|-----------------|
| `REPORT.md` | Tasks 1–3. Keep it under about 1,500 words. |
| `AI_USAGE.md` | Task 4. |

The templates are scaffolding, not a straitjacket. Restructure them if your
answer wants a different shape — just make sure every part of the brief is
answered somewhere. Plain markdown is perfect; we are not assessing formatting.
If you want to attach a script you wrote or a query you ran, include it.

**How to send it:**

- A zip or tarball of the two files, or
- A `git diff` / patch, or
- A link to your own **private** fork with us added as a collaborator.

Whichever is least friction for you. Return it by the date in your invitation
email.

**Do not open a pull request against this repository.** It is public and other
candidates can see it.

---

## Confidentiality

Please don't publish your answers, post the tasks, or push your solution to a
public repository. The repository itself is public and we know the exercise
will not stay secret forever, but circulated worked answers make it useless for
the next person and we would have to start over.

The scenario is fictional. The service is not our production code, the incident
did not happen, and the logs are synthetic.

---

## Adjustments

If you need the format adjusted — more time for a disability or health reason,
a different submission format, screen-reader-hostile content in the repo, or
anything else — reply to the email that sent you this link and ask. It will not
count against you and you do not need to explain why in any detail.

If English is not your first language, write the report in the way that is
fastest for you. We are reading for reasoning, not prose.

---

## What happens next

1. Two of us read your submission independently and compare notes.
2. If we move forward, a **30–45 minute conversation** with your report open in front of us. We walk through your findings, ask how you reached them, and talk about the ones you did not have time for. It is a discussion, not a viva — disagreeing with the exercise is welcome and we ask about that directly.
3. We will tell you either way, and if it is a no we will tell you what the gap was.

You are not expected to finish everything. Nobody does. Good luck.
