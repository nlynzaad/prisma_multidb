import '../env';
import process from "node:process";
import {updateModels} from "prisma/utils/updateModels";
import {runMigration} from "prisma/utils/runMigration";
import {isValidDBProvider} from "prisma/DBProvider";

const args = process.argv.slice(2);

isValidDBProvider(process.env.DATABASE_PROVIDER);

await updateModels(process.env.DATABASE_PROVIDER);

await runMigration(args, process.env.DATABASE_PROVIDER)
