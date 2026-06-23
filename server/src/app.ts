import express from "express";
import cors from "cors";

import productRoutes from "./routes/products.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/products", productRoutes);

export default app;
