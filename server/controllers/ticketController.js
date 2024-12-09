import TicketService from "../services/ticketService.js";

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
      const result = await TicketService.createResaleListing(req.body);
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
