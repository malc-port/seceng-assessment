# paylink-api

Merchant-facing payments API. Handles card pay-ins, transaction lookup,
settlement reporting and inbound PSP callbacks.

> This is a reduced copy of the service, extracted for the security assessment.
> Some modules (migrations, the supertest harness, the payouts worker) are
> referenced but not included. You are not expected to run it.

## Architecture

```
                  ┌──────────────┐
  merchant ──────▶│  ALB + nginx │──┐
  browser / SDK   └──────────────┘  │   X-Forwarded-For preserved
                                    ▼
                        ┌───────────────────────┐      ┌────────────┐
   PSP callbacks ──────▶│      paylink-api      │─────▶│  Postgres  │
   (HMAC signed)        │  (this repo, ECS)     │      │  primary   │
                        └───────────────────────┘      └────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │  PSP partner API      │
                        │  (card authorisation) │
                        └───────────────────────┘
```

- Deployed to ECS Fargate in `eu-west-1` and `us-east-1`. Tasks run in private
  subnets; the VPC CIDR is `10.42.0.0/16`.
- Internal callers (the reconciliation worker, the ledger sync job, the payout
  batch runner) reach the service over the VPC rather than through the ALB.
- Application logs are shipped to the central log pipeline and retained for
  400 days. Compliance treats that pipeline as audit evidence.

## Routes

| Method | Path                          | Auth                      | Notes |
|--------|-------------------------------|---------------------------|-------|
| GET    | `/v1/health`                  | none                      | Liveness probe |
| POST   | `/v1/auth/login`              | none                      | Handled by the auth service, not this repo |
| POST   | `/v1/webhooks/psp`            | HMAC signature            | Payment lifecycle callbacks |
| GET    | `/v1/transactions`            | bearer JWT                | Scoped to the caller's merchant |
| GET    | `/v1/transactions/:id`        | bearer JWT                | Single transaction |
| POST   | `/v1/transactions/:id/refund` | bearer JWT                | Refund request |
| POST   | `/v1/payments/card`           | bearer JWT                | Card authorisation |
| GET    | `/v1/reports/settlements`     | bearer JWT                | Merchant settlement summary |
| GET    | `/v1/reports/chargebacks`     | bearer JWT + admin        | Internal finance tooling |
| GET    | `/v1/reports/export`          | bearer JWT                | Finance CSV export |
| GET    | `/v1/admin/settlements`       | bearer JWT + admin        | Settlement administration |

## Data handled

- **Cardholder data.** `POST /v1/payments/card` receives a full PAN, expiry and
  CVV in the request body and forwards them to the PSP. We persist only brand
  and last four.
- **Customer PII.** Email addresses, transaction amounts, merchant identifiers.
- **Money movement.** A transaction reaching `settled` credits the merchant's
  available balance and makes the funds eligible for the next payout batch.
  Coinflow carries the chargeback and fraud liability on settled volume.

## Environment

| Variable | Required in production | Default if unset |
|----------|------------------------|------------------|
| `DATABASE_URL` | yes | local postgres |
| `JWT_SIGNING_SECRET` | yes | see `src/config.ts` |
| `PSP_WEBHOOK_SECRET` | yes | see `src/config.ts` |
| `INTERNAL_CIDR_PREFIX` | no | `10.` |
| `PSP_BASE_URL` | yes | PSP sandbox |

Secrets are injected from AWS Secrets Manager by the task definition. There is
no startup assertion that they were actually supplied.
