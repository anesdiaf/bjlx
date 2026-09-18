import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import {relations} from './relations';
import pg from "pg"

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
  idleTimeoutMillis: 10000,
  max: 10, // Adjust based on your server limits
});


export const db = drizzle({client: pool, relations});