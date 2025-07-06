import "../env.js";
import getDBAdapter, { IsValidDBProvider } from "src/config/getDBAdapter";
import * as process from "node:process";
import { PrismaClient } from "prisma/schema/generated";

IsValidDBProvider(process.env.DATABASE_PROVIDER!);

const adapter = await getDBAdapter(process.env.DATABASE_PROVIDER);

const prisma = new PrismaClient({ adapter });

export default prisma;
