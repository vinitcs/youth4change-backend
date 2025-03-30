import { Router } from "express";
import { verifyJWT } from "../../middlewares/userAuth.middleware.js";
import { selectedStage } from "../../controllers/stageControllers/selectedStage.controller.js";
import { allStageUserSide } from "../../controllers/stageControllers/allStageUserSide.controller.js";
import { submitStage } from "../../controllers/stageControllers/submitStage.controller.js";

const router = Router();

router.route("/all").get(verifyJWT, allStageUserSide);

router.route("/get/:stageId").get(verifyJWT, selectedStage);

router.route("/submit").post(verifyJWT, submitStage);

export default router;
