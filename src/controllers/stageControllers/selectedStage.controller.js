import { Stage } from "../../models/stage.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { UserStageProgress } from "../../models/userStageProgress.model.js";

const selectedStage = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const stageId = req.params.stageId;

  const stage = await Stage.findById(stageId).lean();
  if (!stage) {
    return res.status(404).json(new ApiResponse(404, {}, "Stage not found"));
  }

  const checkUserPrevStageResponse = await UserStageProgress.findOne({
    userId,
    stageId,
  })
    .sort({ createdAt: -1 }) // Only matters if multiple responses are allowed
    .lean();

  const isPrevSubmitted = !!checkUserPrevStageResponse;
  const previousStatus = checkUserPrevStageResponse?.status || "";

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...stage,
        isPrevSubmitted,
        previousStatus,
      },
      "Selected stage data."
    )
  );
});

export { selectedStage };
