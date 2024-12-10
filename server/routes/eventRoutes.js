import express from "express";
import EventController from "../controllers/eventController.js";

const router = express.Router();

router.post("/", EventController.createEvent);
router.get("/", EventController.getEvents);
router.get("/organizer/:id", EventController.getOrganizerEvents);
router.get("/:id", EventController.getEventDetails);
router.get("/:id/attendees", EventController.getAttendees);
router.put("/:id", EventController.editEvent);
router.delete("/:id", EventController.deleteEvent);
router.get("/:id/tickets", EventController.getAvailableTickets);
router.get("/:id/tickets/summary", EventController.getTicketSummary);
router.get("/:id/resale-tickets", EventController.getResaleTickets);

export default router;
