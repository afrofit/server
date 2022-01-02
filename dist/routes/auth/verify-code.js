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
exports.verifyCodeRouter = void 0;
const express_1 = __importDefault(require("express"));
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const User_1 = require("../../entity/User");
const validate_responses_1 = require("../../util/validate-responses");
const router = express_1.default.Router();
exports.verifyCodeRouter = router;
router.put("/api/users/verify-code", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.currentUser)
        return res.status(403).send("Access Forbidden.");
    const { error } = (0, validate_responses_1.validateVerifyEmail)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = yield User_1.User.findOne(req.currentUser.id);
    if (!user)
        return res.status(400).send("No such user.");
    if (user.isVerified)
        return res.status(400).send("User already verified.");
    if (req.body.code !== user.code)
        return res.status(400).send("Invalid Code.");
    try {
        user.isVerified = true;
        user.code = 0;
        yield user.save();
        const token = user.generateToken();
        return res.header(process.env.CUSTOM_TOKEN_HEADER, token).send(token);
    }
    catch (error) {
        console.error(error);
    }
}));
