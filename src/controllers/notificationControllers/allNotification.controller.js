import { Notification } from "../../models/notification.model.js";
import { Post } from "../../models/post.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const getContentData = async (contentId, contentType) => {
  let content = "";

  if (!contentType) return "";

  switch (contentType) {
    case "post": {
      content = await Post.findById(contentId)
        .select("title description media isEvent eventDate eventCity")
        .lean();

      if (!content) return {};

      // Ensure content.media[0] is a valid object and assign defaults
      const media =
        Array.isArray(content.media) && content.media.length > 0
          ? content.media[0]
          : {};

      const { url = "", type = "", link = "" } = media;

      return {
        _id: content._id,
        title: content.title,
        description: content.description,
        url,
        type,
        link,
        isEvent: content.isEvent,
        eventDate: content.eventDate || "",
        eventCity: content.eventCity,
      };
    }

    default:
      return "";
  }

  // return {
  //   ...content,
  //   media: content.media?.length > 0 ? content.media[0] : {},
  // };
};

const allNotification = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Access from JWT middleware

  const { page = 1, limit = 10 } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const skip = (pageNum - 1) * limitNum;

  let notifications = await Notification.find({ sharedToUserId: userId })
    .select("-isBroadcast -contentId -contentType -isDeleted")
    .sort({ createdAt: -1 }) // Latest first
    .skip(skip)
    .limit(limitNum)
    .lean();

  if (!notifications || notifications.length === 0) {
    const message =
      pageNum === 1
        ? `No notifications found.`
        : "No more notifications data available.";

    return res
      .status(200)
      .json(new ApiResponse(200, { notifications: [] }, message));
  }

  // Populate content data based on contentType
  const populatedNotifications = await Promise.all(
    notifications.map(async (notification) => {
      const contentData = await getContentData(
        notification.contentId,
        notification.contentType
      );
      return {
        ...notification,
        contentData: contentData || {},
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        // notifications: notifications,
        notifications: populatedNotifications,
      },
      `Successfully fetched notifications list.`
    )
  );
});

export { allNotification };
