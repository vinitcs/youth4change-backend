import { ReportAudacity } from "../../models/reportAudacity.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { reportAudacityValidationSchema } from "../../utils/helper/validations/reportAudacityValidationSchema.js";

const addReport = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // get id from jwt middleware (reportedById)
    const { targetId, targetType, reason } = req.body;

    const validatedData = await reportAudacityValidationSchema.validateAsync({
      targetId,
      targetType,
      reason,
    });

    // Check if a report already exists for this target
    let existingReport = await ReportAudacity.findOne({
      targetId: validatedData.targetId,
      targetType: validatedData.targetType,
    });

    if (existingReport) {
      // If the user already reported, block duplicate reporting
      if (
        existingReport.reportedBy.some(
          (r) => r.userId.toString() === userId.toString()
        )
      ) {
        return res
          .status(400)
          .json(new ApiResponse(400, {}, "You have already reported this."));
      }

      // Add user to reportedBy array
      existingReport.reportedBy.push({
        userId: userId,
        reason: validatedData.reason,
      });

      // Increment report count
      existingReport.reportCount += 1;

      await existingReport.save();
    } else {
      // Create new report entry
      existingReport = new ReportAudacity({
        targetId: validatedData.targetId,
        targetType: validatedData.targetType,
        reportedBy: [{ userId: userId, reason: validatedData.reason }],
        reportCount: 1, // Initialize report count
      });

      await existingReport.save();
    }

    return res.status(201).json(
      new ApiResponse(
        201,
        // { report: existingReport },
        {},
        "Your report has been successfully submitted. Our admin team will review it and take appropriate action."
      )
    );
  } catch (error) {
    if (error.isJoi) {
      // Handle JOI validation errors
      return res
        .status(400)
        .json(new ApiResponse(400, {}, `Validation Error: ${error.message}`));
    }

    return res
      .status(500)
      .json(new ApiResponse(500, {}, `Server Error: ${error.message}`));

    // throw new ApiError(500, `Error: ${error.message}`);
  }
});

export { addReport };
