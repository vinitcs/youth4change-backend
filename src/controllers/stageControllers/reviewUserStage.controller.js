import { Notification } from "../../models/notification.model.js";
import { Stage } from "../../models/stage.model.js";
import { UserStageProgress } from "../../models/userStageProgress.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const reviewUserStage = asyncHandler(async (req, res) => {
  const admin = req.admin; // get id from jwt middleware

  const { progressId, status, adminRemarks } = req.body;
  if (!["Accepted", "Rejected"].includes(status)) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "Invalid status. Use 'Accepted' or 'Rejected'."
        )
      );
  }

  const userProgress = await UserStageProgress.findById(progressId);
  if (!userProgress) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User progress not found"));
  }

  userProgress.status = status;
  userProgress.adminRemarks = adminRemarks || "";
  await userProgress.save();

  const getStageDetails = await Stage.findById(userProgress.stageId).select(
    "title"
  );

  // Create in-app notification for the user
  await Notification.create({
    type: "AdminReview",
    sharedByAdminName: admin.name, // Reviewer admin name
    sharedToUserId: userProgress.userId, // Sending notification to the user
    message: `Your stage ${getStageDetails.title} submission has been ${status.toLowerCase()} by the admin.`,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userProgress },
        `Submission ${status.toLowerCase()} successfully.`
      )
    );
});

export { reviewUserStage };
