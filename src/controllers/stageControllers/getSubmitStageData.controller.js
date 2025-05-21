import { UserStageProgress } from "../../models/userStageProgress.model.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";

const getSubmitStageData = asyncHandler(async (req, res) => {
  const userId = req.user._id; // get user id from middleware;
  const stageId = req.params;

  const submittedStageData = await UserStageProgress.findOne({
    userId,
    stageId,
  })
    .populate("userId", "name avatar email")
    .lean();

  if (!submittedStageData) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Submitted stage data not found."));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...submittedStageData },
        "Submitted stage data fetch successfully."
      )
    );
});

export { getSubmitStageData };
