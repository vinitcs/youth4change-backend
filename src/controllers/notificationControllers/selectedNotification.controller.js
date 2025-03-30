// import { Notification } from "../../models/notification.model.js";
// import { ApiResponse } from "../../utils/helper/ApiResponse.js";
// import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

// const selectedNotification = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const selectedNotificationData = await Notification.findById(id).lean();

//   if (!selectedNotificationData) {
//     return res
//       .status(404)
//       .json(new ApiResponse(404, {}, "No notification found."));
//   }

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         { ...selectedNotificationData },
//         `Successfully fetched selected notification data.`
//       )
//     );
// });

// export { selectedNotification };
