import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const profileProgress = asyncHandler(async (req, res) => {
  try {
    // const userId = req.user._id;

    const user = req.user;

    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found."));
    }

    // Define fields to get checked for completeness
    const profileFields = [
      {
        field: "name",
        isComplete: user.name !== "" && user.name !== null,
      },
      {
        field: "email",
        isComplete: user.email !== "" && user.email !== null,
      },
      {
        field: "phone",
        isComplete: user.phone !== "" && user.phone !== null,
      },
      {
        field: "background",
        isComplete: user.background !== "" && user.background !== null,
      },
      {
        field: "bio",
        isComplete: user.bio !== "" && user.bio !== null,
      },
      { field: "dob", isComplete: user.dob !== null && user.dob !== undefined },
    ];

    // Calculate the address fields separately
    let addressCompletion = 0;
    const addressFields = [
      "street",
      "area",
      "city",
      "county",
      "state",
      "pinCode",
      "country",
    ];
    addressFields.forEach((field) => {
      if (user.address && user.address[field] && user.address[field] !== "") {
        addressCompletion += 1;
      }
    });

    // Add the address completion to the profileFields array
    profileFields.push({
      field: "address",
      isComplete: addressCompletion === addressFields.length,
    });

    // Calculate the number of completed fields
    const totalFields = profileFields.length;
    const completedFields = profileFields.filter(
      (field) => field.isComplete
    ).length;

    // Calculate the profile completion percentage
    //   const progressPercentage = parseInt((completedFields / totalFields) * 100);
    const progressPercentage = (completedFields / totalFields) * 100;

    // console.log("profile progress ", progressPercentage);

    // Determine the progress status based on percentage
    let progressStatus = "Not started";
    if (progressPercentage > 0 && progressPercentage < 14.29) {
      progressStatus = "Barely started";
    } else if (progressPercentage >= 14.29 && progressPercentage < 28.57) {
      progressStatus = "Partially completed";
    } else if (progressPercentage >= 28.57 && progressPercentage < 42.86) {
      progressStatus = "Partially completed";
    } else if (progressPercentage >= 42.86 && progressPercentage < 57.14) {
      progressStatus = "More than halfway done";
    } else if (progressPercentage >= 57.14 && progressPercentage < 71.43) {
      progressStatus = "Mostly completed";
    } else if (progressPercentage >= 71.43 && progressPercentage < 85.9) {
      progressStatus = "Almost done";
    } else if (progressPercentage >= 85.9) {
      progressStatus = "Fully completed";
    }

    // Send the response with profile progress and status
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { progress: progressPercentage, status: progressStatus },
          "Profile progress fetched successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, `Error: ${error.message}`);
  }
});

export { profileProgress };
