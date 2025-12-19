import { Router } from "express";
import * as controller from "./package.controller.js";
import { authenticate } from "../auth/auth.middleware.js";
import { roleGuard } from "../../middlewares/roleGuard.js";

const router = Router();

/* PUBLIC */
router.get("/", controller.getPublic);

/* STAFF ONLY */
router.post(
  "/",
  authenticate,
  roleGuard(["STAFF"]),
  controller.create
);

router.get(
  "/all",
  authenticate,
  roleGuard(["STAFF"]),
  controller.getAll
);

router.put(
  "/:id",
  authenticate,
  roleGuard(["STAFF"]),
  controller.update
);

router.delete(
  "/:id",
  authenticate,
  roleGuard(["STAFF"]),
  controller.deactivate
);

export default router;
