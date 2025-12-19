import express from "express";
import { createPaymentController } from "./payment.controller.js";
import { authenticate } from "../../modules/auth/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createPaymentController);

export default router;
