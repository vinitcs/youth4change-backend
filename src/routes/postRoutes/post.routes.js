import { Router } from "express";
import { verifyJWT } from "../../middlewares/userAuth.middleware.js";

import { allPost } from "../../controllers/postControllers/allPost.controller.js";
import { selectedPost } from "../../controllers/postControllers/selectedPost.controller.js";

const router = Router();

router.route("/all").get(verifyJWT, allPost);

router.route("/get/:id").get(verifyJWT, selectedPost);

export default router;
