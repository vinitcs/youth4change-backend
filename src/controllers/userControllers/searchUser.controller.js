import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
const searchUser = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get _id from JWT middleware
  const { term = "", page = 1, limit = 10 } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  if (!term) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Please provide a valid search term."));
  }

  const regex = new RegExp(term, "i"); // Create a regex to match the term (case-insensitive)

  // Fetch all matching users either by name or nameTag
  const allMatchingUsers = await User.find({
    _id: { $ne: userId }, // Exclude logged-in user
    $or: [{ name: regex }, { nameTag: regex }],
  })
    .select("name avatar nameTag")
    .lean();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users: allMatchingUsers },
        `Users found matching '${term}'.`
      )
    );
});

export { searchUser };
