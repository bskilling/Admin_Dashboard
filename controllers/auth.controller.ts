import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

const jwt = require("jsonwebtoken");

export const auth = CatchAsyncError(
  (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    if (token) {
      try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN);

        res.json({
          isLog: true,
        });
      } catch (error: any) {
        res.json({
          isLog: false,
        });
      }
    } else {
      res.json({
        isLog: false,
      });
    }
  }
);
