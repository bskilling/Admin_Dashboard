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
exports.uploadFile = exports.upload = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const AWS = require("aws-sdk");
require("dotenv").config();
exports.upload = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        if (!files || !files.length) {
            return next(new ErrorHandler_1.default("No file found", 400));
        }
        const file = files[0];
        const s3 = new AWS.S3({
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
            region: process.env.S3_REGION,
        });
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `images/${Date.now()}_${file.originalname}`,
            Body: file.buffer,
        };
        const upload = yield s3.upload(params).promise();
        res.status(201).json({ url: upload.Location });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.uploadFile = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        if (!files || !files.length) {
            return next(new ErrorHandler_1.default("No file found", 400));
        }
        const file = files[0];
        const s3 = new AWS.S3({
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
            region: process.env.S3_REGION,
        });
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `files/${Date.now()}_${file.originalname}`,
            Body: file.buffer,
        };
        const upload = yield s3.upload(params).promise();
        res.status(201).json({ url: upload.Location });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
