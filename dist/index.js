"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require("reflect-metadata");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + "/.env" });
const typeorm_1 = require("typeorm");
const cron_1 = require("cron");
const app_1 = require("./app");
const weekly_leaderboard_1 = require("./controllers/weekly-leaderboard");
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    //Check if necessary env vars are set
    /*
    if (!process.env.FORGOT_PASSWORD_PREFIX)
    throw new Error("Forgot Password Prefix must be set");
  if (!process.env.TOKEN_SECRET) throw new Error("Token secret must be set");
  if (!process.env.RESET_TOKEN_SECRET)
    throw new Error("Reset token secret must be set");
  if (!process.env.CUSTOM_TOKEN_HEADER)
    throw new Error("Token header name must be set");
  if (!process.env.SANITY_AUTH_TOKEN && !process.env.SANITY_AUTH_TOKEN_NAME)
    throw new Error("Sanity Details name must be set");
  if (!process.env.EMAIL_PASSWORD || !process.env.EMAIL_USER)
    throw new Error("Email Password name must be set");
  if (
    !process.env.CLOUDINARY_APIKEY ||
    !process.env.CLOUDINARY_SECRET ||
    !process.env.CLOUDINARY_CLOUDNAME ||
    !process.env.CLOUDINARY_URL
  )
    throw new Error("Cloudinary details must be set");
*/
    const PORT = process.env.PORT || 4000;
    let connectionOptions;
    if (process.env.NODE_ENV === "development") {
        connectionOptions = {
            name: "default",
            username: "postgres",
            type: "postgres",
            port: 5432,
            database: "afrofit",
            password: "0000",
            entities: ["dist/entity/**/*.js"],
            migrations: ["dist/migration/**/*.js"],
            subscribers: ["dist/subscribers/**/*.js"],
            synchronize: true,
            logging: false,
            migrationsRun: true,
            cli: {
                entitiesDir: "dist/entity",
                migrationsDir: "dist/migration",
                subscribersDir: "dist/subscribers",
            },
            dropSchema: true,
        };
    }
    else if (process.env.NODE_ENV === "production") {
        connectionOptions = {
            // name: "default",
            username: process.env.PG_USER,
            type: "postgres",
            // port: 5432,
            database: process.env.PG_DATABASE,
            password: process.env.PG_PASSWORD,
            entities: ["dist/entity/**/*.js"],
            migrations: ["dist/migration/**/*.js"],
            subscribers: ["dist/subscribers/**/*.js"],
            synchronize: true,
            logging: false,
            migrationsRun: true,
            cli: {
                entitiesDir: "dist/entity",
                migrationsDir: "dist/migration",
                subscribersDir: "dist/subscribers",
            },
            url: process.env.DATABASE_URL,
            dropSchema: true,
            // extra: {
            // 	ssl: {
            // 		rejectUnauthorized: false,
            // 	},
            // },
        };
    }
    console.log("Connection Options", connectionOptions);
    yield (0, typeorm_1.createConnection)(Object.assign(Object.assign({}, connectionOptions), { type: "postgres" }));
    console.log("Connected via TypeORM to Postgres Database!");
    app_1.app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}!`));
    const job = new cron_1.CronJob("1 * * * * *", function () {
        (0, weekly_leaderboard_1.createWeeklyLeaderboard)();
    });
    job.start();
});
start().catch((error) => console.error(error));
