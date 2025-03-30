import { Notification } from "../../models/notification.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const readNotification = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id.length) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Id must be valid MongoDB object id."));
  }

  //   if (typeof isRead !== "boolean" && !isRead) {
  //     return res
  //       .status(400)
  //       .json(new ApiResponse(400, {}, "isRead value must be true in boolean."));
  //   }

  const readNotification = await Notification.findByIdAndUpdate(
    { _id: id },
    { $set: { isRead: true } },
    { new: true }
  );

  if (!readNotification) {
    return new ApiError(500, "Something went wrong in updating isRead in db.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Notification mark as read successfully."));
});

export { readNotification };
