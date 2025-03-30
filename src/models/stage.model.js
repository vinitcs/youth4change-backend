import { model, Schema, Types } from "mongoose";

const stageSchema = new Schema(
  {
    title: { type: String, required: true }, // Stage name
    description: { type: String, default: "" },
    lists: [
      {
        name: { type: String, required: true }, // Checkbox label
      },
    ],
    // requiredExperience: { type: Number, default: 0 },
    createdBy: { type: Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

export const Stage = model("Stage", stageSchema);
