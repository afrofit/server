"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReactivatable = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isReactivatable = (req, res, next) => {
    const resetToken = req.header(process.env.CUSTOM_RESET_TOKEN_HEADER);
    if (!resetToken)
        return res.status(401).send("Provide Valid Reset Token.");
    try {
        const decoded = jsonwebtoken_1.default.verify(resetToken, process.env.RESET_TOKEN_SECRET);
        req.returningUser = decoded;
        next();
    }
    catch (error) {
        res.status(400).send("Invalid Reset Token provided.");
    }
};
exports.isReactivatable = isReactivatable;
