/** @format */

import UserModel from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const createUser = async (req, res) => {};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your account!"));
  }
  try {
    if (req.body.password) {
      req.body.hashedPassword = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.hashedPassword,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { hashedPassword, ...theRestInfo } = updatedUser._doc;
    res.status(200).json(theRestInfo);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    if (req.user.id !== userId) {
      return next(errorHandler(401, "You can delete only your account!"));
    }

    await UserModel.findByIdAndDelete(userId);
    res.status(200).json({ message: "User has been deleted." });
  } catch (error) {
    next(error);
  }
};
