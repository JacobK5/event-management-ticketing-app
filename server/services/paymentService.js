import db from "../database.js";

class PaymentService {
  static async requestRefund({ refNum, status = "Pending" }) {
    console.log("requesting refund for refNum:", refNum);
    const query = `
      INSERT INTO REFUND (Ref_Num, Status, Date)
      VALUES (?, ?, NOW())
    `;
    await db().execute(query, [refNum, status]);
    console.log("made refund for refNum:", refNum);
    return { message: "Refund request created" };
  }
}

export default PaymentService;
