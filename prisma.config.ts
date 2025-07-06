import {defineConfig} from "prisma/config";
import path from "node:path";
import "../env.js";

export default defineConfig({
	earlyAccess: true,
	schema: path.join('prisma', 'schema'),
})
