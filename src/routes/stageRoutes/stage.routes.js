import { Router } from "express";
import { verifyJWT } from "../../middlewares/userAuth.middleware.js";
import { selectedStage } from "../../controllers/stageControllers/selectedStage.controller.js";
import { allStageUserSide } from "../../controllers/stageControllers/allStageUserSide.controller.js";
import { submitStage } from "../../controllers/stageControllers/submitStage.controller.js";
import stageProofUpload from "../../utils/helper/multer/stageProofUpload.multer.js";
import { getSubmitStageData } from "../../controllers/stageControllers/getSubmitStageData.controller.js";

const router = Router();

router.route("/all").get(verifyJWT, allStageUserSide);

router.route("/get/:stageId").get(verifyJWT, selectedStage);

router
  .route("/submit")
  .post(verifyJWT, stageProofUpload.array("media", 5), submitStage);

router.route("/submit/response/:stageId").get(verifyJWT, getSubmitStageData);

export default router;
