import { Admin } from "../../models/admin.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const internalTeamList = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 10 } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const skip = (pageNum - 1) * limitNum;

  if (!role) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Role name is required."));
  }

  const adminByRoleList = await Admin.find({
    role: role,
  })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .skip(skip)
    .limit(limitNum)
    .lean();

  if (!adminByRoleList || !adminByRoleList.length) {
    const message =
      pageNum === 1 ? `No admins found.` : "No more admins data available.";

    return res.status(200).json(new ApiResponse(200, { admins: [] }, message));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { admins: adminByRoleList },
        "Admins fetched successfully."
      )
    );
});

export { internalTeamList };
