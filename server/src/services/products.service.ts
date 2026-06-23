import { prisma } from "../lib/prisma";
import { decodeCursor, encodeCursor } from "../utils/cursor";

interface GetProductsParams {
  limit: number;
  category?: string;
  cursor?: string;
}

export async function getProducts({
  limit,
  category,
  cursor,
}: GetProductsParams) {
  let whereClause = {};

  if (category) {
    whereClause = {
      category: {
        equals: category,
        mode: "insensitive" as const,
      },
    };
  }

  if (cursor) {
    const decoded = decodeCursor(cursor);

    whereClause = {
      ...whereClause,

      OR: [
        {
          createdAt: {
            lt: new Date(decoded.createdAt),
          },
        },
        {
          AND: [
            {
              createdAt: new Date(decoded.createdAt),
            },
            {
              id: {
                lt: BigInt(decoded.id),
              },
            },
          ],
        },
      ],
    };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
  });

  const hasMore = products.length > limit;

  let nextCursor = null;

  if (hasMore) {
    const nextItem = products[limit - 1];

    nextCursor = encodeCursor({
      createdAt: nextItem.createdAt.toISOString(),
      id: nextItem.id.toString(),
    });
  }

  const results = hasMore ? products.slice(0, limit) : products;

  return {
    products: results,
    nextCursor,
    hasMore,
  };
}
