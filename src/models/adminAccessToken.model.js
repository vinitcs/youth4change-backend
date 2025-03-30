import { Schema, Types, model } from "mongoose";

const adminAccessTokenSchema = new Schema(
  {
    adminId: {
      type: Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    token: {
      type: String,
      //  required: [true, "token is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique referrals between two admins
adminAccessTokenSchema.index(
  {
    adminId: 1,
    token: 1,
  },
  { unique: true }
);

// Uncomment below code when development finished....
// adminAccessTokenSchema.index(
//   {
//     updatedAt: 1,
//   },
//   { expireAfterSeconds: 900 } //900 sec = 15 mins 
// ); 

export const AdminAccessToken = model("AdminAccessToken", adminAccessTokenSchema);
