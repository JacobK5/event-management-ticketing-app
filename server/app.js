import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import pool, {
  createDatabaseIfNeeded,
  createTablesIfNeeded,
} from "./database.js";
import routes from "./routes/routes.js";

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  console.log("Starting server...");
  await createDatabaseIfNeeded();
  await createTablesIfNeeded();

  app.use("/api", routes);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

await startServer();
