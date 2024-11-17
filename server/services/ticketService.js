class TicketService {
  static async purchaseTicket({
    userId,
    ticketId,
    method,
    creditCardInfo,
    discountCode,
  }) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Validate discount code
      let discountAmount = 0;
      if (discountCode) {
        const discountQuery = `
          SELECT Amount, Max_Uses, Current_Uses 
          FROM DISCOUNT_CODE 
          WHERE Code = ?
        `;
        const [discountRows] = await connection.execute(discountQuery, [
          discountCode,
        ]);

        if (discountRows.length === 0) {
          throw new Error("Invalid discount code");
        }

        const discount = discountRows[0];
        if (discount.Current_Uses >= discount.Max_Uses) {
          throw new Error("Discount code usage limit reached");
        }

        const ticketDiscountQuery = `
          SELECT 1 
          FROM TICKET_DISCOUNT 
          WHERE Ticket_ID = ? AND Discount_Code = ?
        `;
        const [ticketDiscountRows] = await connection.execute(
          ticketDiscountQuery,
          [ticketId, discountCode]
        );

        if (ticketDiscountRows.length === 0) {
          throw new Error("Discount code not applicable to this ticket");
        }

        // Update discount usage count
        const updateDiscountQuery = `
          UPDATE DISCOUNT_CODE 
          SET Current_Uses = Current_Uses + 1 
          WHERE Code = ?
        `;
        await connection.execute(updateDiscountQuery, [discountCode]);

        // NOTE: will work out actual logic for this later (if needed)
        discountAmount = discount.Amount;
      }

      // Insert payment record
      const paymentQuery = `
        INSERT INTO PAYMENT (Method, Credit_Card_Info, Date, User_ID) 
        VALUES (?, ?, NOW(), ?)
      `;
      const [paymentResult] = await connection.execute(paymentQuery, [
        method,
        creditCardInfo,
        userId,
      ]);
      const paymentRefNum = paymentResult.insertId;

      // Update ticket ownership
      const updateTicketQuery = `
        UPDATE TICKET 
        SET Holder_UserID = ?, Pmt_Ref_Num = ? 
        WHERE Ticket_ID = ?
      `;
      await connection.execute(updateTicketQuery, [
        userId,
        paymentRefNum,
        ticketId,
      ]);

      await connection.commit();
      return { message: "Ticket purchased successfully", paymentRefNum };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async createResaleListing({ ticketId, price, userId }) {
    // Insert resale listing
    const listingQuery = `
        INSERT INTO RESALE_LISTING (Ticket_ID, Price, User_ID) 
        VALUES (?, ?, ?)
      `;
    await db.execute(listingQuery, [ticketId, price, userId]);
    return { message: "Ticket listed for resale" };
  }

  static async purchaseResaleTicket({
    userId,
    listingId,
    method,
    creditCardInfo,
  }) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Get listing details
      const listingQuery = `
        SELECT Ticket_ID, Price, User_ID 
        FROM RESALE_LISTING 
        WHERE Listing_ID = ?
      `;
      const [listingRows] = await connection.execute(listingQuery, [listingId]);

      if (listingRows.length === 0) {
        throw new Error("Invalid resale listing");
      }

      const { Ticket_ID, Price, User_ID: sellerId } = listingRows[0];

      // Insert payment
      const paymentQuery = `
        INSERT INTO PAYMENT (Method, Credit_Card_Info, Date, User_ID) 
        VALUES (?, ?, NOW(), ?)
      `;
      const [paymentResult] = await connection.execute(paymentQuery, [
        method,
        creditCardInfo,
        userId,
      ]);
      const paymentRefNum = paymentResult.insertId;

      // Update ticket ownership
      const updateTicketQuery = `
        UPDATE TICKET 
        SET Holder_UserID = ?, Pmt_Ref_Num = ? 
        WHERE Ticket_ID = ?
      `;
      await connection.execute(updateTicketQuery, [
        userId,
        paymentRefNum,
        Ticket_ID,
      ]);

      // Remove the resale listing
      const deleteListingQuery = `
        DELETE FROM RESALE_LISTING 
        WHERE Listing_ID = ?
      `;
      await connection.execute(deleteListingQuery, [listingId]);

      await connection.commit();
      return { message: "Ticket purchased from resale", paymentRefNum };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default TicketService;
