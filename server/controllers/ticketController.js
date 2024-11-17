class TicketController {
  static async purchaseTicket(req, res) {
    try {
      const result = await TicketService.purchaseTicket(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async createResaleListing(req, res) {
    try {
      const { ticketId, price, userId } = req.body;
      const result = await TicketService.createResaleListing({
        ticketId,
        price,
        userId,
      });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async purchaseResaleTicket(req, res) {
    try {
      const result = await TicketService.purchaseResaleTicket(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default TicketController;
