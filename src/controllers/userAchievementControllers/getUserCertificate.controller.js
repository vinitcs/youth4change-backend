import { UserAchievement } from "../../models/UserAchievement.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const getUserCertificates = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get id from JWT middleware

  const certificates = await UserAchievement.find({ userId })
    .populate("adminId", "name avatar")
    .select("-userId");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: certificates,
      },
      "Certificates fetched successfully"
    )
  );
});

export { getUserCertificates };
