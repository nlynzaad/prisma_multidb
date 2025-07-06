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

const schemaPath = path.join(configPath, 'schema.prisma');
const schemaOutputPath = path.join(outputPath, 'schema.prisma');

if (fs.existsSync(schemaPath)) {
	if(fs.existsSync(schemaOutputPath)) {
		fs.rmSync(schemaOutputPath);
	}

	fs.copyFileSync(schemaPath, schemaOutputPath);
}

const migrationsDir = path.join(configPath, 'migrations');
const migrationsOutputDir = path.join(outputPath, 'migrations');

if (fs.existsSync(migrationsDir)) {
	if(fs.existsSync(migrationsOutputDir)) {
		fs.rmSync(migrationsOutputDir, { recursive: true});
	}

	if (!fs.existsSync(migrationsOutputDir)) {
		fs.mkdirSync(migrationsOutputDir);
	}

	fs.cpSync(migrationsDir, migrationsOutputDir, {recursive: true});
}

const generatedDir = path.join(configPath, 'generated');
const generatedOutputDir = path.join(outputPath, 'generated');

if (fs.existsSync(generatedDir)) {
	if(fs.existsSync(generatedOutputDir)) {
		fs.rmSync(generatedOutputDir, { recursive: true});
	}

	if (!fs.existsSync(generatedDir)) {
		fs.mkdirSync(generatedDir);
	}

	fs.cpSync(generatedDir, generatedOutputDir, {recursive: true});
}

console.log(`Successfully applied configuration for provider: ${dbType}`);
