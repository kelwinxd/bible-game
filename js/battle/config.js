import { $, reduced } from '../core/utils.js';

// ---------- Batalha ----------
export const cv = $('arena'), ctx = cv.getContext('2d');
export const GROUND = 480;
// Sprites de inimigos (data.js → inimigos[].sprite): tiras horizontais do mesmo tamanho de quadro.
// ax = x dos pés/barriga dentro do quadro; a arte olha para a DIREITA.
export const ESPR = {
  serpente: { attack: new Image(), run: new Image(), FW: 275, FH: 257, ax: 142, nRun: 7 }
};
for (const k in ESPR) { ESPR[k].attack.src = `assets/sprites/enemy/${k}-attack.png`; ESPR[k].run.src = `assets/sprites/enemy/${k}-run.png`; }
// Herói atual (templário): tiras de mesmo quadro; ax = x do tronco no quadro, pés na base. Olha para a direita.
// run: 8 quadros · jump: 0 parecido c/ corrida, 1 subindo, 2 espada erguida, 3 estocada, 4 descendo · death: 5 (cai até deitar)
export const HERO = { run: new Image(), jump: new Image(), death: new Image(), FW: 267, FH: 221, ax: 116 };
for (const k of ['run', 'jump', 'death']) HERO[k].src = `assets/sprites/hero/${k}.png`;
// parado (idle): 4 quadros, em pé; tira com quadro próprio (mais estreito), mesma escala visual das outras
export const HERO_IDLE = { img: new Image(), FW: 148, FH: 211, ax: 83, n: 4 };
HERO_IDLE.img.src = 'assets/sprites/hero/idle.png';
export const HERO_THRUST = 3; // quadro da estocada: golpe e impulso
export const HERO_SCALE = .78; // tamanho do templário no jogo (~150 px correndo)
export const CALLOUT_T = 1.1; // segundos da referência escolhida acima do herói
export const WRONG_T = .8, WRONG_COLOR = { cor: '#ff4a3d', brilho: '#ff2a2a' };
export const FATAL_T = reduced ? 1.4 : 1.8; // segundos da referência na tela ao derrotar um demônio
export const FATAL_SPIRIT_T = reduced ? 2.4 : 2.9; // frase do Espírito (morte pelo Impulso) fica mais tempo: é mais longa
export const SHIELD_REGEN = .6; // segundos de escudo recuperados por segundo abaixado
export const SPEED = 260, JUMP = 720, GRAV = 2000, SWING = .42, SWING_HIT = .15, BASE_DMG = 3;
// Impulso do Espírito: avanço rápido para frente (no chão ou no ar); atravessa e fere cada inimigo no caminho uma vez
export const DASH_T = .2, DASH_SPEED = 1700, DASH_CD = 3; // ~340 px em 0,2 s; recarga 3 s
// Fogos do Espírito: +1 por inimigo derrotado, −1 por versículo errado. Com 1 fogo o impulso funciona;
// com a barra cheia vira impulso DUPLO: L de novo em até 1 s depois do primeiro = volta, sem esperar a recarga.
export const FIRE_MAX = 3, DASH_BACK_WIN = 1;
