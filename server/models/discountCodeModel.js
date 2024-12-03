import pool from "../database.js";

const createDiscountCodeTableQuery = `
  CREATE TABLE IF NOT EXISTS DISCOUNT_CODE (
    Code VARCHAR(20) PRIMARY KEY,
    Amount VARCHAR(10) NOT NULL,
    Max_Uses INT,
    Current_Uses INT DEFAULT 0,
    User_ID INT,
    FOREIGN KEY (User_ID) REFERENCES USER(UserID)
  );
`;

export async function createDiscountCodeTableIfNeeded() {
  try {
    await pool().query(createDiscountCodeTableQuery);
    console.log("DISCOUNT_CODE table created or already exists.");
  } catch (error) {
    console.error("Error creating DISCOUNT_CODE table:", error);
    throw error;
  }
}
