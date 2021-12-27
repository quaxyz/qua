import prisma from "libs/prisma";

export async function getStorePaths() {
  const stores = await prisma.store.findMany({
    select: {
      name: true,
    },
  });

  return {
    paths: stores.map((store) => ({ params: { store: store.name as string } })),
    fallback: false,
  };
}
