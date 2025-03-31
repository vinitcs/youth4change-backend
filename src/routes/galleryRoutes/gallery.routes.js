import { Router } from "express";
import { verifyJWT } from "../../middlewares/userAuth.middleware.js";

import { allGallery } from "../../controllers/galleryControllers/allGallery.controller.js";
import { selectedGallery } from "../../controllers/galleryControllers/selectedGallery.controller.js";

const router = Router();

router.route("/all").get(verifyJWT, allGallery);

router.route("/get/:id").get(verifyJWT, selectedGallery);

export default router;
