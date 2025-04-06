import { Post } from "../../models/post.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const postsCreatedByAdmin = asyncHandler(async (req, res) => {
  const adminId = req.query.adminId || req.admin._id;
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const skip = (pageNum - 1) * limitNum;

  const allPostData = await Post.find({ adminId: adminId })
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

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts: allPostData,
      },
      `Successfully fetched posts.`
    )
  );
});

export { postsCreatedByAdmin };
