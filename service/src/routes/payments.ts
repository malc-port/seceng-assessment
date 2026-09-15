import { Router } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { query } from '../db';
import { logger } from '../util/logger';

export const paymentsRouter = Router();

const PSP_BASE_URL = process.env.PSP_BASE_URL || 'https://api.psp-partner.example';

interface CardDetails {
  number: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
  holder_name: string;
}

/**
 * Create a card payment. The card details are forwarded to the PSP for
 * authorisation; we persist only the brand and last four digits.
 */
paymentsRouter.post('/card', async (req, res) => {
  const { amount_usd, currency, card, customer_email } = req.body as {
    amount_usd: number;
    currency: string;
    card: CardDetails;
    customer_email: string;
  };

  const transactionId = `txn_${uuidv4().slice(0, 12)}`;

  logger.info('creating card payment', {
    transaction_id: transactionId,
    merchant_id: req.principal!.merchantId,
    amount_usd,
    currency,
    customer_email,
    card,
  });

  let authorization;
  try {
    const response = await axios.post(`${PSP_BASE_URL}/v2/authorizations`, {
      amount: amount_usd,
      currency,
      card,
      reference: transactionId,
    });
    authorization = response.data;
  } catch (err: any) {
    logger.error('psp authorisation failed', {
      transaction_id: transactionId,
      status: err.response?.status,
      psp_response: err.response?.data,
      request_card: card,
    });
    return res.status(502).json({ error: 'psp_unavailable' });
  }

  await query(
    'INSERT INTO transactions (id, merchant_id, amount_usd, currency, status, ' +
      'customer_email, card_last4, card_brand, created_at) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())',
    [
      transactionId,
      req.principal!.merchantId,
      amount_usd,
      currency,
      'authorized',
      customer_email,
      card.number.slice(-4),
      authorization.brand,
    ]
  );

  return res.status(201).json({ id: transactionId, status: 'authorized' });
});
