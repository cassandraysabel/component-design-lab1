import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import getRoutes from "./routes/getRoutes";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("root route");
});

app.use("/api/get", getRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
