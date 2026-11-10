import { $, D } from '../core/utils.js';
import { show } from '../ui/screens.js';
import { startBattle } from './world.js';

// ---------- Bestiário (só para desenvolvimento) ----------
// Escolhe um monstro (ou chefão) e luta só com ele numa arena curta, com o cenário da jornada onde ele aparece.
// Os monstros são imortais aqui: quando a vida zera, ela volta cheia (combat.js / boss.js olham B.fase.dev).
// Começa com todos os versículos (para testar a refutação) e não libera jornada nem marca versículo achado.
const COBRA_VERMELHA = { sprite: 'serpente', chao: true, mergulho: false, passo: 70, tell: 0.6, cadencia: 1.8 }; // a da jornada 2
const COBRA_VERDE = { sprite: 'verde', acido: true, tell: 0.7, cadencia: 2, passo: 80 }; // a da jornada 1
const SP = 'assets/sprites/enemy/';
// thumb = [tira, quadros, linhas] → o 1º quadro vira a figura do card
export const BESTIARIO = [
  { id: 'serpente', nome: 'Serpente', sub: 'Demônio da Tentação · bote corpo a corpo', base: 0, inimigo: 'tentacao', thumb: [SP + 'serpente-run.png', 7, 1] },
  { id: 'verde', nome: 'Cobra verde', sub: 'Mentira · cospe ácido de longe', base: 0, inimigo: 'mentira', aparencia: COBRA_VERDE, thumb: [SP + 'verde-run.webp', 4, 1] },
  { id: 'ave', nome: 'Ave da Dúvida', sub: 'Paira no alto e mergulha', base: 1, inimigo: 'duvida', thumb: [SP + 'ave-fly.png', 8, 1] },
  { id: 'vermelha', nome: 'Cobra vermelha', sub: 'Dúvida no chão · bote', base: 1, inimigo: 'duvida', aparencia: COBRA_VERMELHA, thumb: [SP + 'serpente-run.png', 7, 1] },
  { id: 'leao', nome: 'Leão do Orgulho', sub: 'Babilônia · salta com as garras e fala de força própria', base: 2, inimigo: 'orgulho', thumb: [SP + 'leao-run.webp', 6, 1] },
  { id: 'leviata', nome: 'Leviatã', sub: 'Antigo chefão do mar (fora das jornadas) · mordida, mergulho e ácido', base: 0, boss: 'leviata', thumb: [SP + 'leviata.webp', 8, 2] },
  { id: 'naja', nome: 'Naja do mar', sub: 'Chefona da jornada 1 · bote, mergulho, jato de ácido e mentiras', base: 0, boss: 'leviata', pele: 'naja', thumb: [SP + 'naja-run.webp', 8, 1] },
  { id: 'golias', nome: 'Golias', sub: 'Chefão da jornada 2 · estocada e golpe no chão', base: 1, boss: 'golias', thumb: [SP + 'gigante-run.webp', 8, 1] }
];

// fase de mentira, só com o cenário da jornada base e o monstro escolhido
function faseDe(m) {
  const b = D.fases[m.base];
  let comprimento, eventos;
  if (m.boss === 'leviata') { // o fim da jornada 1: mar largo com a laje que vai e volta, a terra submersa e ele no meio
    comprimento = 2100;
    eventos = [{ tipo: 'mar', x: 800, w: 1300 }, { tipo: 'terra', x: 1570, w: 530 },
      { tipo: 'plataforma', x: 820, w: 230, altura: 30, move: 505, periodo: 10 }, { tipo: 'chefe', x: 1185, vida: 50, pele: m.pele }];
  } else if (m.boss === 'golias') { comprimento = 2000; eventos = [{ tipo: 'gigante', x: 1400, vida: 60 }]; }
  else { comprimento = 2400; eventos = [{ tipo: 'inimigos', x: 1000, inimigos: [m.inimigo], vida: 1, aparencia: m.aparencia }]; }
  const f = { nome: m.nome, dev: m.id, comprimento, eventos, fundo: b.fundo, chao: b.chao, chaoMedidas: b.chaoMedidas };
  if ('chaoCor' in b) f.chaoCor = b.chaoCor; // sem a chave = tingimento padrão do chão
  return f;
}
export function startBestiary(id) {
  const m = BESTIARIO.find(m => m.id === id); if (!m) return;
  startBattle(-1, true, faseDe(m));
}
export function openBestiary() {
  $('bestGrid').innerHTML = BESTIARIO.map(m => {
    const [src, n, rows] = m.thumb;
    return `<button class="best-card${m.boss ? ' boss' : ''}" onclick="startBestiary('${m.id}')">
      <span class="best-fig" style="background-image:url('${src}');background-size:${n * 100}% auto;background-position:0 ${rows > 1 ? '0' : '50%'}"></span>
      <b>${m.nome}</b><small>${m.sub}</small>${m.boss ? '<em>Chefão</em>' : ''}</button>`;
  }).join('');
  show('bestiario');
}
