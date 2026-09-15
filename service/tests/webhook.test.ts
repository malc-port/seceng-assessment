import crypto from 'crypto';

import { TEST_PSP_WEBHOOK_SECRET } from './fixtures/keys';

function sign(body: string, secret = TEST_PSP_WEBHOOK_SECRET): string {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

const settledEvent = JSON.stringify({
  id: 'evt_7f21aa',
  type: 'payment.settled',
  created: 1757300000,
  data: { transaction_id: 'txn_480119', merchant_id: 'mch_8842', amount_usd: 120.0 },
});

describe('POST /v1/webhooks/psp', () => {
  it('accepts an event with a valid signature', async () => {
    const res = await post(settledEvent, { 'x-psp-signature': sign(settledEvent) });
    expect(res.status).toBe(200);
  });

  it('rejects an event whose signature does not match the body', async () => {
    const res = await post(settledEvent, { 'x-psp-signature': sign('{}') });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('signature_mismatch');
  });

  it('rejects a malformed JSON payload', async () => {
    const body = 'not-json';
    const res = await post(body, { 'x-psp-signature': sign(body) });
    expect(res.status).toBe(400);
  });

  it('ignores event types it does not handle', async () => {
    const body = JSON.stringify({ id: 'evt_1', type: 'invoice.printed', data: {} });
    const res = await post(body, { 'x-psp-signature': sign(body) });
    expect(res.status).toBe(200);
  });
});

// Thin wrapper over supertest, omitted here for brevity in the assessment copy.
declare function post(
  body: string,
  headers: Record<string, string>
): Promise<{ status: number; body: any }>;
