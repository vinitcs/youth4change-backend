import { Router } from "express";
import { adminLogin } from "../../controllers/adminControllers/adminLogin.controller.js";
// import { adminLogout } from "../../controllers/adminControllers/adminLogout.controller.js";
import { verifyAdminJWT } from "../../middlewares/adminAuth.middleware.js";

import { verifyAdminJwtToken } from "../../controllers/adminControllers/verifyAdminJwtToken.controller.js";

import { selectedUserDataAdminSide } from "../../controllers/adminControllers/selectedUserAdminSide.controller.js";

import { allReport } from "../../controllers/reportControllers/allReport.controller.js";
import { selectedReport } from "../../controllers/reportControllers/selectedReport.controller.js";
import { adminSignUp } from "../../controllers/adminControllers/adminSignUp.controller.js";
import { loggedAdmin } from "../../controllers/adminControllers/loggedAdmin.controller.js";
import avatarProfileUpload from "../../utils/helper/multer/avatarProfile.multer.js";
import { updateAvatar } from "../../controllers/adminControllers/updateAvatar.controller.js";
import { updateProfile } from "../../controllers/adminControllers/updateProfile.controller.js";

import postUpload from "../../utils/helper/multer/post.multer.js";
import { addPost } from "../../controllers/postControllers/addPost.controller.js";
import { selectedPost } from "../../controllers/postControllers/selectedPost.controller.js";
import { updatePost } from "../../controllers/postControllers/updatePost.controller.js";
import { deletePost } from "../../controllers/postControllers/deletePost.controller.js";
import { postsCreatedByAdmin } from "../../controllers/postControllers/postsCreatedByAdmin.controller.js";

import { createStage } from "../../controllers/stageControllers/createStage.controller.js";
import { updateStage } from "../../controllers/stageControllers/updateStage.controller.js";
import { allStage } from "../../controllers/stageControllers/allStage.controller.js";
import { selectedStage } from "../../controllers/stageControllers/selectedStage.controller.js";
import { getUserResponses } from "../../controllers/userStageProgressController.js/getUserResponse.controller.js";
import { reviewUserStage } from "../../controllers/stageControllers/reviewUserStage.controller.js";

import { addGallery } from "../../controllers/galleryControllers/addGallery.controller.js";
import { gallerysCreatedByAdmin } from "../../controllers/galleryControllers/gallerysCreatedByAdmin.controller.js";
import { selectedGallery } from "../../controllers/galleryControllers/selectedGallery.controller.js";
import galleryUpload from "../../utils/helper/multer/gallery.multer.js";
import { updateGallery } from "../../controllers/galleryControllers/updateGallery.controller.js";
import { deleteGallery } from "../../controllers/galleryControllers/deleteGallery.controller.js";

import userAchievementCertificateUpload from "../../utils/helper/multer/userAchievementCertificate.multer.js";
import { addCertificateFromAdminSide } from "../../controllers/userAchievementControllers/addCertificateFromAdminSide.controller.js";
import { deleteCertificateFromAdminSide } from "../../controllers/userAchievementControllers/deleteCertificateFromAdminSide.controller.js";

const router = Router();

router.route("/signup").post(adminSignUp);

router.route("/login").post(adminLogin);

router.route("/verify/token").post(verifyAdminJwtToken); // Verify JWT token

// router.route("/logout").post(verifyAdminJWT, adminLogout);

router.route("/profile").get(verifyAdminJWT, loggedAdmin);

router
  .route("/profile/update/avatar")
  .patch(verifyAdminJWT, avatarProfileUpload.single("avatar"), updateAvatar);

router.route("/profile/update").patch(verifyAdminJWT, updateProfile);

/////////////////////////////////////////////////////////

// All admin side routes are added here for now.

// Selected User data display
router.route("/userdata").get(verifyAdminJWT, selectedUserDataAdminSide);

// Report audacity routes
router.route("/report/all").get(verifyAdminJWT, allReport);

router.route("/report/:id").get(verifyAdminJWT, selectedReport);

/////////////////////////////////////////////////////////

// Stages CRUD

router.route("/stage/create").post(verifyAdminJWT, createStage);

router.route("/stage/update/:stageId").patch(verifyAdminJWT, updateStage);

router.route("/stage/all").get(verifyAdminJWT, allStage);

router.route("/stage/get/:stageId").get(verifyAdminJWT, selectedStage);

router.route("/stage/userresponse").get(verifyAdminJWT, getUserResponses);

router.route("/stage/approval").patch(verifyAdminJWT, reviewUserStage);

/////////////////////////////////////////////////////////

router
  .route("/post/add")
  .post(verifyAdminJWT, postUpload.array("image", 5), addPost);

router.route("/post/all").get(verifyAdminJWT, postsCreatedByAdmin);

router.route("/post/get/:id").get(verifyAdminJWT, selectedPost);

router
  .route("/post/update")
  .patch(verifyAdminJWT, postUpload.array("image", 5), updatePost);

router.route("/post/delete").delete(verifyAdminJWT, deletePost);

/////////////////////////////////////////////////////////

router
  .route("/gallery/add")
  .post(verifyAdminJWT, galleryUpload.array("image", 5), addGallery);

router.route("/gallery/all").get(verifyAdminJWT, gallerysCreatedByAdmin);

router.route("/gallery/get/:id").get(verifyAdminJWT, selectedGallery);

router
  .route("/gallery/update")
  .patch(verifyAdminJWT, galleryUpload.array("image", 5), updateGallery);

router.route("/gallery/delete").delete(verifyAdminJWT, deleteGallery);

/////////////////////////////////////////////////////////

router
  .route("/user/achievement/certificate/add")
  .post(
    verifyAdminJWT,
    userAchievementCertificateUpload.single("pdf"),
    addCertificateFromAdminSide
  );

router
  .route("/user/achievement/certificate/delete")
  .delete(verifyAdminJWT, deleteCertificateFromAdminSide);

export default router;
