import './style.css';
import { fetchSearch, PER_PAGE } from './api.js';
import { state, resetState } from './state.js';
import { refs, notify, toggleLoader, renderItems, clearGallery, setLoadMoreVisible } from './ui.js';
import { canLoadMore } from './utils.js';

// Всі обробники — async + try/catch
const onSearch = async () => {
  try {
    const q = refs.input.value.trim();
    const type = refs.type.value;
    if (!q) { notify('Введіть ключове слово', 'Поле пошуку порожнє'); return; }

    const isNew = q !== state.query || type !== state.type;
    if (isNew) {
      state.query = q; state.type = type; resetState(); clearGallery();
    }
    await loadNextPage();
  } catch (err) {
    notify('Помилка пошуку', String(err.message || err), 'error');
  }
};

const loadNextPage = async () => {
  if (state.isLoading) return;
  state.isLoading = true; toggleLoader(true);
  try {
    const data = await fetchSearch(state.query, state.page, state.type);
    const { Search = [], totalResults = '0' } = data || {};

    if (state.page === 1) {
      state.totalResults = Number(totalResults) || 0;
      if (state.totalResults === 0) {
        notify('Нічого не знайдено', 'Спробуйте інший запит');
        setLoadMoreVisible(false);
        return;
      }
      notify('Готово!', `Знайдено ${state.totalResults} результатів`);
    }

    renderItems(Search);
    state.loaded += Search.length;
    state.page += 1;

    setLoadMoreVisible(canLoadMore(state.loaded, state.totalResults, PER_PAGE));
    if (state.loaded >= state.totalResults) notify('Це всі результати', 'Більше немає');
  } catch (err) {
    notify('Не вдалося завантажити', String(err.message || err), 'error');
  } finally {
    state.isLoading = false; toggleLoader(false);
  }
};

// Події
refs.form.addEventListener('submit', async (e) => { e.preventDefault(); try { await onSearch(); } catch { } });
refs.searchBtn.addEventListener('click', async () => { try { await onSearch(); } catch { } });
refs.loadMore.addEventListener('click', async () => { try { await loadNextPage(); } catch { } });
refs.input.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') { e.preventDefault(); try { await onSearch(); } catch { } }
});
