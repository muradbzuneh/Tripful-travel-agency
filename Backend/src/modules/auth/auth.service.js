import { pool } from "../../config/db.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { generateToken } from "../../utils/jwt.js";

export const registerUser = async (data) => {
  const { full_name, email, password, role, phone } = data;

  // Restrict staff and admin registration
  if (role && ["STAFF", "ADMIN"].includes(role)) {
    throw new Error("Staff and Admin accounts must be created by system administrator");
  }

  const hashedPassword = await hashPassword(password);

  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, email, role`,
    [full_name, email, hashedPassword, role || "CUSTOMER", phone]
  );

  return result.rows[0];
};

export const loginUser = async (email, password) => {
  const result = await pool.query(
    `SELECT id, full_name, email, role, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];
  if (!user) throw new Error("Invalid email / password");

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) throw new Error("Invalid email or password");

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
