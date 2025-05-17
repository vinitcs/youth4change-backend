import { model, Schema, Types } from "mongoose";

const postSchema = new Schema(
  {
    adminId: {
      type: Types.ObjectId,
      ref: "Admin",
      required: [true, "Admin Id is required"],
    },

    title: {
      type: String,
      trim: true,
      default: "",
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

    isEvent: {
      type: Boolean,
      default: false,
    },

    eventDate: {
      type: Date,
      default: null,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ adminId: 1 });
postSchema.index({ eventDate: 1 });
postSchema.index({ isEvent: 1, eventDate: 1 });

export const Post = model("Post", postSchema);
