import { OMDB_API_KEY } from './config.js';

export const BASE_URL = 'https://www.omdbapi.com/';
export const PER_PAGE = 10;

const searchURL = (q, page = 1, type = '') => {
    const p = new URLSearchParams({ apikey: OMDB_API_KEY, s: q, page: String(page) });
    if (type) p.set('type', type);
    return `${BASE_URL}?${p.toString()}`;
};
const byIdURL = (id) =>
    `${BASE_URL}?${new URLSearchParams({ apikey: OMDB_API_KEY, i: id, plot: 'full' })}`;

export const fetchSearch = async (q, page, type) => {
    try {
        const res = await fetch(searchURL(q, page, type));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.Response === 'False') throw new Error(data.Error || 'Unknown error');
        return data; // { Search:[...], totalResults:"123" }
    } catch (err) { throw err; }
};

export const fetchById = async (id) => {
    try {
        const res = await fetch(byIdURL(id));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.Response === 'False') throw new Error(data.Error || 'Unknown error');
        return data;
    } catch (err) { throw err; }
};
