import { sfx, stoneSfx, swordSfx } from '../core/audio.js';
import { opts } from '../core/options.js';
import { D } from '../core/utils.js';
import { tema } from './hud.js';
import { GROUND, ctx } from './config.js';
import { heroDies, hitHero, overlap } from './combat.js';
import { B } from './state.js';
import { makeFrog } from './frog.js';
import { startPreCena } from './cena.js';

// ---------- Chefão da Jornada 3: Golias, o gigante de Gate (1 Samuel 17) ----------
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

// ---------- Chefão da Jornada 4: Nabucodonosor, o rei de Babilônia (Daniel 3–4) ----------
// data.js → { tipo: "gigante", pele: "rei", x, vida }. Mesma arena e mesmas mentiras do Golias, mas luta de longe: anda
// guardando ~320 px do herói e, parado (idle) com os olhos brilhando, dispara FOGO DOS OLHOS em linha reta no herói
// (o escudo bloqueia); a cada 3 ataques, uma rajada de 3. Para golpeá-lo é preciso chegar perto (ou usar o rasgo do poder).
// Sprites (olham para a DIREITA; ax = tronco, pés na base): rei-walk.webp 6 quadros 195×278 (andando),
// rei-idle.webp 6 quadros 149×304 (parado, o fogo dos olhos tremulando) — a arte do idle veio ~5% maior e foi igualada
export const REI = { walk: { img: new Image(), FW: 195, FH: 278, ax: 82, n: 6, fps: 7 }, idle: { img: new Image(), FW: 149, FH: 304, ax: 71, n: 6, fps: 6 },
  olhos: [55, 245], chao: 4 }; // olhos: de onde sai o fogo (px à frente do tronco, px acima do chão)
REI.walk.img.src = 'assets/sprites/enemy/rei-walk.webp'; REI.idle.img.src = 'assets/sprites/enemy/rei-idle.webp';
// invocar: rei-invoca.webp 6 quadros 224×280 (ergue as mãos em chamas); lança-chamas: rei-chamas.webp 6 quadros 224×269
// (arma → estica os braços, o último segura o jato); a chama: hazard/chama-rei.webp 8 quadros 237×134 (cresce nos 5 primeiros,
// depois os 3 últimos em loop), alinhados pela cauda (que sai das mãos), desenhada 1,3× mais comprida
REI.invoca = { img: new Image(), FW: 224, FH: 280, ax: 89, n: 6 }; REI.chamas = { img: new Image(), FW: 224, FH: 269, ax: 91, n: 6 };
REI.invoca.img.src = 'assets/sprites/enemy/rei-invoca.webp'; REI.chamas.img.src = 'assets/sprites/enemy/rei-chamas.webp';
export const CHAMA = { img: new Image(), FW: 237, FH: 134, cy: 66, n: 8, sx: 1.3, maos: [118, 180], ang: .36 }; // maos: px à frente do tronco, px acima do chão; ang: o jato desce na diagonal (~20°) até a altura do herói
CHAMA.img.src = 'assets/sprites/hazard/chama-rei.webp';
const INV_T = 1.6, INV_SURGE = .9, INV_N = 2, INV_MAX = 3; // invocar: quadros em 0,9 s; os soldados surgem do chão em fogo
const CH_ARMA = .6, CH_DUR = 2, CH_CRESCE = .35, CH_TICK = .35, CH_DMG = 5; // lança-chamas: arma 0,6 s, jato 2 s, dano a cada 0,35 s dentro dele
const SEQ_REI = ['atk', 'chamas', 'atk', 'invoca', 'slam']; // a ordem dos ataques (em loop)

// ---------- Chefão final da Babilônia: a estátua de ouro (Daniel 3) ----------
// Surge quando a cena dela despertando acaba (o rei já caiu): gigante, ATRÁS do chão, no meio da arena — só do saiote para
// cima aparece. Não anda; ataca só com os braços: SOCO NO CHÃO (ergue o punho com brilho → gira o braço → o punho bate no
// chão): a tela treme e quem estiver no chão leva dano (o escudo não segura o tremor: pule na hora do soco).
// Leva golpe na altura do corpo dela (espada, rasgo do poder, impulso). Quando cai, afunda atrás do piso e a cruz libera.
// Sprites (de frente, alinhados pelo meio do pedestal; a mesma escala): estatua-idle.webp 4 quadros 300×667 (braços
// cruzados, respirando); estatua-soco.webp 5 quadros 360×667 (cruzados → ergue o punho → gira → SOCO com faísca → segue)
export const ESTATUA = { idle: { img: new Image(), FW: 300, FH: 667, n: 4, fps: 3 }, soco: { img: new Image(), FW: 360, FH: 667, n: 5 }, sc: 1.12, punho: 345 }; // punho: y da arte onde fica o punho no soco (vai na borda do piso)
ESTATUA.idle.img.src = 'assets/sprites/enemy/estatua-idle.webp'; ESTATUA.soco.img.src = 'assets/sprites/enemy/estatua-soco.webp';
// sopro de fogo: estatua-sopro.webp 6 quadros 360×667 (abre a boca → o fogo sai e desce); os 2 últimos em loop 4 vezes,
// e a cada volta ele cospe uma bola de fogo em arco até onde o herói está (fere no voo e onde cai, perto do chão)
ESTATUA.sopro = { img: new Image(), FW: 360, FH: 667, n: 6 }; ESTATUA.sopro.img.src = 'assets/sprites/enemy/estatua-sopro.webp';
const S_ABRE = [[0, 0], [.2, 1], [.45, 2], [.7, 3]], S_LOOP0 = .9, S_TROCA = .15, S_VOLTAS = 4, S_FIM = S_LOOP0 + S_VOLTAS * 2 * S_TROCA + .3;
const S_VOO = .85, S_G = 1100, S_DMG = 12, S_RAIO = 55, BOCA = [12, 150]; // BOCA: px da arte (do meio, de cima) de onde sai o fogo
// morte: estatua-morte.webp 4 quadros 561×609 (urra → cambaleia → cai de joelhos → tomba deitado), alinhados pelos pés, na
// mesma escala (sc). Os pés ficam atrás do piso; a "linha dos pés" sobe um pouco a cada quadro (M_BASE, px abaixo do chão) para
// o corpo deitado ainda aparecer por cima da borda. Depois de M_FICA s deitada, afunda atrás do piso (M_AFUNDA s)
ESTATUA.morte = { img: new Image(), FW: 561, FH: 609, pe: 605, n: 4 }; ESTATUA.morte.img.src = 'assets/sprites/enemy/estatua-morte.webp';
const M_QUADROS = [0, .5, 1, 1.5], M_BASE = [234, 210, 170, 110], M_FICA = 2.9, M_AFUNDA = 1.3;
const E_SOBE = 1.4; // s que ela leva levantando de trás do piso (sem fade: sobe inteira)
const sobe = L => { const k = Math.min(1, (L.aparece || 0) / E_SOBE); return (1 - (1 - Math.pow(1 - k, 3))) * 480; }; // px que ainda falta subir (desacelera no fim)
const estTopo = L => GROUND - 35 - ESTATUA.punho * ESTATUA.sc + sobe(L) + (L.state === 'dead' ? L.sink * 480 : 0);
const E_VIDA = 80, E_CD = [2, 3], E_SOCO_T = 1.35, E_SOCO = [[0, 0], [.12, 1], [.5, 2], [.72, 3], [.95, 4]], E_IMPACTO = .75, E_DMG = 16;
export function makeEstatua(x) {
  return { kind: 'gigante', estatua: true, nome: 'Ídolo Babilônico · a estátua de ouro do rei', x, home: x, face: -1, hp: E_VIDA, maxHp: E_VIDA, state: 'walk', t: 0, cd: 2.5, flash: 0,
    hit: false, sink: 0, lies: [], li: 0, lie: null, lieIn: 0, vuln: false, lastVerse: null, lieFlash: 0, bolas: [], aparece: 0 };
}
function updateEstatuaBoss(L, h, dt) {
  L.aparece += dt;
  if (L.aparece < E_SOBE) { // levantando de trás do piso: o chão treme e solta poeira; ainda não ataca
    B.shake = Math.max(B.shake, .18);
    if (Math.random() < dt * 30) B.shards.push({ x: L.x + (Math.random() - .5) * 320, y: GROUND - 45, vx: (Math.random() - .5) * 260, vy: -120 - Math.random() * 260, r: Math.random() * 6, t: .9, c: Math.random() < .5 ? '200,170,110' : '120,95,70', sz: .5 + Math.random() * .7 });
    if (L.aparece - dt <= 0) stoneSfx('collapse');
    return;
  }
  if (L.state === 'walk') {
    if ((L.cd -= dt) <= 0 && h.deadAt == null) { L.state = (L.atks || 0) % 2 ? 'sopro' : 'atk'; L.t = 0; L.hit = false; L.tiros = 0; } // soco e sopro, alternando
  } else if (L.state === 'atk') {
    if (!L.hit && L.t >= E_IMPACTO) { // o punho bate no chão: treme tudo; quem está no chão leva dano
      L.hit = true; B.shake = .7; stoneSfx('crack', 1);
      const px = L.x - 75 * ESTATUA.sc; // o punho (a arte soca com o braço do lado esquerdo da tela)
      for (let k = 0; k < 26; k++) B.shards.push({ x: px + (Math.random() - .5) * 160, y: GROUND - 40 - Math.random() * 20, vx: (Math.random() - .5) * 520, vy: -150 - Math.random() * 380, r: Math.random() * 6, t: 1, c: Math.random() < .5 ? '255,200,90' : '110,90,70', sz: .6 + Math.random() * .8 });
      if (!B.socoTold) { B.socoTold = true; B.notice = { lines: ['O Ídolo Babilônico soca o chão!', 'Pule [W] na hora do soco — o escudo não segura o tremor'], t: 3.5, c: '#ffb46a' }; }
      if (h.ground && !(h.dash > 0) && !B.over) quake(h, E_DMG);
    }
    if (L.t >= E_SOCO_T) { L.state = 'walk'; L.t = 0; L.atks = (L.atks || 0) + 1; L.cd = E_CD[0] + Math.random() * (E_CD[1] - E_CD[0]); }
  } else if (L.state === 'sopro') { // a cada volta do loop do fogo, cospe uma bola em arco até o herói
    while (L.tiros < S_VOLTAS && L.t >= S_LOOP0 + L.tiros * 2 * S_TROCA) { L.tiros++; cuspe(L, h); }
    if (L.t >= S_FIM) { L.state = 'walk'; L.t = 0; L.atks = (L.atks || 0) + 1; L.cd = E_CD[0] + Math.random() * (E_CD[1] - E_CD[0]); }
  }
}
function cuspe(L, h) {
  const sc = ESTATUA.sc, x = L.x + BOCA[0] * sc, y = estTopo(L) + BOCA[1] * sc;
  const tx = h.x + (Math.random() - .5) * 60, ty = GROUND + h.y - 30; // mira onde o herói está (com um pouco de espalho)
  L.bolas.push({ x, y, vx: (tx - x) / S_VOO, vy: (ty - y - .5 * S_G * S_VOO * S_VOO) / S_VOO, g: S_G, t: 0, dmg: S_DMG, chao: true, r: 22 });
  sfx('fire');
}
// morte: urra, cambaleia, cai de joelhos (tremor) e tomba (tremor forte, desabamento e poeira); deitada um tempo, afunda
function morteEstatua(L, dt) {
  const t = L.t, antes = t - dt, poeira = (n, f) => { for (let k = 0; k < n; k++) B.shards.push({ x: L.x + (Math.random() - .5) * 500, y: GROUND - Math.random() * 20, vx: (Math.random() - .5) * 420 * f, vy: -80 - Math.random() * 260 * f, r: Math.random() * 6, t: 1.1, c: Math.random() < .5 ? '255,200,90' : '120,100,80', sz: .6 + Math.random() * .9 }); };
  if (antes < .05 && t >= .05) { B.shake = Math.max(B.shake, .3); stoneSfx('crack', .6); } // o urro: a pedra range
  if (antes < M_QUADROS[2] && t >= M_QUADROS[2]) { B.shake = Math.max(B.shake, .5); stoneSfx('crack', 1); poeira(14, .7); } // de joelhos
  if (antes < M_QUADROS[3] && t >= M_QUADROS[3]) { B.shake = Math.max(B.shake, .85); stoneSfx('collapse'); poeira(34, 1); } // tomba no chão
  L.sink = Math.max(0, Math.min(1, (t - M_FICA) / M_AFUNDA));
}
// desenhada antes do chão (fica atrás do piso); quando cai, a animação de morte e depois afunda
export function drawEstatua() {
  const L = B.boss; if (!L || !L.estatua) return;
  const M = ESTATUA.morte;
  if (L.state === 'dead' && M.img.naturalWidth) {
    let q = 0; M_QUADROS.forEach((t0, i) => { if (L.t >= t0) q = i; });
    const sc = ESTATUA.sc, pe = GROUND + M_BASE[q] + L.sink * 380; // a linha dos pés (atrás do piso)
    ctx.save(); ctx.globalAlpha = 1 - L.sink * .5;
    ctx.drawImage(M.img, q * M.FW, 0, M.FW, M.FH, L.x - M.FW / 2 * sc, pe - M.pe * sc, M.FW * sc, M.FH * sc);
    ctx.restore(); return;
  }
  const S = L.state === 'atk' ? ESTATUA.soco : L.state === 'sopro' && ESTATUA.sopro.img.naturalWidth ? ESTATUA.sopro : ESTATUA.idle; if (!S.img.naturalWidth) return;
  let fr = Math.floor(B.time * (S.fps || 3)) % S.n;
  if (L.state === 'atk') { fr = 0; E_SOCO.forEach(([t, q]) => { if (L.t >= t) fr = q; }); }
  else if (S === ESTATUA.sopro) { fr = 0; S_ABRE.forEach(([t, q]) => { if (L.t >= t) fr = q; }); if (L.t >= S_LOOP0) fr = 4 + Math.floor((L.t - S_LOOP0) / S_TROCA) % 2; } // os 2 últimos em loop
  const sc = ESTATUA.sc, topo = estTopo(L); // o punho chega à borda do piso
  ctx.save(); ctx.globalAlpha = L.state === 'dead' ? 1 - L.sink * .5 : 1; // sem fade ao surgir: ela sobe (estTopo)
  if (L.flash > 0) ctx.filter = 'brightness(2.4) saturate(.3)';
  else if ((L.state === 'atk' && L.t < E_IMPACTO) || (L.state === 'sopro' && L.t < S_LOOP0)) ctx.filter = `drop-shadow(0 0 ${14 + 10 * Math.sin(L.t * 30)}px #ff5010)`; // armando o soco
  ctx.drawImage(S.img, fr * S.FW, 0, S.FW, S.FH, L.x - S.FW / 2 * sc, topo, S.FW * sc, S.FH * sc);
  ctx.restore();
}
const R_DIST = 320, R_SPEED = 60, R_CD = 1.8, R_ARMA = .7, R_ATK_T = 1.1, R_VOO = 430, R_DMG = 14;
const R_RAJADA = [.8, 1.05, 1.3], R_RAJADA_T = 1.75;

export function makeGiant(e) {
  const rei = e.pele === 'rei', lies = D.mentiras.filter(m => m.tipo === (rei ? 'rei' : 'gigante'));
  return { kind: 'gigante', rei, bolas: [], lieY: rei ? GROUND - 300 : 0, nome: rei ? 'Nabucodonosor · o rei de Babilônia' : 'Golias · o gigante de Gate', x: e.x, home: e.x, face: -1, hp: e.vida || 60, maxHp: e.vida || 60, state: 'hidden', t: 0, cd: 1, flash: 0, hit: false, sink: 0,
    lies, li: 0, lie: null, lieIn: 5, // a 1ª mentira só aparece 5 s depois de ele surgir
    vuln: false, lastVerse: null, lieFlash: 0 };
}
// próxima mentira (chamada quando o poder do versículo contra ele acaba): alterna o versículo que a refuta
export function nextGiantLie(L) { if (!L.lies.length) return; L.li = (L.li + 1) % L.lies.length; L.lie = L.lies[L.li]; L.vuln = false; L.lieFlash = .3; }
export const giantBox = L => L.estatua ? [L.x - 115, GROUND - 400, L.x + 115, GROUND] : L.rei ? [L.x - 50, GROUND - 270, L.x + 50, GROUND] : [L.x - 60, GROUND - 290, L.x + 60, GROUND];
const heroBox = h => [h.x - 22, GROUND + h.y - 160, h.x + 22, GROUND + h.y];
// a ponta da lança na estocada: para o lado em que ele olha, na altura do peito do herói
function spearBox(L) {
  const near = L.x + L.face * 40, far = L.x + L.face * 300 * GIG.sc;
  return [Math.min(near, far), GROUND - 200, Math.max(near, far), GROUND - 80];
}

export function updateGiant(L, dt) {
  const h = B.hero;
  if (L.state === 'hidden') {
    if (h.x > L.home - 620 && !B.zona && !B.arena && B.groups.every(g => g.done) && !B.demons.length) { // arena: a câmera trava e ele entra
      B.arena = { left: L.home - 740, right: L.home + 220, boss: true };
      L.state = 'enter'; L.t = 0; L.x = B.arena.right + 160; L.face = -1; sfx('hurt');
      B.notice = { lines: [L.rei ? 'Nabucodonosor, o rei de Babilônia!' : 'Golias, o gigante de Gate!'], t: 3, c: '#ffb46a' };
    }
    return;
  }
  if (L.rei || L.estatua) updateBolas(L, h, dt);
  if (L.state === 'dead' && L.estatua) return morteEstatua(L, dt);
  if (L.state === 'dead') { // o rei: depois de afundar, a cena da estátua que desperta (uma vez)
    L.sink = Math.min(1, L.sink + dt / DIE_T);
    if (L.rei && !L.cenaVista && L.sink >= 1) { L.cenaVista = true; startPreCena(); } // na fase e no Bestiário: tremor e fala, depois a cena
    if (L.rei && L.cenaVista && !B.prec && !B.cena && B.boss === L) { // a cena acabou: a estátua de ouro é o próximo chefão (na mesma arena)
      B.boss = makeEstatua(L.home - 260); B.arena = { left: L.home - 740, right: L.home + 220, boss: true };
      B.notice = { lines: ['O Ídolo Babilônico se levanta contra você!'], t: 3, c: '#ffb46a' };
    }
    return;
  }
  if (!L.lie && L.lieIn > 0 && (L.lieIn -= dt) <= 0 && L.lies.length) { L.lie = L.lies[0]; L.lieFlash = .3; } // chega calado; depois de 5 s começa a mentir
  if (L.state === 'enter') { L.x = Math.max(L.home, L.x - 220 * dt); if (L.x <= L.home) { L.state = 'walk'; L.t = 0; } return; }
  if (L.rei) return updateRei(L, h, dt);
  if (L.estatua) return updateEstatuaBoss(L, h, dt);
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
// o rei: anda guardando distância; parado, arma (olhos brilhando) e dispara fogo; a cada 3, rajada de 3
function updateRei(L, h, dt) {
  const dx = h.x - L.x;
  L.face = Math.sign(dx) || L.face;
  if (L.state === 'walk') {
    L.cd -= dt;
    const want = Math.abs(dx) - R_DIST; // >0: longe demais (chega perto); <0: perto demais (recua)
    if (Math.abs(want) > 30) L.x += Math.sign(dx) * Math.sign(want) * R_SPEED * dt;
    L.x = Math.max(B.arena.left + 80, Math.min(B.arena.right - 60, L.x));
    L.anda = Math.abs(want) > 30;
    if (L.cd <= 0 && h.deadAt == null) {
      let a = SEQ_REI[(L.atks || 0) % SEQ_REI.length];
      if (a === 'invoca' && soldadosDoRei() >= INV_MAX - 1) a = 'atk'; // já tem soldados demais: atira
      L.state = a; L.t = 0; L.tiros = 0; L.tick = 0;
    }
  } else if (L.state === 'atk') {
    if (!L.tiros && L.t >= R_ARMA) { L.tiros = 1; fogo(L, h); }
    if (L.t >= R_ATK_T) { L.state = 'walk'; L.t = 0; L.cd = R_CD; L.atks = (L.atks || 0) + 1; }
  } else if (L.state === 'slam') { // rajada
    while (L.tiros < R_RAJADA.length && L.t >= R_RAJADA[L.tiros]) { L.tiros++; fogo(L, h); }
    if (L.t >= R_RAJADA_T) { L.state = 'walk'; L.t = 0; L.cd = R_CD; L.atks = (L.atks || 0) + 1; }
  } else if (L.state === 'invoca') { // ergue as mãos: soldados esqueletos brotam do chão em fogo, ao lado dele
    if (!L.tiros && L.t >= INV_SURGE) {
      L.tiros = 1; sfx('fire'); B.shake = .25;
      for (let k = 0; k < INV_N; k++) {
        const x = Math.max(B.arena.left + 60, Math.min(B.arena.right - 40, L.x + L.face * (110 + k * 90)));
        const s = makeFrog({ tipo: 'soldado', x, bando: 'rei' }); s.face = L.face; s.cd = .8; B.frogs.push(s);
        for (let q = 0; q < 16; q++) B.shards.push({ x: x + (Math.random() - .5) * 60, y: GROUND - Math.random() * 20, vx: (Math.random() - .5) * 200, vy: -150 - Math.random() * 300, r: Math.random() * 6, t: .8, c: Math.random() < .5 ? '255,170,60' : '255,80,20', sz: .5 + Math.random() * .6 });
      }
      if (!B.invocTold) { B.invocTold = true; B.notice = { lines: ['O rei invoca seus soldados!'], t: 2.5, c: '#ffb46a' }; }
    }
    if (L.t >= INV_T) { L.state = 'walk'; L.t = 0; L.cd = R_CD; L.atks = (L.atks || 0) + 1; }
  } else if (L.state === 'chamas') { // lança-chamas: arma e solta um jato de fogo das mãos por 2 s; fere a cada tique dentro dele
    const tj = L.t - CH_ARMA;
    if (tj >= 0 && tj < CH_DUR) {
      if (tj - dt < 0) sfx('fire');
      if ((L.tick -= dt) <= 0 && chamaPega(L, tj, heroBox(h))) { hitHero(CH_DMG); L.tick = CH_TICK; }
    }
    if (L.t >= CH_ARMA + CH_DUR + .25) { L.state = 'walk'; L.t = 0; L.cd = R_CD; L.atks = (L.atks || 0) + 1; }
  }
}
const soldadosDoRei = () => B.frogs.filter(f => f.bando === 'rei' && !f.dead).length;
// o jato: das mãos para a frente e para baixo (na diagonal), crescendo no começo; pega se a caixa tocar algum trecho dele
function chamaPega(L, tj, hb) {
  if (tj < 0 || tj >= CH_DUR) return false;
  const len = CHAMA.FW * CHAMA.sx * Math.min(1, .25 + tj / CH_CRESCE), x0 = L.x + L.face * CHAMA.maos[0], y0 = GROUND - CHAMA.maos[1];
  const cx = Math.cos(CHAMA.ang), sy = Math.sin(CHAMA.ang), r = 20 + 20 * Math.min(1, tj / CH_CRESCE); // o jato engrossa na ponta
  for (let d = 0; d <= len; d += 25) {
    const px = x0 + L.face * cx * d, py = y0 + sy * d, rr = r * (.6 + .6 * d / len);
    if (overlap([px - rr, py - rr, px + rr, py + rr], hb)) return true;
  }
  return false;
}
const chamaFrame = tj => tj < CH_CRESCE ? Math.min(4, Math.floor(tj / CH_CRESCE * 5)) : 5 + Math.floor((tj - CH_CRESCE) * 10) % 3; // cresce, depois os 3 últimos em loop
// bola de fogo dos olhos: reta até o peito do herói (mira na hora do disparo)
function fogo(L, h) {
  const x = L.x + L.face * REI.olhos[0], y = GROUND - REI.olhos[1], tx = h.x, ty = GROUND + h.y - 90;
  const d = Math.hypot(tx - x, ty - y) || 1;
  L.bolas.push({ x, y, vx: (tx - x) / d * R_VOO, vy: (ty - y) / d * R_VOO, t: 0 });
  sfx('fire');
}
function updateBolas(L, h, dt) {
  L.bolas.forEach(b => {
    b.t += dt; b.vy += (b.g || 0) * dt; b.x += b.vx * dt; b.y += b.vy * dt;
    const r = b.r ? b.r * .7 : 14;
    if (overlap([b.x - r, b.y - r, b.x + r, b.y + r], heroBox(h))) { b.dead = true; hitHero(b.dmg || R_DMG); faisca(b.x, b.y, 12); }
    else if (b.y > GROUND + 10 || b.t > 3) {
      b.dead = true; faisca(b.x, Math.min(b.y, GROUND), b.chao ? 22 : 8);
      if (b.chao) { B.shake = Math.max(B.shake, .15); if (Math.abs(h.x - b.x) < S_RAIO && h.y > -60) hitHero(b.dmg); } // caiu: espirra fogo em volta
    }
  });
  L.bolas = L.bolas.filter(b => !b.dead);
}
const faisca = (x, y, n) => { for (let k = 0; k < n; k++) B.shards.push({ x, y, vx: (Math.random() - .5) * 300, vy: -Math.random() * 240, r: Math.random() * 6, t: .6, c: Math.random() < .5 ? '255,170,60' : '255,90,30', sz: .4 + Math.random() * .5 }); };
function drawRei(L) {
  let S = L.state === 'walk' && L.anda ? REI.walk : REI.idle, fr = L.state === 'dead' ? 0 : Math.floor(B.time * S.fps) % S.n;
  if (L.state === 'invoca' && REI.invoca.img.naturalWidth) { S = REI.invoca; fr = Math.min(5, Math.floor(L.t / INV_SURGE * 6)); }
  else if (L.state === 'chamas' && REI.chamas.img.naturalWidth) { S = REI.chamas; fr = Math.min(5, Math.floor(L.t / CH_ARMA * 6)); }
  if (!S.img.naturalWidth) return;
  ctx.save();
  ctx.translate(L.x, GROUND + REI.chao + (L.state === 'dead' ? L.sink * 40 : 0)); ctx.scale(L.face, 1);
  if (L.flash > 0) ctx.filter = 'brightness(3) saturate(0)';
  else if ((L.state === 'atk' && L.t < R_ARMA) || (L.state === 'slam' && L.t < R_RAJADA[0]) || (L.state === 'chamas' && L.t < CH_ARMA)) ctx.filter = 'drop-shadow(0 0 18px #ff4010)'; // armando o fogo
  if (L.state === 'dead') ctx.globalAlpha = 1 - L.sink;
  ctx.drawImage(S.img, fr * S.FW, 0, S.FW, S.FH, -S.ax, 2 - S.FH, S.FW, S.FH);
  ctx.restore();
  const tj = L.state === 'chamas' ? L.t - CH_ARMA : -1;
  if (tj >= 0 && tj < CH_DUR && CHAMA.img.naturalWidth) { // o jato de fogo saindo das mãos
    const q = chamaFrame(tj);
    ctx.save(); ctx.translate(L.x + L.face * CHAMA.maos[0], GROUND - CHAMA.maos[1]); ctx.scale(L.face, 1); ctx.rotate(CHAMA.ang); ctx.scale(CHAMA.sx, 1); // inclinado para baixo
    ctx.globalAlpha = tj > CH_DUR - .2 ? (CH_DUR - tj) / .2 : 1; // some no fim
    ctx.drawImage(CHAMA.img, q * CHAMA.FW, 0, CHAMA.FW, CHAMA.FH, -6, -CHAMA.cy, CHAMA.FW, CHAMA.FH);
    ctx.restore();
  }
  drawBolas(L);
}
function drawBolas(L) {
  L.bolas.forEach(b => { // bola de fogo com rastro
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let k = 3; k >= 0; k--) {
      const R = b.r || 16, px = b.x - b.vx * k * .025, py = b.y - b.vy * k * .025, r = R - k * R / 5;
      const g = ctx.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, `rgba(255,240,180,${.9 - k * .2})`); g.addColorStop(.5, `rgba(255,140,40,${.7 - k * .15})`); g.addColorStop(1, 'rgba(255,60,10,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill();
    }
    ctx.restore();
  });
}
// dano do tremor: direto na vida (o escudo não bloqueia), com o mesmo aviso vermelho dos outros golpes
function quake(h, dmg = SLAM_DMG) {
  sfx('hurt'); if (!opts.god) B.hp = Math.max(0, B.hp - dmg); h.hurt = .3;
  B.floats.push({ x: h.x, y: GROUND + h.y - 250, t: .9, s: '-' + dmg, c: '#ff5a4a' });
  if (B.hp <= 0) heroDies(); // vida zerada: a mesma morte dos outros golpes
}
export function giantDies(L) {
  L.state = 'dead'; L.t = 0; L.sink = 0; B.shake = .5;
  if (B.arena && B.arena.boss) B.arena = null;
  L.bolas = [];
  if (L.rei) B.frogs.forEach(f => { if (f.bando === 'rei' && !f.dead) f.hp = 0, f.dead = true; }); // os soldados invocados caem com ele
  B.notice = L.rei ? { lines: ['Nabucodonosor caiu!'], t: 2.5, c: '#f2c84b' } // logo depois vem a cena da estátua
    : { lines: [L.estatua ? 'O Ídolo Babilônico caiu!' : 'Golias caiu!', 'Siga até a cruz no fim da jornada'], t: 4, c: '#f2c84b' };
  sfx('refute');
}

export function drawGiant() {
  const L = B.boss; if (!L || L.kind !== 'gigante' || L.state === 'hidden') return;
  if (L.rei) return drawRei(L);
  if (L.estatua) return drawBolas(L); // ela é desenhada atrás do chão (drawEstatua); as bolas de fogo, na frente
  if (!GIG.run.naturalWidth) return;
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
export const giantLieY = L => L.lieY || (L.pele && L.pele.lieY) || GROUND - 285; // abaixo da barra de vida do chefão (a Naja traz o dela)
export function drawGiantLie() {
  // também o chefão do mar que mente (Naja): some enquanto ele mergulha ou sobe da água
  const L = B.boss; if (!L || !L.lies || !L.lie || !['walk', 'atk', 'slam', 'invoca', 'chamas', 'swim', 'bite', 'acid'].includes(L.state)) return;
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
