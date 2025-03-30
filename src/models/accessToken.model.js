import { Schema, Types, model } from "mongoose";

const accessTokenSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
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

// Enforce unique referrals between two users
accessTokenSchema.index(
  {
    userId: 1,
    token: 1,
  },
  { unique: true }
);

// Uncomment below code when development finished....
// accessTokenSchema.index(
//   {
//     updatedAt: 1,
//   },
//   { expireAfterSeconds: 900 } //900 sec = 15 mins 
// ); 

export const AccessToken = model("AccessToken", accessTokenSchema);
