import {defineConfig} from "prisma/config";
import path from "node:path";
import "../env.js";
import {isValidDBProvider} from "./prisma/DBProvider";
import * as process from "node:process";

isValidDBProvider(process.env.DATABASE_PROVIDER)

export default defineConfig({
	earlyAccess: true,
	schema: path.join('prisma', 'schemas', process.env.DATABASE_PROVIDER),
	migrations: {
		path: path.join('prisma', 'migrations', process.env.DATABASE_PROVIDER)
	},
})
