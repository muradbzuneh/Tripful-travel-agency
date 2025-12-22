export const roleGuard = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export const requireStaffOrAdmin = (req, res, next) => {
  if (!["STAFF", "ADMIN"].includes(req.user.role)) {
    return res.status(403).json({ error: "Staff or Admin access required" });
  }
  next();
};
