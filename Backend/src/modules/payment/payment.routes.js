import express from "express";
import { initializePaymentController, verifyPaymentController } from "./payment.controller.js";

const router = express.Router();

// Initialize payment
router.post("/pay", initializePaymentController);

// Verify payment
router.get("/verify", verifyPaymentController);

export default router;
