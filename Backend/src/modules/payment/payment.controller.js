import { createPayment } from "./payment.service.js";

export const createPaymentController = async (req, res) => {
  try {
    const payment = await createPayment({
      bookingId: req.body.booking_id,
      userId: req.user.id,
      amount: req.body.amount,
      reference: req.body.reference,
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
