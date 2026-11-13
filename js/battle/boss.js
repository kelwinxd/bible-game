import { sfx, swordSfx } from '../core/audio.js';
import { D, reduced } from '../core/utils.js';
import { GROUND, ctx } from './config.js';
import { hitHero, overlap } from './combat.js';
import { B } from './state.js';
import { rainOnPlatform } from './frog.js';
import { drawGiant, drawGiantLie, giantBox, giantDies, giantLieY, makeGiant, nextGiantLie, updateGiant } from './giant.js';
export { drawGiant, drawGiantLie, giantLieY, makeGiant, nextGiantLie };
// B.boss é um chefão só por fase: o Leviatã (kind 'leviata', no mar) ou Golias (kind 'gigante', em terra, js/battle/giant.js)

// ---------- Chefão: Leviatã, o monstro do mar (Isaías 27:1) ----------
// Mora num `mar` (data.js → { tipo: "chefe", x, vida }: fica no mar que estiver em x). Surge quando o herói chega perto
// e fica o tempo todo dentro da água, seguindo o herói de um lado para o outro e atacando:
//  · bote (mordida) quando o herói está perto;
//  · a cada 3 ataques mergulha, some um pouco (não leva golpe) e sobe de novo em outro ponto;
//  · da metade da vida para baixo também cospe ÁCIDO (alterna bote e ácido; o ácido alcança longe, em arco).
// Não sai do mar; morre com golpes (espada, rasgo do poder, impulso). A jornada só termina depois que ele cai.
// Sprites (a arte olha para a ESQUERDA; ax/foot = meio do corpo enrolado e a base dele no quadro):
//  leviata.webp       2 linhas de 8 quadros 250×236 (1ª = nadando/parado, 2ª = bote)
//  leviata-acido.webp 8 quadros 306×236 (abre a boca → bola de ácido → jato → pinga), alinhados pelo corpo com os outros
export const LEVI = { img: new Image(), FW: 250, FH: 236, ax: 150, foot: 234, sc: 1.45, n: 8 };
LEVI.img.src = 'assets/sprites/enemy/leviata.webp';
export const ACID = { img: new Image(), FW: 306, FH: 236, ax: 194, foot: 234, n: 8 };
ACID.img.src = 'assets/sprites/enemy/leviata-acido.webp';
// Pele do chefão do mar (data.js → chefe.pele; sem ela = Leviatã). Mesmo comportamento, só muda a arte e os textos.
//  swim/bite/acid = { img, FW, FH, ax, foot, n, row }; dir = -1 se a arte olha para a esquerda; boca = de onde sai o ácido
//  (px na arte, a partir de ax/foot); sc = escala
const NAJA = { swim: { img: new Image(), FW: 288, FH: 294, ax: 136, foot: 292, n: 8 }, bite: { img: new Image(), FW: 428, FH: 260, ax: 136, foot: 258, n: 6 },
  acid: { img: new Image(), FW: 408, FH: 288, ax: 136, foot: 286, n: 6 } };
NAJA.swim.img.src = 'assets/sprites/enemy/naja-run.webp'; NAJA.bite.img.src = 'assets/sprites/enemy/naja-attack.webp'; NAJA.acid.img.src = 'assets/sprites/enemy/naja-acido.webp';
export const PELES = {
  leviata: { nome: 'Leviatã', titulo: 'o monstro do mar', furia: 'O Leviatã está furioso!', morte: 'Leviatã derrotado!', sc: LEVI.sc, dir: -1, boca: [181, 124],
    swim: { ...LEVI, row: 0 }, bite: { ...LEVI, row: 1 }, acid: { ...ACID, row: 0 } },
  // naja do mar (só no Bestiário): 3 tiras enviadas, igualadas pela do bote e alinhadas pela cauda e pela base; olha para a direita
  // jato: o ácido é o próprio sprite (sem bola): tocar no jato (quadros 3–4) tira dano; caixa em px da arte a partir de ax/foot
  // mentiras = tipo das mentiras do data.js que ela alterna (refutáveis com versículo, como o Golias); lieY = base do balão
  naja: { nome: 'Naja', titulo: 'a serpente do mar', furia: 'A Naja está furiosa!', morte: 'A Naja foi derrotada!', mentiras: 'naja', lieY: GROUND - 305, distancia: 380, ras: 5, sc: 1.25, dir: 1, boca: [249, 138], jato: { x: [235, 400], y: [108, 188], fr: [3, 5] },
    swim: { ...NAJA.swim, row: 0 }, bite: { ...NAJA.bite, row: 0 }, acid: { ...NAJA.acid, row: 0 } }
};
const SURGE_T = 1.4, SPEED = 75, REACH = 300, CD = 2, BITE_T = 1.2, BITE = [.55, .8], DMG = 15;
const ACID_T = 1.3, ACID_SPIT = .8, ACID_DMG = 12, ACID_FLY = .75, ACID_G = 900, ACID_REACH = 650;
const RAS_T = 5; // s entre uma rã e outra caindo na jangada
const DIVE_T = .9, UNDER_T = 1.8, ATKS_PER_DIVE = 3;
const WATER = 60; // a base do corpo fica dentro da água, abaixo da borda da tela (o corte de baixo da arte nunca aparece)

export function makeBoss(e) {
  const sea = B.holes.find(o => o.mar && e.x >= o.x && e.x <= o.x + o.w);
  if (!sea) return null;
  const pele = PELES[e.pele] || PELES.leviata, lies = pele.mentiras ? D.mentiras.filter(m => m.tipo === pele.mentiras) : [];
  return { kind: 'leviata', pele, lies, li: 0, lie: null, lieIn: lies.length ? 5 : 0, vuln: false, lastVerse: null, lieFlash: 0, sea, x: e.x, face: -1, hp: e.vida || 50, maxHp: e.vida || 50, state: 'hidden', t: 0, cd: 1.5, flash: 0, bitHit: false, spat: false, sink: 0, atks: 0, nextAcid: false, fase2: false };
}
const lo = L => L.sea.x + 110, hi = L => L.sea.x + L.sea.w - 110;
// corpo que leva golpe (o pescoço e a cabeça erguidos, sem a cauda)
export function bossBox(L) {
  if (L.kind === 'gigante') return giantBox(L);
  const sc = L.pele.sc, top = GROUND + WATER - 200 * sc;
  return [L.x - 95 * sc * .7, top, L.x + 95 * sc * .7, GROUND + 20]; // da água até a cabeça
}
// leva golpe: fora d'água (mergulhando ou embaixo d'água, não)
export const bossAlive = L => L && ['surge', 'swim', 'approach', 'retreat', 'bite', 'acid', 'invoca', 'chamas', 'sopro', 'enter', 'walk', 'atk', 'slam'].includes(L.state);
const fighting = L => L && L.state !== 'hidden' && L.state !== 'dead';
const heroBox = h => [h.x - 22, GROUND + h.y - 200, h.x + 22, GROUND + h.y];

function endAttack(L) { // depois de cada ataque: a cada 3, mergulha
  L.atks++; L.t = 0; L.cd = CD;
  if (L.pele.distancia) { L.state = L.lastAtk === 'bite' ? 'retreat' : 'swim'; return; } // naja: depois do bote recua (e aí mergulha)
  L.state = L.atks % ATKS_PER_DIVE ? 'swim' : 'dive';
  if (L.state === 'dive') splash(L, 14);
}
export function updateBoss(dt) {
  const L = B.boss; if (!L) return;
  const h = B.hero;
  L.flash = Math.max(0, L.flash - dt); L.t += dt;
  if (L.kind === 'gigante') return updateGiant(L, dt);
  if (L.state === 'hidden') { // espera o herói chegar perto e sobe do fundo
    // com uma laje que espera no mar: só surge quando o herói pisa nela; sem ela, quando ele chega perto do mar
    const laje = B.platforms.find(pl => pl.espera && pl.x < L.sea.x + L.sea.w && pl.x + pl.w > L.sea.x);
    const pisou = laje && h.ground && Math.abs(h.y - laje.top) < 1 && h.x > laje.x - 10 && h.x < laje.x + laje.w + 10;
    if (laje ? pisou : h.x > L.sea.x - 420) {
      L.state = 'surge'; L.t = 0; sfx('hurt');
      B.notice = { lines: [`${L.pele.nome}, ${L.pele.titulo}!`, 'Golpeie-o da laje ou da margem — e cuidado com o bote'], t: 4, c: '#ff7a6a' };
      splash(L, 22);
    }
    return;
  }
  if (L.state === 'dead') { L.sink = Math.min(1, L.sink + dt / 1.6); return; }
  if (L.fila > 0 && (L.rasT -= dt) <= 0) { // rãs na jangada: uma a cada RAS_T s (no máximo 6 vivas lá em cima)
    const pl = B.platforms.find(p => p.espera) || B.platforms[0];
    if (pl && B.frogs.filter(f => f.pl && !f.dead).length < 6) { rainOnPlatform(1, pl, L.rasAviso); L.rasAviso = false; L.fila--; }
    L.rasT = RAS_T;
  }
  if (!L.lie && L.lieIn > 0 && (L.lieIn -= dt) <= 0 && L.lies.length) { L.lie = L.lies[0]; L.lieFlash = .3; } // 5 s depois de surgir começa a mentir
  if (L.state === 'surge') { if (L.t >= SURGE_T) { L.state = 'swim'; L.t = 0; } return; }
  const N = L.pele.distancia; // naja: fica a N px do herói; só chega perto para o bote, depois recua e mergulha
  if (N && (L.state === 'approach' || L.state === 'retreat')) return updateDistante(L, h, dt, N);
  if (L.state === 'dive') { if (L.t >= DIVE_T) { L.state = 'under'; L.t = 0; } return; }
  if (L.state === 'under') { // embaixo d'água: reaparece perto do herói, de surpresa
    if (L.t >= UNDER_T) {
      L.x = Math.max(lo(L), Math.min(hi(L), h.x + (Math.random() < .5 ? -1 : 1) * (N ? N + Math.random() * 60 : 170 + Math.random() * 120)));
      L.face = h.x < L.x ? -1 : 1; L.state = 'surge'; L.t = 0; L.cd = .8; splash(L, 18); sfx('hurt');
    }
    return;
  }
  // metade da vida: passa a cuspir ácido também
  if (!L.fase2 && L.hp <= L.maxHp / 2) { L.fase2 = true; L.nextAcid = true; B.notice = { lines: [L.pele.furia, 'Agora ele cospe ácido — erga o escudo [J] ou saia do caminho'], t: 4, c: '#a8ff4a' }; }
  if (L.state === 'swim') { // segue o herói dentro do mar e olha para ele
    const want = N ? longe(L, h, N) : Math.max(lo(L), Math.min(hi(L), h.x + (h.x < L.x ? 150 : -150)));
    L.x += Math.sign(want - L.x) * Math.min(Math.abs(want - L.x), SPEED * (N ? 1.6 : 1) * dt);
    L.face = h.x < L.x ? -1 : 1;
    L.cd -= dt;
    const d = Math.abs(h.x - L.x);
    if (L.cd > 0 || h.deadAt != null) return;
    const J = L.pele.jato, alcance = J ? J.x[1] * L.pele.sc - 30 : ACID_REACH; // com jato: só cospe se o herói estiver ao alcance dele
    const acid = L.fase2 && (L.nextAcid || d >= REACH) && d < alcance;
    if (acid) { L.state = 'acid'; L.t = 0; L.spat = false; L.nextAcid = false; }
    else if (N) { if (d > N * .75 || L.cd < -1.5) { L.state = 'approach'; L.t = 0; } } // vem para o bote (só depois de ter se afastado)
    else if (d < REACH) { L.state = 'bite'; L.t = 0; L.bitHit = false; L.nextAcid = L.fase2; swordSfx('swing'); }
  } else if (L.state === 'bite') {
    if (!L.bitHit && L.t >= BITE[0] && L.t <= BITE[1] && overlap(biteBox(L), heroBox(h))) { L.bitHit = true; hitHero(DMG); }
    if (L.t >= BITE_T) { L.lastAtk = 'bite'; endAttack(L); }
  } else if (L.state === 'acid') {
    const J = L.pele.jato;
    if (J) { // o jato do sprite é o golpe: pega se o herói estiver nele enquanto o ácido sai da boca
      const fr = Math.floor(L.t / ACID_T * L.pele.acid.n);
      if (!L.spat && fr >= J.fr[0] && fr < J.fr[1] && overlap(jetBox(L, J), heroBox(h))) { L.spat = true; hitHero(ACID_DMG); goo(h.x, GROUND + h.y - 100, 12); }
    } else if (!L.spat && L.t >= ACID_SPIT) { L.spat = true; spit(L, h); }
    if (L.t >= ACID_T) { L.lastAtk = 'acid'; endAttack(L); }
  }
}
// ponto a N px do herói, do lado em que ela já está (se não couber no mar, do outro lado)
function longe(L, h, N) {
  let s = Math.sign(L.x - h.x) || 1, x = h.x + s * N;
  if (x < lo(L) || x > hi(L)) { s = -s; x = h.x + s * N; }
  return Math.max(lo(L), Math.min(hi(L), x));
}
const APPROACH_V = 300, RETREAT_V = 240, BOTE_D = 190;
function updateDistante(L, h, dt, N) {
  L.face = h.x < L.x ? -1 : 1;
  if (L.state === 'approach') { // avança rápido até ficar a BOTE_D px e dá o bote
    const want = Math.max(lo(L), Math.min(hi(L), h.x - L.face * BOTE_D));
    L.x += Math.sign(want - L.x) * Math.min(Math.abs(want - L.x), APPROACH_V * dt);
    if (Math.abs(want - L.x) < 8 || L.t > 1.6) { L.state = 'bite'; L.t = 0; L.bitHit = false; L.nextAcid = L.fase2; swordSfx('swing'); }
  } else { // recua até a distância e mergulha
    const want = longe(L, h, N);
    L.x += Math.sign(want - L.x) * Math.min(Math.abs(want - L.x), RETREAT_V * dt);
    if (Math.abs(want - L.x) < 8 || L.t > 1.4) { L.state = 'dive'; L.t = 0; splash(L, 14); }
  }
}
// a boca no bote: para o lado em que ele olha, na altura do peito do herói (da laje ou da margem)
function biteBox(L) {
  const near = L.x + L.face * 40, far = L.x + L.face * 300;
  return [Math.min(near, far), GROUND - 300, Math.max(near, far), GROUND - 110];
}
function jetBox(L, J) {
  const s = L.pele.sc, a = L.x + L.face * J.x[0] * s, b = L.x + L.face * J.x[1] * s;
  return [Math.min(a, b), GROUND + WATER - J.y[1] * s, Math.max(a, b), GROUND + WATER - J.y[0] * s];
}
// ácido: uma bola que sai da ponta do jato e cai em arco onde o herói está (mira na hora do cuspe)
function spit(L, h) {
  const P = L.pele, s = P.sc, x = L.x + L.face * P.boca[0] * s, y = GROUND + WATER - P.boca[1] * s;
  spitAcid(x, y, h.x, GROUND + h.y - 90, ACID_DMG, ACID_FLY);
}
// bola de ácido de (x, y) que cai em arco em (tx, ty) depois de T segundos (usada pelo Leviatã e pela cobra verde)
export function spitAcid(x, y, tx, ty, dmg, T) {
  B.acid.push({ x, y, vx: (tx - x) / T, vy: (ty - y - .5 * ACID_G * T * T) / T, t: 0, dmg });
  sfx('fire');
}
export function updateAcid(dt) {
  if (!B.acid || !B.acid.length) return;
  const h = B.hero;
  B.acid.forEach(a => {
    a.t += dt; a.vy += ACID_G * dt; a.x += a.vx * dt; a.y += a.vy * dt;
    if (overlap([a.x - 14, a.y - 14, a.x + 14, a.y + 14], heroBox(h))) { a.dead = true; hitHero(a.dmg || ACID_DMG); goo(a.x, a.y, 14); return; }
    if (a.y > GROUND + 20 || a.t > 3) { a.dead = true; goo(a.x, Math.min(a.y, GROUND + 10), 10); } // espirra no chão ou no mar
  });
  B.acid = B.acid.filter(a => !a.dead);
}
const goo = (x, y, n) => { for (let k = 0; k < (reduced ? n / 3 : n); k++) B.shards.push({ x, y, vx: (Math.random() - .5) * 300, vy: -Math.random() * 260, r: Math.random() * 6, t: .7, c: '150,230,60', sz: .4 + Math.random() * .5 }); };

export function damageBoss(dmg, cor = '#bbb') {
  const L = B.boss; if (!bossAlive(L)) return;
  L.hp -= dmg; L.flash = .15;
  if (L.pele && L.pele.ras) { // 5 momentos da vida (a cada 1/6 perdido): rãs caem do céu na jangada
    const k = Math.min(5, Math.floor((L.maxHp - Math.max(0, L.hp)) / (L.maxHp / 6))), pl = B.platforms.find(p => p.espera) || B.platforms[0];
    while ((L.rasK || 0) < k) { L.rasK = (L.rasK || 0) + 1; if (L.hp > 0) { L.fila = (L.fila || 0) + L.pele.ras; if (!(L.rasT > 0)) L.rasT = 0; L.rasAviso = true; } } // entram na fila: caem uma a uma
  }
  B.floats.push({ x: L.x, y: bossBox(L)[1] - 10, t: .8, s: dmg.toFixed(dmg % 1 ? 1 : 0), c: cor });
  if (B.fase.dev && L.hp <= 0 && !L.rei && !L.estatua) { // Bestiário: imortais (menos o rei e a estátua, para ver a cena e a queda)
    L.hp = L.maxHp; B.floats.push({ x: L.x, y: bossBox(L)[1] - 45, t: 1, s: 'imortal · vida cheia', c: '#9fe4ff' }); return; } // Bestiário
  if (L.hp <= 0 && L.kind === 'gigante') { L.hp = 0; return giantDies(L); }
  if (L.hp <= 0) { // afunda de vez
    L.hp = 0; L.state = 'dead'; L.t = 0; B.shake = .5; B.acid = [];
    B.risers.forEach(r => { r.up = true; }); // a terra do fim sobe da água
    B.notice = { lines: [L.pele.morte, 'O mar se acalma e a terra aparece… siga até a cruz'], t: 4, c: '#f2c84b' };
    splash(L, 30); sfx('refute');
  }
}
function splash(L, n) {
  for (let k = 0; k < (reduced ? n / 3 : n); k++)
    B.shards.push({ x: L.x + (Math.random() - .5) * 220, y: GROUND + 20, vx: (Math.random() - .5) * 340, vy: -200 - Math.random() * 380, r: Math.random() * 6, t: .9, c: '214,232,240', sz: .5 + Math.random() * .6 });
}

// desenhado dentro do mar: atrás das ondas (que cobrem a base do corpo) e das lajes
export function drawBoss(sea) {
  const L = B.boss, P = L && L.pele; if (!L || L.sea !== sea || L.state === 'hidden' || L.state === 'under' || !P.swim.img.naturalWidth) return;
  let S = P.swim, fr = Math.floor(B.time * 8) % S.n, rise = 0;
  if (L.state === 'surge') rise = 1 - Math.min(1, L.t / SURGE_T);
  else if (L.state === 'dive') rise = Math.min(1, L.t / DIVE_T);
  else if (L.state === 'bite' && P.bite.img.naturalWidth) { S = P.bite; fr = Math.min(S.n - 1, Math.floor(L.t / BITE_T * S.n)); }
  else if (L.state === 'acid' && P.acid.img.naturalWidth) { S = P.acid; fr = Math.min(S.n - 1, Math.floor(L.t / ACID_T * S.n)); }
  else if (L.state === 'dead') { rise = L.sink; fr = 0; }
  const s = P.sc, y = GROUND + WATER + rise * P.swim.FH * s * .95;
  ctx.save();
  ctx.translate(L.x, y); ctx.scale(L.face * P.dir * s, s); // dir: para onde a arte olha
  if (L.flash > 0) ctx.filter = 'brightness(3) saturate(0)';
  else if (L.state === 'bite' && L.t < BITE[0]) ctx.filter = 'drop-shadow(0 0 14px #ff2020)'; // armando o bote: brilho vermelho
  else if (L.state === 'acid' && L.t < ACID_SPIT) ctx.filter = 'drop-shadow(0 0 14px #9cff3a)'; // armando o ácido: brilho verde
  if (L.state === 'dead') ctx.globalAlpha = 1 - L.sink * .6;
  ctx.drawImage(S.img, fr * S.FW, S.row * S.FH, S.FW, S.FH, -S.ax, -S.foot, S.FW, S.FH);
  ctx.restore();
}
// bolas de ácido voando (na frente de tudo)
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
// barra de vida do chefão (no topo, abaixo do HUD) durante a luta (também enquanto ele está mergulhado)
export function drawBossBar(bar) {
  const L = B.boss; if (!fighting(L)) return;
  const k = L.state === 'surge' && L.atks === 0 ? Math.min(1, L.t / SURGE_T) : 1;
  ctx.save(); ctx.globalAlpha = k;
  ctx.fillStyle = '#000a'; ctx.fillRect(230, 58, 500, 40);
  ctx.fillStyle = L.fase2 ? '#c8ff8a' : '#ffb4a8'; ctx.font = '800 15px Cinzel, serif'; ctx.textAlign = 'center';
  ctx.fillText(L.kind === 'gigante' ? L.nome : L.state === 'dive' || L.state === 'under' ? `${L.pele.nome} · mergulhou…` : `${L.pele.nome} · ${L.pele.titulo}`, 480, 73);
  bar(250, 79, 460, 12, L.hp / L.maxHp, L.fase2 ? '#5f9e1c' : '#b3261e', '');
  ctx.restore();
}
export const bossBlocksWin = () => !!B.boss && B.boss.state !== 'dead'; // vitória só com o chefão no fundo do mar
