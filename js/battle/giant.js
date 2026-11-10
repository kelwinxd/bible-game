import { sfx, stoneSfx, swordSfx } from '../core/audio.js';
import { opts } from '../core/options.js';
import { D } from '../core/utils.js';
import { tema } from './hud.js';
import { GROUND, ctx } from './config.js';
import { heroDies, hitHero, overlap } from './combat.js';
import { B } from './state.js';

// ---------- Chefão da Jornada 2: Golias, o gigante de Gate (1 Samuel 17) ----------
// data.js → { tipo: "gigante", x, vida }. Quando o herói chega perto, a câmera trava numa arena e ele entra pela direita.
// Anda até o herói e, de perto, dá uma estocada de lança (arma brilhando vermelho → estoca). Bem maior que o herói.
// A cada 3 ataques (ou se o herói ficar longe) bate a lança no CHÃO: a tela treme e quem estiver no chão leva dano
// (o escudo não segura o tremor: tem que estar no ar — pular na hora do golpe).
// Leva espada, rasgo do poder e impulso. A jornada só termina depois que ele cai.
// Fala mentiras (data.js → mentiras do tipo "gigante", na ordem), num balão escuro e dourado mais forte que o dos outros.
// Cada uma é refutada por um versículo; quando o poder dela acaba, ele troca para a próxima (que pede o outro versículo).
// Sprites (a arte olha para a DIREITA; ax = meio dos pés, pés na base):
//  gigante-run.webp    8 quadros 504×370 (andando)
//  gigante-attack.webp 5 quadros 504×370 (guarda → arma → recolhe → ESTOCA → volta)
//  gigante-chao.webp   8 quadros 524×396 (guarda → ergue → no alto → desce → BATE no chão → faísca e poeira), ampliados 1,43× da arte enviada
export const GIG = { run: new Image(), atk: new Image(), FW: 504, FH: 370, ax: 180, foot: 364, sc: .82, chao: 12 }; // chao: afunda um pouco na grama (não flutua)
GIG.run.src = 'assets/sprites/enemy/gigante-run.webp'; GIG.atk.src = 'assets/sprites/enemy/gigante-attack.webp';
export const SLAM = { img: new Image(), FW: 524, FH: 396, ax: 180, foot: 390 };
SLAM.img.src = 'assets/sprites/enemy/gigante-chao.webp';
const SLAM_T = 1.45, SLAM_HIT = .76, SLAM_DMG = 14, SLAM_Q = [[0, 0], [.15, 1], [.32, 2], [.55, 3], [.76, 4], [.92, 5], [1.08, 6], [1.25, 7]];
const SPEED = 70, REACH = 250, CD = 1.4, DMG = 18;
const ATK_T = 1.05, ATK = [[0, 0], [.15, 1], [.35, 2], [.52, 3], [.78, 4]], HIT = [.52, .68]; // [t, quadro]; acerta na estocada
const ENTER_T = 1.6, DIE_T = 1.4;

export function makeGiant(e) {
  const lies = D.mentiras.filter(m => m.tipo === 'gigante');
  return { kind: 'gigante', nome: 'Golias · o gigante de Gate', x: e.x, home: e.x, face: -1, hp: e.vida || 60, maxHp: e.vida || 60, state: 'hidden', t: 0, cd: 1, flash: 0, hit: false, sink: 0,
    lies, li: 0, lie: null, lieIn: 5, // a 1ª mentira só aparece 5 s depois de ele surgir
    vuln: false, lastVerse: null, lieFlash: 0 };
}
// próxima mentira (chamada quando o poder do versículo contra ele acaba): alterna o versículo que a refuta
export function nextGiantLie(L) { if (!L.lies.length) return; L.li = (L.li + 1) % L.lies.length; L.lie = L.lies[L.li]; L.vuln = false; L.lieFlash = .3; }
export const giantBox = L => [L.x - 60, GROUND - 290, L.x + 60, GROUND];
const heroBox = h => [h.x - 22, GROUND + h.y - 160, h.x + 22, GROUND + h.y];
// a ponta da lança na estocada: para o lado em que ele olha, na altura do peito do herói
function spearBox(L) {
  const near = L.x + L.face * 40, far = L.x + L.face * 300 * GIG.sc;
  return [Math.min(near, far), GROUND - 200, Math.max(near, far), GROUND - 80];
}

export function updateGiant(L, dt) {
  const h = B.hero;
  if (L.state === 'hidden') {
    if (h.x > L.home - 620 && !B.arena && B.groups.every(g => g.done) && !B.demons.length) { // arena: a câmera trava e ele entra
      B.arena = { left: L.home - 740, right: L.home + 220, boss: true };
      L.state = 'enter'; L.t = 0; L.x = B.arena.right + 160; L.face = -1; sfx('hurt');
      B.notice = { lines: ['Golias, o gigante de Gate!'], t: 3, c: '#ffb46a' };
    }
    return;
  }
  if (L.state === 'dead') { L.sink = Math.min(1, L.sink + dt / DIE_T); return; }
  if (!L.lie && L.lieIn > 0 && (L.lieIn -= dt) <= 0 && L.lies.length) { L.lie = L.lies[0]; L.lieFlash = .3; } // chega calado; depois de 5 s começa a mentir
  if (L.state === 'enter') { L.x = Math.max(L.home, L.x - 220 * dt); if (L.x <= L.home) { L.state = 'walk'; L.t = 0; } return; }
  const dx = h.x - L.x;
  if (L.state === 'walk') {
    L.face = Math.sign(dx) || L.face; L.cd -= dt;
    if (Math.abs(dx) > REACH - 40) L.x += Math.sign(dx) * SPEED * dt;
    L.x = Math.max(B.arena.left + 80, Math.min(B.arena.right - 60, L.x));
    const longe = Math.abs(dx) > REACH + 80, terceiro = (L.atks || 0) % 3 === 2;
    if (L.cd <= 0 && h.deadAt == null && (terceiro || (longe && L.t > 1.2))) { L.state = 'slam'; L.t = 0; L.hit = false; } // golpe no chão
    else if (L.cd <= 0 && Math.abs(dx) < REACH && h.deadAt == null) { L.state = 'atk'; L.t = 0; L.hit = false; }
  } else if (L.state === 'atk') {
    if (!L.hit && L.t >= HIT[0] && L.t <= HIT[1]) {
      if (L.t - dt < HIT[0]) swordSfx('swing'); // o vento da lança
      if (overlap(spearBox(L), heroBox(h))) { L.hit = true; hitHero(DMG); }
    }
    if (L.t >= ATK_T) { L.state = 'walk'; L.t = 0; L.cd = CD; L.atks = (L.atks || 0) + 1; }
  } else if (L.state === 'slam') {
    if (!L.hit && L.t >= SLAM_HIT) { // a lança bate no chão: treme tudo; quem está no chão leva dano
      L.hit = true; B.shake = .55; stoneSfx('crack', 1);
      const tip = L.x + L.face * 150 * GIG.sc;
      for (let k = 0; k < 18; k++) B.shards.push({ x: tip + (Math.random() - .5) * 80, y: GROUND - 4, vx: (Math.random() - .5) * 420, vy: -120 - Math.random() * 320, r: Math.random() * 6, t: .9, c: Math.random() < .5 ? '255,190,90' : '120,95,70', sz: .5 + Math.random() * .7 });
      if (!B.slamTold) { B.slamTold = true; B.notice = { lines: ['O chão treme!', 'Pule [W] na hora do golpe — o escudo não segura o tremor'], t: 3.5, c: '#ffb46a' }; }
      if (h.ground && !(h.dash > 0) && !B.over) quake(h); // no ar (pulando) ou atravessando no impulso: não pega
    }
    if (L.t >= SLAM_T) { L.state = 'walk'; L.t = 0; L.cd = CD; L.atks = (L.atks || 0) + 1; }
  }
}
// dano do tremor: direto na vida (o escudo não bloqueia), com o mesmo aviso vermelho dos outros golpes
function quake(h) {
  sfx('hurt'); if (!opts.god) B.hp = Math.max(0, B.hp - SLAM_DMG); h.hurt = .3;
  B.floats.push({ x: h.x, y: GROUND + h.y - 250, t: .9, s: '-' + SLAM_DMG, c: '#ff5a4a' });
  if (B.hp <= 0) heroDies(); // vida zerada: a mesma morte dos outros golpes
}
export function giantDies(L) {
  L.state = 'dead'; L.t = 0; L.sink = 0; B.shake = .5;
  if (B.arena && B.arena.boss) B.arena = null;
  B.notice = { lines: ['Golias caiu!', 'Siga até a cruz no fim da jornada'], t: 4, c: '#f2c84b' };
  sfx('refute');
}

export function drawGiant() {
  const L = B.boss; if (!L || L.kind !== 'gigante' || L.state === 'hidden' || !GIG.run.naturalWidth) return;
  let img = GIG.run, fr = Math.floor(B.time * 8) % 8;
  let S = GIG;
  if (L.state === 'atk' && GIG.atk.naturalWidth) { img = GIG.atk; ATK.forEach(([t, q]) => { if (L.t >= t) fr = q; }); }
  else if (L.state === 'slam' && SLAM.img.naturalWidth) { S = SLAM; img = SLAM.img; SLAM_Q.forEach(([t, q]) => { if (L.t >= t) fr = q; }); }
  else if (L.state === 'dead') fr = 0;
  const s = GIG.sc;
  ctx.save();
  ctx.translate(L.x, GROUND + GIG.chao + (L.state === 'dead' ? L.sink * 40 : 0)); ctx.scale(L.face * s, s);
  if (L.flash > 0) ctx.filter = 'brightness(3) saturate(0)';
  else if ((L.state === 'atk' && L.t < HIT[0]) || (L.state === 'slam' && L.t < SLAM_HIT)) ctx.filter = 'drop-shadow(0 0 16px #ff2020)'; // armando o golpe
  if (L.state === 'dead') ctx.globalAlpha = 1 - L.sink;
  ctx.drawImage(img, fr * S.FW, 0, S.FW, S.FH, -S.ax, -S.foot, S.FW, S.FH);
  ctx.restore();
}

// balão da mentira do Golias: escuro, borda dourada grossa, letra em caixa alta (mais forte que o papel dos outros inimigos).
// Refutado: a borda e o brilho ficam na cor do versículo
export const giantLieY = L => (L.pele && L.pele.lieY) || GROUND - 285; // abaixo da barra de vida do chefão (a Naja traz o dela)
export function drawGiantLie() {
  // também o chefão do mar que mente (Naja): some enquanto ele mergulha ou sobe da água
  const L = B.boss; if (!L || !L.lies || !L.lie || !['walk', 'atk', 'slam', 'swim', 'bite', 'acid'].includes(L.state)) return;
  L.lieFlash = Math.max(0, L.lieFlash - 1 / 60);
  ctx.save(); ctx.globalAlpha = 1 - L.lieFlash / .3;
  ctx.font = '800 19px Cinzel, Georgia, serif';
  const words = L.lie.texto.toUpperCase().split(' '), lines = []; let ln = '';
  words.forEach(w => { if (ctx.measureText(ln + ' ' + w).width > 400 && ln) { lines.push(ln); ln = w; } else ln = ln ? ln + ' ' + w : w; });
  lines.push(ln);
  const bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 40, bh = lines.length * 26 + 20;
  const cx = Math.min(B.cam + 960 - bw / 2 - 8, Math.max(B.cam + bw / 2 + 8, L.x)), y = giantLieY(L) - bh;
  const tc = L.vuln && L.lastVerse && tema(L.lastVerse), pulse = .5 + .5 * Math.sin(B.time * 4);
  ctx.shadowColor = tc ? tc.brilho : '#ff3a1a'; ctx.shadowBlur = tc ? 22 : 10 + pulse * 10;
  const g = ctx.createLinearGradient(0, y, 0, y + bh); g.addColorStop(0, '#3a0a08'); g.addColorStop(1, '#160403');
  ctx.fillStyle = g; ctx.strokeStyle = tc ? tc.cor : '#d4a038'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.roundRect(cx - bw / 2, y, bw, bh, 6); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(L.x - 14, y + bh); ctx.lineTo(L.x, y + bh + 20); ctx.lineTo(L.x + 14, y + bh); ctx.closePath(); ctx.fill(); ctx.stroke(); // ponta para ele
  ctx.shadowBlur = 0; ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd98a';
  lines.forEach((l, i) => { const ty = y + 32 + i * 26; ctx.strokeText(l, cx, ty); ctx.fillText(l, cx, ty); });
  ctx.restore();
}
