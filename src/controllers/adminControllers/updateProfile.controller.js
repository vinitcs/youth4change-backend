import { ApiError } from "../../utils/helper/ApiError.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { adminProfileDataValidationSchema } from "../../utils/helper/validations/profileValidationSchema.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { Admin } from "../../models/admin.model.js";

const updateProfile = asyncHandler(async (req, res) => {
  try {
    console.log("req body", req.body);

    const validatedData = await adminProfileDataValidationSchema.validateAsync(
      req.body
    ); // Collect all validation errors if any);

    console.log("validated ", validatedData);
    const adminId = req.admin._id; // Access admin _id from JWT

    // // Prepare updated data for fields that are allowed to be changed
    // const updatedData = { ...validatedData };

    const admin = await Admin.findById({ _id: adminId });

    if (!admin) {
      return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
    }

    // Check email is already used by another admin
    if (validatedData.email) {
      const existingAdmin = await Admin.findOne({ email: validatedData.email });
      if (
        existingAdmin &&
        existingAdmin._id.toString() !== adminId.toString()
      ) {
        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              { inputEmail: validatedData.email },
              "Email is already in use by another admin."
            )
          );
      }
    }

    // Prepare final updatedData while checking for empty values
    const updatedData = {
      name: validatedData.name || admin.name,
      email: validatedData.email || admin.email,
    };

    // Remove undefined or empty values (ensuring no accidental overrides)
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === "" || updatedData[key] === null) {
        updatedData[key] = admin[key]; // Retain previous value
      }
    });

    // update admin profile
    const updatedAdmin = await Admin.findByIdAndUpdate(
      { _id: adminId },
      updatedData,
      {
        new: true, // Return the updated admin document
      }
    ).select("-password -refreshToken");

    console.log("Final Updated Data:", updatedData);

    if (!updatedAdmin) {
      throw new ApiError(500, "Failed to update profile in db.");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          updatedAdmin: {
            ...updatedAdmin.toObject(),
          },
        },
        "Profile updated successfully!"
      )
    );
  } catch (error) {
    if (error.isJoi) {
      // Handle JOI validation errors
      return res
        .status(400)
        .json(new ApiResponse(400, {}, `Validation Error: ${error.message}`));
    }

    throw new ApiError(500, `Error: ${error.message}`);
  }
});

export { updateProfile };
