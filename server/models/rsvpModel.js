import pool from "../database.js";

const createRSVPTableQuery = `
  CREATE TABLE IF NOT EXISTS RSVP (
    User_ID INT,
    Event_ID INT,
    Status VARCHAR(20),
    PRIMARY KEY (User_ID, Event_ID),
    FOREIGN KEY (User_ID) REFERENCES USER(UserID),
    FOREIGN KEY (Event_ID) REFERENCES EVENT(EventID)
  );
`;

export async function createRSVPTableIfNeeded() {
  try {
    await pool.query(createRSVPTableQuery);
    console.log("RSVP table created or already exists.");
  } catch (error) {
    console.error("Error creating RSVP table:", error);
    throw error;
  }
}
