import pool from "../database.js";

const createEventTableQuery = `
  CREATE TABLE IF NOT EXISTS EVENT (
    EventID VARCHAR(100) PRIMARY KEY,
    Time TIME,
    Location_Name VARCHAR(100),
    Location_Address VARCHAR(150),
    Date DATE,
    Description TEXT,
    Organizer_UserID INT,
    FOREIGN KEY (Organizer_UserID) REFERENCES USER(UserID)
  );
`;

export async function createEventTableIfNeeded() {
  try {
    await pool().query(createEventTableQuery);
    console.log("EVENT table created or already exists.");
  } catch (error) {
    console.error("Error creating EVENT table:", error);
    throw error;
  }
}
