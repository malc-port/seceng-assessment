# Detection rules

Coinflow's SIEM is being migrated, so rules are maintained in this
vendor-neutral YAML form and compiled into the target platform's query language
on deploy. Write any new or amended rule in the same form. If you would rather
express your answer as a Splunk SPL search, an Elastic/EQL query, a Panther
Python rule or a Sigma rule, that is fine too — say which platform you are
writing for.

## Schema

```yaml
id:          # R-NNN
title:
status:      # production | testing | deprecated
severity:    # informational | low | medium | high | critical
description:
source:      # which log source the rule reads: coinflow-auth | api-gateway
detection:
  where:     # list of conditions, ANDed together
  exclude:   # optional; events matching any of these are dropped
  group_by:  # optional; field or list of fields to aggregate over
  threshold: # optional; {count, window} - fires when count is met within window
response:
  destination: # pagerduty | slack#channel | ticket
  runbook:
```

Supported operators in `where` and `exclude`:

| Operator | Meaning |
|----------|---------|
| `==`, `!=` | equality on a field |
| `>`, `<`, `>=`, `<=` | numeric comparison |
| `in`, `not_in` | membership in a literal list or in a `baseline(...)` |
| `matches` | glob against a string field |
| `exists`, `not_exists` | field presence |
| `distinct_count(field)` | cardinality of a field inside a `group_by` bucket |
| `baseline(field, window=)` | values seen for this key over a trailing window |

## Log sources

`coinflow-auth` — authentication events. Fields: `ts`, `event`, `username`,
`src_ip`, `asn`, `asn_org`, `geo_country`, `geo_city`, `user_agent`, `outcome`,
`reason`, `mfa`, `session_id`, `account_type`, `merchant_id`,
`token_ttl_seconds`, `scopes`.

`api-gateway` — one record per HTTP request reaching the edge. Fields: `ts`,
`request_id`, `method`, `path`, `route`, `status`, `src_ip`, `asn`,
`geo_country`, `user_agent`, `latency_ms`, `bytes_out`, `auth_subject`,
`merchant_id`, `session_id`, `error`. Webhook requests additionally carry
`sig_present` (was a signature header supplied), `sig_valid` (did it verify —
`null` when no signature was supplied), `psp_env`, `event_type`, `target_txn`
and `amount_usd`.

Both sources are newline-delimited JSON in `../data/`.
