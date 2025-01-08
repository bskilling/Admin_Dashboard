"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const course_controller_1 = require("../controllers/course.controller");
const courseRouter = express_1.default.Router();
courseRouter.post("/create-course", auth_1.isAuthenticated, course_controller_1.uploadCourse);
courseRouter.put("/edit-course/:id", auth_1.isAuthenticated, course_controller_1.editCourse);
// courseRouter.put("/edit-course/:id", isAuthenticated, editCourse);
courseRouter.get("/get-course/:id", auth_1.isAuthenticated, course_controller_1.getSingleCourse);
courseRouter.get("/get-courses", auth_1.isAuthenticated, course_controller_1.getAllCourses);
courseRouter.delete("/delete-course/:id", auth_1.isAuthenticated, course_controller_1.deleteCourse);
courseRouter.get("/get-course-title", auth_1.isAuthenticated, course_controller_1.getCourseTitle);
courseRouter.get("/getCoursesLength", auth_1.isAuthenticated, course_controller_1.getCoursesLength);
exports.default = courseRouter;
