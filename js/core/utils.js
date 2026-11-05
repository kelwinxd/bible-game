export const D = window.DATA;
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const $ = id => document.getElementById(id);
export const byId = Object.fromEntries(D.versiculos.map(v => [v.id, v]));
export const rand = a => a[Math.floor(Math.random() * a.length)];
export const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const rgbOf = hex => [1, 3, 5].map(i => parseInt(hex.substr(i, 2), 16)).join(',');
export const hash = n => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
export const mix = (a, b, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.substr(i, 2), 16) * (1 - t) + parseInt(b.substr(i, 2), 16) * t).toString(16).padStart(2, '0')).join('');
