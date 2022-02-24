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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserAuth = void 0;
const User_1 = require("../entity/User");
const checkUserAuth = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.currentUser)
        return null;
    const user = yield User_1.User.findOne({ id: req.currentUser.id });
    if (!user)
        return null;
    return user;
});
exports.checkUserAuth = checkUserAuth;
// return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
// return res
// 			.status(STATUS_CODE.UNAUTHORIZED)
// 			.send("Sorry. Something went wrong with this request.");
