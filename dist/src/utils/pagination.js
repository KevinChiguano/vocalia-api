export async function paginate(model, params, query = {}, tx) {
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
