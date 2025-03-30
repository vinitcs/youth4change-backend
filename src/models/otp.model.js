import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
    },

    otp: {
      type: String,
      required: [true, "OTP is required"],
      unique: [true, "OTP is unique"],
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 }); //60 sec = 1 minute

otpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();
  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});

otpSchema.methods.compareOtp = async function (otp) {
  return await bcrypt.compare(otp, this.otp);
};

export const Otp = mongoose.model("Otp", otpSchema);
