import { Stage } from "../../models/stage.model.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const stages = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));

  // Fetch stages where requiredExperience matches the user's experience
  const accessibleStages = await Stage.find({
    requiredExperience: {
      $lte: user.experienceYears,
      $gt: user.experienceYears - 1,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { stages: accessibleStages },
        "Accessible stages fetched."
      )
    );
});

export { stages };
