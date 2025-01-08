import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  deleteCourse,
  editCourse,
  getAllCourses,
  getSingleCourse,
  uploadCourse,
  getCourseTitle,
  getCoursesLength,
} from "../controllers/course.controller";
const courseRouter = express.Router();

courseRouter.post("/create-course", isAuthenticated, uploadCourse);

courseRouter.put("/edit-course/:id", isAuthenticated, editCourse);

// courseRouter.put("/edit-course/:id", isAuthenticated, editCourse);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.delete("/delete-course/:id", isAuthenticated, deleteCourse);

courseRouter.get("/get-course-title", getCourseTitle);

courseRouter.get("/getCoursesLength", getCoursesLength);

export default courseRouter;
