import pino from 'pino';

import { config } from '../config';

/**
 * Structured application logger.
 *
 * Output is shipped to the log pipeline by the node agent and retained for
 * 400 days.
 */
const base = pino({
  level: config.logLevel,
  base: {
    service: 'paylink-api',
    env: config.environment,
  },
  redact: {
    paths: ['req.headers.authorization', 'password'],
    censor: '[redacted]',
  },
});

export const logger = {
  info: (msg: string, fields: Record<string, unknown> = {}) => base.info(fields, msg),
  warn: (msg: string, fields: Record<string, unknown> = {}) => base.warn(fields, msg),
  error: (msg: string, fields: Record<string, unknown> = {}) => base.error(fields, msg),
  debug: (msg: string, fields: Record<string, unknown> = {}) => base.debug(fields, msg),
};
