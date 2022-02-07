"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("@sanity/client"));
const client = (0, client_1.default)({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: process.env.SANITY_API_VERSION,
    token: process.env.SANITY_AUTH_TOKEN,
    useCdn: true,
});
exports.default = client;
