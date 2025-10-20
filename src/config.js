// Ключ беремо з Vite env
export const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
if (!OMDB_API_KEY) console.warn('OMDb API key is missing. Set VITE_OMDB_API_KEY in .env');
