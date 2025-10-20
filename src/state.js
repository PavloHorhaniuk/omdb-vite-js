export const state = {
    query: '',
    type: '',   // movie | series | episode | game | ''
    page: 1,
    totalResults: 0,
    loaded: 0,
    isLoading: false,
};
export const resetState = () => {
    state.page = 1;
    state.totalResults = 0;
    state.loaded = 0;
};
