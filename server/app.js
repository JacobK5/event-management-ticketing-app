import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import pool, {
  createDatabaseIfNeeded,
  createTablesIfNeeded,
} from "./database.js";

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  console.log("Starting server...");
  await createDatabaseIfNeeded();
  await createTablesIfNeeded();

  app.get("/api/test", async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT "Connection Successful!" AS message'
      );
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
