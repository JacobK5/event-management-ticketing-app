import EventService from "./eventService.js";
import RsvpService from "./rsvpService.js";
import TicketService from "./ticketService.js";
import UserService from "./userService.js";
import PaymentService from "./paymentService.js";
import db from "../database.js";

class SampleDataService {
  static clearDatabase = async () => {
    const connection = await db().getConnection();
    await connection.beginTransaction();
    try {
      const tables = [
        "RSVP",
        "TICKET_DISCOUNT",
        "DISCOUNT_CODE",
        "RESALE_LISTING",
        "TICKET",
        "REFUND",
        "PAYMENT",
        "EVENT_CATEGORIES",
        "EVENT",
        "ATTENDEE",
        "ORGANIZER",
        "USER",
      ];

      for (const table of tables) {
        await connection.execute(`DELETE FROM ${table}`);
      }

      await connection.commit();
      console.log("Database cleared.");
    } catch (error) {
      await connection.rollback();
      console.error("Error clearing database:", error);
    } finally {
      connection.release();
    }
  };

  static populateSampleData = async () => {
    try {
      // Step 1: Clear the database
      await this.clearDatabase();

      // Step 2.1: Create users
      const organizer = await UserService.createUser({
        fname: "Organizer",
        lname: "One",
        email: "organizer@example.com",
        password: "password",
        dob: "1980-01-01",
        phoneNumber: "1234567890",
        isAttendee: true,
        organizerSSN: "123456",
      });

      const attendee1 = await UserService.createUser({
        fname: "Attendee",
        lname: "One",
        email: "attendee1@example.com",
        password: "password",
        dob: "1995-06-15",
        phoneNumber: "2345678901",
        isAttendee: true,
        organizerSSN: null,
      });

      const attendee2 = await UserService.createUser({
        fname: "Attendee",
        lname: "Two",
        email: "attendee2@example.com",
        password: "password",
        dob: "2000-09-25",
        phoneNumber: "3456789012",
        isAttendee: true,
        organizerSSN: null,
      });

      // Step 2.2: Create events and track free/paid events
      const freeEventIds = [];
      const paidEventIds = [];
      const categories = ["Concerts", "Sports", "Theatre", "Family"];

      for (const category of categories) {
        const freeEvent = await EventService.createEvent({
          name: `${category} Free Event`,
          time: "18:00:00",
          locationName: `${category} Venue`,
          locationAddress: `${category} Address`,
          date: "2024-12-31",
          description: `This is a free ${category.toLowerCase()} event.`,
          organizerUserId: organizer.UserID,
          categories: [category],
          tickets: [], // No tickets for free events
        });
        freeEventIds.push(freeEvent); // Track free event IDs

        const paidEvent = await EventService.createEvent({
          name: `${category} Paid Event`,
          time: "20:00:00",
          locationName: `${category} Venue`,
          locationAddress: `${category} Address`,
          date: "2024-12-31",
          description: `This is a paid ${category.toLowerCase()} event.`,
          organizerUserId: organizer.UserID,
          categories: [category],
          tickets: [
            {
              price: 50,
              tier: "Regular",
              details: "General admission",
              quantity: 10,
            },
            { price: 100, tier: "VIP", details: "VIP seating", quantity: 10 },
          ],
          discountCodes: [
            {
              code: `${category}10`,
              amount: "10%",
              maxUses: 10,
            },
            {
              code: `${category}5`,
              amount: "$5",
              maxUses: 10,
            },
          ],
        });
        paidEventIds.push(paidEvent); // Track paid event IDs
      }

      // Step 2.3: Create RSVPs for free events
      for (const freeEventId of freeEventIds) {
        await RsvpService.createRsvp({
          userId: attendee1.UserID,
          eventId: freeEventId,
          status: "Confirmed",
        });

        // Add RSVP for the second attendee to some events
        if (Math.random() > 0.5) {
          await RsvpService.createRsvp({
            userId: attendee2.UserID,
            eventId: freeEventId,
            status: "Confirmed",
          });
        }
      }

      console.log("RSVPs for free events created successfully.");

      const ticketsToPurchase = [];
      for (const event of paidEventIds) {
        const tickets = await EventService.getAvailableTickets(event);
        ticketsToPurchase.push(tickets[0]); // Take the first ticket for each event
      }
      const purchasedTickets = [];
      for (const ticket of ticketsToPurchase) {
        const ticketId = ticket.Ticket_ID;
        console.log("ticket:", ticket);
        console.log("ticketId", ticketId);
        const purchasedTicket = await TicketService.purchaseTicket({
          userId: attendee1.UserID,
          ticketId: ticketId,
          method: "Credit Card",
          creditCardInfo: "1234-5678-9876-5432",
          discountCode: null, // No discount code
        });
        purchasedTickets.push(ticketId); // Track purchased ticket IDs
        console.log(`Attendee 1 purchased ticket ID: ${ticketId}`);
      }

      // Step 2: Resale Listings
      const resaleTickets = purchasedTickets.slice(0, 2); // Use first 2 tickets for resale
      console.log("resaleTickets", resaleTickets);
      for (const ticketId of resaleTickets) {
        await TicketService.createResaleListing({
          ticketId,
          price: 75, // Adjust price for resale
          userId: attendee1.UserID,
        });
        console.log(`Ticket ID: ${ticketId} listed for resale`);
      }

      // Step 3: Refund
      const refundTicketId = purchasedTickets[2]; // Use the third ticket for refund
      const ticket = await TicketService.getTicket(refundTicketId);
      const refundPayment = await PaymentService.requestRefund({
        refNum: ticket.Pmt_Ref_Num,
        status: "Pending", // Default status
      });
      console.log(`Refund requested for ticket ID: ${refundTicketId}`);

      // Step 4: Resale Purchase
      const resaleTicketId = resaleTickets[0]; // Use the first resale ticket for purchase
      console.log("resaleTicketId", resaleTicketId);
      const resaleListing = await TicketService.getResaleListingByTicketId(
        resaleTicketId
      );
      await TicketService.purchaseResaleTicket({
        userId: attendee2.UserID,
        listingId: resaleListing.Listing_ID,
        method: "Debit Card",
        creditCardInfo: "9876-5432-1234-5678",
      });
      console.log(
        `Attendee 2 purchased resale ticket ID: ${resaleTicketId} from attendee 1`
      );

      console.log("Tickets and payments sample data created successfully.");

      console.log("Sample data created successfully.");
    } catch (error) {
      console.error("Error populating sample data:", error);
    }
  };
}

export default SampleDataService;
