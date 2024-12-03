import EventService from "../services/eventService.js";

class EventController {
  static async createEvent(req, res) {
    try {
      const eventId = await EventService.createEvent(req.body);
      return res.status(201).json({ eventId });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getEvents(req, res) {
    try {
      const events = await EventService.getEvents(req.query);
      return res.status(200).json(events);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getEventDetails(req, res) {
    try {
      const eventDetails = await EventService.getEventDetails(req.params.id);
      return res.status(200).json(eventDetails);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getAttendees(req, res) {
    try {
      const attendees = await EventService.getAttendees(req.params.id);
      return res.status(200).json(attendees);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async editEvent(req, res) {
    try {
      const updatedEvent = await EventService.editEvent(
        req.params.id,
        req.body
      );
      return res.status(200).json(updatedEvent);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteEvent(req, res) {
    try {
      await EventService.deleteEvent(req.params.id);
      return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getAvailableTickets(req, res) {
    try {
      const tickets = await EventService.getAvailableTickets(req.params.id);
      return res.status(200).json(tickets);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getResaleTickets(req, res) {
    try {
      const resaleTickets = await EventService.getResaleTickets(req.params.id);
      return res.status(200).json(resaleTickets);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default EventController;
