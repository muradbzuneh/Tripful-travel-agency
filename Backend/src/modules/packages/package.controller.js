import * as service from "./package.service.js";

/* STAFF: create package */
export const create = async (req, res, next) => {
  try {
    const pkg = await service.createPackage(req.body, req.user.id);
    res.status(201).json(pkg);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

/* PUBLIC: get active packages */
export const getPublic = async (req, res, next) => {
  try {
    const packages = await service.getActivePackages();
    res.json(packages);
  } catch (err) {
    next(err);
  }
};

/* STAFF: get all packages */
export const getAll = async (req, res, next) => {
  try {
    const packages = await service.getAllPackages();
    res.json(packages);
  } catch (err) {
    next(err);
  }
};

/* STAFF: update package */
export const update = async (req, res, next) => {
  try {
    const pkg = await service.updatePackage(req.params.id, req.body);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    next(err);
  }
};

/* STAFF: deactivate package */
export const deactivate = async (req, res, next) => {
  try {
    const pkg = await service.deactivatePackage(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    next(err);
  }
};
