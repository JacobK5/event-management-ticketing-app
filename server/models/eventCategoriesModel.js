import pool from "../database.js";

const createEventCategoriesTableQuery = `
  CREATE TABLE IF NOT EXISTS EVENT_CATEGORIES (
    EventID VARCHAR(100),
    Category VARCHAR(50),
    PRIMARY KEY (EventID, Category),
    FOREIGN KEY (EventID) REFERENCES EVENT(EventID)
  );
`;

export async function createEventCategoriesTableIfNeeded() {
  try {
    await pool().query(createEventCategoriesTableQuery);
    console.log("EVENT_CATEGORIES table created or already exists.");
  } catch (error) {
    console.error("Error creating EVENT_CATEGORIES table:", error);
    throw error;
  }
}
