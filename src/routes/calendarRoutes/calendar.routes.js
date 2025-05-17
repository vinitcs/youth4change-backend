import { Router } from "express";
import { verifyJWT } from "../../middlewares/userAuth.middleware.js";
import { calendarPosts } from "../../controllers/calendarControllers/calendarPosts.controller.js";

const router = Router();

router.route("/post").get(verifyJWT, calendarPosts);

export default router;
