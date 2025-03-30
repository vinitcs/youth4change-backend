import { Router } from "express";
import { verifyJWT } from "../../middlewares/userAuth.middleware.js";
import { addReport } from "../../controllers/reportControllers/addReport.controller.js";

const router = Router();

router.route("/add").post(verifyJWT, addReport); // One time interest list display at user side

export default router;
