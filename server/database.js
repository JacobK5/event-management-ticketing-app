import mysql from "mysql2/promise";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from "./config.js";
import { createUserTableIfNeeded } from "./models/userModel.js";
import { createOrganizerTableIfNeeded } from "./models/organizerModel.js";
import { createAttendeeTableIfNeeded } from "./models/attendeeModel.js";
import { createEventTableIfNeeded } from "./models/eventModel.js";
import { createEventCategoriesTableIfNeeded } from "./models/eventCategoriesModel.js";
import { createTicketTableIfNeeded } from "./models/ticketModel.js";
import { createDiscountCodeTableIfNeeded } from "./models/discountCodeModel.js";
import { createRSVPTableIfNeeded } from "./models/rsvpModel.js";
import { createPaymentTableIfNeeded } from "./models/paymentModel.js";
import { createResaleListingTableIfNeeded } from "./models/resaleListingModel.js";
import { createRefundTableIfNeeded } from "./models/refundModel.js";
import { createTicketDiscountTableIfNeeded } from "./models/ticketDiscountModel.js";

let pool;

function getPool() {
  if (!pool) {
    throw new Error(
      "Connection pool has not been created. Call createDatabaseConnection first."
    );
  }
  return pool;
}

// also creates the pool
export async function createDatabaseIfNeeded() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });
    console.log("Creating database (if it doesn't already exist)...");
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`);
    console.log(`Database '${DB_NAME}' created or already exists.`);
    await connection.end();
  } catch (error) {
    console.error("Error creating database:", error);
    process.exit(1);
  }

  // Now create the pool after ensuring the database exists
  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("Connection pool created successfully.");
}

export async function createTablesIfNeeded() {
  try {
    console.log("Creating tables (if they don't already exist)...");
    await createUserTableIfNeeded();
    await createOrganizerTableIfNeeded();
    await createAttendeeTableIfNeeded();
    await createEventTableIfNeeded();
    await createEventCategoriesTableIfNeeded();
    await createPaymentTableIfNeeded();
    await createTicketTableIfNeeded();
    await createDiscountCodeTableIfNeeded();
    await createRSVPTableIfNeeded();
    await createResaleListingTableIfNeeded();
    await createRefundTableIfNeeded();
    await createResaleListingTableIfNeeded();
    await createRefundTableIfNeeded();
    await createTicketDiscountTableIfNeeded();
    console.log("All tables initialized successfully.");
  } catch (error) {
    console.error("Error initializing tables:", error);
    throw error;
  }
}

export default getPool;
