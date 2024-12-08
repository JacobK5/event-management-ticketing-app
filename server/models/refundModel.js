import pool from "../database.js";

const createRefundTableQuery = `
  CREATE TABLE IF NOT EXISTS REFUND (
    Ref_Num INT PRIMARY KEY,
    Status VARCHAR(20),
    Date DATE,
    FOREIGN KEY (Ref_Num) REFERENCES PAYMENT(Reference_Num)
  );
`;

export async function createRefundTableIfNeeded() {
  try {
    await pool().query(createRefundTableQuery);
    console.log("REFUND table created or already exists.");
  } catch (error) {
    console.error("Error creating REFUND table:", error);
    throw error;
  }
}
