import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  NODE_ENV,
  POSTGRES_DB_TEST,
} = process.env;

let pool: Pool;

switch (NODE_ENV?.trim()) {
  case "test":
    pool = new Pool({
      host: POSTGRES_HOST,
      database: POSTGRES_DB_TEST,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
    });
    break;
  case "dev":
    pool = new Pool({
      host: POSTGRES_HOST,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
    });
    break;
  default:
    pool = new Pool({
      host: POSTGRES_HOST,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
    });
}

pool.on("error", (err: Error) => {
  console.error(err.message);
});

export default pool;
