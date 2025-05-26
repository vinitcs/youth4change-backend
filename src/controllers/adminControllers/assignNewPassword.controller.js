import { Admin } from "../../models/admin.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const assignNewPassword = asyncHandler(async (req, res) => {
  const { adminId, newPassword } = req.body;

  const admin = await Admin.findById(adminId);

  if (!admin) {
    return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
  }

  admin.password = newPassword;
  await admin.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully."));
});

export { assignNewPassword };
