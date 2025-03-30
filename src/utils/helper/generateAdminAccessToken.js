import jwt from "jsonwebtoken";

const generateAdminAccessToken = (adminName) => {
  return jwt.sign(
    {
      admin: adminName,
    },
    process.env.ADMIN_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY,
    }
  );
};

export { generateAdminAccessToken };
