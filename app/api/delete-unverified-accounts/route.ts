import prisma from "lib/prisma";

export async function POST() {
  const users = await prisma.user.findMany({ where: { verifiedEmail: false } });
  if (users && users.length > 0) {
  }
}
