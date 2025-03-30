import { Stage } from "../../models/stage.model.js";
import { UserStageProgress } from "../../models/userStageProgress.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const submitStage = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { stageId, selectedLists } = req.body;
  const stage = await Stage.findById(stageId);
  if (!stage) {
    return res.status(404).json(new ApiResponse(404, {}, "Stage not found"));
  }

  // Check if all checkboxes are selected
  const isCompleted = stage.lists.every((list) =>
    selectedLists.some((sel) => sel.name === list.name && sel.checked)
  );

  if (!isCompleted) {
    return res.status(400).json(new ApiResponse(400, {}, "All checks must be mark before submit."));
  }

  const userProgress = new UserStageProgress({
    userId,
    stageId,
    selectedLists,
    isCompleted,
  });

  await userProgress.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { userProgress }, "Stage response submitted successfully.")
    );
});

export { submitStage };
