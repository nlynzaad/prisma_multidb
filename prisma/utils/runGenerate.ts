import {type DBProvider, isValidDBProvider} from "prisma/DBProvider";
import * as child_process from "node:child_process";

export async function runGenerate(provider: DBProvider) {
	try {
		await new Promise((resolve, reject) => {
			const process = child_process.exec(
				`DATABASE_PROVIDER=${provider} pnpm prisma generate`
			);

			process.stdout?.on('data', (chunk) => console.log(chunk));
			process.stderr?.on('data', (chunk) => console.error(chunk));

			process.on('close', (code) =>
				code != 0 ? reject(process.stderr) : resolve(process.stdout)
			);
		});
	} catch (error) {
		console.error(error);
	}
}
