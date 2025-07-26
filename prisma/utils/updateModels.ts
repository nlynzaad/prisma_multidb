import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import type {DBProvider} from "../DBProvider";

export const updateModels = async (provider: DBProvider) => {
	const __fileName = url.fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__fileName);

	const modelPath = path.join(__dirname, '..', 'models');

	const outputPath = path.join(__dirname, '..', 'schemas', provider, 'models');

	//copy models
	if (fs.existsSync(modelPath)) {
		if(fs.existsSync(outputPath)) {
			fs.rmSync(outputPath, { recursive: true});
		}

		if (!fs.existsSync(outputPath)) {
			fs.mkdirSync(outputPath);
		}

		fs.cpSync(modelPath, outputPath, {recursive: true});
	}

	console.log(`Successfully applied models for provider: ${provider}`);
}

