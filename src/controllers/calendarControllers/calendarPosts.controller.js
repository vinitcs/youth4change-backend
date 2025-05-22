import { Post } from "../../models/post.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const calendarPosts = asyncHandler(async (req, res) => {
  const { month } = req.query;

  // Validate month format (YYYY-MM)
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Invalid or missing 'month' parameter. Expected format: YYYY-MM"
        )
      );
  }

  const [year, mon] = month.split("-").map(Number);
  const start = new Date(year, mon - 1, 1); // local time: YYYY-MM-01
  const end = new Date(year, mon, 1); // start of next month

  const calendarPostsData = await Post.find({
    eventDate: { $gte: start, $lt: end },
    isEvent: true,
  })
    .select("_id title eventDate eventCity")
    .lean();

  if (!calendarPostsData || !calendarPostsData.length) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { calendarPosts: [] }, `No calendar posts found.`)
      );
  }

  // If any null value then convert it into empty string for frontend handling
  const modifiedPostData = calendarPostsData.map((p) => ({
    ...p,
    eventDate: p?.eventDate ? p.eventDate.toISOString().slice(0, 10) : "",
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        calendarPosts: modifiedPostData,
      },
      `Successfully fetched calendar posts.`
    )
  );
});

export { calendarPosts };
