import { ReportAudacity } from "../../models/reportAudacity.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const selectedReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let selectedReportData = await ReportAudacity.findById(id).populate(
    "reportedBy.userId",
    "name avatar phone"
  );

  if (!selectedReportData) {
    return res.status(404).json(new ApiResponse(404, {}, `No report found!`));
  }

  selectedReportData = {
    ...selectedReportData.toObject(),
    reportedBy: selectedReportData.reportedBy.map((user) => ({
      name: user.userId?.name || "",
      avatar: user.userId?.avatar || "",
      phone: user.userId?.phone || "",
    })),
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        selectedReport: selectedReportData,
      },
      `Successfully fetched selected report data.`
    )
  );
});

export { selectedReport };
