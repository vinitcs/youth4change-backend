import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import path from "path";
// import fs from "fs";
import fs from "fs/promises";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { updatePostValidationSchema } from "../../utils/helper/validations/postValidationSchema.js";
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
  }
};

const deleteUploadedFiles = async (req) => {
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      const filePath = `./public/uploads/post/${file.mimetype.startsWith("image/") ? "images" : "videos"}/${file.filename}`;
      try {
        await deleteFileIfExists(filePath);
      } catch (error) {
        throw new ApiError(
          500,
          `Failed to delete file: ${filePath}, Error: ${error.message}`
        );
      }
    }
  }
};

const updatePost = asyncHandler(async (req, res) => {
  const adminId = req.admin._id; // get id from jwt middleware

  try {
    const { postId, description, link, deleteMedia } = req.body;

    const validatedData = await updatePostValidationSchema.validateAsync({
      postId,
      description,
      link,
    });

    // Find the admin updating the post
    const admin = await Admin.findById({ _id: adminId });

    if (!admin) {
      await deleteUploadedFiles(req);

      return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
    }

    const post = await Post.findById({ _id: validatedData.postId });

    if (!post) {
      await deleteUploadedFiles(req);

      return res.status(404).json(new ApiResponse(404, {}, "Post not found."));
    }

    // Ensure admin owns the post
    if (post.adminId.toString() !== req.admin._id.toString()) {
      await deleteUploadedFiles(req);

      return res.status(403).json(new ApiResponse(403, {}, "Unauthorized."));
    }

    let updatedMedia = [...post.media]; // Clone the existing media array

    let mediaToDelete = [];

    // 1. Delete Only Provided Media URLs
    if (Array.isArray(deleteMedia)) {
      mediaToDelete = deleteMedia; // Use directly if it's already an array
    } else if (typeof deleteMedia === "string" && deleteMedia.trim() !== "") {
      try {
        mediaToDelete = JSON.parse(deleteMedia); // Parse if it's a JSON string
      } catch (error) {
        await deleteUploadedFiles(req);

        return res
          .status(400)
          .json(new ApiResponse(400, {}, "Invalid deleteMedia format."));
      }
    }

    if (mediaToDelete.length > 0) {
      updatedMedia = updatedMedia.filter(
        (item) => !mediaToDelete.includes(item.url)
      );

      for (const fileUrl of mediaToDelete) {
        const filePath = path.join("./public", fileUrl);
        await deleteFileIfExists(filePath);
      }
    }

    // 2. Add New Media Files
    if (req.files) {
      console.log("post files", req.files);

      req.files?.forEach((file) => {
        updatedMedia.push({
          url: file.mimetype.startsWith("image/")
            ? `/uploads/post/images/${file.filename}`
            : file.mimetype.startsWith("video/")
              ? `/uploads/post/videos/${file.filename}`
              : "",

          type: file.mimetype.startsWith("image/")
            ? `image`
            : file.mimetype.startsWith("video/")
              ? `video`
              : "",

          link: "",
        });
      });
    }

    // 3. update link with new updated link
    if (validatedData.link) {
      if (updatedMedia.length === 1 && updatedMedia[0].type === "link") {
        updatedMedia[0].link = validatedData.link || post.media.link;
      }
    }

    // 5. Update Post in Database
    post.description = validatedData.description || post.description;
    post.media = updatedMedia; // Only the required media is updated

    const updatedPost = await post.save();

    if (!updatedPost) {
      await deleteUploadedFiles(req);

      throw new ApiError(500, "Something went wrong to update post.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedPost: updatedPost },
          "Post updated successfully."
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

export { updatePost };
