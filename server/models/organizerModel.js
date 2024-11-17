import pool from "../database.js";

const createOrganizerTableQuery = `
  CREATE TABLE IF NOT EXISTS ORGANIZER (
    Organizer_SSN VARCHAR(11) PRIMARY KEY,
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES USER(UserID)
  );
`;

export async function createOrganizerTableIfNeeded() {
  try {
    await pool.query(createOrganizerTableQuery);
    console.log("ORGANIZER table created or already exists.");
  } catch (error) {
    console.error("Error creating ORGANIZER table:", error);
    throw error;
  }
}
