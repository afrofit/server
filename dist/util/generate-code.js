"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCode = void 0;
const random_1 = __importDefault(require("random"));
const min = 100001;
const max = 999999;
const generateCode = (min = 100000, max = 999999) => {
    return random_1.default.int(min, max);
};
exports.generateCode = generateCode;
