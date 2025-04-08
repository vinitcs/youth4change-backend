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

// import { selectedUserData } from "../../controllers/userFollowingAndFollowerControllers/selectedUser.controller.js";

import { refreshAccessToken } from "../../controllers/userControllers/refreshAccessToken.controller.js";
import { searchUser } from "../../controllers/userControllers/searchUser.controller.js";
import { verifyUserJwtToken } from "../../controllers/userControllers/verifyUserJwtToken.controller.js";
import { getUserCertificates } from "../../controllers/userAchievementControllers/getUserCertificate.controller.js";

const router = Router();

router.route("/signup").post(signUp);

// router.route("/login").post(loginRateLimiter, login); // add loginRateLimiter to try avoid brute force attack on phone number
router.route("/login").post(login); // add later loginRateLimiter to try avoid brute force attack on phone number

router.route("/verify/token").post(verifyUserJwtToken); // Verify JWT token

router.route("/refresh-token").post(refreshAccessToken); // based on refresh token, new access token is assigned

router.route("/profile").get(verifyJWT, loggedUser);

// router.route("/logout").post(verifyJWT, logout);

// For now avatar is there so use below route
// router
//   .route("/profile/update")
//   .patch(verifyJWT, avatarUpload.single("avatar"), updateProfile);

router
  .route("/profile/update/avatar")
  .patch(verifyJWT, avatarProfileUpload.single("avatar"), updateAvatar);

router.route("/profile/update").patch(verifyJWT, updateProfile);

// router.route("/selected/:id").get(verifyJWT, selectedUserData);

router.route("/certificate/all").get(verifyJWT, getUserCertificates);

//
//
//
//
//

// display users data by matching search name or nameTag

router.route("/search").get(verifyJWT, searchUser);

export default router;
