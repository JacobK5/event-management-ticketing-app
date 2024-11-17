import express from "express";
import userRoutes from "./userRoutes.js";
import eventRoutes from "./eventRoutes.js";
import ticketRoutes from "./ticketRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import rsvpRoutes from "./rsvpRoutes.js";

const router = express.Router();

// Register each set of routes with an appropriate prefix
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/tickets", ticketRoutes);
router.use("/payments", paymentRoutes);
router.use("/rsvps", rsvpRoutes);

export default router;
