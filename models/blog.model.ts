import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    banner: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
