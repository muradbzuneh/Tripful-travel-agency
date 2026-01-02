import { pool } from "../../config/db.js";

/* Create package (STAFF & ADMIN) */
export const createPackage = async (data, staffId) => {
  const {
    title,
    destination,
    location,
    image_url,
    description,
    flight_summary,
    hotel_name,
    hotel_rating,
    duration_days,
    price,
    available_slots,
    start_date,
  } = data;

  // Calculate end_date based on start_date and duration_days
  const startDateObj = new Date(start_date);
  const endDateObj = new Date(startDateObj);
  endDateObj.setDate(startDateObj.getDate() + parseInt(duration_days) - 1);
  const end_date = endDateObj.toISOString().split('T')[0];

  // Truncate fields that might exceed database limits
  const truncatedData = {
    title: title?.substring(0, 255) || '',
    destination: destination?.substring(0, 255) || '',
    location: location?.substring(0, 255) || '',
    image_url: image_url?.substring(0, 500) || null,
    description: description || null,
    flight_summary: flight_summary || null,
    hotel_name: hotel_name?.substring(0, 255) || '',
    hotel_rating: parseInt(hotel_rating) || 5,
    duration_days: parseInt(duration_days) || 1,
    price: parseFloat(price) || 0,
    available_slots: parseInt(available_slots) || 0,
    start_date,
    end_date
  };

  const result = await pool.query(
    `INSERT INTO packages
     (title, destination, location, image_url, description, flight_summary, hotel_name, hotel_rating,
      duration_days, price, available_slots, start_date, end_date, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING *`,
    [
      truncatedData.title,
      truncatedData.destination,
      truncatedData.location,
      truncatedData.image_url,
      truncatedData.description,
      truncatedData.flight_summary,
      truncatedData.hotel_name,
      truncatedData.hotel_rating,
      truncatedData.duration_days,
      truncatedData.price,
      truncatedData.available_slots,
      truncatedData.start_date,
      truncatedData.end_date,
      staffId,
    ]
  );

  return result.rows[0];
};

/* Get all ACTIVE packages (PUBLIC) */
export const getActivePackages = async () => {
  const result = await pool.query(
    `SELECT *
     FROM packages
     WHERE is_active = true
     ORDER BY created_at DESC`
  );
  return result.rows;
};

/* Get ALL packages (STAFF & ADMIN) */
export const getAllPackages = async () => {
  const result = await pool.query(
    `SELECT *
     FROM packages
     ORDER BY created_at DESC`
  );
  return result.rows;
};

/* Get package by ID (PUBLIC) */
export const getPackageById = async (id) => {
  const result = await pool.query(
    `SELECT *
     FROM packages
     WHERE id = $1 AND is_active = true`,
    [id]
  );
  return result.rows[0];
};

/* Get latest packages for suggestions */
export const getLatestPackages = async (limit = 2) => {
  const result = await pool.query(
    `SELECT *
     FROM packages
     WHERE is_active = true
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

/* Update package (STAFF) - FIXED SQL PARAMETERS */
export const updatePackage = async (id, data) => {
  const fields = Object.keys(data);
  if (fields.length === 0) return null;

  // If start_date or duration_days is being updated, recalculate end_date
  if (data.start_date || data.duration_days) {
    const currentPackage = await pool.query('SELECT start_date, duration_days FROM packages WHERE id = $1', [id]);
    if (currentPackage.rows.length > 0) {
      const pkg = currentPackage.rows[0];
      const startDate = data.start_date || pkg.start_date;
      const durationDays = data.duration_days || pkg.duration_days;
      
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(startDateObj);
      endDateObj.setDate(startDateObj.getDate() + parseInt(durationDays) - 1);
      data.end_date = endDateObj.toISOString().split('T')[0];
    }
  }

  // Truncate fields that might exceed database limits
  const truncatedData = { ...data };
  if (truncatedData.title) truncatedData.title = truncatedData.title.substring(0, 255);
  if (truncatedData.destination) truncatedData.destination = truncatedData.destination.substring(0, 255);
  if (truncatedData.location) truncatedData.location = truncatedData.location.substring(0, 255);
  if (truncatedData.image_url) truncatedData.image_url = truncatedData.image_url.substring(0, 500);
  if (truncatedData.hotel_name) truncatedData.hotel_name = truncatedData.hotel_name.substring(0, 255);

  const updatedFields = Object.keys(truncatedData);
  const updates = updatedFields
    .map((field, i) => `${field} = $${i + 1}`)
    .join(", ");

  const values = Object.values(truncatedData);

  const result = await pool.query(
    `UPDATE packages
     SET ${updates}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${updatedFields.length + 1}
     RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
};

/* Deactivate package (STAFF) */
export const deactivatePackage = async (id) => {
  const result = await pool.query(
    `UPDATE packages
     SET is_active = false
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
};