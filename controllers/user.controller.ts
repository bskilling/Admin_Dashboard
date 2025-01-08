require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { sendToken } from "../utils/jwt";
import crypto from "crypto"

// register user
interface IRegistrationBody {
  email: string;
  password: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const isEmailExits = await userModel.findOne({ email });
      if (isEmailExits) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user: IRegistrationBody = {
        email,
        password,
      };

      await userModel.create({
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

const CRYPTO_KEY = process.env.CLIENT_ID;
const CRYPTO_IV= process.env.SECRET_KEY;

export const authorisation =CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {token} = req.query

      console.log(token);

      const encodedDataBuffer = Buffer.from(token as string, "base64");
      const key = Buffer.from(CRYPTO_KEY as string, "base64");
      const iv = Buffer.from(CRYPTO_IV as string, "base64");
      const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
      const decryptedChunks = [];
      decryptedChunks.push(decipher.update(encodedDataBuffer));
      decryptedChunks.push(decipher.final());
      const decryptedData = Buffer.concat(decryptedChunks).toString("utf-8");
      return decryptedData;
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
)

// Logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      res.status(200).json({
        success: true,
        messge: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
