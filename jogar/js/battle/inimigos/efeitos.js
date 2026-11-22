// ---------- Efeitos compartilhados por chefões e bichos ----------
// Tudo o que antes se repetia em cada inimigo: caixa do herói, desenho de um quadro de sprite, partículas (faíscas, poeira,
// respingos), tremor de chão, projéteis (bolas de fogo, nuvem de praga) e o ácido (Leviatã/Naja e a cobra verde).
import { heroiDanoSom, sfx } from '../../core/audio.js';
import { opts } from '../../core/options.js';
import { reduced } from '../../core/utils.js';
import { GROUND, ctx } from '../config.js';
import { heroDies, hitHero, overlap } from '../combat.js';
import { B } from '../state.js';

/** caixa do herói para os golpes dos inimigos (alto = altura considerada, em px) */
/** volume de um som que sai de x (0–1): cheio dentro da tela, some a ~420 px fora da borda */
export const ouvido = x => { const d = Math.abs(x - (B.cam + 480)); return d < 480 ? 1 : Math.max(0, 1 - (d - 480) / 420); };
export const caixaHeroi = (h, alto = 160) => [h.x - 22, GROUND + h.y - alto, h.x + 22, GROUND + h.y];
/** quadro de uma linha de tempo [[t, quadro], …]: o último cujo t já passou */
export const quadroNoTempo = (linha, t) => { let q = linha[0][1]; linha.forEach(([t0, f]) => { if (t >= t0) q = f; }); return q; };

/**
 * Desenha um quadro de uma tira de sprite com os pés em (x, y).
 * S = { img, FW, FH, ax, foot?, row? } (ax = âncora x na arte; foot = linha dos pés, padrão FH − 2).
 * op: face (−1/1), sc (escala), filtro (CSS filter), alpha, dy (desloca para cima/baixo)
 */
export function desenharQuadro(S, fr, x, y, { face = 1, sc = 1, filtro = null, alpha = 1, dy = 0 } = {}) {
  if (!S.img.naturalWidth) return false;
  ctx.save(); ctx.translate(x, y + dy); ctx.scale(face * sc, sc);
  if (filtro) ctx.filter = filtro;
  if (alpha < 1) ctx.globalAlpha = Math.max(0, alpha);
  ctx.drawImage(S.img, fr * S.FW, (S.row || 0) * S.FH, S.FW, S.FH, -S.ax, -(S.foot ?? S.FH - 2), S.FW, S.FH);
  ctx.restore();
  return true;
}
export const FILTRO_ACERTO = 'brightness(3) saturate(0)'; // o piscar branco quando leva golpe
export const brilho = (cor, r = 16) => `drop-shadow(0 0 ${r}px ${cor})`; // o brilho de "vai atacar"

// ---------- partículas ----------
/** n lascas saindo de (x, y); cores = 2 cores 'r,g,b' (sorteadas); vel = [vx espalho, vy para cima] */
export function lascas(x, y, n, { cores = ['255,170,60', '255,90,30'], vel = [300, 240], vida = .6, tam = [.4, .5], espalho = 0 } = {}) {
  for (let k = 0; k < (reduced ? Math.ceil(n / 3) : n); k++)
    B.shards.push({ x: x + (Math.random() - .5) * espalho, y, vx: (Math.random() - .5) * vel[0], vy: -Math.random() * vel[1] - (vel[2] || 0), r: Math.random() * 6, t: vida, c: cores[Math.random() < .5 ? 0 : 1], sz: tam[0] + Math.random() * tam[1] });
}
export const faisca = (x, y, n) => lascas(x, y, n);
export const respingo = (x, n) => lascas(x, GROUND + 20, n, { cores: ['214,232,240', '214,232,240'], vel: [340, 380, 200], vida: .9, tam: [.5, .6], espalho: 220 }); // água
export const gosma = (x, y, n) => lascas(x, y, n, { cores: ['150,230,60', '150,230,60'], vel: [300, 260], vida: .7 }); // ácido

/** tremor de chão: dano direto na vida (o escudo não segura; quem está no ar escapa — quem chama confere) */
export function tremor(h, dano) {
  if (!heroiDanoSom()) sfx('hurt'); if (!opts.god) B.hp = Math.max(0, B.hp - dano); h.hurt = .3;
  B.floats.push({ x: h.x, y: GROUND + h.y - 250, t: .9, s: '-' + dano, c: '#ff5a4a' });
  if (B.hp <= 0) heroDies();
}
/** aviso no alto da tela uma vez só por batalha (chave = nome do aviso) */
export function avisarUmaVez(chave, aviso) { B.avisos = B.avisos || {}; if (B.avisos[chave]) return; B.avisos[chave] = true; B.notice = aviso; }

// ---------- projéteis dos chefões (lista própria em cada chefão: L.bolas) ----------
// { x, y, vx, vy, t, g? (gravidade), r? (raio), dmg?, chao? (espirra onde cai), praga? (desenho de enxame) }
export function lancar(L, x, y, tx, ty, v, extra = {}) { // em linha reta até (tx, ty)
  const d = Math.hypot(tx - x, ty - y) || 1;
  L.bolas.push({ x, y, vx: (tx - x) / d * v, vy: (ty - y) / d * v, t: 0, ...extra });
}
export function arremessar(L, x, y, tx, ty, T, g, extra = {}) { // em arco, chegando em (tx, ty) depois de T s
  L.bolas.push({ x, y, vx: (tx - x) / T, vy: (ty - y - .5 * g * T * T) / T, g, t: 0, ...extra });
}
export function atualizarBolas(L, h, dt, { danoPadrao = 14, raioChao = 55 } = {}) {
  L.bolas.forEach(b => {
    b.t += dt; b.vy += (b.g || 0) * dt; b.x += b.vx * dt; b.y += b.vy * dt;
    const r = b.r ? b.r * .7 : 14;
    if (overlap([b.x - r, b.y - r, b.x + r, b.y + r], caixaHeroi(h))) { b.dead = true; hitHero(b.dmg || danoPadrao); faisca(b.x, b.y, 12); }
    else if (b.y > GROUND + 10 || b.t > 3) {
      b.dead = true; faisca(b.x, Math.min(b.y, GROUND), b.chao ? 22 : 8);
      if (b.chao) { B.shake = Math.max(B.shake, .15); if (Math.abs(h.x - b.x) < raioChao && h.y > -60) hitHero(b.dmg); } // caiu: espirra fogo em volta
    }
  });
  L.bolas = L.bolas.filter(b => !b.dead);
}
export function desenharBolas(L) {
  L.bolas.forEach(b => {
    if (b.praga) return desenharPraga(b);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; // bola de fogo com rastro
    for (let k = 3; k >= 0; k--) {
      const R = b.r || 16, px = b.x - b.vx * k * .025, py = b.y - b.vy * k * .025, r = R - k * R / 5;
      const g = ctx.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, `rgba(255,240,180,${.9 - k * .2})`); g.addColorStop(.5, `rgba(255,140,40,${.7 - k * .15})`); g.addColorStop(1, 'rgba(255,60,10,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill();
    }
    ctx.restore();
  });
}
// a nuvem de praga (Faraó): um enxame escuro de gafanhotos zumbindo em volta de um miolo roxo
function desenharPraga(b) {
  ctx.save();
  const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 1.4); g.addColorStop(0, 'rgba(150,70,210,.55)'); g.addColorStop(1, 'rgba(60,20,90,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 1.4, 0, 7); ctx.fill();
  ctx.fillStyle = '#2a1406';
  for (let k = 0; k < 16; k++) {
    const a = k * 2.4 + b.t * (6 + k % 3), rr = b.r * (.3 + (k * 37 % 10) / 12);
    ctx.beginPath(); ctx.ellipse(b.x + Math.cos(a) * rr - b.vx * .02, b.y + Math.sin(a) * rr * .7, 3, 1.6, a, 0, 7); ctx.fill();
  }
  ctx.restore();
}

// ---------- ácido (bolas verdes em arco; lista global B.acid: Leviatã/Naja e a cobra verde) ----------
const ACID_G = 900, ACID_DMG = 12;
/** bola de ácido de (x, y) que cai em arco em (tx, ty) depois de T segundos */
export function spitAcid(x, y, tx, ty, dmg, T) {
  B.acid.push({ x, y, vx: (tx - x) / T, vy: (ty - y - .5 * ACID_G * T * T) / T, t: 0, dmg });
  sfx('fire');
}
export function updateAcid(dt) {
  if (!B.acid || !B.acid.length) return;
  const h = B.hero;
  B.acid.forEach(a => {
    a.t += dt; a.vy += ACID_G * dt; a.x += a.vx * dt; a.y += a.vy * dt;
    if (overlap([a.x - 14, a.y - 14, a.x + 14, a.y + 14], caixaHeroi(h, 200))) { a.dead = true; hitHero(a.dmg || ACID_DMG); gosma(a.x, a.y, 14); return; }
    if (a.y > GROUND + 20 || a.t > 3) { a.dead = true; gosma(a.x, Math.min(a.y, GROUND + 10), 10); } // espirra no chão ou no mar
  });
  B.acid = B.acid.filter(a => !a.dead);
}
export function drawAcid() {
  if (!B.acid || !B.acid.length) return;
  ctx.save(); ctx.shadowColor = '#9cff3a'; ctx.shadowBlur = 14;
  B.acid.forEach(a => {
    const g = ctx.createRadialGradient(a.x - 4, a.y - 4, 2, a.x, a.y, 15); g.addColorStop(0, '#f2ffb0'); g.addColorStop(.5, '#9ce43a'); g.addColorStop(1, '#4f8a14');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(a.x, a.y, 15, 12, Math.atan2(a.vy, a.vx), 0, 7); ctx.fill();
    ctx.globalAlpha = .55; ctx.fillStyle = '#9ce43a'; // gotas ficando para trás
    for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.arc(a.x - a.vx * .02 * k, a.y - a.vy * .02 * k, 7 - k * 1.5, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
  });
  ctx.restore();
}

// ---------- Coluna de fogo (o rei invocando soldados) ----------
// colunaDeFogo(x, y) = uma labareda que brota do chão em x (y = o chão): a chama do jato do rei (hazard/chama-rei.webp, 8 quadros)
// virada para cima — cresce nos 5 primeiros quadros, tremula nos 3 últimos e some; com brilho por cima (modo "lighter")
const CHAMA = { img: Object.assign(new Image(), { src: 'assets/sprites/hazard/chama-rei.webp' }), FW: 237, FH: 134, cy: 66 };
const COLUNA = { dura: 1.3, cresce: .3, sc: 1.05 };
export function colunaDeFogo(x, y) { B.fx.push({ labareda: true, x, y, t: COLUNA.dura }); }
export function desenharColunaDeFogo(f) {
  if (!CHAMA.img.naturalWidth) return;
  const vivo = COLUNA.dura - f.t, q = vivo < COLUNA.cresce ? Math.min(4, Math.floor(vivo / COLUNA.cresce * 5)) : 5 + Math.floor(vivo * 12) % 3;
  ctx.save(); ctx.globalAlpha = Math.min(1, f.t / .3); ctx.globalCompositeOperation = 'lighter';
  ctx.translate(f.x, f.y + 6); ctx.rotate(-Math.PI / 2); ctx.scale(COLUNA.sc, COLUNA.sc);
  ctx.drawImage(CHAMA.img, q * CHAMA.FW, 0, CHAMA.FW, CHAMA.FH, -10, -CHAMA.cy, CHAMA.FW, CHAMA.FH);
  ctx.restore();
}
