import { Response } from "express";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await userModel.findById(id);

  if (userJson) {
    res.status(201).json({
      success: true,
      userJson,
    });
  }
};
