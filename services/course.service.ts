import { NextFunction, Request, Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import userModel from "../models/user.model";

// create a new Course
export const createCourse = CatchAsyncError(
  async (req: Request, res: Response, data: any) => {
    const course = await CourseModel.create(data);

    // const user = await userModel.findById(req.user?._id);
    // user?.courses.push(course?._id);
    // await user?.save();

    res.status(201).json({
      success: true,
      course,
    });
  }
);
