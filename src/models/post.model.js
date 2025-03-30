import { model, Schema, Types } from "mongoose";

const postSchema = new Schema(
  {
    adminId: {
      type: Types.ObjectId,
      ref: "Admin",
      required: [true, "Admin Id is required"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    media: [
      {
        url: { type: String, trim: true, default: "" }, // Store URL/path. If link, then url: ""
        type: {
          type: String,
          enum: ["image", "video", "link"],
          default: "",
        },
        link: { type: String, trim: true, default: "" }, // If media file provided, then link: ""
      },
    ],
  },
  {
    timestamps: true,
  }
);

postSchema.index({ userId: 1 });

export const Post = model("Post", postSchema);
