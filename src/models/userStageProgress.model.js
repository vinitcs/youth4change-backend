import { model, Schema, Types } from "mongoose";

const userStageProgressSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    stageId: { type: Types.ObjectId, ref: "Stage", required: true },
    selectedLists: [
      {
        name: { type: String, required: true }, // Selected checkbox name
        checked: { type: Boolean, required: true, default: false },
      },
    ],
    isCompleted: { type: Boolean, default: false }, // True if all checkboxes are selected
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    }, // Admin review status
    adminRemarks: { type: String, default: "" }, // Optional remarks by the admin
  },
  { timestamps: true }
);

export const  UserStageProgress = model("UserStageProgress", userStageProgressSchema);
