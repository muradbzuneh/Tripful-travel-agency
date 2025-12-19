import {pool} from "../../config/db.js";

export const createPayment = async ({
  bookingId,
  userId,
  amount,
  reference,
}) => {
  // 1. Get booking
  const bookingRes = await pool.query(
    "SELECT * FROM bookings WHERE id = $1",
    [bookingId]
  );

  if (!bookingRes.rows.length) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  // 2. Prevent overpayment
  const newPaidAmount = Number(booking.paid_amount) + Number(amount);

  if (newPaidAmount > booking.total_price) {
    throw new Error("Payment exceeds total price");
  }

  // 3. Insert payment record
  await pool.query(
    `INSERT INTO payments (booking_id, user_id, amount, reference)
     VALUES ($1, $2, $3, $4)`,
    [bookingId, userId, amount, reference]
  );

  // 4. Determine statuses
  let paymentStatus = "UNPAID";
  let bookingStatus = "PENDING";

  if (newPaidAmount === booking.total_price) {
    paymentStatus = "PAID";
    bookingStatus = "CONFIRMED";
  } else if (newPaidAmount > 0) {
    paymentStatus = "PARTIAL";
  }

  // 5. Update booking
  const updatedBooking = await pool.query(
    `UPDATE bookings
     SET paid_amount = $1,
         payment_status = $2,
         booking_status = $3,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
    [newPaidAmount, paymentStatus, bookingStatus, bookingId]
  );

  return updatedBooking.rows[0];
};
