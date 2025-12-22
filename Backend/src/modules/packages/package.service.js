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
    end_date,
  } = data;

  const result = await pool.query(
    `INSERT INTO packages
     (title, destination, location, image_url, description, flight_summary, hotel_name, hotel_rating,
      duration_days, price, available_slots, start_date, end_date, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING *`,
    [
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
      end_date,
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

/* Update package (STAFF) */
export const updatePackage = async (id, data) => {
  const fields = Object.keys(data);
  if (fields.length === 0) return null;

  const updates = fields
    .map((field, i) => `${field} = $${i + 1}`)
    .join(", ");

  const values = Object.values(data);

  const result = await pool.query(
    `UPDATE packages
     SET ${updates}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${fields.length + 1}
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
