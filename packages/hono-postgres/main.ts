import { Hono } from "hono";
import { serve } from "@hono/node-server";
import chance from "chance";
import postgres from "postgres";

const app = new Hono();
const port = Number(process.env.PORT) || 3000;

const sql = postgres(
  "postgresql://postgres:postgres@localhost:5432/db?sslmode=disable",
);

app.get("/up", (c) => c.json({ status: "ok" }));

app.post("/users", async (c) => {
  try {
    const result = await sql`
    INSERT INTO users (first_name, last_name, email)
    VALUES (${chance().first()}, ${chance().last()}, ${chance().email()})
    RETURNING first_name, last_name, email;
  `;

    return c.json({ success: true, user: result[0] });
  } catch (e) {
    return c.json(e, 500);
  }
});

app.get("/users", async (c) => {
  try {
    const users = await sql`SELECT * FROM users;`;

    return c.json({ users });
  } catch (e) {
    return c.json(e, 500);
  }
});

serve({ fetch: app.fetch, port }, ({ port }) => {
  console.log(`listening on port ${port}`);
});
