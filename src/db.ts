import {getPrismaClient} from "prisma/DBProvider";

const prisma = await getPrismaClient();

export default prisma;
