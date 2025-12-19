import express from "express";
import {
  createBookingController,
  getMyBookingsController,
  getAllBookingsController,
  updateBookingStatusController,
} from "./booking.controller.js";

import { authenticate } from "../../modules/auth/auth.middleware.js";
import { requireStaff } from "./booking.permissions.js";

const router = express.Router();

// Customer
router.post("/", authenticate, createBookingController);
router.get("/my", authenticate, getMyBookingsController);

// Staff
router.get("/", authenticate, requireStaff, getAllBookingsController);
router.patch("/:id/status", authenticate, requireStaff, updateBookingStatusController);

export default router;
