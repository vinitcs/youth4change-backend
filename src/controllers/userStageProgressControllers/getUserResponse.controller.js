import { UserStageProgress } from "../../models/userStageProgress.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const getUserResponses = asyncHandler(async (req, res) => {
  const { search = "", status, page = 1, limit = 10, sortByStatus } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const regex = new RegExp(search, "i");

  // Status Sorting Order: Pending → Accepted → Rejected
  // const statusSortOrder = { Pending: 1, Accepted: 2, Rejected: 3 };

  const aggregationPipeline = [
    // Step 1: Lookup user details
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" }, // Convert array to object

    // Step 2: Lookup stage details
    {
      $lookup: {
        from: "stages",
        localField: "stageId",
        foreignField: "_id",
        as: "stage",
      },
    },
    { $unwind: "$stage" }, // Convert array to object

    // Step 3: Apply Filters
    {
      $match: {
        ...(status && { status }),
        ...(search && {
          $or: [{ "user.name": regex }, { "user.email": regex }],
        }),
      },
    },

    // Step 4: Add Sorting Order for Status
    {
      $addFields: {
        statusOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "Pending"] }, then: 1 },
              { case: { $eq: ["$status", "Accepted"] }, then: 2 },
              { case: { $eq: ["$status", "Rejected"] }, then: 3 },
            ],
            default: 4,
          },
        },
      },
    },

    // Step 5: Sorting
    {
      $sort:
        sortByStatus === "true"
          ? { statusOrder: 1, createdAt: -1 }
          : { createdAt: -1 },
    },

    // Step 6: Pagination
    { $skip: skip },
    { $limit: limitNum },

    // Step 7: Select Only Required Fields
    {
      $project: {
        _id: 1,
        userId: "$user._id",
        userName: "$user.name",
        userEmail: "$user.email",
        stageId: "$stage._id",
        stageTitle: "$stage.title",
        stageDescription: "$stage.description",
        selectedLists: 1,
        isCompleted: 1,
        status: 1,
        adminRemarks: 1,
        createdAt: 1,
      },
    },
  ];

  const responses = await UserStageProgress.aggregate(aggregationPipeline);

  // **Get Total Count**
  const totalCount = await UserStageProgress.countDocuments();

  if (!responses.length) {
    const message =
      pageNum === 1 ? `No responses.` : `No more responses available.`;
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { total: totalCount, page: pageNum, limit: limitNum, responses: [] },
          message
        )
      );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        responses,
      },
      "User responses fetched successfully."
    )
  );
});

export { getUserResponses };

//
//
//
//
//
//
//
//

// import { UserStageProgress } from "../../models/userStageProgress.model.js";
// import { User } from "../../models/user.model.js";
// import { ApiResponse } from "../../utils/helper/ApiResponse.js";
// import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

// const getUserResponses = asyncHandler(async (req, res) => {
//   const { search = "", status, page = 1, limit = 10, sortByStatus } = req.query;

//   const pageNum = Number(page) || 1;
//   const limitNum = Number(limit) || 10;

//   const skip = (pageNum - 1) * limitNum;

//   const regex = new RegExp(search, "i"); // Case-insensitive search

//   const filter = {};

//   // Filter by status if provided
//   if (status) {
//     filter.status = status;
//   }

//   // Search by user name or email
//   if (search) {
//     const users = await User.find({
//       $or: [{ name: regex }, { email: regex }],
//     }).select("_id");

//     filter.userId = { $in: users.map((user) => user._id) };
//   }

//   // Sorting order based on status (Pending first, then Accepted, then Rejected)
//    const statusOrder = { Pending: 1, Accepted: 2, Rejected: 3 };
//   let sortOrder = { createdAt: -1 }; // Default sorting (latest first)

//   if (sortByStatus === "true") {
//     sortOrder = {}; // Remove default sorting
//   }

//   // Fetch user responses with pagination and sorting
//   const responses = await UserStageProgress.find(filter)
//     .populate("userId", "name email")
//     .populate("stageId", "title description")
//     .sort(sortOrder)
//     .skip(skip)
//     .limit(limitNum);

//   if (!responses || responses.length === 0) {
//     const message =
//       pageNum === 1
//         ? `No responses found with matching '${search}'.`
//         : `No more responses available with matching '${search}'.`;
//     return res.status(200).json(new ApiResponse(200, { users: [] }, message));
//   }

//   const totalCount = await UserStageProgress.countDocuments(filter);

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         total: totalCount,
//         page: pageNum,
//         limit: limitNum,
//         responses,
//       },
//       "User responses fetched successfully."
//     )
//   );
// });

// export { getUserResponses };
