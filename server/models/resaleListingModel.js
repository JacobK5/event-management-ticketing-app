import pool from "../database.js";

const createResaleListingTableQuery = `
  CREATE TABLE IF NOT EXISTS RESALE_LISTING (
    Listing_ID INT AUTO_INCREMENT PRIMARY KEY,
    Price DECIMAL(10, 2) NOT NULL,
    Ticket_ID INT,
    User_ID INT,
    FOREIGN KEY (Ticket_ID) REFERENCES TICKET(Ticket_ID),
    FOREIGN KEY (User_ID) REFERENCES USER(UserID)
  );
`;

export async function createResaleListingTableIfNeeded() {
  try {
    await pool.query(createResaleListingTableQuery);
    console.log("RESALE_LISTING table created or already exists.");
  } catch (error) {
    console.error("Error creating RESALE_LISTING table:", error);
    throw error;
  }
}
