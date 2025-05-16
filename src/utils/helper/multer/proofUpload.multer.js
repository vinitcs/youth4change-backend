import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = "./public/uploads/profile";

    // const uploadDir = "./public/uploads/ngo";
    let uploadDir;

    if (file.mimetype.startsWith("image/")) {
      uploadDir = `${baseDir}/images`;
    } else if (file.mimetype === "application/pdf") {
      uploadDir = `${baseDir}/pdfs`;
    } else {
      return cb(
        new Error(
          "Invalid file type! Only image, video and PDF files are allowed."
        )
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

const proofUpload = multer({
  storage: storage,
  // limits: { fileSize: 30 * 1024 * 1024 }, // Limit to 30MB per file
  fileFilter: (req, file, cb) => {
    const mediaTypes = /jpeg|jpg|png|pdf/;

    const isMedia =
      mediaTypes.test(path.extname(file.originalname).toLowerCase()) &&
      mediaTypes.test(file.mimetype);

    if (isMedia) {
      console.log(file);
      return cb(null, true); // Allow the file
    }

    cb(new Error("Only image, PDF files are allowed!"));
  },
});

export default proofUpload;
