import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // const uploadDir = "./public/uploads/profile";
    let uploadDir;

    if (file.fieldname === "avatar") {
      uploadDir = "./public/uploads/profile/avatars";
    } else if (file.fieldname === "banner") {
      uploadDir = "./public/uploads/profile/banners";
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

// // multer to handle in-memory file upload
// const storage = multer.memoryStorage();

const profileUpload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB per file
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

export default profileUpload;
