import pool from "../database.js";

const createTicketTableQuery = `
  CREATE TABLE IF NOT EXISTS TICKET (
    Ticket_ID INT AUTO_INCREMENT PRIMARY KEY,
    Price DECIMAL(10, 2) NOT NULL,
    Tier VARCHAR(20),
    Details TEXT,
    Event_ID INT,
    Holder_UserID INT,
    Pmt_Ref_Num INT,
    FOREIGN KEY (Event_ID) REFERENCES EVENT(EventID),
    FOREIGN KEY (Holder_UserID) REFERENCES USER(UserID),
    FOREIGN KEY (Pmt_Ref_Num) REFERENCES PAYMENT(Reference_Num)
  );
`;

export async function createTicketTableIfNeeded() {
  try {
    await pool.query(createTicketTableQuery);
    console.log("TICKET table created or already exists.");
  } catch (error) {
    console.error("Error creating TICKET table:", error);
    throw error;
  }
}
