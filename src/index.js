import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/db.js";

// config secrect (.env) file here
dotenv.config({
  path: "./.env",
});

// access port from secrect
const port = process.env.PORT || 4000;

// cheking whether db is working or not status
connectDB().then(() => {
  app.on("error", (error) => {
    console.log("MongoDB ERR:", error);
    throw error;
  });
});

// checking server status
app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
