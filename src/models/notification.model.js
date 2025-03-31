import { model, Schema, Types } from "mongoose";

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    }, // AdminReview, SharePost

    // If admin share
    sharedByAdminName: {
      type: String,
      default: "",
    },

    isBroadcast: {
      type: Boolean,
      default: false,
    },
    sharedToUserId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Notification share to user id is required"],
    },
    message: {
      type: String,
      maxlength: 500,
      required: [true, "Notification message is required"],
    },

    contentId: { type: Types.ObjectId, default: null },

    contentType: {
      type: String,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    }, // allow user to delete it, without actually deleting from db. To preserve history
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ sharedTo: 1, type: 1, createdAt: -1 });
notificationSchema.index({ sharedTo: 1, status: 1 });

export const Notification = model("Notification", notificationSchema);

//
//
//
//
//
//
//
//
// enum: [
//   "Admin",
//   "PostShare",
//   "EventShare",
//   "NgoShare",
//   "SocialReformerShare",
// ],
