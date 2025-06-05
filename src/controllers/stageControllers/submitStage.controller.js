import { Stage } from "../../models/stage.model.js";
import { UserStageProgress } from "../../models/userStageProgress.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import fs from "fs/promises";
import { parseArrayField } from "../../utils/helper/parse/parseArrayField.js";

const deleteFileIfExists = async (filePath) => {
  try {
    await fs.access(filePath); // Check if the file exists
    await fs.unlink(filePath); // Delete the file
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Error deleting post file: ${filePath}`, error.message);
    }

    return false; // File did not exist or could not be deleted
  }
};

const deleteUploadedFiles = async (req) => {
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      const filePath = `./public/uploads/stage/proofUpload/${file.mimetype.startsWith("image/") ? "images" : "pdfs"}/${file.filename}`;
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

const submitStage = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  req.body.selectedLists = parseArrayField(
    req.body.selectedLists,
    "selectedLists"
  );

  const { stageId, selectedLists } = req.body;
  try {
    const stage = await Stage.findById(stageId);
    if (!stage) {
      await deleteUploadedFiles(req);
      return res.status(404).json(new ApiResponse(404, {}, "Stage not found"));
    }

    // Find existing progress for this user and stage
    let userProgress = await UserStageProgress.findOne({ userId, stageId });

    // Only allow to update previous document if status is not Rejected
    if (userProgress && userProgress.status === "Rejected") {
      userProgress = null;
    }

    // If: updated in previous response until if it is not rejected or all checkboxes are not true
    // Else: created new document if previous is rejected or all checkboxes are true
    if (userProgress) {
      // Update selectedLists: merge new selections with existing
      const updatedLists = [...userProgress.selectedLists];

      for (const incoming of selectedLists) {
        const index = updatedLists.findIndex(
          (item) => item.name === incoming.name
        );
        if (index !== -1) {
          // updatedLists[index].checked =
          //   updatedLists[index].checked || incoming.checked;

          updatedLists[index] = incoming; // Replace with latest value
        } else {
          updatedLists.push(incoming);
        }
      }

      const validStageListNames = stage.lists.map((item) => item.name);
      const isValid = selectedLists.every((sel) =>
        validStageListNames.includes(sel.name)
      );

      if (!isValid) {
        await deleteUploadedFiles(req);
        throw new ApiError(400, "Invalid selected list items submitted.");
      }

      // Check if all stage lists are completed
      const isCompleted = stage.lists.every((stageItem) =>
        updatedLists.some((sel) => sel.name === stageItem.name && sel.checked)
      );

      userProgress.selectedLists = updatedLists;
      userProgress.isCompleted = isCompleted;

      // Process media uploads
      let mediaArray = [];

      if (req.files) {
        console.log("user proof files", req.files);

        req.files?.forEach((file) => {
          mediaArray.push({
            url: file.mimetype.startsWith("image/")
              ? `/uploads/stage/proofUpload/images/${file.filename}`
              : file.mimetype === "application/pdf"
                ? `/uploads/stage/proofUpload/pdfs/${file.filename}`
                : "",

            type: file.mimetype.startsWith("image/")
              ? `image`
              : file.mimetype === "application/pdf"
                ? `pdf`
                : "",
          });
        });
      }

      userProgress.media = mediaArray;

      await userProgress.save();

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { userProgress },
            isCompleted
              ? "Stage completed."
              : "Stage updated. Still incomplete."
          )
        );
    } else {
      // first time submission or if previous submission is rejected - insert new
      // Only allow a new document if status is Rejected

      const validStageListNames = stage.lists.map((item) => item.name);
      const isValid = selectedLists.every((sel) =>
        validStageListNames.includes(sel.name)
      );

      if (!isValid) {
        await deleteUploadedFiles(req);
        throw new ApiError(400, "Invalid selected list items submitted.");
      }

      const isCompleted = stage.lists.every((stageItem) =>
        selectedLists.some((sel) => sel.name === stageItem.name && sel.checked)
      );

      // Process media uploads
      let mediaArray = [];

      if (req.files) {
        console.log("user proof files", req.files);

        req.files?.forEach((file) => {
          mediaArray.push({
            url: file.mimetype.startsWith("image/")
              ? `/uploads/stage/proofUpload/images/${file.filename}`
              : file.mimetype === "application/pdf"
                ? `/uploads/stage/proofUpload/pdfs/${file.filename}`
                : "",

            type: file.mimetype.startsWith("image/")
              ? `image`
              : file.mimetype === "application/pdf"
                ? `pdf`
                : "",
          });
        });
      }

      userProgress = await UserStageProgress.create({
        userId,
        stageId,
        selectedLists,
        isCompleted,
        media: mediaArray,
      });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { userProgress },
            isCompleted ? "Stage completed." : "Stage partially submitted."
          )
        );
    }
  } catch (error) {
    await deleteUploadedFiles(req);

    return res
      .status(500)
      .json(new ApiResponse(500, {}, `Server Error: ${error.message}`));
  }
});

export { submitStage };

//
//
//
//
//
//
//
//
//

// const submitStage = asyncHandler(async (req, res) => {
//   const userId = req.user._id;

//   const { stageId, selectedLists } = req.body;
//   const stage = await Stage.findById(stageId);
//   if (!stage) {
//     return res.status(404).json(new ApiResponse(404, {}, "Stage not found"));
//   }

//   // Check if all checkboxes are selected
//   const isCompleted = stage.lists.every((list) =>
//     selectedLists.some((sel) => sel.name === list.name && sel.checked)
//   );

//   if (!isCompleted) {
//     return res.status(400).json(new ApiResponse(400, {}, "All checks must be mark before submit."));
//   }

//   const userProgress = new UserStageProgress({
//     userId,
//     stageId,
//     selectedLists,
//     isCompleted,
//   });

//   await userProgress.save();

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, { userProgress }, "Stage response submitted successfully.")
//     );
// });
