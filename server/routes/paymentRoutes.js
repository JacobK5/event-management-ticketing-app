import express from "express";
import PaymentController from "../controllers/paymentController.js";

const router = express.Router();

router.post("/refund", PaymentController.requestRefund);

export default router;
