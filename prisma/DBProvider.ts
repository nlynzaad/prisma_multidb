import '../env.js'
import process from "node:process";
import type {PrismaClient as SqlitePrismaClient} from './generated/sqlite/client'
import type {PrismaClient as MysqlPrismaClient} from './generated/mysql/client'
import type {PrismaClient as PostgreSqlPrismaClient} from './generated/postgresql/client'

type PrismaClient<T extends DBProvider = DBProvider> = T extends 'mysql' ? MysqlPrismaClient : T extends 'postgresql' ? PostgreSqlPrismaClient : SqlitePrismaClient;

export const dbProviders = ['mysql','postgresql','sqlite'] as const

export type DBProvider = typeof dbProviders[number]

export function isValidDBProvider(
	provider: string | undefined,
): asserts provider is DBProvider {
	switch (provider) {
		case "postgresql":
			return;
		case "mysql":
			return;
		case "sqlite":
			return;
		default:
			throw new Error(`Invalid database provider: ${provider}`);
	}
}

export async function getPrismaAdapter() {
	const provider = process.env.DATABASE_ADAPTER;

	isValidDBProvider(provider);

	switch (provider) {
		case "postgresql":
			const {PrismaPg} = await import("@prisma/adapter-pg");

			return new PrismaPg({connectionString: process.env.DATABASE_URL!});
		case "mysql":
			const {PrismaMariaDb} = await import("@prisma/adapter-mariadb");

			return new PrismaMariaDb(process.env.DATABASE_URL!);
		case "sqlite":
			const {PrismaLibSQL} = await import("@prisma/adapter-libsql");

			return new PrismaLibSQL({
				url: `${process.env.DATABASE_URL!}`,
				authToken: `${process.env.DATABASE_AUTH_TOKEN!}`,
			});
		default:
			throw new Error(`Invalid database provider: ${provider}`);
	}
}

export const getPrismaClient = async (): Promise<PrismaClient> => {
	const adapter = await getPrismaAdapter();

	const provider = process.env.DATABASE_ADAPTER;

	isValidDBProvider(provider);

	const {PrismaClient} = await import(`./generated/${provider}/client`);

	return new PrismaClient({adapter})
};
