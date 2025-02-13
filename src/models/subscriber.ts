import { QueryConfig } from 'pg';
import { getPool } from '../db/db';
import { Subscriber as SubscriberType } from '../types';

export class Subscriber {
  static async findAll(name: string | undefined) {
    if (name) {
      const result = await getPool().query({
        name: 'all-subs', // to cache the query
        text: 'SELECT * FROM subscriber WHERE name ILIKE $1',
        values: [name],
      });
      return result.rows;
    }

    const result = await getPool().query('SELECT * FROM subscriber LIMIT 100');
    return result.rows;
  }

  static async find(id: string) {
    const values = [id];
    const result = await getPool().query('SELECT * FROM subscriber WHERE id = $1', values);

    if (result.rows.length > 0){
      return result.rows[0];
    } 
  }

  static async update(id: string, data: { name: string; last_name: string; email: string; phone: string }) {
    const { name, last_name, email, phone } = data;
    const values = [name, last_name, email, phone, id];
    const result = await getPool().query(
      `UPDATE subscriber 
       SET name = $1, last_name = $2, email = $3, phone = $4 
       WHERE id = $5 
       RETURNING *`,
      values
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }
  }

  static async create(data: { name: string; last_name: string; email: string; phone: string }) {
    const { name, last_name, email, phone } = data;
    const values = [name, last_name, email, phone];

    const result = await getPool().query(
      `INSERT INTO subscriber (name, last_name, email, phone) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      values
    );

    return result.rows[0];
  }
  
  static async delete(id: string) {
    const values = [id];
    const result = await getPool().query('DELETE FROM subscriber WHERE id = $1 RETURNING *', values);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  }
}




