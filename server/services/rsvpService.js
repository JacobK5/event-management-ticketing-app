import db from "../database.js";

class RsvpService {
  static async createRsvp({ userId, eventId, status }) {
    // Check if RSVP already exists
    const checkQuery = `
      SELECT * 
      FROM RSVP 
      WHERE User_ID = ? AND Event_ID = ?
    `;
    const [rows] = await db().execute(checkQuery, [userId, eventId]);

    if (rows.length > 0) {
      throw new Error("RSVP already exists");
    }

    // Insert new RSVP
    const insertQuery = `
      INSERT INTO RSVP (User_ID, Event_ID, Status) 
      VALUES (?, ?, ?)
    `;
    await db().execute(insertQuery, [userId, eventId, status]);
    return { message: "RSVP created" };
  }

  static async updateRsvp({ userId, eventId, status }) {
    // Update RSVP status
    const updateQuery = `
      UPDATE RSVP 
      SET Status = ? 
      WHERE User_ID = ? AND Event_ID = ?
    `;
    const [result] = await db().execute(updateQuery, [status, userId, eventId]);

    if (result.affectedRows === 0) {
      throw new Error("RSVP not found");
    }

    return { message: "RSVP status updated" };
  }

  static async cancelRsvp(userId, eventId) {
    // Delete RSVP
    const deleteQuery = `
      DELETE FROM RSVP 
      WHERE User_ID = ? AND Event_ID = ?
    `;
    await db().execute(deleteQuery, [userId, eventId]);
    return { message: "RSVP cancelled" };
  }
}

export default RsvpService;
