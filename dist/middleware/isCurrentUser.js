"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCurrentUser = void 0;
const status_codes_1 = require("../util/status-codes");
const isCurrentUser = (req, res, next) => {
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access forbidden.");
    next();
};
exports.isCurrentUser = isCurrentUser;
