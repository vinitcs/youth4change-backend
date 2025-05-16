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
    },

    dob: {
      type: Date,
      required: true,
    },

    age: {
      type: Number,
      requied: true,
    },

    gender: {
      type: String,
      required: true,
    },

    caste: {
      type: String,
      required: true,
    },

    religion: {
      type: String,
      reuired: true,
    },

    bloodGroup: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    village: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    aadharNumber: {
      type: Number,
      required: true,
    },

    education: {
      type: String,
      required: true,
    },

    college: {
      type: String,
      required: true,
    },

    yearOfAdmission: {
      type: Number,
      required: true,
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

    hasConsented: {
      type: Boolean,
      required: true,
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
