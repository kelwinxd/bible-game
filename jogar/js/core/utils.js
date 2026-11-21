import DATA from '../../data/index.js'; // o conteúdo do jogo, dividido por domínio em jogar/data/ (ver data/index.js)
export const D = DATA;
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const $ = id => document.getElementById(id);
export const byId = Object.fromEntries(D.versiculos.map(v => [v.id, v]));
export const rand = a => a[Math.floor(Math.random() * a.length)];
export const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const rgbOf = hex => [1, 3, 5].map(i => parseInt(hex.substr(i, 2), 16)).join(',');
export const hash = n => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
export const mix = (a, b, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.substr(i, 2), 16) * (1 - t) + parseInt(b.substr(i, 2), 16) * t).toString(16).padStart(2, '0')).join('');

// símbolo do martelo amarelo: marca os versículos dos Dez Mandamentos (mandamento: true) nos cards; o poder deles é o martelo
export const ICONE_MARTELO = '<svg class="martelo-ico" viewBox="0 0 24 24" aria-label="Mandamento" role="img"><title>Mandamento: o poder é o martelo</title>'
  + '<rect x="3" y="3.5" width="18" height="7.5" rx="3.2" fill="#ffd23f" stroke="#a87a00" stroke-width="1.2"/>'
  + '<rect x="6.2" y="4.7" width="11.6" height="5.1" rx="1" fill="#fff1a8" opacity=".7"/>'
  + '<path d="M10.6 11h2.8l.6 10a1.6 1.6 0 0 1-1.6 1.6h-.8A1.6 1.6 0 0 1 10 21z" fill="#ffd23f" stroke="#a87a00" stroke-width="1.2"/></svg>';
