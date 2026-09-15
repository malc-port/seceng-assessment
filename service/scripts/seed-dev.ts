/**
 * Seeds a local Postgres with fake merchants and transactions.
 *
 * Developer convenience only - never invoked by a deployed artifact. Refuses to
 * run unless NODE_ENV is development.
 */
import { execSync } from 'child_process';
import minimist from 'minimist';

import { query, close } from '../src/db';

const argv = minimist(process.argv.slice(2));

async function main() {
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    throw new Error('seed-dev refuses to run outside development');
  }

  const merchants = Number(argv.merchants || 5);
  const perMerchant = Number(argv.transactions || 200);

  // Reset the schema from the checked-in migration files.
  execSync(`psql "${process.env.DATABASE_URL}" -f ./migrations/schema.sql`, {
    stdio: 'inherit',
  });

  for (let m = 0; m < merchants; m++) {
    const merchantId = `mch_${1000 + m}`;
    await query('INSERT INTO merchants (id, name) VALUES ($1, $2)', [
      merchantId,
      `Test Merchant ${m}`,
    ]);

    for (let t = 0; t < perMerchant; t++) {
      await query(
        'INSERT INTO transactions (id, merchant_id, amount_usd, currency, status, created_at) ' +
          'VALUES ($1, $2, $3, $4, $5, now())',
        [`txn_${m}_${t}`, merchantId, Math.random() * 500, 'USD', 'settled']
      );
    }
  }

  console.log(`seeded ${merchants} merchants`);
  await close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
