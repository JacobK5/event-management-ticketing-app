import pool from "../database.js";

const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS USER (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Fname VARCHAR(50) NOT NULL,
    Lname VARCHAR(50) NOT NULL,
    DOB DATE,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone_number VARCHAR(20),
    Password VARCHAR(100) NOT NULL
  );
`;

export async function createUserTableIfNeeded() {
  try {
    await pool.query(createUserTableQuery);
    console.log("USER table created or already exists.");
  } catch (error) {
    console.error("Error creating USER table:", error);
    throw error;
  }
}
