import express from "express";
import authRoutes from "./modules/auth/auth.routes";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("DevFlow Backend Running");
});

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});