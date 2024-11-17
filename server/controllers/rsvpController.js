class RsvpController {
  static async createRsvp(req, res) {
    try {
      const result = await RsvpService.createRsvp(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateRsvp(req, res) {
    try {
      const result = await RsvpService.updateRsvp(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async cancelRsvp(req, res) {
    try {
      const result = await RsvpService.cancelRsvp(
        req.params.userId,
        req.params.eventId
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default RsvpController;
