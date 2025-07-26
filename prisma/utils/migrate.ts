import '../../env';
import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import url from "node:url";
import {isValidDBProvider} from "prisma/DBProvider";
import {updateModels} from "prisma/utils/updateModels";
import type {DBProvider} from "prisma/DBProvider";

async function prismaMigrate(args: string[], provider: DBProvider) {
	try {
		if (args.length === 0) {
			throw new Error("No arguments provided");
		}

		await new Promise((resolve, reject) => {
			const process = child_process.exec(
				`DATABASE_PROVIDER=${provider} pnpm prisma migrate ${args.join(' ')}`, {maxBuffer: 1024 * 1024}
			);

			process.stdout?.on("data", (chunk) => console.log(chunk));
			process.stderr?.on("data", (chunk) => console.error(chunk));

			process.on("close", (code) =>
				code != 0 ? reject(process.stderr) : resolve(process.stdout),
			);
		});
	} catch (error) {
		console.error(error);
	}
}

async function migrate() {
	const args = process.argv.slice(2);

	if (args.includes('dev')) {
		const __fileName = url.fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__fileName);
		const schemasPath = path.join(__dirname, '..', 'schemas');

		const providers = fs.readdirSync(schemasPath);

		//update models and generate clients
		for (const provider of providers) {
			isValidDBProvider(provider);

			await updateModels(provider)
			await prismaMigrate(args, provider);
		}
	}
	else {
		isValidDBProvider(process.env.DATABASE_PROVIDER);

		await updateModels(process.env.DATABASE_PROVIDER);

		await prismaMigrate(args, process.env.DATABASE_PROVIDER)
	}
}

await migrate();
