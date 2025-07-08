import '../env';
import process from "node:process";
import {updateModels} from "prisma/utils/updateModels";
import {runMigration} from "prisma/utils/runMigration";

const args = process.argv.slice(2);

await updateModels('mysql')
await runMigration(args, 'mysql');

await updateModels('postgresql');
await runMigration(args, 'postgresql');

await updateModels('sqlite');
await runMigration(args, 'sqlite');


