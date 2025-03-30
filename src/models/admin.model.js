import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const adminSchema = new Schema(
  {
    name: {
      type: String,
      index: true,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter admin password"],
      trim: true,
    },
    role: {
      type: String,
      default: "super",
    },
    avatar: {
      // Profile Img URl
      type: String,
      trim: true,
      default: "",
    },
    refreshToken: {
      type: String, // Refresh token is stored securely
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      phone: this.phone,
    },
    process.env.ADMIN_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY,
    }
  );
};

adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      phone: this.phone,
    },
    process.env.ADMIN_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.ADMIN_REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Admin = model("Admin", adminSchema);
