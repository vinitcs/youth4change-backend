import { model, Schema, Types } from "mongoose";

const userAchievementSchema = new Schema(
  {
    adminId: {
      type: Types.ObjectId,
      ref: "Admin",
      required: [true, "Admin Id is required"],
    },

    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },

    url: { type: String, trim: true },
    type: {
      type: String,
      enum: ["image", "pdf"],
    },

    // media: [
    //   {
    //     url: { type: String, trim: true },
    //     type: {
    //       type: String,
    //       enum: ["image", "pdf"],
    //     },
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

userAchievementSchema.index({ adminId: 1 });
userAchievementSchema.index({ userId: 1 });

export const UserAchievement = model("UserAchievement", userAchievementSchema);
