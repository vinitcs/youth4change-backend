import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = "./public/uploads/post";
    let uploadDir;

    if (file.mimetype.startsWith("image/")) {
      uploadDir = `${baseDir}/images`;
    } else if (file.mimetype.startsWith("video/")) {
      uploadDir = `${baseDir}/videos`;
    } else {
      return cb(
        new Error("Invalid file type! Only image and video files are allowed.")
      );
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const postUpload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|mp4|avi|mov|mkv|flv/;
    const isValidType =
      allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
      allowedTypes.test(file.mimetype);

    if (isValidType) {
      return cb(null, true);
    }
    cb(new Error("Only image and video files are allowed!"));
  },
});

export default postUpload;
