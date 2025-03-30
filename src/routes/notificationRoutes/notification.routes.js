import { Router } from "express";
import { verifyJWT } from "../../middlewares/userAuth.middleware.js";
import { allNotification } from "../../controllers/notificationControllers/allNotification.controller.js";
import { readNotification } from "../../controllers/notificationControllers/readNotification.controller.js";

const router = Router();

router.route("/all").get(verifyJWT, allNotification);

router.route("/read").patch(verifyJWT, readNotification);

export default router;
