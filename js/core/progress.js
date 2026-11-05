import { D } from './utils.js';

// progresso por versículo: forja 0–3 (dano) e afia 0–3 (duração do poder)
export let prog = {};
try { prog = JSON.parse(localStorage.getItem('ef-prog') || '{}'); } catch (e) {}
export const saveProg = () => { try { localStorage.setItem('ef-prog', JSON.stringify(prog)); } catch (e) {} };
// versículos já encontrados na jornada (livro dourado); a forja só mostra estes
export let found = [];
try { found = JSON.parse(localStorage.getItem('ef-found') || '[]'); } catch (e) {}
export function markFound(id) { if (found.includes(id)) return; found.push(id); try { localStorage.setItem('ef-found', JSON.stringify(found)); } catch (e) {} }
export const progOf = id => prog[id] || (prog[id] = { forja: 0, afia: 0 });
export const forged = id => progOf(id).forja > 0;
export const verseMult = id => D.niveis.forja.mult[progOf(id).forja - 1] || 1;
export const powerDur = id => D.niveis.afiacao.base + progOf(id).afia * D.niveis.afiacao.ganho;
export const gradeIdx = id => 3 - progOf(id).forja; // índice em D.graus: 0 Temperado, 1 Forjado, 2 Bruto
export const barsHTML = (n, cls) => `<span class="bars ${cls}" title="${n} de 3">${[1, 2, 3].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;
export let shieldMax = D.fe.escudoBase; // segundos de escudo; sobe passando no quiz da fé
try { shieldMax = Math.min(D.fe.escudoMax, Math.max(D.fe.escudoBase, +localStorage.getItem('ef-shield') || 0)); } catch (e) {}
export const setShieldMax = s => { shieldMax = Math.min(D.fe.escudoMax, s); try { localStorage.setItem('ef-shield', shieldMax); } catch (e) {} };
export let spiritLvl = 0; // nível do Impulso do Espírito (0..nivelMax); sobe passando no quiz do Espírito Santo
try { spiritLvl = Math.min(D.espirito.nivelMax, Math.max(0, +localStorage.getItem('ef-spirit') || 0)); } catch (e) {}
export const setSpiritLvl = n => { spiritLvl = Math.min(D.espirito.nivelMax, n); try { localStorage.setItem('ef-spirit', spiritLvl); } catch (e) {} };
export const dashDmg = () => D.espirito.danoBase + spiritLvl * D.espirito.ganho;
export const runeHTML = gi => { const g = D.graus[gi]; if (!g) return ''; return `<span class="rune" style="background:${g.cor}" title="${g.nome}">${g.letra}</span>`; };
