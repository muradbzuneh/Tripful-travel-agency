import { pool } from "../../config/db.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { generateToken } from "../../utils/jwt.js";

export const registerUser = async (data) => {
  const { full_name, email, password, role, phone } = data;

  // Restrict staff and admin registration
  if (role && ["STAFF", "ADMIN"].includes(role)) {
    throw new Error(
      "Staff and Admin accounts must be created by system administrator"
    );
  }

  try {
    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT email FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error(
        "An account with this email address already exists. Please use a different email or try logging in."
      );
    }

    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, role`,
      [
        full_name,
        email.toLowerCase().trim(),
        hashedPassword,
        role || "CUSTOMER",
        phone,
      ]
    );

    return result.rows[0];
  } catch (error) {
    // Handle PostgreSQL unique constraint violation
    if (error.code === "23505" && error.constraint === "users_email_key") {
      throw new Error(
        "An account with this email address already exists. Please use a different email or try logging in."
      );
    }

    // Re-throw other errors
    throw error;
  }
};

export const loginUser = async (email, password) => {
  const result = await pool.query(
    `SELECT id, full_name, email, role, password_hash
     FROM users
     WHERE LOWER(email) = LOWER($1)`,
    [email.toLowerCase().trim()]
  );

  const user = result.rows[0];
  if (!user)
    throw new Error(
      "Invalid email or password. Please check your credentials and try again."
    );

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch)
    throw new Error(
      "Invalid email or password. Please check your credentials and try again."
    );

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
};

export const checkEmailAvailability = async (email) => {
  const result = await pool.query(
    "SELECT email FROM users WHERE LOWER(email) = LOWER($1)",
    [email.toLowerCase().trim()]
  );

  return result.rows.length === 0; // Returns true if email is available
};
