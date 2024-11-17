import express from "express";
import RsvpController from "../controllers/rsvpController.js";

const router = express.Router();

router.post("/", RsvpController.createRsvp);
router.put("/", RsvpController.updateRsvp);
router.delete("/:userId/:eventId", RsvpController.cancelRsvp);

export default router;
