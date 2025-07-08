import type { DBProvider } from "prisma/DBProvider";
import * as child_process from "node:child_process";

export async function runMigration(args: string[], provider: DBProvider) {
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
