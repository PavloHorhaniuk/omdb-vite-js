export const canLoadMore = (loaded, total, perPage) =>
    loaded < total && loaded % perPage === 0;
