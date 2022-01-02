module.exports = [
	{
		name: "default",
		type: "postgres",
		host: "127.0.0.1",
		port: 5432,
		username: "postgres",
		database: "afrofit",
		password: "0000",
		dropSchema: true,
		entities: ["src/entity/**/*.ts"],
		migrations: ["src/migration/**/*.ts"],
		subscribers: ["src/subscribers/**/*.ts"],
		synchronize: true,
		logging: false,
		migrationsRun: true,
		cli: {
			entitiesDir: "src/entity",
			migrationsDir: "src/migration",
			subscribersDir: "src/subscribers",
		},
	},
];
