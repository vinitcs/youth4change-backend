import { Notification } from "../../models/notification.model.js";
// import { Post } from "../../models/post.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

// const getContentData = async (contentId, contentType) => {
//   let content = "";

//   switch (contentType) {
//     case "Post":
//       content = await Post.findById(contentId).select("media").lean();
//       if (!content) return {};

//       // Convert null to "" in post media
//       if (content.media?.length > 0) {
//         content.media[0].url = content.media[0].url ?? "";
//         content.media[0].type = content.media[0].type ?? "";
//         content.media[0].text = content.media[0].text ?? "";
//         content.media[0].font = content.media[0].font ?? "";
//         content.media[0].backgroundColor =
//           content.media[0].backgroundColor ?? "";
//       }
//       return {
//         ...content,
//         media: content.media?.length > 0 ? content.media[0] : {},
//       };

//     // break;

//     case "Event":
//       content = await Event.findById(contentId)
//         .select("title date time media address")
//         .lean();
//       break;

//     case "NGO":
//       content = await NGO.findById(contentId).select("name media").lean();
//       break;

//     case "SocialReformer":
//       content = await SocialReformer.findById(contentId)
//         .select("name nationality bio media")
//         .lean();
//       break;

//     default:
//       return "";
//   }
//   if (!contentType) return "";

//   return {
//     ...content,
//     media: content.media?.length > 0 ? content.media[0] : {},
//   };
// };

const allNotification = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Access from JWT middleware

  const { page = 1, limit = 10 } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const skip = (pageNum - 1) * limitNum;

  let notifications = await Notification.find({ sharedToUserId: userId })
    .select("-isBroadcast -sharedToUserId -contentId -contentType -isDeleted")
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

  // // Populate content data based on contentType
  // const populatedNotifications = await Promise.all(
  //   notifications.map(async (notification) => {
  //     const contentData = await getContentData(
  //       notification.contentId,
  //       notification.contentType
  //     );
  //     return {
  //       ...notification,
  //       contentData: contentData || {},
  //     };
  //   })
  // );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications: notifications,
        // notifications: populatedNotifications,
      },
      `Successfully fetched notifications list.`
    )
  );
});

export { allNotification };
