export const validateCreateBooking = (req, res, next) => {
  const { package_id, travel_date } = req.body;

  if (!package_id || !travel_date) {
    return res.status(400).json({
      error: "package_id and travel_date are required",
    });
  }

  next();
};
