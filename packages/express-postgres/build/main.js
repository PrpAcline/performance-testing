// main.ts
import express from "express";
var app = express();
var port = process.env.PORT || 3e3;
app.get("/up", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
