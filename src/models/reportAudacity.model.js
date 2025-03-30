import { model, Schema, Types } from "mongoose";

const reportAudacitySchema = new Schema(
  {
    targetId: {
      type: Types.ObjectId, // Can reference User, Post, or Event
      required: [true, "Target id is required"],
    },
    targetType: {
      type: String,
      enum: [
        "User",
        "Post",
        "Event",
        "NGO",
        "SocialReformer",
        "PostComment",
        "EventComment",
        "NgoComment",
        "SocialReformerComment",
      ], // Differentiate the type of target
      required: [true, "Target type is required"],
    },

    reportedBy: [
      {
        userId: { type: Types.ObjectId, ref: "User" },
        reason: { type: String, trim: true, default: "" },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
    reportCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const ReportAudacity = model("ReportAudacity", reportAudacitySchema);
