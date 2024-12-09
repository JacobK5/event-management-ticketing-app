import db from "../database.js";

class PaymentService {
  static async requestRefund({ refNum, status = "Pending" }) {
    const query = `
      INSERT INTO REFUND (Ref_Num, Status, Date)
      VALUES (?, ?, NOW())
    `;
    await db().execute(query, [refNum, status]);
    return { message: "Refund request created" };
  }
}

export default PaymentService;
