import { $ } from './utils.js';

// ---------- Opções / persistência ----------
export const opts = { sound: true, forge: 'normal', god: true, all: false }; // all: todos os versículos e jornadas (teste)
['Sound', 'All'].forEach(k => $('opt' + k).onchange = e => opts[k.toLowerCase()] = e.target.checked);
// som também nas Configurações da pausa; as duas caixas ficam sincronizadas e a escolha fica salva
export function setSound(on) { opts.sound = on; $('optSound').checked = $('pauseSound').checked = on; try { localStorage.setItem('ef-sound', on ? '1' : '0'); } catch (e) {} }
$('optSound').onchange = $('pauseSound').onchange = e => setSound(e.target.checked);
try { if (localStorage.getItem('ef-sound') === '0') setSound(false); } catch (e) {}
$('optForge').onchange = e => opts.forge = e.target.value;
// imortalidade (desenvolvedor): nas Configurações do menu e da pausa, sincronizadas; a escolha fica salva no navegador
export function setGod(on) { opts.god = on; $('optGod').checked = $('pauseGod').checked = on; try { localStorage.setItem('ef-god', on ? '1' : '0'); } catch (e) {} }
$('optGod').onchange = $('pauseGod').onchange = e => setGod(e.target.checked);
try { const g = localStorage.getItem('ef-god'); if (g !== null) setGod(g === '1'); } catch (e) {}
