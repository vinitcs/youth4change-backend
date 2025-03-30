import { ReportAudacity } from "../../models/reportAudacity.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const allReport = asyncHandler(async (req, res) => {
  const { targetType } = req.query;
  const limit = parseInt(req.query.limit) || 10;
  const skip = parseInt(req.query.skip) || 0;

  let filter = {};
  if (targetType) {
    filter.targetType = targetType;
  }

  const allReportData = await ReportAudacity.find(filter)
    // .populate("reportedBy", "name avatar")
    .select("-reportedBy -reasons")
    .sort({ createdAt: -1 }) // Latest first
    .skip(skip)
    .limit(limit)
    .exec();

  // Count total reports matching the filter (for frontend pagination)
  const totalReports = await ReportAudacity.countDocuments(filter);

  if (!allReportData.length) {
    return res.status(404).json(new ApiResponse(404, {}, `No reports found!`));
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        reports: allReportData,
        totalReports, // Total reports count
        currentPage: Math.floor(skip / limit) + 1, // Calculate current page
        totalPages: Math.ceil(totalReports / limit), // Total pages
      },
      `Successfully fetched reports list.`
    )
  );
});

export { allReport };
