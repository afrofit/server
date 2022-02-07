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
exports.verifyPasswordResetCodeRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../../entity/User");
const isReactivatable_1 = require("../../middleware/isReactivatable");
const status_codes_1 = require("../../util/status-codes");
const validate_responses_1 = require("../../util/validate-responses");
const router = express_1.default.Router();
exports.verifyPasswordResetCodeRouter = router;
router.put("/api/users/verify-password-reset-code", [isReactivatable_1.isReactivatable], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.returningUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    const { error } = (0, validate_responses_1.validateVerifyEmail)(req.body);
    if (error)
        return res.status(status_codes_1.STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    let user = yield User_1.User.findOne(req.returningUser.id);
    if (!user)
        return res.status(status_codes_1.STATUS_CODE.BAD_REQUEST).send("No such user.");
    if (req.body.code !== user.code)
        return res.status(status_codes_1.STATUS_CODE.BAD_REQUEST).send("Invalid Code.");
    try {
        user.isReactivated = true;
        user.code = 100000;
        yield user.save();
        const resetToken = user.generateResetToken();
        return res
            .status(status_codes_1.STATUS_CODE.OK)
            .header(process.env.CUSTOM_RESET_TOKEN_HEADER, resetToken)
            .send(resetToken);
    }
    catch (error) {
        console.error(error);
    }
}));
