import { Pool } from 'pg';

import { config } from '../config';

const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30_000,
});

export async function query(sql: string, params: any[] = []): Promise<any[]> {
  const result = await pool.query(sql, params);
  return result.rows;
}

/**
 * Next value from the transaction id sequence.
 *
 * Transaction identifiers are human-quotable in support tickets and
 * reconciliation files, so they are drawn from a Postgres sequence rather than
 * being random.
 */
export async function nextTransactionSequence(): Promise<number> {
  const rows = await query("SELECT nextval('transactions_id_seq') AS id");
  return Number(rows[0].id);
}

export async function close(): Promise<void> {
  await pool.end();
}
