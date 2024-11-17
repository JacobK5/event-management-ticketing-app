import express from "express";
import TicketController from "../controllers/ticketController.js";

const router = express.Router();

router.post("/purchase", TicketController.purchaseTicket);
router.post("/resell", TicketController.createResaleListing);
router.post("/resell/purchase", TicketController.purchaseResaleTicket);

export default router;
