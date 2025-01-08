"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const aws_controller_1 = require("../controllers/aws.controller");
const awsRouter = express_1.default.Router();
awsRouter.post("/upload", auth_1.isAuthenticated, aws_controller_1.upload);
awsRouter.post("/upload-file", auth_1.isAuthenticated, aws_controller_1.uploadFile);
exports.default = awsRouter;
