import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();

/* Global Middlewares */
app.use(cors());
app.use(express.json());

/* API Routes */
app.use("/api", routes);

/* Health Check */
app.get("/", (req, res) => {
  res.json({
    message: "Tripful API is running 🚀",
  });
});

/* Global Error Handler */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

export default app;
