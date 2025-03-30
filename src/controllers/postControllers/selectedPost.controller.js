import { Post } from "../../models/post.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const selectedPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const selectedPostData = await Post.findById({ _id: id }).lean();

  if (!selectedPostData) {
    return res.status(404).json(new ApiResponse(404, {}, `No post found!`));
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...selectedPostData,
      },
      `Successfully fetched selected post data.`
    )
  );
});

export { selectedPost };
