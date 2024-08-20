import chance from "chance";
import express from "express";
import postgres from "postgres";

const app = express();
const port = process.env.PORT || 3000;

const sql = postgres("postgresql://postgres:postgres@localhost:5432");

app.get("/up", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/users", async (req, res) => {
  try {
    const result = await sql`
    INSERT INTO users (first_name, last_name, email)
    VALUES (${chance().first()}, ${chance().last()}, ${chance().email()})
    RETURNING first_name, last_name, email
  `;

    res.status(201).json({ success: true, user: result[0] });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await sql`SELECT * FROM users;`;

    res.status(200).json({ users });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
