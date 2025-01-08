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
exports.deleteBlog = exports.editBlog = exports.getBlogById = exports.getBlogs = exports.create = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const blog_model_1 = __importDefault(require("../models/blog.model"));
exports.create = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.body.title
            .split(" ")
            .join("-")
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, "");
        const newPost = new blog_model_1.default(Object.assign(Object.assign({}, req.body), { slug }));
        const savedPost = yield newPost.save();
        res.status(201).json(savedPost);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.getBlogs = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        // Refine the filter object with type assertion
        const filter = Object.assign(Object.assign(Object.assign(Object.assign({}, (req.query.userId && { userId: req.query.userId })), (req.query.slug && { slug: req.query.slug })), (req.query.blogId && { _id: req.query.blogId })), (req.query.searchTerm && {
            $or: [
                { title: { $regex: req.query.searchTerm, $options: "i" } },
                { content: { $regex: req.query.searchTerm, $options: "i" } },
            ],
        }));
        const posts = yield blog_model_1.default.find(filter)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        const totalPosts = yield blog_model_1.default.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthPosts = yield blog_model_1.default.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.getBlogById = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield blog_model_1.default.findById(req.params.id);
        res.status(200).json({
            success: true,
            blog,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.editBlog = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body.data;
        const blogId = req.params.id;
        const updatedBlog = yield blog_model_1.default.findByIdAndUpdate(blogId, {
            $set: data,
        }, {
            new: true,
        });
        res.status(201).json({
            success: true,
            updatedBlog,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.deleteBlog = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blog = yield blog_model_1.default.findById(id);
        if (!blog) {
            return next(new ErrorHandler_1.default("blog not found", 404));
        }
        yield blog.deleteOne({ id });
        res.status(200).json({
            success: true,
            message: "blog deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
