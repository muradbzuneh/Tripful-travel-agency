import { Router } from "express";
import * as controller from "./auth.controller.js";

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/check-email", controller.checkEmail);

export default router;
