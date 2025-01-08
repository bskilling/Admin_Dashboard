import express from "express";
import {
  authorisation,
  loginUser,
  logoutUser,
  registrationUser,
} from "../controllers/user.controller";
import { auth } from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);    
//hjhjhj

userRouter.post("/login", loginUser);

userRouter.post("/auth", auth);

userRouter.get("/logout", isAuthenticated, logoutUser);


userRouter.post("/authorisation",authorisation)

export default userRouter;
