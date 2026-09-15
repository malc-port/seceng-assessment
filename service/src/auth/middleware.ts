import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config';
import { logger } from '../util/logger';

export interface Principal {
  subject: string;
  merchantId: string | null;
  accountType: 'staff' | 'merchant' | 'service';
  scopes: string[];
  isAdmin: boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      principal?: Principal;
    }
  }
}

/**
 * Authenticates a caller.
 *
 * Two paths are supported:
 *   1. A bearer JWT issued by our auth service (merchants, staff).
 *   2. Internal service-to-service calls originating inside the VPC, which
 *      identify themselves with X-Internal-Actor instead of carrying a token.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const internalActor = req.header('x-internal-actor');

  if (internalActor && req.ip.startsWith(config.internalCidrPrefix)) {
    req.principal = {
      subject: internalActor,
      merchantId: null,
      accountType: 'service',
      scopes: ['read:transactions', 'read:settlements', 'write:settlements'],
      isAdmin: true,
    };
    return next();
  }

  const header = req.header('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'missing_credentials' });
  }

  try {
    const claims = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
    }) as any;

    req.principal = {
      subject: claims.sub,
      merchantId: claims.merchant_id ?? null,
      accountType: claims.account_type,
      scopes: (claims.scopes || '').split(',').filter(Boolean),
      isAdmin: claims.account_type === 'staff' && claims.role === 'admin',
    };

    return next();
  } catch (err) {
    logger.warn('jwt verification failed', { error: (err as Error).message });
    return res.status(401).json({ error: 'invalid_token' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.principal?.isAdmin) {
    return res.status(403).json({ error: 'forbidden' });
  }
  return next();
}
