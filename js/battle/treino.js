import { D, $ } from '../core/utils.js';
import { escudoAtual, treino, verseMult, vidaMax } from '../core/progress.js';
import { FIRE_MAX } from './config.js';
import { renderFires } from './combat.js';
import { buildHotbar } from './hud.js';
import { B } from './state.js';
import { startBattle } from './world.js';

// ---------- Treinamento (menu inicial) ----------
// Uma fase curta com o cenário do Exodus, 2 espantalhos (alvos parados e imortais), um terreno alto e uma laje para testar
// movimentos. O herói começa com todos os versículos, os 3 fogos e TODOS os poderes no máximo; o painel (canto de cima, à
// direita) ajusta cada um na hora. Os ajustes ficam só na memória (valem até fechar a página) e nada é salvo nem dá xp.
const LINHAS = [
  { k: 'forja', nome: 'Forja', min: 1, max: 3, txt: v => `${D.niveis.forja.nomes[v - 1]} ×${D.niveis.forja.mult[v - 1]}` },
  { k: 'afia', nome: 'Afiação', min: 0, max: 3, txt: v => `${D.niveis.afiacao.base + v * D.niveis.afiacao.ganho}s de poder` },
  { k: 'escudo', nome: 'Escudo', min: D.fe.escudoBase, max: D.fe.escudoMax, txt: v => `${v}s` },
  { k: 'espirito', nome: 'Espírito', min: 0, max: D.espirito.nivelMax, txt: v => `impulso ${D.espirito.danoBase + v * D.espirito.ganho}` },
  { k: 'nivel', nome: 'Nível', min: 0, max: D.xp.niveis.length, txt: v => `Nv ${v} · vida ${100 + v * D.xp.vidaPorNivel}` }
];
const maximo = () => Object.fromEntries(LINHAS.map(l => [l.k, l.max]));
const fase = () => {
  const b = D.fases[0];
  return { nome: 'Treinamento', dev: 'treino', treino: true, comprimento: 2700, fundo: b.fundo, chao: b.chao, chaoMedidas: b.chaoMedidas,
    eventos: [{ tipo: 'espantalho', x: 900 }, { tipo: 'terreno', x: 1350, w: 360, altura: 90 }, { tipo: 'plataforma', x: 1850, w: 170, altura: 150 },
      { tipo: 'espantalho', x: 2300 }] };
};
export function startTreino() {
  if (treino.forja == null) Object.assign(treino, maximo()); // 1ª vez na sessão: tudo no máximo
  startBattle(-1, true, fase());
  B.notice = { lines: ['Treinamento: todos os poderes no máximo', 'Ajuste no painel à direita · os espantalhos não morrem'], t: 5, c: '#9fc3ff' };
  renderTreino();
}
export function renderTreino() {
  const lin = LINHAS.map(l => `<div class="tr-lin"><span class="tr-nome">${l.nome}</span>
      <button onclick="treinoAjusta('${l.k}',-1);this.blur()" ${treino[l.k] <= l.min ? 'disabled' : ''} aria-label="Diminuir ${l.nome}">−</button>
      <span class="tr-val">${l.txt(treino[l.k])}</span>
      <button onclick="treinoAjusta('${l.k}',1);this.blur()" ${treino[l.k] >= l.max ? 'disabled' : ''} aria-label="Aumentar ${l.nome}">+</button></div>`).join('');
  $('treinoPainel').innerHTML = `<button class="tr-tit" onclick="treinoRecolhe();this.blur()">🎯 Treinamento <span>${treino.recolhido ? '▸' : '▾'}</span></button>`
    + (treino.recolhido ? '' : `<div class="tr-corpo">${lin}<div class="tr-acoes">
      <button onclick="treinoMax();this.blur()">Tudo no máximo</button><button onclick="treinoCheio();this.blur()">Vida, escudo e fogos cheios</button></div></div>`);
}
// aplica na batalha em curso o que mudou (vida máxima, escudo, grau dos cards, força do poder ativo)
function aplicar() {
  if (!B || !B.fase.treino) return;
  B.hpMax = vidaMax(); B.hp = Math.min(B.hp, B.hpMax);
  B.shieldE = Math.min(B.shieldE, escudoAtual());
  if (B.power) B.power.mult = verseMult(B.power.v.id);
  buildHotbar();
}
export function treinoAjusta(k, d) {
  const l = LINHAS.find(l => l.k === k); if (!l) return;
  treino[k] = Math.max(l.min, Math.min(l.max, treino[k] + d));
  aplicar(); if (k === 'nivel') B.hp = B.hpMax; if (k === 'escudo') { B.shieldE = escudoAtual(); B.shieldLock = false; }
  renderTreino();
}
export function treinoMax() { Object.assign(treino, maximo()); aplicar(); treinoCheio(); renderTreino(); }
export function treinoCheio() { if (!B) return; B.hp = B.hpMax; B.shieldE = escudoAtual(); B.shieldLock = false; B.fire = FIRE_MAX; renderFires(); }
export function treinoRecolhe() { treino.recolhido = !treino.recolhido; renderTreino(); }
