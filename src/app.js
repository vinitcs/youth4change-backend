import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Create/ Initialize the server app
const app = express();

// Defining the cors options (Change it to origin callback func as for connecting it with mobile app)
const corsOptions = {
  // eslint-disable-next-line no-undef
  origin: process.env.CORS_ORIGIN,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

// Allowing secific to access the server
app.use(cors(corsOptions));

/*
  It is the process of converting a JSON string to a JSON object for data manipulation,
  limit use to set how much request will come 
*/
app.use(express.json({ limit: "16kb" }));

app.use(urlencoded({ extended: true, limit: "16kb" }));
// optional extended:true for now => deals nested objects

// Serve the entire "public" directory at the root path
app.use(express.static("public"));
// use to keep assests, favicon and so on

// Serve only the "uploads" directory under "/uploads"
app.use("/uploads", express.static("public/uploads"));

app.use(cookieParser());
// used to perform crud operations on cookie data

// import routes

// User
import verificationRouter from "./routes/verificationRoutes/verification.routes.js";
import userRouter from "./routes/userRoutes/user.routes.js";
import postRouter from "./routes/postRoutes/post.routes.js";
import galleryRouter from "./routes/galleryRoutes/gallery.routes.js";
import notificationRouter from "./routes/notificationRoutes/notification.routes.js";
import reportRouter from "./routes/reportRoutes/report.routes.js";
import stageRouter from "./routes/stageRoutes/stage.routes.js";

app.use("/api/v1/verification", verificationRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/gallery", galleryRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/report", reportRouter);
app.use("/api/v1/stage", stageRouter);

//
//
//

// Admin
import adminRouter from "./routes/adminRoutes/admin.routes.js";
app.use("/api/v1/admin", adminRouter);

export { app };
