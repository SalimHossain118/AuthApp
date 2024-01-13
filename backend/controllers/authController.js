/** @format */

import UserModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "./../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await UserModel.findOne({ email: email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Something wrong"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SCRET);
    const { password: hashedPassword, ...theRestUserInfo } = validUser._doc;
    const expirDays = new Date(Date.now() + 3600000); // for 1 hour
    res
      .cookie("access_token", token, { httpOnly: true, expires: expirDays })
      .status(200)
      .json(theRestUserInfo);
  } catch (error) {
    next(error);
  }
};
