import { Stage } from "../../models/stage.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const createStage = asyncHandler(async (req, res) => {
  const { title, description, lists } = req.body;
  const newStage = new Stage({
    title,
    description,
    lists,
    createdBy: req.admin._id,
  });

  await newStage.save();

  return res
    .status(201)
    .json(
      new ApiResponse(201, { stage: newStage }, "Stage created successfully")
    );
});

export { createStage };
