"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseTitle = exports.deleteCourse = exports.getAllCourses = exports.getCoursesLength = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const course_model_1 = __importDefault(require("../models/course.model"));
const course_service_1 = require("../services/course.service");
exports.uploadCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        (0, course_service_1.createCourse)(req, res, data);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.editCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body.data;
        const courseId = req.params.id;
        const course = yield course_model_1.default.findByIdAndUpdate(courseId, {
            $set: data,
        }, {
            new: true,
        });
        res.status(201).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// get single course
exports.getSingleCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield course_model_1.default.findById(req.params.id);
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// length of courses
exports.getCoursesLength = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield course_model_1.default.find();
        const coursesLength = courses.length;
        res.status(200).json({
            success: true,
            coursesLength,
        });
    }
    catch (error) { }
}));
// get all courses
exports.getAllCourses = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        let page = parseInt(req.query.page) || 1;
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
        const courses = yield course_model_1.default.find(query)
            .select("-assessment -assessment_required -batch_sessions -description -duration -training_batches -training_metadata -training_status")
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// delete course --only for admin
exports.deleteCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const course = yield course_model_1.default.findById(id);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        yield course.deleteOne({ id });
        res.status(200).json({
            success: true,
            message: "course deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.getCourseTitle = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield course_model_1.default.find().select("-assessment -assessment_required -batch_sessions -description -duration -training_batches -training_metadata -training_status");
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
