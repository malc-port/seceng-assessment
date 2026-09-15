import express from 'express';
import bodyParser from 'body-parser';

import { config } from './config';
import { logger } from './util/logger';
import { requireAuth, requireAdmin } from './auth/middleware';
import { transactionsRouter } from './routes/transactions';
import { reportsRouter } from './routes/reports';
import { paymentsRouter } from './routes/payments';
import { handlePspWebhook } from './webhooks/pspWebhook';

const app = express();

// We sit behind an ALB and then an nginx ingress, so client IPs arrive in
// X-Forwarded-For.
app.set('trust proxy', true);

// Keep the raw body around: the PSP signs the exact bytes it sends us, so
// re-serialising the parsed object would break verification.
app.use(
  bodyParser.json({
    limit: '2mb',
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);

app.use((req, _res, next) => {
  logger.info('request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    body: req.body,
  });
  next();
});

app.get('/v1/health', (_req, res) => res.status(200).send('ok'));

// Inbound PSP callbacks. Not authenticated with a bearer token - the PSP
// authenticates itself with an HMAC signature over the request body.
app.post('/v1/webhooks/psp', handlePspWebhook);

app.use('/v1/transactions', requireAuth, transactionsRouter);
app.use('/v1/payments', requireAuth, paymentsRouter);
app.use('/v1/reports', reportsRouter);

app.use('/v1/admin/settlements', requireAuth, requireAdmin, (req, res) => {
  res.json({ ok: true });
});

app.listen(config.port, () => {
  logger.info(`paylink-api listening on :${config.port}`, {
    environment: config.environment,
  });
});

export { app };
