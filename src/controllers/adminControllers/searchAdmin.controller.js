import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { Admin } from "../../models/admin.model.js";

const searchAdmin = asyncHandler(async (req, res) => {
  const adminId = req.admin._id; // Logged-in user ID
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

  const searchFilters = {
    _id: { $ne: adminId },
  };

  if (name) {
    searchFilters.name = new RegExp(name, "i");
  }

  if (email) {
    searchFilters.email = new RegExp(email, "i");
  }

  const admins = await Admin.find(searchFilters)
    .select("_id name email avatar role city")
    .skip(skip)
    .limit(limitNum);

  if (!admins || admins.length === 0) {
    const message =
      pageNum === 1
        ? `No admins found with given filters.`
        : `No more admins available with given filters.`;
    return res.status(200).json(new ApiResponse(200, { admins: [] }, message));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { admins }, `Admins found with given filters.`));
});

export { searchAdmin };
