import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
} from "./booking.service.js";

export const createBookingController = async (req, res) => {
  try {
    const booking = await createBooking({
      userId: req.user.id,
      packageId: req.body.package_id,
      travelDate: req.body.travel_date,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMyBookingsController = async (req, res) => {
  try {
    const bookings = await getMyBookings(req.user.id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await getAllBookings();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const cancelBookingController = async (req, res) => {
  try {
    const booking = await cancelBooking(req.params.id, req.user.id);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateBookingStatusController = async (req, res) => {
  try {
    const booking = await updateBookingStatus(
      req.params.id,
      req.body
    );
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};