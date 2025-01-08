import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.model";
import { createCourse } from "../services/course.service";

export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      createCourse(req, res, data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body.data;

      const courseId = req.params.id;

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        {
          new: true,
        }
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get single course
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await CourseModel.findOne({ url: req.params.id });

      if (course) {
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id);
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// length of courses
export const getCoursesLength = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseModel.find();

      const coursesLength = courses.length;

      res.status(200).json({
        success: true,
        coursesLength,
      });
    } catch (error) {}
  }
);

// get all courses
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query: any = {};
      let page = parseInt(req.query.page as string) || 1;
      const limit = 10;
      let skip = (page - 1) * limit;

      const { category, level, language, isPaid, mode } = req.query;

      if (category) {
        query.category = category;
      }
      if (level) {
        query.level = level;
      }
      if (language) {
        query.language = language;
      }
      // if (isPaid !== undefined) {
      //   query.isPaid = isPaid === "true"; // Convert to boolean
      // }
      // if (mode) {
      //   query.mode = mode;
      // }

      const courses = await CourseModel.find(query)
        .select(
          "-assessment -assessment_required -batch_sessions -description -duration -training_batches -training_metadata -training_status"
        )
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete course --only for admin
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const course = await CourseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      await course.deleteOne({ id });

      res.status(200).json({
        success: true,
        message: "course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getCourseTitle = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseModel.find().select(
        "-assessment -assessment_required -batch_sessions -description -duration -training_batches -training_metadata -training_status"
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
