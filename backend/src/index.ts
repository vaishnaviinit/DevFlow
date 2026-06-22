import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("DevFlow Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});