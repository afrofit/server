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
const create_weekly_leaderboard_1 = require("./controllers/create-weekly-leaderboard");
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    //Check if necessary env vars are set
    const PORT = process.env.PORT || 4000;
    // Make sure to set up pro config later...
    const connectionOptions = {
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
        dropSchema: process.env.NODE_ENV === "development" ? true : false,
    };
    // console.log("NODE_ENV", process.env.NODE_ENV);
    yield (0, typeorm_1.createConnection)(Object.assign(Object.assign({}, connectionOptions), { type: "postgres" }));
    console.log("Connected via TypeORM to Postgres Database!");
    app_1.app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}!`));
    const job = new cron_1.CronJob("1 * * * * *", function () {
        (0, create_weekly_leaderboard_1.createWeeklyLeaderboard)();
        // console.log(
        // 	"Job has started at " + new Date().getTime(),
        // 	null,
        // 	true,
        // 	"America/Los Angeles"
        // );
    });
    job.start();
});
start().catch((error) => console.error(error));
