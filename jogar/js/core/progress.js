import { D } from './utils.js';

// progresso por versículo: forja 0–3 (dano) e afia 0–3 (duração do poder)
export let prog = {};
try { prog = JSON.parse(localStorage.getItem('ef-prog') || '{}'); } catch (e) {}
// jornadas vencidas (ids de data/jornadas/*.js → fases[].id). Uma jornada fica aberta quando não tem `abre` (as do começo: Exodus e
// As Pragas, o jogador escolhe por qual começar) ou quando o herói já venceu alguma das listadas em `abre` (o Vale abre com
// o Exodus OU As Pragas; a Babilônia com o Vale). Antes era um índice só (ef-fase): migra marcando as anteriores a ele
export let vencidas = null;
try { vencidas = JSON.parse(localStorage.getItem('ef-won') || 'null'); } catch (e) {}
if (!Array.isArray(vencidas)) {
  let fm = 0; try { fm = +localStorage.getItem('ef-fase') || 0; } catch (e) {}
  vencidas = D.fases.slice(0, fm).map(f => f.id);
}
const saveWon = () => { try { localStorage.setItem('ef-won', JSON.stringify(vencidas)); } catch (e) {} };
export const venceu = id => vencidas.includes(id);
// nivelMin (opcional): além do caminho, o herói precisa estar nesse nível (XP) para a jornada abrir
export const caminhoAberto = f => !f.abre || f.abre.some(venceu);
export const nivelOk = f => !f.nivelMin || nivel() >= f.nivelMin;
export const abertaBase = f => caminhoAberto(f) && nivelOk(f); // sem contar as opções de teste (Tudo liberado / jornadasLiberadas)
// ovelhas perdidas achadas (uma escondida por jornada; ids de fases[].id): achada não reaparece quando a jornada é jogada de novo
export let ovelhas = [];
try { ovelhas = JSON.parse(localStorage.getItem('ef-ovelhas') || '[]'); } catch (e) {}
export const achouOvelha = id => ovelhas.includes(id);
export function marcarOvelha(id) { if (!id || achouOvelha(id)) return; ovelhas.push(id); try { localStorage.setItem('ef-ovelhas', JSON.stringify(ovelhas)); } catch (e) {} }
// XP e nível (data/progresso/xp.js → xp): nível = quantos marcos de xp.niveis o total já passou; vida máxima = 100 + nível × vidaPorNivel
export let xp = 0;
try { xp = +localStorage.getItem('ef-xp') || 0; } catch (e) {}
export const nivelDe = x => D.xp.niveis.filter(n => x >= n).length;
export const nivel = () => nivelDe(xp);
export const proxNivel = () => D.xp.niveis[nivel()] ?? null; // xp total do próximo nível (null no máximo)
// Treinamento (menu inicial): enquanto on, os poderes vêm daqui (ajustáveis no painel, começam no máximo) em vez do progresso salvo.
// Só na memória: nada disto vai para o localStorage. Liga ao entrar no treino e desliga em qualquer outra jornada ou tela
export const treino = { on: false };
export const nivelAtual = () => treino.on ? treino.nivel : nivel();
export const vidaMax = () => 100 + nivelAtual() * D.xp.vidaPorNivel;
export function ganharXp(n) { const antes = nivel(); xp += n; try { localStorage.setItem('ef-xp', xp); } catch (e) {} return nivel() > antes; }
export function marcarVitoria(id) { if (!id || venceu(id)) return; vencidas.push(id); saveWon(); }
export const saveProg = () => { try { localStorage.setItem('ef-prog', JSON.stringify(prog)); } catch (e) {} };
// versículos já encontrados na jornada (livro dourado); a forja só mostra estes
export let found = [];
try { found = JSON.parse(localStorage.getItem('ef-found') || '[]'); } catch (e) {}
export function markFound(id) { if (found.includes(id)) return; found.push(id); try { localStorage.setItem('ef-found', JSON.stringify(found)); } catch (e) {} }
export const progOf = id => prog[id] || (prog[id] = { forja: 0, afia: 0 });
export const forged = id => progOf(id).forja > 0;
export const forjaDe = id => treino.on ? treino.forja : progOf(id).forja; // nível da forja (no treino, o do painel)
export const afiaDe = id => treino.on ? treino.afia : progOf(id).afia;
export const verseMult = id => D.niveis.forja.mult[forjaDe(id) - 1] || 1;
export const powerDur = id => D.niveis.afiacao.base + afiaDe(id) * D.niveis.afiacao.ganho;
export const gradeIdx = id => 3 - forjaDe(id); // índice em D.graus: 0 Temperado, 1 Forjado, 2 Bruto
export const barsHTML = (n, cls, max = 3) => `<span class="bars ${cls}" title="${n} de ${max}">${Array.from({ length: max }, (_, k) => `<i class="${k < n ? 'on' : ''}"></i>`).join('')}</span>`;
export let shieldMax = D.fe.escudoBase; // segundos de escudo; sobe passando no quiz da fé
try { shieldMax = Math.min(D.fe.escudoMax, Math.max(D.fe.escudoBase, +localStorage.getItem('ef-shield') || 0)); } catch (e) {}
export const setShieldMax = s => { shieldMax = Math.min(D.fe.escudoMax, s); try { localStorage.setItem('ef-shield', shieldMax); } catch (e) {} };
export let spiritLvl = 0; // nível do Impulso do Espírito (0..nivelMax); sobe passando no quiz do Espírito Santo
try { spiritLvl = Math.min(D.espirito.nivelMax, Math.max(0, +localStorage.getItem('ef-spirit') || 0)); } catch (e) {}
export const setSpiritLvl = n => { spiritLvl = Math.min(D.espirito.nivelMax, n); try { localStorage.setItem('ef-spirit', spiritLvl); } catch (e) {} };
export const dashDmg = () => D.espirito.danoBase + (treino.on ? treino.espirito : spiritLvl) * D.espirito.ganho;
export const escudoAtual = () => treino.on ? treino.escudo : shieldMax; // segundos de escudo na batalha
export const runeHTML = gi => { const g = D.graus[gi]; if (!g) return ''; return `<span class="rune" style="background:${g.cor}" title="${g.nome}">${g.letra}</span>`; };
