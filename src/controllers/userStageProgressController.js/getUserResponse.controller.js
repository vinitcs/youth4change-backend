import { UserStageProgress } from "../../models/userStageProgress.model.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const getUserResponses = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 10, sortByStatus } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  // Filter by status if provided
  if (status) {
    filter.status = status;
  }

  // Search by user name or email
  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    filter.userId = { $in: users.map((user) => user._id) };
  }

  // Sorting order based on status (Pending first, then Accepted, then Rejected)
  let sortOrder = { createdAt: -1 }; // Default sorting (latest first)
  if (sortByStatus === "true") {
    sortOrder = {
      status: { $meta: "textScore" }, // Sort by status order
      createdAt: -1, // Then by latest date
    };
  }

  // Fetch user responses with pagination and sorting
  const responses = await UserStageProgress.find(filter)
    .populate("userId", "name email")
    .populate("stageId", "title description")
    .sort(sortOrder)
    .skip(skip)
    .limit(limitNum);

  const totalCount = await UserStageProgress.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        responses,
      },
      "User responses fetched successfully."
    )
  );
});

export { getUserResponses };
