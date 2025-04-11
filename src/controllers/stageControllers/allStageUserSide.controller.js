import { Stage } from "../../models/stage.model.js";
import { UserStageProgress } from "../../models/userStageProgress.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const allStageUserSide = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch all stages sorted by order of creation
  const stages = await Stage.find().sort({ createdAt: 1 });

  // Fetch user's progress for all stages
  const userProgress = await UserStageProgress.find({ userId });

  let isPreviousStageApproved = true; // First stage is always accessible

  // Map stages with submission and approval status
  const stageList = stages.map((stage, index) => {
    const progressList = userProgress
      .filter((p) => p.stageId.toString() === stage._id.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort descending by createdAt

    const progress = progressList[0]; // Get the latest one

    const isSubmitted =
      !!progress &&
      (progress.status === "Pending" || progress.status === "Accepted");
    const isApproved = progress?.status === "Accepted";

    // First stage is always accessible; others depend on previous stage approval
    const isAccessible = index === 0 || isPreviousStageApproved;

    // Update flag for the next stage
    isPreviousStageApproved = isApproved;

    return {
      _id: stage._id,
      title: stage.title,
      description: stage.description,
      requiredExperience: stage.requiredExperience,
      isSubmitted,
      isApproved,
      isAccessible,
    };
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { stages: stageList },
        "Stages list fetched successfully."
      )
    );
});

export { allStageUserSide };
