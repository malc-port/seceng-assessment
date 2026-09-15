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

export async function close(): Promise<void> {
  await pool.end();
}
