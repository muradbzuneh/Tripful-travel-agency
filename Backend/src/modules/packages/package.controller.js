import * as service from "./package.service.js";

/* STAFF & ADMIN: create package */
export const create = async (req, res, next) => {
  try {
    const packageData = req.body;
    
    // If file was uploaded, add the image path
    if (req.file) {
      packageData.image_url = `/uploads/packages/${req.file.filename}`;
    }
    
    const pkg = await service.createPackage(packageData, req.user.id);
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

/* PUBLIC: get package by ID */
export const getById = async (req, res, next) => {
  try {
    const pkg = await service.getPackageById(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    next(err);
  }
};

/* PUBLIC: get latest packages for suggestions */
export const getLatest = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 2;
    const packages = await service.getLatestPackages(limit);
    res.json(packages);
  } catch (err) {
    next(err);
  }
};

/* STAFF & ADMIN: get all packages */
export const getAll = async (req, res, next) => {
  try {
    const packages = await service.getAllPackages();
    res.json(packages);
  } catch (err) {
    next(err);
  }
};

/* STAFF & ADMIN: update package */
export const update = async (req, res, next) => {
  try {
    const packageData = req.body;
    
    // If file was uploaded, add the image path
    if (req.file) {
      packageData.image_url = `/uploads/packages/${req.file.filename}`;
    }
    
    const pkg = await service.updatePackage(req.params.id, packageData);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    next(err);
  }
};

/* ADMIN ONLY: deactivate package */
export const deactivate = async (req, res, next) => {
  try {
    const pkg = await service.deactivatePackage(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    next(err);
  }
};

/* STAFF & ADMIN: upload image */
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const imageUrl = `/uploads/packages/${req.file.filename}`;
    res.json({ 
      success: true, 
      imageUrl,
      filename: req.file.filename 
    });
  } catch (err) {
    next(err);
  }
};
