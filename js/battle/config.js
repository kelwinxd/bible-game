import { $, reduced } from '../core/utils.js';

// ---------- Batalha ----------
export const cv = $('arena'), ctx = cv.getContext('2d');
export const GROUND = 480;
// Sprites de inimigos (data.js → inimigos[].sprite): tiras horizontais do mesmo tamanho de quadro.
// ax = x dos pés/barriga dentro do quadro; a arte olha para a DIREITA.
// ave: tira de voo (runName 'fly') e de ataque, 8 quadros cada; âncora (ax, ay) = olho vermelho
export const ESPR = {
  serpente: { attack: new Image(), run: new Image(), FW: 275, FH: 257, ax: 142, nRun: 7 },
  ave: { attack: new Image(), run: new Image(), FW: 226, FH: 285, ax: 180, ay: 162, nRun: 8, runName: 'fly' },
  // cobra verde (cospe ácido; sobra do quadro vizinho limpa da borda da tira de andar): 4 quadros andando + 8 do cuspe (arma 0–3 · cospe 4–7), 270×292, alinhados pela base; boca no cuspe = (boca)
  // leão (Babilônia, Daniel 6; o de cicatrizes e olhos vermelhos): 6 quadros andando + 6 do ataque (encara → agacha → salta →
  // garras → aterrissa → volta), 284×166, arte reduzida a 70% (mesmo tamanho do leão anterior) e alinhada pela pata de trás; usa o mapa de quadros da serpente (aviso 0–2, bote 3, volta 4)
  leao: { attack: new Image(), run: new Image(), FW: 284, FH: 166, ax: 128, nRun: 6, ext: 'webp' },
  verde: { attack: new Image(), run: new Image(), FW: 270, FH: 292, ax: 100, nRun: 4, nAtk: 8, ext: 'webp', topo: 240, boca: [96, -106], sc: .8 } // sc: desenhada a 80% (era grande demais); boca/topo já na escala
};
for (const k in ESPR) { const e = ESPR[k].ext || 'png'; ESPR[k].attack.src = `assets/sprites/enemy/${k}-attack.${e}`; ESPR[k].run.src = `assets/sprites/enemy/${k}-${ESPR[k].runName || 'run'}.${e}`; }
// Herói atual (templário): tiras de mesmo quadro; ax = x do tronco no quadro, pés na base. Olha para a direita.
// run: 8 quadros · jump: 0 parecido c/ corrida, 1 subindo, 2 espada erguida, 3 estocada, 4 descendo · death: 5 (cai até deitar)
export const HERO = { run: new Image(), jump: new Image(), death: new Image(), FW: 267, FH: 221, ax: 116 };
for (const k of ['run', 'jump', 'death']) HERO[k].src = `assets/sprites/hero/${k}.png`;
// parado (idle): 4 quadros, em pé; tira com quadro próprio (mais estreito), mesma escala visual das outras
export const HERO_IDLE = { img: new Image(), FW: 148, FH: 211, ax: 83, n: 4 };
HERO_IDLE.img.src = 'assets/sprites/hero/idle.png';
// defesa (escudo [J]): 5 quadros erguendo o escudo e agachando; para no último enquanto J estiver apertado.
// Arte enviada reduzida a 54% (o 1º quadro, em pé, com a altura do idle), cada quadro alinhado pelo meio dos pés
export const HERO_DEF = { img: new Image(), FW: 182, FH: 210, ax: 109, n: 5, step: .06 };
HERO_DEF.img.src = 'assets/sprites/hero/defend.webp';
// andando com o escudo erguido (35% da velocidade): 6 quadros em loop, arte reduzida a 49% (o capacete com o tamanho do da defesa),
// alinhados pelo capacete (os pés mudam de lugar a cada passo)
export const HERO_DEFWALK = { img: new Image(), FW: 172, FH: 204, ax: 111, n: 6, fps: 7 };
HERO_DEFWALK.img.src = 'assets/sprites/hero/defend-walk.webp';
// Golpes do combo no chão: dois ataques de 6 quadros cada (attack1 / attack2), na mesma escala visual do idle
// (a guarda do 1º quadro tem a mesma altura nos dois), cada quadro alinhado pelo pé de trás → ax = meio dos pés, pés na base.
// sc = escala extra ao desenhar (1,08: na arte o golpe ficava um pouco menor que o idle).
// Cor igualada ao idle (metal prata e capa branca; a arte veio mais quente). T = duração (s), HIT = quando acerta, quadros = [t, quadro] (vale a partir de t segundos)
// corte = o rasgo de luz do poder do versículo nesse golpe (a mesma meia-lua de sempre, ~91 px de altura, só esticada na
// vertical): sy = quanto estica na altura, y = altura do centro acima do chão. Lateral: menor e no meio do corpo;
// de cima para baixo: do pescoço aos pés
export const HERO_ATK = [
  // 1º: corte lateral — guarda → arma → corte → corte largo → estocada → volta à guarda
  { img: new Image(), FW: 274, FH: 186, ax: 123, sc: 1.08, T: .6, HIT: .27, quadros: [[0, 0], [.08, 1], [.17, 2], [.27, 3], [.38, 4], [.5, 5]],
    corte: { sy: 1.05, y: 92 } },
  // 2º: corte de cima para baixo — guarda → ergue → ergue → no alto (arco) → desce cortando (termina aí: não bate no chão)
  { img: new Image(), FW: 239, FH: 300, ax: 102, sc: 1.08, T: .44, HIT: .28, quadros: [[0, 0], [.06, 1], [.12, 2], [.2, 3], [.28, 4]],
    corte: { sy: 1.5, y: 68 } }
];
HERO_ATK.forEach((a, i) => { a.img.src = `assets/sprites/hero/attack${i + 1}.webp`; });
export const SPIT_ANIM = .5; // duração dos quadros do cuspe da cobra verde
export const COMBO_WIN = .3; // apertar K até 0,3 s depois do golpe acabar ainda encadeia o próximo
// Ídolo (bezerro de ouro) no lugar da pedra do versículo: 4 quadros 420×580, base do pedestal em y=566, centro x=210.
// Quadro = estado por golpe (inteiro · rachado · quebrado · só o pedestal com entulho). No último, as peças de
// bezerro-pecas.png caem: [sx, sy, w, h, x, y no quadro]
export const IDOL = { img: new Image(), pecas: new Image(), W: 420, H: 580, foot: 566, cx: 210, sc: .32,
  pieces: [[0, 0, 210, 293, 43, 96], [212, 0, 29, 33, 217, 196], [243, 0, 44, 52, 253, 224], [289, 0, 159, 159, 224, 279], [450, 0, 52, 64, 39, 341], [504, 0, 21, 24, 387, 374], [527, 0, 26, 28, 100, 390]] };
IDOL.img.src = 'assets/sprites/object/bezerro.png'; IDOL.pecas.src = 'assets/sprites/object/bezerro-pecas.png';
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
