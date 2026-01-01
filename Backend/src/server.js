import app from "./app.js";
import { env } from "./config/env.js";
import "./config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadDir = path.join(__dirname, "../uploads/packages");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created uploads directory:", uploadDir);
}

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`🚀 Tripful server running on port ${PORT}`);
});
