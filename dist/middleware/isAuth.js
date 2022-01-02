"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, res, next) => {
    const token = req.header(process.env.CUSTOM_TOKEN_HEADER);
    if (!token)
        return res.status(401).send("Provide Valid Token.");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        req.currentUser = decoded;
        next();
    }
    catch (error) {
        res.status(400).send("Invalid token provided.");
    }
};
exports.isAuth = isAuth;
