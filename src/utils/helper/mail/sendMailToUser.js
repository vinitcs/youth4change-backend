import nodemailer from "nodemailer";
import { ApiError } from "../ApiError.js";

const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT || 587,
  //   secure: true,
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const sendEmail = async (template) => {
  try {
    const response = await transporter.sendMail(template);
    return response;
  } catch (error) {
    throw new ApiError(400, "Something went wrong while sending mail");
  }
};

export { sendEmail };
