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
}; // end
export const google = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    console.log("Email:", req.body.email);
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SCRET);
      const { password: hashedPassword, ...therest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(therest);
    } else {
      const geraratedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(geraratedPassword, 10);

      const newUser = new UserModel({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SCRET);
      const { password: hashedPassword2, ...theRestUserInfo } = newUser._doc;
      const expirDays = new Date(Date.now() + 3600000); // for 1 hour
      res
        .cookie("access_token", token, { httpOnly: true, expires: expirDays })
        .status(200)
        .json(theRestUserInfo);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie("access_token").status(200).json("Signout success!");
};
