import { model, Schema, Types } from "mongoose";

const gallerySchema = new Schema(
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

    category: {
      type: String,
      trim: true,
      default: "",
    },
    url: { type: String, trim: true, default: "" }, // Store URL/path. If link, then url: ""
    type: {
      type: String,
      enum: ["image", "video"],
      default: "",
    },

    // media: [
    //   {
    //     url: { type: String, trim: true, default: "" }, // Store URL/path. If link, then url: ""
    //     type: {
    //       type: String,
    //       enum: ["image", "video"],
    //       default: "",
    //     },
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

gallerySchema.index({ adminId: 1 });

export const Gallery = model("Gallery", gallerySchema);
