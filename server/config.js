import dotenv from "dotenv";

dotenv.config();

export const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT } = process.env;
