import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    // const connectionInstance =
    
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    // To check the serverHost
    
    // console.log(
    //   `\nMongoDB connect! DB Host: ${connectionInstance.connection.host}`
    // ); 
  } catch (error) {
    console.error("MONGODB connect error", error);
    process.exit(1);
    // Note: process.exit(1) force the process to exit as quickly as possible even if there are still asynchronous operations pending that have not yet completed fully, including I/O operations
  }
};

export default connectDB;
