import { Admin } from "../../models/admin.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const adminId = req.admin._id; // Access id from admin auth middleware
  const { oldPassword, newPassword } = req.body;

  const admin = await Admin.findById(adminId);
  const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Invalid old Password."));
  }

  admin.password = newPassword;
  await admin.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully."));
});

export { changeCurrentPassword };
