/** @format */

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRouter from "../backend/routes/userRoute.js";
import authRouter from "../backend/routes/authRoute.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.listen(8000, () => {
  console.log("Server is listening on 8000");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
