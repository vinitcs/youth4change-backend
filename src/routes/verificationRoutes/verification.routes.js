import { Router } from "express";
import { sendOtp } from "../../controllers/verificationControllers/sendOtp.controller.js";
import { verifyOtp } from "../../controllers/verificationControllers/verifyOtp.controller.js";

const router = Router();

router.route("/send/otp").post(sendOtp);

router.route("/verify/otp").post(verifyOtp);

export default router;
