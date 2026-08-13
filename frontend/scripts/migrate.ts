import { pool } from "./db";

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS links (
      id           SERIAL PRIMARY KEY,
      code         VARCHAR(10) UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS clicks (
      id          SERIAL PRIMARY KEY,
      link_id     INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
      clicked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      country     VARCHAR(2),
      city        VARCHAR(100),
      region      VARCHAR(100),
      device_type VARCHAR(20),
      browser     VARCHAR(50),
      os          VARCHAR(50),
      referrer    TEXT,
      ip          VARCHAR(45)
    );

    CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id);
    CREATE INDEX IF NOT EXISTS idx_clicks_link_id_clicked_at ON clicks(link_id, clicked_at);
  `);

  console.log("Database migration completed");
}

// Allow `npm run db:migrate` to run this directly.
migrate()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
