import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import { createConnection, Connection, getConnectionOptions } from "typeorm";

import { app } from "./app";

const start = async () => {
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
	await createConnection({ ...connectionOptions, type: "postgres" });
	console.log("Connected via TypeORM to Postgres Database!");
	app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}!`));
};

start().catch((error) => console.error(error));
