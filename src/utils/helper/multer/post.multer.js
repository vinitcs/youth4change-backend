import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = "./public/uploads/post";

    // const uploadDir = "./public/uploads/post";
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

    // Create directory if it doesn't exist
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

// // multer to handle in-memory file upload
// const storage = multer.memoryStorage();

const postUpload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // Limit to 30MB per file
  fileFilter: (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png|mp4|avi|mov/;

    const isImage =
      imageTypes.test(path.extname(file.originalname).toLowerCase()) &&
      imageTypes.test(file.mimetype);

    if (isImage) {
      console.log(file);

      return cb(null, true); // Allow the file
    }

    cb(new Error("Only image and video files are allowed!"));
  },
});

export default postUpload;
