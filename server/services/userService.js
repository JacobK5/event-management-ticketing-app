import db from "../database.js";

class UserService {
  static async loginUser(email, password) {
    // Check if the user exists with the given email and password
    // (In a real system we would hash the password before comparing)
    const query = "SELECT * FROM USER WHERE Email = ? AND Password = ?";
    const [rows] = await db().execute(query, [email, password]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async createUser({
    fname,
    lname,
    email,
    password,
    dob,
    phoneNumber,
    isAttendee,
    organizerSSN,
  }) {
    const connection = await db().getConnection(); // Get a connection object

    try {
      console.log("got create user request");

      // Begin transaction
      await connection.beginTransaction();

      // Check if a user with this email already exists
      const checkQuery = "SELECT * FROM USER WHERE Email = ?";
      const [existingUser] = await connection.execute(checkQuery, [email]);
      if (existingUser.length > 0) {
        throw new Error("User with this email already exists");
      }

      // Insert the new user
      const insertUserQuery =
        "INSERT INTO USER (Fname, Lname, Email, Password, DOB, Phone_number) VALUES (?, ?, ?, ?, ?, ?)";
      const [result] = await connection.execute(insertUserQuery, [
        fname,
        lname,
        email,
        password,
        dob,
        phoneNumber,
      ]);
      const userId = result.insertId;

      // Insert into ATTENDEE and/or ORGANIZER tables
      if (isAttendee) {
        const insertAttendeeQuery = "INSERT INTO ATTENDEE (UserID) VALUES (?)";
        await connection.execute(insertAttendeeQuery, [userId]);
      }

      if (organizerSSN) {
        const insertOrganizerQuery =
          "INSERT INTO ORGANIZER (UserID, Organizer_SSN) VALUES (?, ?)";
        await connection.execute(insertOrganizerQuery, [userId, organizerSSN]);
      }

      // Commit the transaction if all queries succeed
      await connection.commit();

      // Create a user object to return
      const user = {
        userId,
        fname,
        lname,
        email,
        dob,
        phoneNumber,
        isAttendee,
        organizerSSN,
      };

      return user;
    } catch (error) {
      // Rollback the transaction if anything fails
      await connection.rollback();
      console.error("Transaction failed, rolling back:", error.message);
      throw error;
    } finally {
      // Release the connection back to the pool
      await connection.release();
    }
  }

  static async getUserProfile(userId) {
    // Get the user's profile information
    const query = `
      SELECT 
        u.UserID, u.Fname, u.Lname, u.Email, u.Phone_number, u.DOB, 
        o.Organizer_SSN 
      FROM USER u 
      LEFT JOIN ORGANIZER o ON u.UserID = o.UserID 
      WHERE u.UserID = ?
    `;

    const [rows] = await db().execute(query, [userId]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async updateUserProfile(userId, updates) {
    // Update the user's profile information
    const query = `
      UPDATE USER 
      SET Fname = ?, Lname = ?, Email = ?, Phone_number = ?, DOB = ?
      WHERE UserID = ?
    `;

    const [result] = await db().execute(query, [
      updates.fname,
      updates.lname,
      updates.email,
      updates.phone_number,
      updates.dob,
      userId,
    ]);

    return result.affectedRows > 0;
  }

  static async updatePassword(userId, newPassword) {
    // Update the user's password
    const query = `
      UPDATE USER 
      SET Password = ? 
      WHERE UserID = ?
    `;
    const [result] = await db().execute(query, [newPassword, userId]);
    return result.affectedRows > 0;
  }

  static async getUserTickets(userId) {
    // Get the tickets owned by the user
    const query = `
      SELECT t.Ticket_ID, t.Price, t.Tier, t.Details, e.EventID, e.Time, e.Date, 
             e.Location_Name, e.Location_Address, e.Description
      FROM TICKET t
      JOIN EVENT e ON t.Event_ID = e.EventID
      WHERE t.Holder_UserID = ?
    `;
    const [rows] = await db().execute(query, [userId]);
    return rows;
  }

  static async getUserRsvps(userId) {
    // Get RSVPs of the user with event details
    const query = `
      SELECT e.EventID, e.Time, e.Date, e.Location_Name, e.Location_Address, 
             e.Description, r.Status
      FROM RSVP r
      JOIN EVENT e ON r.Event_ID = e.EventID
      WHERE r.User_ID = ?
    `;
    const [rows] = await db().execute(query, [userId]);
    return rows;
  }

  static async getUserPayments(userId) {
    // Get the payments made by the user with ticket and event details
    const query = `
      SELECT p.Reference_Num, p.Method, p.Date, t.Ticket_ID, t.Price, t.Tier, 
             e.EventID, e.Time, e.Date AS EventDate, e.Location_Name, e.Description
      FROM PAYMENT p
      JOIN TICKET t ON p.Reference_Num = t.Pmt_Ref_Num
      JOIN EVENT e ON t.Event_ID = e.EventID
      WHERE p.User_ID = ?
    `;
    const [rows] = await db().execute(query, [userId]);
    return rows;
  }

  static async getUserRefunds(userId) {
    // Get the refunds requested by the user with ticket and event details
    const query = `
      SELECT r.Ref_Num, r.Status, r.Date, t.Ticket_ID, t.Price, e.EventID, 
             e.Time, e.Date AS EventDate, e.Location_Name
      FROM REFUND r
      JOIN PAYMENT p ON r.Ref_Num = p.Reference_Num
      JOIN TICKET t ON p.Reference_Num = t.Pmt_Ref_Num
      JOIN EVENT e ON t.Event_ID = e.EventID
      WHERE p.User_ID = ?
    `;
    const [rows] = await db().execute(query, [userId]);
    return rows;
  }
}

export default UserService;
