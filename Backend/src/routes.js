import { Router } from "express";
import authRoute from "./modules/auth/auth.routes.js"
import packageRoutes from "./modules/packages/package.routes.js";
import bookingRoutes from "./modules/bookings/booking.routes.js"
import paymentRoutes from "./modules/payment/payment.routes.js"
const router = Router();

/* Temporary test route */
router.get("/health", (req, res) => {
  res.json({ status: "OK" });
});
router.use("/auth", authRoute)
router.use("/packages", packageRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);

export default router;
