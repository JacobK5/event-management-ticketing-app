class PaymentController {
  static async requestRefund(req, res) {
    try {
      const result = await PaymentService.requestRefund(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default PaymentController;
