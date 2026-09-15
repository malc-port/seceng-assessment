# The exercise

> If you have not read [`INSTRUCTIONS.md`](INSTRUCTIONS.md) yet — scope, what
> you may use, and how to submit — start there. It takes about three minutes.

You have joined Coinflow as its Security Engineer. It is Friday 11 September
2026. Four things are on your desk.

A rough guide to the weighting, if it helps you plan. It is an indication of
how much each part is worth to us, not a schedule to hold yourself to:

| | Task | Rough share |
|-|------|-------------|
| 1 | Vulnerability triage and code review | ~45 min |
| 2 | Detection and alert engineering | ~35 min |
| 3 | Compliance and the call you have to make | ~25 min |
| 4 | AI usage write-up | ~15 min |

Write answers into `submission/REPORT.md`. Aim for somewhere around 1,500
words — that is a steer towards tight reasoning, not a cap to write up to. If
you say it well in half that, do.

---

## Task 1 — Vulnerability triage and code review

Aegis Scan ran against `paylink-api` yesterday. Its output is in
`scans/aegis-scan-2026-09-10.json`: 14 findings, four of them CRITICAL. The
platform team has seen the summary and wants to know what they are fixing this
sprint.

The scanner is a tool, not an oracle. Its severities come from generic rules
that know nothing about how this service is deployed, what it does with money,
or what is actually reachable. The source, manifests and CI configuration in
`service/` are the ground truth. `service/README.md` describes the deployment.

Produce:

**1a. Your top three risks, ranked.** For each: what it is, where it is, how it
would actually be exploited against *this* service, what the business impact
is, and what you would do about it. Say plainly whether each one came from the
scanner, from your own reading, or from the scanner pointing you somewhere
useful for the wrong reason.

**1b. Three scanner findings you are not actioning at their stated severity.**
Say what the scanner got wrong and how you established that. "Deprioritised" is
a fine answer; so is "this is not a real finding". We are looking for the
evidence, not the verdict.

**1c. Anything the scanner missed.** Note the scan's own metadata while you are
at it.

**1d. Remediation sequencing.** You cannot ship everything at once, and one of
these needs to be dealt with before the weekend. What goes out first, what goes
out this sprint, what goes in the backlog, and what would you put in CI so the
class of bug does not come back?

---

## Task 2 — Detection and alert engineering

`data/` holds 24 hours of logs from 8 September — `auth_events.jsonl` from the
auth service and `api_gateway.jsonl` from the edge. `siem/README.md` documents
the fields and the rule schema. Four production detection rules are in
`siem/rules/`. `siem/alert-console-export.csv` is the last 30 days of alert
volume and analyst disposition.

Nobody was paged on 8 September.

Produce:

**2a. What happened.** A timestamped timeline of anything you judge to be
malicious, with the log evidence behind each step. Note anything you looked at
and ruled out, and why.

**2b. Why the rules did not fire.** Go rule by rule for the ones that should
have caught a stage of this and explain the specific reason each one missed.
At least one of them missed for a reason that will look entirely reasonable in
the commit that introduced it.

**2c. Write one detection.** Pick the gap you think matters most and write the
rule, in the schema in `siem/README.md` or in the query language of a SIEM you
know — say which. Include what it keys on, its threshold and window if it has
one, where it routes, and how you would test it before turning it on. Then say
honestly what it will produce false positives on.

**2d. The alert console.** Look at the 30-day export and tell us what you would
change, and what you would tell the CTO about the state of alerting here.

---

## Task 3 — Compliance and the call you have to make

Coinflow is a PSP handling card pay-ins and stablecoin settlement, with EU
merchants and an EU entity. We are mid-flight on SOC 2 Type 2, hold ISO 27001,
and are in scope for PCI DSS and for DORA.

Produce:

**3a. Control mapping.** For your three findings from Task 1a and the detection
gap from Task 2, map each to the specific control or requirement it touches.
Cover ISO 27001 Annex A, SOC 2 TSC, PCI DSS v4.0, and NIST — CSF 2.0 or
800-53, your choice, say which. Be as specific as you can be without guessing;
if you are unsure of an exact clause number, say what the control requires and
flag that the number needs checking. Confident wrong citations cost more than
honest approximations.

**3b. Two questions.** Answer both, briefly.

> *From the CTO, in Slack, this morning:*
>
> "Two things. First — our SOC 2 Type 2 report came back clean last month and
> the auditor had no findings on access control, so we're covered on the PCI
> side for these, right? Second — if something did go wrong here, what's our
> actual reporting obligation? I want to know before I need to know."

**3c. The risk acceptance.** The fix for one of your top-three findings is
entangled with the ledger rewrite and engineering wants 90 days. The CTO is
willing to sign a risk acceptance to protect the launch date.

Write the acceptance — no more than 200 words. What exactly is being accepted,
by whom, for how long, on what evidence, what compensating controls you require
in the meantime, and what would force it to be revisited early. If you would
refuse to sign it, say so and say what you would escalate instead.

---

## Task 4 — AI usage

Fill in `submission/AI_USAGE.md`. It should take fifteen minutes and it is
weighted the same as the other tasks.

---

## What we are assessing

- Whether you can tell a real risk from a scanner's opinion, and show your
  working.
- Whether you read code, or read tool output about code.
- Whether your detections would survive contact with a real alert queue.
- Whether you can hold a compliance conversation without either hand-waving or
  disappearing into framework citations.
- Whether you know what your tools did on your behalf.
- What you choose to prioritise, and whether you can say why.

## What we are not assessing

- Whether you can run the service. You cannot, and you do not need to.
- Whether you produce a working exploit. Describe the attack path; a PoC is
  welcome if you have one but it earns nothing extra on its own.
- Report formatting. Plain markdown is perfect.
- Coverage for its own sake.
