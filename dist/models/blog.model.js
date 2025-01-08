"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blogSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
const Blog = mongoose_1.default.model("Blog", blogSchema);
exports.default = Blog;
