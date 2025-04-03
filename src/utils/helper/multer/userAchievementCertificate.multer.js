import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = "./public/uploads/user/achievement/certificate";

    // const uploadDir = "./public/uploads/user/achievement/certificate";
    let uploadDir;

    if (file.mimetype.startsWith("image/")) {
      uploadDir = `${baseDir}/images`;
    }
    //  else if (file.mimetype.startsWith("video/")) {
    //   uploadDir = `${baseDir}/videos`;
    // }
    else {
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

const userAchievementCertificateUpload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // Limit to 30MB per file
  fileFilter: (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png/;
    // const videoTypes = /mp4|avi|mov|mkv|flv/;

    const isImage =
      imageTypes.test(path.extname(file.originalname).toLowerCase()) &&
      imageTypes.test(file.mimetype);

    // const isVideo =
    //   videoTypes.test(path.extname(file.originalname).toLowerCase()) &&
    //   videoTypes.test(file.mimetype);

    if (
      isImage
      // || isVideo
    ) {
      return cb(null, true); // Allow the file
    }

    cb(new Error("Only image and video files are allowed!"));
  },
});

export default userAchievementCertificateUpload;
