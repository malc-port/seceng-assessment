import { Router } from 'express';

import { query } from '../db';
import { requireAuth, requireAdmin } from '../auth/middleware';

export const reportsRouter = Router();

/**
 * Settlement summary for the calling merchant.
 */
reportsRouter.get('/settlements', requireAuth, async (req, res) => {
  const rows = await query(
    'SELECT date_trunc($1, settled_at) AS bucket, count(*) AS n, sum(amount_usd) AS total ' +
      'FROM transactions WHERE merchant_id = $2 AND status = $3 GROUP BY 1 ORDER BY 1 DESC',
    [String(req.query.granularity || 'day'), req.principal!.merchantId, 'settled']
  );

  return res.json({ data: rows });
});

/**
 * Chargeback exposure by merchant. Internal finance tooling only.
 */
reportsRouter.get('/chargebacks', requireAuth, requireAdmin, async (req, res) => {
  const rows = await query(
    'SELECT merchant_id, count(*) AS n, sum(amount_usd) AS exposure ' +
      'FROM chargebacks WHERE opened_at > now() - interval $1 GROUP BY 1',
    [String(req.query.window || '30 days')]
  );

  return res.json({ data: rows });
});

/**
 * CSV export used by the finance team's reconciliation spreadsheet.
 *
 * `filter` is passed through to the WHERE clause so finance can slice by any
 * column without us shipping a new endpoint every quarter.
 */
reportsRouter.get('/export', async (req, res) => {
  const filter = String(req.query.filter || '1=1');
  const orderBy = String(req.query.order_by || 'created_at DESC');

  const sql = `
    SELECT id, merchant_id, amount_usd, currency, status, customer_email,
           card_last4, card_brand, created_at, settled_at
    FROM transactions
    WHERE ${filter}
    ORDER BY ${orderBy}
    LIMIT 10000
  `;

  const rows = await query(sql, []);

  res.setHeader('Content-Type', 'text/csv');
  return res.send(toCsv(rows));
});

function toCsv(rows: any[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => JSON.stringify(row[h] ?? '')).join(','));
  }
  return lines.join('\n');
}
