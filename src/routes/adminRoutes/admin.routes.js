import { Router } from "express";
import { adminLogin } from "../../controllers/adminControllers/adminLogin.controller.js";
import { adminLogout } from "../../controllers/adminControllers/adminLogout.controller.js";
import { verifyAdminJWT } from "../../middlewares/adminAuth.middleware.js";

import { selectedUserDataAdminSide } from "../../controllers/adminControllers/selectedUserAdminSide.controller.js";

import { allReport } from "../../controllers/reportControllers/allReport.controller.js";
import { selectedReport } from "../../controllers/reportControllers/selectedReport.controller.js";
import { adminSignUp } from "../../controllers/adminControllers/adminSignUp.controller.js";
import { loggedAdmin } from "../../controllers/adminControllers/loggedAdmin.controller.js";

import postUpload from "../../utils/helper/multer/post.multer.js";
import { addPost } from "../../controllers/postControllers/addPost.controller.js";
import { selectedPost } from "../../controllers/postControllers/selectedPost.controller.js";
import { updatePost } from "../../controllers/postControllers/updatePost.controller.js";
import { deletePost } from "../../controllers/postControllers/deletePost.controller.js";
import { postsCreatedByAdmin } from "../../controllers/postControllers/postsCreatedByAdmin.controller.js";

import { createStage } from "../../controllers/stageControllers/createStage.controller.js";
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

const router = Router();

router.route("/signup").post(adminSignUp);

router.route("/login").post(adminLogin);

router.route("/logout").post(verifyAdminJWT, adminLogout);

router.route("/profile").get(verifyAdminJWT, loggedAdmin);

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

router.route("/stage/all").get(verifyAdminJWT, allStage);

router.route("/stage/get/:stageId").get(verifyAdminJWT, selectedStage);

router.route("/stage/userresponse").get(verifyAdminJWT, getUserResponses);

router.route("/stage/approval").patch(verifyAdminJWT, reviewUserStage);

/////////////////////////////////////////////////////////

router.route("/post/add").post(
  verifyAdminJWT,
  postUpload.fields([
    { name: "image", maxCount: 5 }, //upload image file
    { name: "video", maxCount: 5 }, //upload video file
  ]),
  addPost
);

router.route("/post/all").get(verifyAdminJWT, postsCreatedByAdmin);

router.route("/post/get/:id").get(verifyAdminJWT, selectedPost);

router.route("/post/update").patch(
  verifyAdminJWT,
  postUpload.fields([
    { name: "image", maxCount: 5 }, //upload image file
    { name: "video", maxCount: 5 }, //upload video file
  ]),
  updatePost
);

router.route("/post/delete").delete(verifyAdminJWT, deletePost);

/////////////////////////////////////////////////////////

router.route("/gallery/add").post(
  verifyAdminJWT,
  galleryUpload.fields([
    { name: "image", maxCount: 5 }, //upload image file
    { name: "video", maxCount: 5 }, //upload video file
  ]),
  addGallery
);

router.route("/gallery/all").get(verifyAdminJWT, gallerysCreatedByAdmin);

router.route("/gallery/get/:id").get(verifyAdminJWT, selectedGallery);

router.route("/gallery/update").patch(
  verifyAdminJWT,
  galleryUpload.fields([
    { name: "image", maxCount: 5 }, //upload image file
    { name: "video", maxCount: 5 }, //upload video file
  ]),
  updateGallery
);

router.route("/gallery/delete").delete(verifyAdminJWT, deleteGallery);

export default router;
