import { $ } from './utils.js';

// ---------- Ferramentas de desenvolvedor: só no local ----------
// Imortalidade, Bestiário, "Forjar tudo (teste)" e "Tudo liberado" (os elementos com data-dev na página) só existem quando o jogo
// roda no seu computador: npm run dev, localhost/127.0.0.1 ou fora do Vite (Live Server). No site publicado (Vercel, AWS…) somem
// e ficam desligados — a imortalidade também, mesmo que tenha ficado salva como ligada no navegador.
// Para forçar: VITE_FERRAMENTAS=1 (liga) ou VITE_FERRAMENTAS=0 (desliga) no .env / nas variáveis da hospedagem.
const ENV = import.meta.env || {};
const LOCAL = !import.meta.env || ENV.DEV === true || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
export const DEV = ENV.VITE_FERRAMENTAS === '1' || (ENV.VITE_FERRAMENTAS !== '0' && LOCAL);
document.querySelectorAll('[data-dev]').forEach(el => { el.hidden = !DEV; });

// ---------- Opções / persistência ----------
export const opts = { sound: true, forge: 'normal', god: DEV, all: false }; // all: todos os versículos e jornadas (teste)
['Sound', 'All'].forEach(k => $('opt' + k).onchange = e => opts[k.toLowerCase()] = e.target.checked && (k !== 'All' || DEV));
// som também nas Configurações da pausa; as duas caixas ficam sincronizadas e a escolha fica salva
export function setSound(on) { opts.sound = on; $('optSound').checked = $('pauseSound').checked = on; try { localStorage.setItem('ef-sound', on ? '1' : '0'); } catch (e) {} }
$('optSound').onchange = $('pauseSound').onchange = e => setSound(e.target.checked);
try { if (localStorage.getItem('ef-sound') === '0') setSound(false); } catch (e) {}
$('optForge').onchange = e => opts.forge = e.target.value;
// imortalidade (desenvolvedor): nas Configurações do menu e da pausa, sincronizadas; a escolha fica salva no navegador
export function setGod(on) { on = on && DEV; opts.god = on; $('optGod').checked = $('pauseGod').checked = on; try { localStorage.setItem('ef-god', on ? '1' : '0'); } catch (e) {} }
$('optGod').onchange = $('pauseGod').onchange = e => setGod(e.target.checked);
try { const g = localStorage.getItem('ef-god'); if (g !== null) setGod(g === '1'); } catch (e) {}
