#!/usr/bin/env python3
"""Checks that the assessment working copy is complete and readable."""

import json
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

REQUIRED = [
    "INSTRUCTIONS.md",
    "ASSESSMENT.md",
    "scans/aegis-scan-2026-09-10.json",
    "siem/README.md",
    "siem/alert-console-export.csv",
    "siem/rules/R-001-anomalous-login-location.yml",
    "siem/rules/R-002-credential-stuffing.yml",
    "siem/rules/R-003-resource-enumeration.yml",
    "siem/rules/R-004-webhook-signature-failure.yml",
    "service/package.json",
    "service/package-lock.json",
    "service/README.md",
    "service/src/index.ts",
    "service/src/config.ts",
    "service/src/auth/middleware.ts",
    "service/src/routes/transactions.ts",
    "service/src/routes/reports.ts",
    "service/src/routes/payments.ts",
    "service/src/webhooks/pspWebhook.ts",
    "service/src/db/index.ts",
    "service/src/util/logger.ts",
    "service/scripts/seed-dev.ts",
    "service/tests/webhook.test.ts",
    "service/tests/fixtures/keys.ts",
    "service/.github/dependabot.yml",
    "service/.github/workflows/dependabot-auto-merge.yml",
    "data/auth_events.jsonl",
    "data/api_gateway.jsonl",
    "submission/REPORT.md",
    "submission/AI_USAGE.md",
]

problems = []

for rel in REQUIRED:
    if not os.path.exists(os.path.join(ROOT, rel)):
        problems.append("missing: %s" % rel)

counts = {}
for name in ("auth_events", "api_gateway"):
    path = os.path.join(ROOT, "data", "%s.jsonl" % name)
    if not os.path.exists(path):
        continue
    n = 0
    with open(path) as fh:
        for i, line in enumerate(fh, 1):
            try:
                json.loads(line)
            except ValueError:
                problems.append("%s.jsonl line %d is not valid JSON" % (name, i))
                break
            n += 1
    counts[name] = n

with open(os.path.join(ROOT, "scans", "aegis-scan-2026-09-10.json")) as fh:
    scan = json.load(fh)

print("")
print("  scan report  %d findings (%s)" % (
    len(scan["findings"]), scan["scan"]["target"]))
for name, n in sorted(counts.items()):
    print("  %-12s %d records" % (name, n))

if problems:
    print("")
    for p in problems:
        print("  ! %s" % p)
    print("\n  Setup incomplete.\n")
    sys.exit(1)

print("""
  Ready.

  Read INSTRUCTIONS.md first - scope, ground rules and how to submit.
  Then work through ASSESSMENT.md.

  Answers go in submission/REPORT.md and submission/AI_USAGE.md.
""")
