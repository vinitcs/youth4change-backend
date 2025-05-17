import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
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
      index: true,
    },

    dob: {
      type: Date,
      default: null,
      index: true,
    },

    age: {
      type: Number,
      default: 0,
      index: true,
    },

    gender: {
      type: String,
      default: "",
    },

    caste: {
      type: String,
      default: "",
    },

    religion: {
      type: String,
      default: "",
    },

    bloodGroup: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    village: {
      type: String,
      default: "",
    },

    district: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    aadharNumber: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      default: "",
    },

    yearOfAdmission: {
      type: Number,
      default: 0,
    },

    password: {
      type: String,
      required: [true, "Please enter user password"],
      trim: true,
    },

    avatar: {
      // Profile Img URl
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    media: [
      {
        url: { type: String, trim: true, default: "" }, // Store URL/path.
        type: {
          type: String,
          enum: ["image", "pdf"],
          default: "",
        },
      },
    ],

    hasMediaConsented: {
      type: Boolean,
      default: false,
    },

    isUnderEighteen: {
      type: Boolean,
      default: false,
    },

    guardianDetails: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      hasGuardianConsented: { type: Boolean, default: false },
    },

    hasDeclareConsented: {
      type: Boolean,
      default: false,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      phone: this.phone,
    },
    process.env.USER_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.USER_ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      phone: this.phone,
    },
    process.env.USER_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.USER_REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = model("User", userSchema);
