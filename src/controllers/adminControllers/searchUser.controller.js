import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { User } from "../../models/user.model.js";

const searchUser = asyncHandler(async (req, res) => {
  const { name = "", email = "", page = 1, limit = 10 } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  if (!name || !email) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "Please provide at least one search filter either name or email."
        )
      );
  }

  const searchFilters = {};

  if (name) {
    searchFilters.name = new RegExp(name, "i");
  }

  if (email) {
    searchFilters.email = new RegExp(email, "i");
  }

  const users = await User.find(searchFilters)
    .select("_id name email avatar city")
    .skip(skip)
    .limit(limitNum);

  if (!users || users.length === 0) {
    const message =
      pageNum === 1
        ? `No users found with given filters.`
        : `No more users available with given filters.`;
    return res.status(200).json(new ApiResponse(200, { users: [] }, message));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { users }, `Users found with given filters.`));
});

export { searchUser };
