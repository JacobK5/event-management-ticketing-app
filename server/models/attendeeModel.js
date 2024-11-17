import pool from "../database.js";

const createAttendeeTableQuery = `
  CREATE TABLE IF NOT EXISTS ATTENDEE (
    UserID INT PRIMARY KEY,
    FOREIGN KEY (UserID) REFERENCES USER(UserID)
  );
`;

export async function createAttendeeTableIfNeeded() {
  try {
    await pool.query(createAttendeeTableQuery);
    console.log("ATTENDEE table created or already exists.");
  } catch (error) {
    console.error("Error creating ATTENDEE table:", error);
    throw error;
  }
}
