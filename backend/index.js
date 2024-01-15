/** @format */

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
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

//=> path
const __dirname = path.resolve();

const app = express();

//=>
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
//=>
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

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
