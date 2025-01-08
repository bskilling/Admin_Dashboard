"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const blog_controller_1 = require("../controllers/blog.controller");
const blogRouter = express_1.default.Router();
blogRouter.post("/create-blog", auth_1.isAuthenticated, blog_controller_1.create);
blogRouter.get("/get-blogs", blog_controller_1.getBlogs);
blogRouter.get("/get-blogs/:id", blog_controller_1.getBlogById);
blogRouter.delete("/delete-blog/:id", auth_1.isAuthenticated, blog_controller_1.deleteBlog);
blogRouter.put("/edit-blog/:id", auth_1.isAuthenticated, blog_controller_1.editBlog);
exports.default = blogRouter;
