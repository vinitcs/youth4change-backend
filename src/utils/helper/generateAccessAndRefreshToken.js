import { Admin } from "../../models/admin.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "./ApiError.js";

const generateAccessAndRefreshToken = async (id, session) => {
  try {
    const user = await User.findById({ _id: id }).session(session);

    if (!user) {
      throw new ApiError(404, `User not found`);
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while generating refresh and access token. Error ${error.message}`
    );
  }
};

const generateAdminAccessAndRefreshToken = async (id, session) => {
  try {
    const admin = await Admin.findById({ _id: id }).session(session);

    if (!admin) {
      throw new ApiError(404, `Admin not found`);
    }

    const accessToken = await admin.generateAccessToken();
    const refreshToken = await admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while generating refresh and access token. Error ${error.message}`
    );
  }
};

export { generateAccessAndRefreshToken, generateAdminAccessAndRefreshToken };
