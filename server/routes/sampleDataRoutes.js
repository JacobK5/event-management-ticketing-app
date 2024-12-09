import express from "express";
import SampleDataController from "../controllers/sampleDataController.js";

const router = express.Router();

// Route to populate sample data
router.post("/populate", SampleDataController.populate);

export default router;
