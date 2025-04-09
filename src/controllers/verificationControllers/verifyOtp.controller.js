import { Admin } from "../../models/admin.model.js";
import { Otp } from "../../models/otp.model.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { verifyOtpValidationSchema } from "../../utils/helper/validations/userValidationSchema.js";

const verifyOtp = asyncHandler(async (req, res) => {
  try {
    // const { otp, email } = req.body;
    const { email, otp, userType } =
      await verifyOtpValidationSchema.validateAsync(req.body);

    const otpRecord = await Otp.findOne({ email: email });

    if (!otpRecord) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            {},
            `OTP not found or expired for this email. Please request a new OTP.`
          )
        );
    }

    // Securely compare the provided OTP with the stored one
    const isOtpValid = await otpRecord.compareOtp(otp); // Ensure compareOtp uses a secure comparison

    if (!isOtpValid) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, `Invalid OTP. Please try again.`));
    }

    // OTP is valid, delete the record to prevent reuse
    await otpRecord.deleteOne();

    // Check if user is already registered
    let isAlreadyRegistered = false;

    if (userType === "admin") {
      const admin = await Admin.findOne({ email });
      isAlreadyRegistered = !!admin;
    } else {
      const user = await User.findOne({ email });
      isAlreadyRegistered = !!user;
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { email, isAlreadyRegistered, userType },
          "Email verification successful."
        )
      );
  } catch (error) {
    if (error.isJoi) {
      // Handle JOI validation errors
      return res
        .status(400)
        .json(new ApiResponse(400, {}, `Validation Error: ${error.message}`));
    }
  }
});

export { verifyOtp };
