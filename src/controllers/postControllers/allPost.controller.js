import { Post } from "../../models/post.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const allPost = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const skip = (pageNum - 1) * limitNum;

  const allPostData = await Post.find({})
    .populate("adminId", "name avatar")
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .skip(skip)
    .limit(limitNum)
    .lean();

  if (!allPostData || !allPostData.length) {
    const message =
      pageNum === 1 ? `No post found.` : "No more post data available.";

    return res.status(200).json(new ApiResponse(200, { posts: [] }, message));
  }

  // If any null value then convert it into empty string for frontend handling
  const modifiedPostData = allPostData.map((p) => ({
    ...p,
    eventDate: p?.eventDate ? p.eventDate.toISOString().slice(0,10) : "",
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts: modifiedPostData,
      },
      `Successfully fetched posts.`
    )
  );
});

export { allPost };
