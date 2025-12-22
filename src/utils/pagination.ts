interface PrismaTxDummy {
  findMany: Function;
  count: Function;
  // Agrega aquí todos los métodos necesarios del cliente Prisma si fuera un módulo compartido
}

interface PrismaModel {
  findMany: (query: Record<string, any>, tx?: any) => Promise<any>;
  count: (query: Record<string, any>, tx?: any) => Promise<number>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function paginate<T>(
  model: PrismaModel,
  params: PaginationParams,
  query: Record<string, any> = {},
  tx?: any
): Promise<PaginationResult<T>> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;

  const skip = (page - 1) * limit;

  const where = query.where ?? {};

  const finalQuery = {
    skip,
    take: limit,
    ...query,
    where,
  };

  const [data, total] = await Promise.all([
    model.findMany(finalQuery, tx),
    model.count({ where }, tx),
  ]);

  return {
    items: data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
