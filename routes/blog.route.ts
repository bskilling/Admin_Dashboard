import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  create,
  deleteBlog,
  editBlog,
  getBlogById,
  getBlogs,
} from "../controllers/blog.controller";

const blogRouter = express.Router();

blogRouter.post("/create-blog", isAuthenticated, create);

blogRouter.get("/get-blogs", getBlogs);

blogRouter.get("/get-blogs/:id", getBlogById);

blogRouter.delete("/delete-blog/:id", isAuthenticated, deleteBlog);

blogRouter.put("/edit-blog/:id", isAuthenticated, editBlog);

export default blogRouter;
