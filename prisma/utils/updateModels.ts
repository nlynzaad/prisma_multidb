import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import '../../env.js'
import type {DBProvider} from "../DBProvider";

export const updateModels = async (provider: DBProvider) => {
	const __fileName = url.fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__fileName);

	const modelPath = path.join(__dirname, '..', 'models');

	const outputPath = path.join(__dirname, '..', provider, 'models');

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

	const generatedPath = path.join(__dirname, '..', provider, 'generated');

//clear generated
	if(fs.existsSync(generatedPath)) {
		fs.rmSync(generatedPath, { recursive: true});
	}

	console.log(`Successfully applied models and cleared generated for provider: ${provider}`);
}

