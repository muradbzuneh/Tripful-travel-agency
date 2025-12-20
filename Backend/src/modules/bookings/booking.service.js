import {pool} from "../../config/db.js";

export const createBooking = async ({ userId, packageId, travelDate }) => {
  const pkg = await pool.query(
    "SELECT price FROM packages WHERE id = $1",
    [packageId]
  );

  if (!pkg.rows.length) throw new Error("Package not found");

  const totalPrice = pkg.rows[0].price;

  const result = await pool.query(
    `INSERT INTO bookings
     (user_id, package_id, total_price, travel_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, packageId, totalPrice, travelDate]
  );

  return result.rows[0];
};

export const getMyBookings = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE user_id = $1 ORDER BY user_id`,
    [userId]
  );
  return result.rows;
};

export const getAllBookings = async () => {
  const result = await pool.query(
    `SELECT * FROM bookings ORDER BY user_id`
  );
  return result.rows;
};

export const updateBookingStatus = async (bookingId, data) => {
  const { booking_status, payment_status, paid_amount } = data;

  const result = await pool.query(
    `UPDATE bookings
     SET booking_status = COALESCE($1, booking_status),
         payment_status = COALESCE($2, payment_status),
         paid_amount = COALESCE($3, paid_amount),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
    [booking_status, payment_status, paid_amount, bookingId]
  );

  if (!result.rows.length) throw new Error("Booking not found");

  return result.rows[0];
};
