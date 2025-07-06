import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

import '../../env.js'

const __fileName = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

// Determine the target database type from an environment variable
const dbType = process.env.DATABASE_PROVIDER; // e.g., "postgresql" or "sqlite"

if (!dbType) {
	console.error(
		"Error: DATABASE_PROVIDER environment variable not set. Please set it to 'postgresql', 'mysql' or 'sqlite'."
	);
	process.exit(1);
}

const configPath = path.join(__dirname, dbType);
const outputPath = path.join(__dirname, "../schema");

if (!fs.existsSync(configPath)) {
	fs.mkdirSync(configPath);
}

const migrationsDir = path.join(configPath, 'migrations');
const migrationsOutputDir = path.join(outputPath, 'migrations');

if (fs.existsSync(migrationsOutputDir)) {
	if(fs.existsSync(migrationsDir)) {
		fs.rmSync(migrationsDir, {recursive: true});
	}

	if (!fs.existsSync(migrationsDir)) {
		fs.mkdirSync(migrationsDir);
	}

	fs.cpSync(migrationsOutputDir, migrationsDir, {recursive: true});

	if(fs.existsSync(migrationsOutputDir)) {
		fs.rmSync(migrationsOutputDir, {recursive: true});
	}
}

const generatedDir = path.join(configPath, 'generated');
const generatedOutputDir = path.join(outputPath, 'generated');

if (fs.existsSync(generatedOutputDir)) {
	if(fs.existsSync(generatedDir)) {
		fs.rmSync(generatedDir, {recursive: true});
	}

	if (!fs.existsSync(generatedDir)) {
		fs.mkdirSync(generatedDir);
	}

	fs.cpSync(generatedOutputDir, generatedDir, {recursive: true});

	if(fs.existsSync(generatedOutputDir)) {
		fs.rmSync(generatedOutputDir, {recursive: true});
	}
}

console.log(`Successfully saved provider configuration for provider: ${dbType}`);
