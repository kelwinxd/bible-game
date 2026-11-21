// ---------- Bichos soltos pela fase: a fachada ----------
// B.frogs é a lista dos bichos (rãs, lobos, soldados, mulheres dos piolhos, bois, espantalhos), cada um um objeto de uma das
// classes em js/battle/inimigos/bichos/ (todas herdam de Bicho, js/battle/inimigos/base/bicho.js — o contrato). Este arquivo só
// escolhe a classe pelo tipo do data/jornadas e repassa as chamadas do resto do jogo. Para criar um bicho novo: uma classe que herda de
// Bicho (ou de Patrulheiro, se patrulha e ataca) e uma linha em BICHOS (inimigos/bichos/index.js).
import { B } from './state.js';
import { overlap } from './combat.js';
import { chuvaDeRas, criarBicho, rasNaJangada } from './inimigos/index.js';
export { RA } from './inimigos/index.js';

export const makeFrog = e => criarBicho(e); // a classe pelo tipo: inimigos/bichos/index.js → BICHOS
export const frogBox = f => f.caixa();
export const hitFrog = (f, dano, cor) => f.sofrer(dano, cor);
export const updateFrogs = dt => { const h = B.hero; B.frogs.forEach(f => f.atualizar(h, dt)); };
export const drawFrog = f => { if (f.visivel()) f.desenhar(); };
/** os bichos que a caixa toca (golpe, rasgo, impulso): cada fonte de dano chama isto com a sua caixa */
export function frogsIn(box, fn) { B.frogs.forEach(f => { if (!f.dead && overlap(box, f.caixa())) fn(f); }); }
export const cleanFrogs = () => { B.frogs = B.frogs.filter(f => !f.dead); };
export const rainFrogs = (n, ar) => chuvaDeRas(n, ar);                 // chuva de rãs depois de uma arena
export const rainOnPlatform = (n, pl, aviso) => rasNaJangada(n, pl, aviso); // rãs na jangada da Naja
