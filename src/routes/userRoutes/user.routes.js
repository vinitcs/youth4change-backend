import { Router } from "express";

import { signUp } from "../../controllers/userControllers/signUp.controller.js";

import { login } from "../../controllers/userControllers/login.controller.js";
import { verifyJWT } from "../../middlewares/userAuth.middleware.js";
// import { logout } from "../../controllers/userControllers/logout.controller.js";

// import { loginRateLimiter } from "../middlewares/loginRateLimiter.js";

import { loggedUser } from "../../controllers/userControllers/loggedUser.controller.js";

import { updateProfile } from "../../controllers/userControllers/updateProfile.controller.js";

import avatarProfileUpload from "../../utils/helper/multer/avatarProfile.multer.js";
import { updateAvatar } from "../../controllers/userControllers/updateAvatar.controller.js";

import { refreshAccessToken } from "../../controllers/userControllers/refreshAccessToken.controller.js";
import { verifyUserJwtToken } from "../../controllers/userControllers/verifyUserJwtToken.controller.js";
import { getUserCertificates } from "../../controllers/userAchievementControllers/getUserCertificate.controller.js";
import proofUpload from "../../utils/helper/multer/proofUpload.multer.js";

const router = Router();

router.route("/signup").post(proofUpload.array("media", 5), signUp);

// router.route("/login").post(loginRateLimiter, login); // add loginRateLimiter to try avoid brute force attack on phone number
router.route("/login").post(login); // add later loginRateLimiter to try avoid brute force attack on phone number

router.route("/verify/token").post(verifyUserJwtToken); // Verify JWT token

router.route("/refresh-token").post(refreshAccessToken); // based on refresh token, new access token is assigned

router.route("/profile").get(verifyJWT, loggedUser);

// router.route("/logout").post(verifyJWT, logout);

router
  .route("/profile/update/avatar")
  .patch(verifyJWT, avatarProfileUpload.single("avatar"), updateAvatar);

router.route("/profile/update").patch(verifyJWT, updateProfile);

router.route("/certificate/all").get(verifyJWT, getUserCertificates);

export default router;
