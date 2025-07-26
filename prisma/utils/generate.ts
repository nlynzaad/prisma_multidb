import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import {isValidDBProvider} from "prisma/DBProvider";
import {updateModels} from "prisma/utils/updateModels";
import type {DBProvider} from "prisma/DBProvider";

function copyDirectoryExcluding(srcDir:string, destDir:string, excludeList: Array<string>) {
	try {
		const items = fs.readdirSync(srcDir);

		for (const item of items) {
			const srcPath = path.join(srcDir, item);
			const destPath = path.join(destDir, item);

			// Check if the item should be excluded
			if (excludeList.includes(item)) {
				console.log(`Excluding: ${item}`);
				continue; // Skip this item
			}

			const stats = fs.statSync(srcPath);

			if (stats.isDirectory()) {
				// Recursively copy subdirectories
				copyDirectoryExcluding(srcPath, destPath, excludeList);
			} else {
				// Copy files
				fs.cpSync(srcPath, destPath);
			}
		}
		console.log(`Copy completed: ${srcDir} to ${destDir}`);
	} catch (err) {
		console.error('Error during copy:', err);
	}
}


async function prismaGenerate(provider: DBProvider) {
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

async function generate() {
	const __fileName = url.fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__fileName);
	const generatePath = path.join(__dirname, '..', 'generated');
	const schemasPath = path.join(__dirname, '..', 'schemas');

	const providers = fs.readdirSync(schemasPath);
	const commonPath = path.join(generatePath,'common');

	if(fs.existsSync(commonPath)) {
		fs.rmSync(commonPath, { recursive: true});
	}

	if (!fs.existsSync(commonPath)) {
		fs.mkdirSync(commonPath);
	}

//update models and generate clients
	for (const provider of providers) {
		isValidDBProvider(provider);

		await updateModels(provider);
		await prismaGenerate(provider);
	}

	//copy provider agnostic generated types and utilities
	copyDirectoryExcluding(path.join(generatePath, providers[0]), commonPath, ['internal','client.ts']);
}

await generate()
