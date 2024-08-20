import { serve } from "@hono/node-server";
import chance from "chance";
import { Hono } from "hono";
import postgres from "postgres";
import { createPostgresBridge } from "postgres-bridge";
import { createPool, sql } from "slonik";
const app = new Hono();
const port = Number(process.env.PORT) || 3e3;
const PostgresBridge = createPostgresBridge(postgres);
const pool = await createPool(
  "postgresql://postgres:postgres@localhost:5432/db?sslmode=disable",
  { PgPool: PostgresBridge }
);
app.get("/up", (c) => c.json({ status: "ok" }));
app.post("/users", async (c) => {
  try {
    const query = sql.unsafe`
    INSERT INTO users (first_name, last_name, email)
    VALUES (${chance().first()}, ${chance().last()}, ${chance().email()})
    RETURNING first_name, last_name, email;
  `;
    const result = await pool.connect(
      async (connection) => await connection.query(query)
    );
    return c.json({ success: true, user: result.rows[0] });
  } catch (e) {
    console.log(e);
    return c.json(e, 500);
  }
});
app.get("/users", async (c) => {
  try {
    const query = sql.unsafe`SELECT * FROM users;`;
    const users = await pool.connect((connection) => connection.query(query));
    return c.json({ users });
  } catch (e) {
    return c.json(e, 500);
  }
});
serve({ fetch: app.fetch, port }, ({ port: port2 }) => {
  console.log(`listening on port ${port2}`);
});
