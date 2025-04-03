import { ApiError } from "../../utils/helper/ApiError.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { addPostValidationSchema } from "../../utils/helper/validations/postValidationSchema.js";
import fs from "fs/promises";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { Post } from "../../models/post.model.js";
import { Admin } from "../../models/admin.model.js";

const deleteFileIfExists = async (filePath) => {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Error deleting post file: ${filePath}`, error.message);
    }
  }
};

const deleteUploadedFiles = async (req) => {
  if (req.files) {
    const uploadedFiles = req.files.map((file) => `./public/uploads/post/${file.mimetype.startsWith("image/") ? "images" : "videos"}/${file.filename}`);

    for (const file of uploadedFiles) {
      try {
        await deleteFileIfExists(file);
      } catch (error) {
        throw new ApiError(500, `Failed to delete file: ${file} and error ${error.message}`);
      }
    }
  }
};

const addPost = asyncHandler(async (req, res) => {
  const adminId = req.admin._id;
  try {
    const validatedData = await addPostValidationSchema.validateAsync(req.body);
    const admin = await Admin.findById({ _id: adminId });

    if (!admin) {
      await deleteUploadedFiles(req);
      return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
    }

    let mediaArray = req.files.map((file) => ({
      url: `/uploads/post/${file.mimetype.startsWith("image/") ? "images" : "videos"}/${file.filename}`,
      type: file.mimetype.startsWith("image/") ? "image" : "video",
      link: "",
    }));

    if (validatedData.link) {
      mediaArray.push({
        link: validatedData.link || "",
        url: "",
        type: "link",
      });
    }

    const newPost = new Post({
      adminId,
      description: validatedData.description,
      media: mediaArray,
    });

    const createdPost = await newPost.save();

    if (!createdPost) {
      await deleteUploadedFiles(req);
      throw new ApiError(500, "Failed to create post.");
    }

    return res.status(201).json(new ApiResponse(201, { Post: createdPost }, "Post created successfully."));
  } catch (error) {
    await deleteUploadedFiles(req);

    if (error.isJoi) {
      return res.status(400).json(new ApiResponse(400, {}, `Validation Error: ${error.message}`));
    }
    return res.status(500).json(new ApiResponse(500, {}, `Server Error: ${error.message}`));
  }
});

export { addPost };