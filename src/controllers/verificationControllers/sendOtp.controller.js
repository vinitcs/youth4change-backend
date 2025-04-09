import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { generateOtp } from "../../utils/helper/generateOtp.js";

import { Otp } from "../../models/otp.model.js";
import { sendEmail } from "../../utils/helper/mail/sendMailToUser.js";

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // validate inputs
  if (!email) {
    return res.status(400).json(new ApiResponse(400, {}, `Email is required!`));
  }

  // Check if an OTP already exists for the email
  const existingOtp = await Otp.findOne({ email: email });

  if (existingOtp) {
    const timeElapsed = (Date.now() - existingOtp.createdAt) / 1000; // Time elapsed in seconds
    if (timeElapsed < 60) {
      return res
        .status(429)
        .json(
          new ApiResponse(
            429,
            { email: email },
            `OTP request timeout elapsed time: ${Math.ceil(60 - timeElapsed)} sec.`
          )
        );
    }

    // Delete the old OTP since it's expired
    await existingOtp.deleteOne();
  }

  // Generate OTP
  const otp = generateOtp();

  if (!otp) {
    throw new ApiError(400, "Error while generating OTP !");
  }

  const template = {
    from: process.env.SMTP_USER, // sender address
    to: email, // list of receivers
    subject: `Email verification ✔`, // Subject line
    text: "Email verification", // plain text body
    html: `<h1>Email verification otp: ${otp}</h1>`, // html body
  };

  const isOtpSendToMail = await sendEmail(template);

  if (!isOtpSendToMail) {
    throw new ApiError(404, "Email doesnt exist !");
  }

  const otpRecord = await Otp.create({
    email: email,
    otp,
  });

  if (!otpRecord) {
    throw new ApiError(500, "Error while storing OTP in db.");
  }

  console.log("otp send via email");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email: email },
        `OTP sent successfully via email. It will expire within 1 minute.`
      )
    );
});

export { sendOtp };
