import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router.post("/login", UserController.loginUser);
router.post("/register", UserController.registerUser);
router.get("/profile/:id", UserController.getUserProfile);
router.put("/profile/:id", UserController.updateUserProfile);
router.put("/profile/password/:id", UserController.updatePassword);
router.get("/:userId/tickets", UserController.getUserTickets);
router.get("/:userId/rsvps", UserController.getUserRsvps);
router.get("/:userId/payments", UserController.getUserPayments);
router.get("/:userId/refunds", UserController.getUserRefunds);

export default router;
