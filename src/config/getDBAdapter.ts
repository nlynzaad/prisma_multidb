import type { DBProvider } from "src/config/DBProvider";

export function IsValidDBProvider(
	provider: string,
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

export default async function getDBAdapter(provider: DBProvider) {
	switch (provider) {
		case "postgresql":
			const { PrismaPg } = await import("@prisma/adapter-pg");

			return new PrismaPg({ connectionString: process.env.DATABASE_URL! });
		case "mysql":
			const { PrismaMariaDb } = await import("@prisma/adapter-mariadb");

			return new PrismaMariaDb(process.env.DATABASE_URL!);
		case "sqlite":
			const { PrismaLibSQL } = await import("@prisma/adapter-libsql");

			return new PrismaLibSQL({
				url: `${process.env.DATABASE_URL!}`,
				authToken: `${process.env.DATABASE_AUTH_TOKEN!}`,
			});
		default:
			throw new Error(`Invalid database provider: ${provider}`);
	}
}
