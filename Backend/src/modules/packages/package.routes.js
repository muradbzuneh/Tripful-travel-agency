import { Router } from "express";
import * as controller from "./package.controller.js";
import { authenticate } from "../auth/auth.middleware.js";
import { requireAdmin, requireStaffOrAdmin } from "../../middlewares/roleGuard.js";
import upload from "../../middlewares/upload.js";

const router = Router();

/* PUBLIC */
router.get(
  "/all",
  authenticate,
  requireStaffOrAdmin,
  controller.getAll
);

router.get("/", controller.getPublic);
router.get("/latest", controller.getLatest);
router.get("/:id", controller.getById);

/* STAFF & ADMIN */
router.post(
  "/",
  authenticate,
  requireStaffOrAdmin,
  upload.single('image'),
  controller.create
);


router.put(
  "/:id",
  authenticate,
  requireStaffOrAdmin,
  upload.single('image'),
  controller.update
);

/* ADMIN ONLY */
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  controller.deactivate
);

/* FILE UPLOAD */
router.post(
  "/upload-image",
  authenticate,
  requireStaffOrAdmin,
  upload.single('image'),
  controller.uploadImage
);

export default router;
