import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

const AWS = require("aws-sdk");
require("dotenv").config();

export const upload = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || !files.length) {
        return next(new ErrorHandler("No file found", 400));
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

      const upload = await s3.upload(params).promise();

      res.status(201).json({ url: upload.Location });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const uploadFile = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || !files.length) {
        return next(new ErrorHandler("No file found", 400));
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

      const upload = await s3.upload(params).promise();

      res.status(201).json({ url: upload.Location });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
