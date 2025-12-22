import express from "express";
import {
  createBookingController,
  getMyBookingsController,
  getAllBookingsController,
  updateBookingStatusController,
} from "./booking.controller.js";

import { authenticate } from "../../modules/auth/auth.middleware.js";
import { requireStaffOrAdmin } from "../../middlewares/roleGuard.js";

const router = express.Router();

// Customer
router.post("/", authenticate, createBookingController);
router.get("/my", authenticate, getMyBookingsController);

// Staff & Admin
router.get("/", authenticate, requireStaffOrAdmin, getAllBookingsController);
router.patch("/:id/status", authenticate, requireStaffOrAdmin, updateBookingStatusController);

export default router;
