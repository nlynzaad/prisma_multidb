import {runGenerate} from "prisma/utils/runGenerate";
import {updateModels} from "prisma/utils/updateModels";
import {isValidDBProvider} from "prisma/DBProvider";
import process from "node:process";

isValidDBProvider(process.env.DATABASE_PROVIDER);

const provider = process.env.DATABASE_PROVIDER;

await updateModels(provider);
await runGenerate(provider);

await updateModels(provider);
await runGenerate(provider);

await updateModels(provider);
await runGenerate(provider);
