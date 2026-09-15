import { Router } from 'express';

import { query } from '../db';
import { logger } from '../util/logger';

export const transactionsRouter = Router();

/**
 * List transactions for the calling merchant.
 */
transactionsRouter.get('/', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);

  const rows = await query(
    'SELECT id, merchant_id, amount_usd, currency, status, created_at, settled_at ' +
      'FROM transactions WHERE merchant_id = $1 ORDER BY created_at DESC LIMIT $2',
    [req.principal!.merchantId, limit]
  );

  return res.json({ data: rows });
});

/**
 * Fetch a single transaction.
 */
transactionsRouter.get('/:id', async (req, res) => {
  const rows = await query(
    'SELECT id, merchant_id, amount_usd, currency, status, customer_email, ' +
      'card_last4, card_brand, created_at, settled_at ' +
      'FROM transactions WHERE id = $1',
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'not_found' });
  }

  return res.json({ data: rows[0] });
});

/**
 * Issue a refund against a settled transaction.
 */
transactionsRouter.post('/:id/refund', async (req, res) => {
  const rows = await query('SELECT id, merchant_id, status FROM transactions WHERE id = $1', [
    req.params.id,
  ]);

  if (rows.length === 0) {
    return res.status(404).json({ error: 'not_found' });
  }

  if (rows[0].merchant_id !== req.principal!.merchantId) {
    logger.warn('cross-merchant refund attempt', {
      subject: req.principal!.subject,
      transaction_id: req.params.id,
    });
    return res.status(403).json({ error: 'forbidden' });
  }

  await query('UPDATE transactions SET status = $1 WHERE id = $2', [
    'refund_pending',
    req.params.id,
  ]);

  return res.status(202).json({ status: 'refund_pending' });
});
