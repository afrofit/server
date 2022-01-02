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
exports.loginRouter = void 0;
const argon2_1 = __importDefault(require("argon2"));
const express_1 = __importDefault(require("express"));
const User_1 = require("../../entity/User");
const validate_responses_1 = require("../../util/validate-responses");
const router = express_1.default.Router();
exports.loginRouter = router;
router.post("/api/users/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, validate_responses_1.validateLogin)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = yield User_1.User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send("Wrong Email/Password");
    const validPassword = yield argon2_1.default.verify(user.password, req.body.password);
    if (!validPassword)
        return res.status(400).send("Wrong Email/Password");
    const token = user.generateToken();
    return res.send(token);
}));
