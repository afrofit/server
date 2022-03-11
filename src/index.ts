import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import { createConnection, Connection, getConnectionOptions } from "typeorm";
import { CronJob } from "cron";

import { app } from "./app";
import { createWeeklyLeaderboard } from "./controllers/weekly-leaderboard";

const start = async () => {
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
	} else if (process.env.NODE_ENV === "production") {
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
	await createConnection({ ...connectionOptions, type: "postgres" });
	console.log("Connected via TypeORM to Postgres Database!");
	app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}!`));
	const job = new CronJob("1 * * * * *", function () {
		createWeeklyLeaderboard();
	});
	job.start();
};

start().catch((error) => console.error(error));
