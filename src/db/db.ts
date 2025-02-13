import { Client, Pool } from 'pg';

let client: null | Client = null;
let pool: null | Pool = null;

// Si
export function getClient() {
  if (client) {
    return client;
  }
  client = new Client({
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return client;
}

export function getPool() {
  if (pool) {
    return pool;
  }
  pool = new Pool({
    max: 20,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return pool;
}
