import db from "../database.js";

class EventService {
  static async createEvent({
    name,
    time,
    locationName,
    locationAddress,
    date,
    description,
    organizerUserId,
    categories,
    tickets,
    discountCodes,
  }) {
    const connection = await db().getConnection();
    await connection.beginTransaction();
    try {
      // Insert into EVENT
      const eventQuery = `
        INSERT INTO EVENT (EventID, Time, Location_Name, Location_Address, Date, Description, Organizer_UserID) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [eventResult] = await connection.execute(eventQuery, [
        name,
        time,
        locationName,
        locationAddress,
        date,
        description,
        organizerUserId,
      ]);
      const eventId = name;

      // Insert into EVENT_CATEGORIES for each category
      const categoryQuery = `
        INSERT INTO EVENT_CATEGORIES (EventID, Category) 
        VALUES (?, ?)
      `;
      for (const category of categories) {
        await connection.execute(categoryQuery, [eventId, category]);
      }

      // NOTE: How this works will change for actual implementation (probably use some kind of object with price, tier, details, and number and we will just loop that many times to make all the tickets), for now this is good enough since we just need the query
      // Insert into TICKET
      const ticketQuery = `
        INSERT INTO TICKET (Price, Tier, Details, Event_ID) 
        VALUES (?, ?, ?, ?)
      `;
      for (const ticket of tickets) {
        // probably need to track ids of all tickets so we can associate discount codes with them
        for (let i = 0; i < ticket.quantity; i++) {
          await connection.execute(ticketQuery, [
            ticket.price,
            ticket.tier,
            ticket.details,
            eventId,
          ]);
        }
      }

      // Insert into DISCOUNT_CODE
      const discountQuery = `
        INSERT INTO DISCOUNT_CODE (Code, Amount, Max_Uses, User_ID) 
        VALUES (?, ?, ?, ?)
      `;
      const ticketDiscountQuery = `
        INSERT INTO TICKET_DISCOUNT (Ticket_ID, Discount_Code) 
        VALUES (?, ?)
      `;
      for (const discount of discountCodes) {
        const [discountResult] = await connection.execute(discountQuery, [
          discount.code,
          discount.amount,
          discount.maxUses,
          organizerUserId, // NOTE: We will probably just get rid of the User_ID part for discount codes
        ]);

        // NOTE: This logic will also need to change, we might need to split up making an event and adding discounts so it's easier to choose which tickets the codes apply to
        // Insert into TICKET_DISCOUNT
        for (const ticketId of discount.ticketIds) {
          await connection.execute(ticketDiscountQuery, [
            ticketId,
            discount.code,
          ]);
        }
      }

      await connection.commit();
      return eventId;
    } catch (error) {
      console.log("error creating event:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getEvents({ category, location, maxPrice, searchTerm }) {
    // Make base query
    let query = `
      SELECT e.EventID, e.Time, e.Location_Name, e.Location_Address, e.Date, e.Description, u.Fname AS OrganizerName, u.UserID AS OrganizerID
      FROM EVENT e
      JOIN USER u ON e.Organizer_UserID = u.UserID
    `;
    const params = [];

    // Apply filters if provided
    if (category) {
      query += ` JOIN EVENT_CATEGORIES ec ON e.EventID = ec.EventID WHERE ec.Category = ?`;
      params.push(category);
    } else {
      // If no category is provided, we need to add a WHERE clause to the query so the rest of the filters work
      query += ` WHERE 1 = 1`;
    }

    if (location) {
      query += ` AND e.Location_Name LIKE ?`;
      params.push(`%${location}%`);
    }

    if (maxPrice) {
      query += `
        AND EXISTS (
          SELECT 1 FROM TICKET t WHERE t.Event_ID = e.EventID AND t.Price <= ?
        )
      `;
      params.push(maxPrice);
    }

    if (searchTerm) {
      query += ` AND e.EventID LIKE ?`; // Match search term with EventID (event name)
      params.push(`%${searchTerm}%`);
    }

    const [events] = await db().execute(query, params);
    return events;
  }

  static async getEventDetails(eventId) {
    const connection = await db().getConnection();

    try {
      // Get event details along with organizer info
      const eventQuery = `
        SELECT e.EventID, e.Time, e.Location_Name, e.Location_Address, e.Date, e.Description, 
               u.Fname AS OrganizerName, u.Email AS OrganizerEmail 
        FROM EVENT e 
        JOIN USER u ON e.Organizer_UserID = u.UserID 
        WHERE e.EventID = ?
      `;
      const [eventRows] = await connection.execute(eventQuery, [eventId]);
      const eventDetails = eventRows[0];

      if (!eventDetails) return null;

      // Get event categories
      const categoryQuery = `
        SELECT Category 
        FROM EVENT_CATEGORIES 
        WHERE EventID = ?
      `;
      const [categoryRows] = await connection.execute(categoryQuery, [eventId]);
      eventDetails.categories = categoryRows.map((row) => row.Category);

      // Count tickets sold
      const ticketsQuery = `
        SELECT COUNT(*) AS ticketsSold 
        FROM TICKET 
        WHERE Event_ID = ? AND Holder_UserID IS NOT NULL
      `;
      const [ticketsRows] = await connection.execute(ticketsQuery, [eventId]);
      eventDetails.ticketsSold = ticketsRows[0].ticketsSold;

      // Count RSVPs by status
      const rsvpQuery = `
        SELECT Status, COUNT(*) AS count 
        FROM RSVP 
        WHERE Event_ID = ? 
        GROUP BY Status
      `;
      const [rsvpRows] = await connection.execute(rsvpQuery, [eventId]);
      eventDetails.rsvpCounts = rsvpRows;

      return eventDetails;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getAttendees(eventId) {
    const connection = await db().getConnection();

    try {
      // Get ticket holders
      const ticketHoldersQuery = `
        SELECT t.Ticket_ID, u.UserID, u.Fname, u.Lname, u.Email, 'Paid' AS Type 
        FROM TICKET t 
        JOIN USER u ON t.Holder_UserID = u.UserID 
        WHERE t.Event_ID = ?
      `;
      const [ticketHolders] = await connection.execute(ticketHoldersQuery, [
        eventId,
      ]);

      // Get RSVP attendees
      const rsvpAttendeesQuery = `
        SELECT u.UserID, u.Fname, u.Lname, u.Email, r.Status, 'RSVP' AS Type 
        FROM RSVP r 
        JOIN USER u ON r.User_ID = u.UserID 
        WHERE r.Event_ID = ?
      `;
      const [rsvpAttendees] = await connection.execute(rsvpAttendeesQuery, [
        eventId,
      ]);

      // Combine results
      const attendees = [...ticketHolders, ...rsvpAttendees];
      return attendees;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }

  static async editEvent(
    eventId,
    { time, locationName, locationAddress, date, description, categories }
  ) {
    const connection = await db().getConnection();
    await connection.beginTransaction();

    try {
      // Update event details
      const eventQuery = `
        UPDATE EVENT 
        SET Time = ?, Location_Name = ?, Location_Address = ?, Date = ?, Description = ? 
        WHERE EventID = ?
      `;
      await connection.execute(eventQuery, [
        time,
        locationName,
        locationAddress,
        date,
        description,
        eventId,
      ]);

      // Delete existing categories
      const deleteCategoriesQuery = `
        DELETE FROM EVENT_CATEGORIES 
        WHERE EventID = ?
      `;
      await connection.execute(deleteCategoriesQuery, [eventId]);

      // Insert new categories
      const categoryQuery = `
        INSERT INTO EVENT_CATEGORIES (EventID, Category) 
        VALUES (?, ?)
      `;
      for (const category of categories) {
        await connection.execute(categoryQuery, [eventId, category]);
      }

      await connection.commit();
      return { message: "Event updated successfully" };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteEvent(eventId) {
    const connection = await db().getConnection();
    await connection.beginTransaction();

    try {
      // Delete RSVPs
      const deleteRsvpQuery = `
        DELETE FROM RSVP 
        WHERE Event_ID = ?
      `;
      await connection.execute(deleteRsvpQuery, [eventId]);

      // Delete ticket discount associations
      const deleteTicketDiscountsQuery = `
        DELETE FROM TICKET_DISCOUNT 
        WHERE Ticket_ID IN (SELECT Ticket_ID FROM TICKET WHERE Event_ID = ?)
      `;
      await connection.execute(deleteTicketDiscountsQuery, [eventId]);

      // Delete discount codes associated with the event
      const deleteDiscountCodesQuery = `
        DELETE FROM DISCOUNT_CODE 
        WHERE Code IN (
          SELECT Discount_Code 
          FROM TICKET_DISCOUNT 
          WHERE Ticket_ID IN (SELECT Ticket_ID FROM TICKET WHERE Event_ID = ?)
        )
      `;
      await connection.execute(deleteDiscountCodesQuery, [eventId]);

      // Delete tickets
      const deleteTicketsQuery = `
        DELETE FROM TICKET 
        WHERE Event_ID = ?
      `;
      await connection.execute(deleteTicketsQuery, [eventId]);

      // Delete event categories
      const deleteCategoriesQuery = `
        DELETE FROM EVENT_CATEGORIES 
        WHERE EventID = ?
      `;
      await connection.execute(deleteCategoriesQuery, [eventId]);

      // Delete the event itself
      const deleteEventQuery = `
        DELETE FROM EVENT 
        WHERE EventID = ?
      `;
      await connection.execute(deleteEventQuery, [eventId]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getAvailableTickets(eventId) {
    // Get tickets for this event that are not sold
    const query = `
      SELECT Ticket_ID, Price, Tier, Details 
      FROM TICKET 
      WHERE Event_ID = ? AND Holder_UserID IS NULL
    `;
    const [rows] = await db().execute(query, [eventId]);
    return rows;
  }

  static async getResaleTickets(eventId) {
    // Get resale listings for this event
    const query = `
      SELECT rl.Listing_ID, rl.Price AS Resale_Price, t.Ticket_ID, t.Price AS Original_Price, 
             t.Tier, t.Details 
      FROM RESALE_LISTING rl
      JOIN TICKET t ON rl.Ticket_ID = t.Ticket_ID
      WHERE t.Event_ID = ?
    `;
    const [rows] = await db().execute(query, [eventId]);
    return rows;
  }
}

export default EventService;
