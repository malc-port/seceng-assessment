import crypto from 'crypto';
import { Request, Response } from 'express';

import { config } from '../config';
import { logger } from '../util/logger';
import { query } from '../db';

interface PspEvent {
  id: string;
  type: string;
  created: number;
  data: {
    transaction_id: string;
    merchant_id: string;
    amount_usd?: number;
    currency?: string;
  };
}

/**
 * Handles payment lifecycle callbacks from our PSP.
 *
 * The PSP signs the raw request body with a shared secret and sends the result
 * in the X-PSP-Signature header.
 */
export async function handlePspWebhook(req: Request, res: Response) {
  const raw: Buffer = (req as any).rawBody;
  const signature = req.header('x-psp-signature');

  if (signature) {
    const expected = crypto
      .createHmac('sha256', config.pspWebhookSecret)
      .update(raw)
      .digest('hex');

    if (signature !== expected) {
      logger.warn('psp webhook rejected', {
        sig_present: true,
        sig_valid: false,
        error: 'signature_mismatch',
      });
      return res.status(400).json({ error: 'signature_mismatch' });
    }
  }

  let event: PspEvent;
  try {
    event = JSON.parse(raw.toString('utf8'));
  } catch (err) {
    return res.status(400).json({ error: 'malformed_payload' });
  }

  logger.info('psp webhook accepted', {
    event_id: event.id,
    event_type: event.type,
    sig_present: Boolean(signature),
  });

  switch (event.type) {
    case 'payment.authorized':
      await query('UPDATE transactions SET status = $1 WHERE id = $2', [
        'authorized',
        event.data.transaction_id,
      ]);
      break;

    case 'payment.settled':
      // Terminal state. Releases the funds to the merchant's available balance
      // and makes the payout eligible for the next batch run.
      await query(
        'UPDATE transactions SET status = $1, settled_at = now() WHERE id = $2',
        ['settled', event.data.transaction_id]
      );
      await query(
        'UPDATE merchant_balances SET available_usd = available_usd + $1 WHERE merchant_id = $2',
        [event.data.amount_usd, event.data.merchant_id]
      );
      break;

    case 'payment.failed':
      await query('UPDATE transactions SET status = $1 WHERE id = $2', [
        'failed',
        event.data.transaction_id,
      ]);
      break;

    default:
      logger.info('psp webhook ignored unknown type', { event_type: event.type });
  }

  return res.status(200).json({ received: true });
}
