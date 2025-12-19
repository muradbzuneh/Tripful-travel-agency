import app from "./app.js";
import { env } from "./config/env.js";
import "./config/db.js";

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`🚀 Tripful server running on port ${PORT}`);
});
