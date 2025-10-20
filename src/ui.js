import { fetchById } from './api.js';

// basicLightbox
import 'basiclightbox/dist/basicLightbox.min.css';
import * as basicLightbox from 'basiclightbox';

// PNotify
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { alert as pnotifyAlert, defaultModules } from '@pnotify/core';
import * as PNotifyMobile from '@pnotify/mobile';
defaultModules.set(PNotifyMobile, {});

export const refs = {
    form: document.getElementById('search-form'),
    input: document.getElementById('query'),
    type: document.getElementById('type'),
    searchBtn: document.getElementById('search-btn'),
    gallery: document.getElementById('gallery'),
    loadMore: document.getElementById('load-more'),
    loader: document.getElementById('loader'),
};

export const notify = (title, text = '', type = 'info') => {
    try { pnotifyAlert({ title, text, type, delay: 1800, styling: 'brighttheme' }); }
    catch { console[type === 'error' ? 'error' : 'log'](title + (text ? ` — ${text}` : '')); }
};

export const toggleLoader = (show) => refs.loader.classList.toggle('active', !!show);

export const renderItems = (items = []) => {
    const frag = document.createDocumentFragment();
    items.forEach(item => frag.appendChild(createCard(item)));
    refs.gallery.appendChild(frag);

    const scrollTarget = refs.gallery.lastElementChild;
    if (scrollTarget) scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'end' });
};

export const clearGallery = () => { refs.gallery.innerHTML = ''; };
export const setLoadMoreVisible = (visible) => { refs.loadMore.style.display = visible ? 'inline-flex' : 'none'; };

const createCard = ({ Title, Year, imdbID, Type, Poster }) => {
    const li = document.createElement('li');
    li.className = 'photo-card';

    if (Poster && Poster !== 'N/A') {
        const img = document.createElement('img');
        img.className = 'poster';
        img.src = Poster;
        img.alt = `${Title} (${Year}) poster`;
        img.loading = 'lazy';
        img.addEventListener('click', () => openDetails(imdbID));
        li.appendChild(img);
    } else {
        const ph = document.createElement('div');
        ph.className = 'no-poster';
        ph.textContent = 'NO POSTER';
        li.appendChild(ph);
    }

    const h = document.createElement('div');
    h.className = 'title';
    h.textContent = Title;
    li.appendChild(h);

    const stats = document.createElement('div');
    stats.className = 'stats';
    stats.innerHTML = `
    <p class="stats-item"><i class="material-icons">event</i>${Year}</p>
    <p class="stats-item"><i class="material-icons">movie</i>${Type}</p>
    <p class="stats-item"><i class="material-icons">confirmation_number</i>${imdbID}</p>
    <p class="stats-item"><i class="material-icons">open_in_new</i><a class="link" href="https://www.imdb.com/title/${imdbID}/" target="_blank" rel="noreferrer noopener">IMDb</a></p>
  `;
    li.appendChild(stats);

    const actions = document.createElement('div');
    actions.className = 'actions';
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.innerHTML = '<span class="material-icons">info</span>Details';
    btn.addEventListener('click', () => openDetails(imdbID));
    actions.appendChild(btn);
    li.appendChild(actions);

    return li;
};

const openDetails = async (id) => {
    try {
        toggleLoader(true);
        const data = await fetchById(id);
        const poster = (data.Poster && data.Poster !== 'N/A')
            ? `<img src="${data.Poster}" alt="${data.Title}" style="max-width:38vw; max-height:80vh; margin-right:16px; object-fit:cover; border-radius:12px;"/>`
            : '';
        const ratings = (data.Ratings || []).map(r => `${r.Source}: <strong>${r.Value}</strong>`).join('<br/>');
        const html = `
      <div style="display:flex; gap:12px; align-items:flex-start; color:#e5e7eb;">
        ${poster}
        <div style="max-width:52ch">
          <h2 style="margin:0 0 8px; font-size:22px;">${data.Title} <small style="opacity:.8">(${data.Year})</small></h2>
          <p style="margin:0 0 6px; opacity:.9">${data.Genre || ''} • ${data.Runtime || ''} • Rated: ${data.Rated || 'N/A'}</p>
          <p style="margin:0 0 8px">IMDb: <strong>${data.imdbRating || 'N/A'}</strong> (votes: ${data.imdbVotes || 'N/A'})</p>
          ${ratings ? `<p style="margin:0 0 8px">${ratings}</p>` : ''}
          <p style="margin:0; line-height:1.45">${data.Plot || ''}</p>
          <p style="margin:10px 0 0; opacity:.9">Director: ${data.Director || '—'}</p>
          <p style="margin:0; opacity:.9">Actors: ${data.Actors || '—'}</p>
        </div>
      </div>`;
        basicLightbox.create(html).show();
    } catch (err) {
        notify('Не вдалося завантажити деталі', String(err.message || err), 'error');
    } finally {
        toggleLoader(false);
    }
};
