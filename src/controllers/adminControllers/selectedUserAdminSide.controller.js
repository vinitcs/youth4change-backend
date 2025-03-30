import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const selectedUserDataAdminSide = asyncHandler(async (req, res) => {
  try {
    // const userId = req.user._id;
    const targetUserId = req.body.targetUserId;

    const selectedUserData = await User.findById({ _id: targetUserId }).select(
      "name email phone avatar"
    );

    if (!selectedUserData) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found."));
    }

    const userWithFollowersAndFollowing = {
      ...selectedUserData.toObject(),
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: userWithFollowersAndFollowing },
          "Selected user data fetched successfully at admin side."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      `Error while fetching selected following user: ${error.message}`
    );
  }
});

export { selectedUserDataAdminSide };
