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
exports.resendVerifyCode = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../../entity/User");
const generate_code_1 = require("../../util/generate-code");
const validate_responses_1 = require("../../util/validate-responses");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const status_codes_1 = require("../../util/status-codes");
const router = express_1.default.Router();
exports.resendVerifyCode = router;
router.post("/api/users/resend-verify-code", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ email: req.body.email });
    if (!user)
        return res.status(status_codes_1.STATUS_CODE.UNAUTHORIZED).send("User does not exist.");
    const { error } = (0, validate_responses_1.validateEmailResetCode)(req.body);
    if (error)
        return res.status(status_codes_1.STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    const newCode = (0, generate_code_1.generateCode)();
    try {
        user.code = newCode;
        yield user.save();
        console.log("Resending Verify Email Code: ", user.code);
        /** Send Email to User Here */
        return res.status(status_codes_1.STATUS_CODE.OK).send({ success: true });
    }
    catch (error) {
        console.error(error);
    }
}));
