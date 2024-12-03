import pool from "../database.js";

const createPaymentTableQuery = `
  CREATE TABLE IF NOT EXISTS PAYMENT (
    Reference_Num INT AUTO_INCREMENT PRIMARY KEY,
    Method VARCHAR(30),
    Credit_Card_Info VARCHAR(30),
    Date DATE,
    User_ID INT,
    FOREIGN KEY (User_ID) REFERENCES USER(UserID)
  );
`;

export async function createPaymentTableIfNeeded() {
  try {
    await pool().query(createPaymentTableQuery);
    console.log("PAYMENT table created or already exists.");
  } catch (error) {
    console.error("Error creating PAYMENT table:", error);
    throw error;
  }
}
