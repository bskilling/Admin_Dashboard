import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { upload, uploadFile } from "../controllers/aws.controller";

const awsRouter = express.Router();

awsRouter.post("/upload", isAuthenticated, upload);

awsRouter.post("/upload-file", isAuthenticated, uploadFile);

export default awsRouter;
