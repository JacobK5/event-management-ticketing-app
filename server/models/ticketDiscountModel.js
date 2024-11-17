import pool from "../database.js";

const createTicketDiscountTableQuery = `
  CREATE TABLE IF NOT EXISTS TICKET_DISCOUNT (
    Ticket_ID INT,
    Discount_Code VARCHAR(20),
    PRIMARY KEY (Ticket_ID, Discount_Code),
    FOREIGN KEY (Ticket_ID) REFERENCES TICKET(Ticket_ID),
    FOREIGN KEY (Discount_Code) REFERENCES DISCOUNT_CODE(Code)
  );
`;

export async function createTicketDiscountTableIfNeeded() {
  try {
    await pool.query(createTicketDiscountTableQuery);
    console.log("TICKET_DISCOUNT table created or already exists.");
  } catch (error) {
    console.error("Error creating TICKET_DISCOUNT table:", error);
    throw error;
  }
}
