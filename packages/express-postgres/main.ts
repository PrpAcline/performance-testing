import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/up", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
