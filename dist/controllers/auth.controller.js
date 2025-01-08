"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
exports.auth = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => {
    const { token } = req.body;
    if (token) {
        try {
            const decode = jwt.verify(token, process.env.ACCESS_TOKEN);
            res.json({
                isLog: true,
            });
        }
        catch (error) {
            res.json({
                isLog: false,
            });
        }
    }
    else {
        res.json({
            isLog: false,
        });
    }
});
