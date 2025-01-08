import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import Blog from "../models/blog.model";
import { FilterQuery } from "mongoose";
import userModel from "../models/user.model";

export const create = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");
      const newPost = new Blog({
        ...req.body,
        slug,
      });
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getBlogs = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const startIndex = parseInt(req.query.startIndex as string) || 0;
      const limit = parseInt(req.query.limit as string) || 9;
      const sortDirection = req.query.order === "asc" ? 1 : -1;

      // Refine the filter object with type assertion
      const filter: FilterQuery<any> = {
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.blogId && { _id: req.query.blogId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: "i" } },
            { content: { $regex: req.query.searchTerm, $options: "i" } },
          ],
        }),
      };

      const posts = await Blog.find(filter)
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

      const totalPosts = await Blog.countDocuments();

      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );

      const lastMonthPosts = await Blog.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });

      res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getBlogById = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blog = await Blog.findById(req.params.id);

      res.status(200).json({
        success: true,
        blog,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const editBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body.data;

      const blogId = req.params.id;

      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $set: data,
        },
        {
          new: true,
        }
      );

      res.status(201).json({
        success: true,
        updatedBlog,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const deleteBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const blog = await Blog.findById(id);

      if (!blog) {
        return next(new ErrorHandler("blog not found", 404));
      }

      await blog.deleteOne({ id });

      res.status(200).json({
        success: true,
        message: "blog deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
