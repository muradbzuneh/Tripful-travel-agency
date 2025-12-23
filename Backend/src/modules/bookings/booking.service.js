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
    `SELECT b.*, p.title as package_title, p.destination, p.image_url
     FROM bookings b
     LEFT JOIN packages p ON b.package_id = p.id
     WHERE b.user_id = $1 
     ORDER BY b.booked_at DESC`,
    [userId]
  );
  return result.rows;
};

export const getAllBookings = async () => {
  const result = await pool.query(
    `SELECT b.*, p.title as package_title, p.destination, u.full_name, u.email
     FROM bookings b
     LEFT JOIN packages p ON b.package_id = p.id
     LEFT JOIN users u ON b.user_id = u.id
     ORDER BY b.booked_at DESC`
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

export const cancelBooking = async (bookingId, userId) => {
  // First check if booking exists and belongs to user
  const checkResult = await pool.query(
    "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
    [bookingId, userId]
  );

  if (!checkResult.rows.length) {
    throw new Error("Booking not found or unauthorized");
  }

  const booking = checkResult.rows[0];

  // Check if booking can be cancelled (not already cancelled or completed)
  if (booking.booking_status === 'CANCELLED') {
    throw new Error("Booking is already cancelled");
  }

  // Update booking status to cancelled
  const result = await pool.query(
    `UPDATE bookings
     SET booking_status = 'CANCELLED',
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [bookingId, userId]
  );

  return result.rows[0];
};