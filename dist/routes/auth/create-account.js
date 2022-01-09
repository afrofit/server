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
exports.createAccountRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../../entity/User");
const UserActivityToday_1 = require("../../entity/UserActivityToday");
const UserPerformance_1 = require("../../entity/UserPerformance");
const generate_code_1 = require("../../util/generate-code");
const validate_responses_1 = require("../../util/validate-responses");
const router = express_1.default.Router();
exports.createAccountRouter = router;
router.post("/api/users/create-account", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, validate_responses_1.validateCreateAccount)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = yield User_1.User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send("Sorry! Email Already Registered.");
    let userWithUsername = yield User_1.User.findOne({ username: req.body.username });
    if (userWithUsername)
        return res.status(400).send("Sorry! Username Already Taken.");
    //Generate Verification Code
    const verificationCode = (0, generate_code_1.generateCode)();
    try {
        user = yield User_1.User.create({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
            isPremium: false,
            isRegistered: true,
            code: verificationCode,
            rankId: 1,
        }).save();
        const performance = yield UserPerformance_1.UserPerformance.create({
            totalBodyMoves: 0,
            totalDaysActive: 0,
            totalHoursDanced: 0,
            totalCaloriesBurned: 0,
            user,
        }).save();
        const activity = yield UserActivityToday_1.UserActivityToday.create({
            caloriesBurned: 0,
            bodyMoves: 0,
            user,
        }).save();
        if (!performance || !activity)
            console.error("Could not create a subscription!");
        console.log("Create Account Code: ", user.code);
        //Send verification email at this point
        const token = user.generateToken();
        return res.header(process.env.CUSTOM_TOKEN_HEADER, token).send(token);
    }
    catch (error) {
        console.error(error);
    }
    return res.send({});
}));
