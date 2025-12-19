export const requireStaff = (req, res, next) => {
  if (req.user.role !== "STAFF") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
