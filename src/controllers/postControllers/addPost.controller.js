import { ApiError } from "../../utils/helper/ApiError.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { addPostValidationSchema } from "../../utils/helper/validations/postValidationSchema.js";
import fs from "fs/promises";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { Post } from "../../models/post.model.js";
import { Admin } from "../../models/admin.model.js";

const deleteFileIfExists = async (filePath) => {
  try {
    await fs.access(filePath); // Check if the file exists
    await fs.unlink(filePath); // Delete the file
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Error deleting post file: ${filePath}`, error.message);
    }
    // throw new ApiError(
    //   500,
    //   `Error deleting post file: ${error.message}`
    // );

    return false; // File did not exist or could not be deleted
  }
};

const deleteUploadedFiles = async (req) => {
  if (req.files) {
    const uploadedFiles = [];

    if (req.files.image) {
      req.files?.image?.forEach((file) => {
        uploadedFiles.push(`./public/uploads/post/images/${file.filename}`);
      });
    }

    if (req.files.video) {
      req.files?.video?.forEach((file) => {
        uploadedFiles.push(`./public/uploads/post/videos/${file.filename}`);
      });
    }
    for (const file of uploadedFiles) {
      try {
        await deleteFileIfExists(file);
      } catch (error) {
        throw new ApiError(
          500,
          `Failed to delete file: ${file} and error ${error.message}`
        );
      }
    }
  }
};

const addPost = asyncHandler(async (req, res) => {
  const adminId = req.admin._id; // get id from jwt middleware

  try {
    // Validate input data
    const validatedData = await addPostValidationSchema.validateAsync(req.body);

    const admin = await Admin.findById({ _id: adminId });

    // Check if admin exists
    if (!admin) {
      await deleteUploadedFiles(req);

      return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
    }

    // Process media uploads and text posts
    let mediaArray = [];

    if (req.files) {
      console.log("Files",req.files);
      
      // if (req.files.image) {
        console.log("image::",req.files.image);
        req.files?.forEach((file) => {
          mediaArray.push({
            url: `/uploads/post/images/${file.filename}`,
            type: "image",
            link: "",
          });
        });
      // }

      // if (req.files.video) {
      //   req.files?.video?.forEach((file) => {
      //     mediaArray.push({
      //       url: `/uploads/post/videos/${file.filename}`,
      //       type: "video",
      //       link: "",
      //     });
      //   });
      // }
    }

    // Handle link post
    if (validatedData.link) {
      mediaArray.push({
        link: validatedData.link || "",
        url: "",
        type: "link",
      });
    }

    // Create post
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

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { Post: createdPost },
          "Post created successfully."
        )
      );
  } catch (error) {
    await deleteUploadedFiles(req);

    if (error.isJoi) {
      // Handle JOI validation errors
      return res
        .status(400)
        .json(new ApiResponse(400, {}, `Validation Error: ${error.message}`));
    }

    return res
      .status(500)
      .json(new ApiResponse(500, {}, `Server Error: ${error.message}`));

    // throw new ApiError(500, `Error: ${error.message}`);
  }
});

export { addPost };
