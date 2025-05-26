import { Admin } from "../../models/admin.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const assignRoleInternal = asyncHandler(async (req, res) => {
  const { adminId, role } = req.body;

  // Fetch admin details
  const admin = await Admin.findById(adminId);

  if (!admin) {
    return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
  }

  admin.role = role;
  await admin.save();

  return res.status(200).json(new ApiResponse(200, {}, "Admin role updated."));
});

export { assignRoleInternal };
