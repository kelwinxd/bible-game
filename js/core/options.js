import { $ } from './utils.js';

// ---------- Opções / persistência ----------
export const opts = { sound: true, forge: 'normal', god: true };
['Sound', 'God'].forEach(k => $('opt' + k).onchange = e => opts[k.toLowerCase()] = e.target.checked);
// som também nas Configurações da pausa; as duas caixas ficam sincronizadas e a escolha fica salva
export function setSound(on) { opts.sound = on; $('optSound').checked = $('pauseSound').checked = on; try { localStorage.setItem('ef-sound', on ? '1' : '0'); } catch (e) {} }
$('optSound').onchange = $('pauseSound').onchange = e => setSound(e.target.checked);
try { if (localStorage.getItem('ef-sound') === '0') setSound(false); } catch (e) {}
$('optForge').onchange = e => opts.forge = e.target.value;
