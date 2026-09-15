/**
 * Runtime configuration for paylink-api.
 *
 * Values come from the environment in every deployed tier. The literals below
 * exist so that `npm run dev` and the integration suite work without a full
 * secrets bootstrap.
 */

export interface Config {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  pspWebhookSecret: string;
  internalCidrPrefix: string;
  logLevel: string;
  environment: string;
}

export const config: Config = {
  port: Number(process.env.PORT || 8080),

  databaseUrl:
    process.env.DATABASE_URL || 'postgres://paylink:paylink@localhost:5432/paylink',

  jwtSecret: process.env.JWT_SIGNING_SECRET || 'dev-jwt-secret-do-not-ship',

  // Shared secret used to authenticate inbound webhooks from our PSP.
  pspWebhookSecret:
    process.env.PSP_WEBHOOK_SECRET || 'whsec_9f2a41c8b7e04d6a83c150e7d2ab9914',

  // Requests originating inside the VPC are treated as first-party.
  internalCidrPrefix: process.env.INTERNAL_CIDR_PREFIX || '10.',

  logLevel: process.env.LOG_LEVEL || 'info',

  environment: process.env.NODE_ENV || 'development',
};
