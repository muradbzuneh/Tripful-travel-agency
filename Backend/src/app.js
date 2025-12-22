import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* Global Middlewares */
app.use(cors());
app.use(express.json());

/* Serve static files for uploads */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
