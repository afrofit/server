"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCurrentUser = void 0;
const isCurrentUser = (req, res, next) => {
    if (!req.currentUser)
        return res.status(403).send("Access forbidden.");
    next();
};
exports.isCurrentUser = isCurrentUser;
