import { sfx } from '../core/audio.js';
import { reduced } from '../core/utils.js';
import { GROUND, ctx } from './config.js';
import { drawShadow } from './draw/world.js';
import { heroBox, hitHero, overlap } from './combat.js';
import { B } from './state.js';
import { terrainTop } from './world.js';

// ---------- Rã (Êxodo 8, a praga das rãs) ----------
// Bicho solto pela fase (data.js → { tipo: "ra", x }), fora das arenas: não ataca nem mente, mas **encostar nela fere**.
// Fica parada (idle, a papada enchendo) um tempo e dá um pulo curto: longe do herói, vai e volta em volta do lugar onde nasceu;
// com o herói perto, pula na direção dele (sem se afastar muito de casa).
// Morre fácil (20 de vida): espada, rasgo do poder e impulso.
// Sprites (a arte olha para a DIREITA): ra-idle.webp 6 quadros 106×84 (base na borda de baixo);
// ra-pulo.webp 6 quadros 172×210 (agacha → sobe → no alto → desce → aterrissa); a altura do pulo já vem desenhada
// (o chão é a borda de baixo do quadro), igualada ao idle (a tira do pulo era 18% menor)
export const RA = { idle: { img: new Image(), FW: 106, FH: 84, n: 6 }, pulo: { img: new Image(), FW: 172, FH: 210, n: 6 } };
RA.idle.img.src = 'assets/sprites/enemy/ra-idle.webp'; RA.pulo.img.src = 'assets/sprites/enemy/ra-pulo.webp';
const ARCO = [0, 1, 23, 67, 63, 0]; // altura do corpo em cada quadro do pulo (px), para a caixa acompanhar
// patrulha (como inimigos de plataforma): vai e volta perto de casa (até RONDA px); só vai atrás do herói quando ele chega
// a PERTO px, e mesmo assim não se afasta mais que COLEIRA px de casa. SC = escala do desenho (menor que a arte)
const HOP_T = .55, HOP_D = 90, VIDA = 20, DANO = 4, PERTO = 180, RONDA = 110, COLEIRA = 230, TOQUE_CD = 1, SC = .72;

// ---------- Lobo (o Vale da sombra) ----------
// Também solto pela fase ({ tipo: "lobo", x }), fora das arenas. Anda devagar indo e voltando em volta de casa; com o herói
// perto (e na mesma altura) corre atrás dele (sem sair da coleira) e, a um salto de distância, rosna (brilho vermelho) e
// SALTA para a frente mordendo (8 de dano, como um monstro; o escudo bloqueia). 40 de vida.
// Sprites (olha para a direita, alinhados pela pata de trás): lobo-run.webp 6 quadros 190×136 (andando);
// lobo-attack.webp 6 quadros (agacha → rosna → arma → SALTO → aterrissa → volta), a arte do ataque era ~20% menor e foi igualada
export const LOBO = { run: { img: new Image(), n: 6 }, atk: { img: new Image(), n: 6 }, FW: 190, FH: 136, ax: 97, arco: [3, 5, 3, 20, 2, 0] };
LOBO.run.img.src = 'assets/sprites/enemy/lobo-run.webp'; LOBO.atk.img.src = 'assets/sprites/enemy/lobo-attack.webp';
const L_VIDA = 40, L_DANO = 8, L_ANDA = 55, L_CORRE = 150, L_PERTO = 200, L_RONDA = 170, L_COLEIRA = 340, L_ARMA = .35, L_SALTO_T = .4, L_SALTO = 95, L_CD = 1.4;
function makeWolf(e) {
  return { kind: 'lobo', x: e.x, home: e.x, face: Math.random() < .5 ? -1 : 1, hp: L_VIDA, maxHp: L_VIDA, state: 'walk', t: 0, wait: 0, ph: Math.random() * 6, flash: 0, cd: 0, moving: false };
}
const wolfFrame = f => f.state === 'arm' ? Math.min(2, Math.floor(f.t / L_ARMA * 3)) : f.state === 'leap' ? 3 + Math.min(2, Math.floor(f.t / L_SALTO_T * 3)) : -1;
const wolfBox = f => { const fr = wolfFrame(f), y = GROUND + terrainTop(f.x) - (fr >= 0 ? LOBO.arco[fr] : 0); return [f.x - 55, y - 72, f.x + 55, y]; };
function updateWolf(f, h, dt) {
  const dx = h.x - f.x, perto = Math.abs(dx) < L_PERTO && Math.abs(h.y - terrainTop(f.x)) < 90 && h.deadAt == null;
  const ok = x => terrainTop(x) !== Infinity && terrainTop(x) >= terrainTop(f.x) - 30; // sem buraco nem parede
  f.moving = false; f.t += dt;
  if (f.state === 'walk') {
    if (perto && !(f.chaseOff > 0)) f.face = Math.sign(dx) || f.face;
    if (perto && Math.abs(dx) < 150 && f.cd <= 0) { f.state = 'arm'; f.t = 0; return; } // a um salto: rosna e arma
    if (perto && Math.abs(dx) < 90) return; // colado no herói: espera o próximo salto
    // perto mas não alcança (fim da coleira, buraco, parede): não fica parado encarando — volta a patrulhar
    if (perto && (Math.abs(f.x + f.face * 20 - f.home) > L_COLEIRA || !ok(f.x + f.face * 50))) f.chaseOff = 1.5;
    const caca = perto && !(f.chaseOff > 0);
    if (f.chaseOff > 0) f.chaseOff -= dt;
    if (!caca && perto && f.chaseOff > 0 && Math.sign(dx) === f.face) f.face = -f.face;
    const v = caca ? L_CORRE : L_ANDA, lim = caca ? L_COLEIRA : L_RONDA, nx = f.x + f.face * v * dt;
    const volta = Math.abs(nx - f.home) < Math.abs(f.x - f.home); // fora da ronda (depois de caçar): pode voltar para casa
    if ((Math.abs(nx - f.home) <= lim || volta) && ok(nx + f.face * 50)) { f.x = nx; f.moving = true; }
    else f.face = -f.face; // fim da ronda, buraco ou parede: dá meia-volta
  } else if (f.state === 'arm') {
    if (f.t >= L_ARMA) { f.state = 'leap'; f.t = 0; f.hit = false; f.x0 = f.x; sfx('slash'); }
  } else if (f.state === 'leap') {
    const k = Math.min(1, f.t / L_SALTO_T), stop = h.x - f.face * 45;
    let to = f.x0 + f.face * L_SALTO * Math.sin(k * Math.PI / 2);
    to = f.face > 0 ? Math.min(to, Math.max(f.x, stop)) : Math.max(to, Math.min(f.x, stop)); // não atravessa o herói
    if (ok(to)) f.x = to;
    if (!f.hit && overlap(wolfBox(f), heroBox(h))) { f.hit = true; hitHero(L_DANO); }
    if (f.t >= L_SALTO_T) { f.state = 'walk'; f.t = 0; f.cd = L_CD; }
  }
}
function drawWolf(f) {
  const fr = wolfFrame(f), S = fr >= 0 ? LOBO.atk : LOBO.run; if (!S.img.naturalWidth) return;
  const q = fr >= 0 ? fr : f.moving ? Math.floor(f.ph * (f.cd > 0 || Math.abs(B.hero.x - f.x) < L_PERTO ? 12 : 7)) % 6 : 0;
  drawShadow(f.x + f.face * 4, GROUND + terrainTop(f.x), 120, fr >= 0 ? LOBO.arco[fr] : 0);
  ctx.save(); ctx.translate(f.x, GROUND + terrainTop(f.x)); ctx.scale(f.face, 1);
  if (f.flash > 0) ctx.filter = 'brightness(3) saturate(0)';
  else if (f.state === 'arm') ctx.filter = 'drop-shadow(0 0 10px #ff2020)';
  ctx.drawImage(S.img, q * LOBO.FW, 0, LOBO.FW, LOBO.FH, -LOBO.ax, 2 - LOBO.FH, LOBO.FW, LOBO.FH);
  ctx.restore();
}

export function makeFrog(e) {
  if (e.tipo === 'lobo') return makeWolf(e);
  // ronda (data.js): só patrulha, nunca persegue; ensina: a dica do tutorial "[K] atacar" aparece perto dela
  return { x: e.x, home: e.x, ronda: !!e.ronda, ensina: !!e.ensina, face: Math.random() < .5 ? -1 : 1, hp: VIDA, maxHp: VIDA, state: 'idle', t: 0, wait: .8 + Math.random() * 1.6, ph: Math.random() * 6, flash: 0, cd: 0, x0: e.x, x1: e.x };
}
const frame = f => f.state === 'hop' ? Math.min(5, Math.floor(f.t / HOP_T * 6)) : 0;
export const frogBox = f => {
  if (f.kind === 'lobo') return wolfBox(f);
  const y = GROUND + terrainTop(f.x) - (f.state === 'hop' ? ARCO[frame(f)] * SC : 0);
  return [f.x - 28, y - 42, f.x + 28, y];
};

export function updateFrogs(dt) {
  const h = B.hero;
  B.frogs.forEach(f => {
    f.flash = Math.max(0, f.flash - dt); f.cd = Math.max(0, f.cd - dt); f.ph += dt;
    if (f.kind === 'lobo') return updateWolf(f, h, dt);
    const dx = h.x - f.x, perto = !f.ronda && Math.abs(dx) < PERTO && Math.abs(h.y) < 120 && h.deadAt == null;
    if (f.state === 'idle' && (f.wait -= dt) <= 0) {
      // perto: pula na direção do herói (sem sair da coleira); longe: ronda, indo e voltando em volta de casa
      if (perto) f.face = Math.sign(dx) || f.face;
      else if (Math.abs(f.x + f.face * HOP_D - f.home) > RONDA) f.face = -f.face;
      const lim = perto ? COLEIRA : RONDA;
      let to = f.x + f.face * (perto ? Math.min(HOP_D, Math.max(30, Math.abs(dx) - 20)) : HOP_D);
      to = Math.max(f.home - lim, Math.min(f.home + lim, to));
      const ok = x => terrainTop(x) !== Infinity && terrainTop(x) >= terrainTop(f.x) - 40; // sem buraco nem parede
      if (Math.abs(to - f.x) > 10 && ok(to)) { f.state = 'hop'; f.t = 0; f.x0 = f.x; f.x1 = to; if (Math.abs(f.x - B.cam - 480) < 560) sfx('croak'); }
      else { f.face = -f.face; f.wait = .6; } // travou (buraco, parede ou fim da coleira): vira e tenta o outro lado
    } else if (f.state === 'hop') {
      f.t += dt;
      const k = Math.min(1, f.t / HOP_T), e = k * k * (3 - 2 * k);
      f.x = f.x0 + (f.x1 - f.x0) * e;
      if (f.t >= HOP_T) { f.state = 'idle'; f.wait = 1.1 + Math.random() * 1.1; }
    }
    // encostar fere (o escudo e o impulso protegem, como nos outros golpes)
    if (f.cd <= 0 && overlap(frogBox(f), heroBox(h))) { f.cd = TOQUE_CD; hitHero(DANO); }
  });
}
// golpe na rã: some num estouro verde quando a vida acaba
export function hitFrog(f, dmg, cor = '#bbb') {
  f.hp -= dmg; f.flash = .12;
  const b = frogBox(f);
  B.floats.push({ x: f.x, y: b[1] - 14, t: .7, s: dmg.toFixed(dmg % 1 ? 1 : 0), c: cor });
  if (f.hp > 0) return;
  f.dead = true; sfx('slash');
  for (let k = 0; k < (reduced ? 6 : 16); k++)
    B.shards.push({ x: f.x + (Math.random() - .5) * 50, y: b[1] + 30, vx: (Math.random() - .5) * 300, vy: -100 - Math.random() * 260, r: Math.random() * 6, t: .7, c: f.kind === 'lobo' ? (Math.random() < .5 ? '70,60,58' : '150,40,30') : Math.random() < .5 ? '120,160,50' : '200,170,80', sz: .4 + Math.random() * .5 });
}
// toca no herói (golpe/rasgo/impulso): cada fonte de dano chama isto com a sua caixa
export function frogsIn(box, fn) { B.frogs.forEach(f => { if (!f.dead && overlap(box, frogBox(f))) fn(f); }); }
export const cleanFrogs = () => { B.frogs = B.frogs.filter(f => !f.dead); };

export function drawFrog(f) {
  if (f.x < B.cam - 120 || f.x > B.cam + 1080) return;
  if (f.kind === 'lobo') return drawWolf(f);
  const S = f.state === 'hop' ? RA.pulo : RA.idle; if (!S.img.naturalWidth) return;
  const fr = f.state === 'hop' ? frame(f) : Math.floor(f.ph * 6) % S.n;
  drawShadow(f.x, GROUND + terrainTop(f.x), 62, f.state === 'hop' ? ARCO[fr] * SC : 0);
  ctx.save(); ctx.translate(f.x, GROUND + terrainTop(f.x)); ctx.scale(f.face * SC, SC);
  if (f.flash > 0) ctx.filter = 'brightness(3) saturate(0)';
  ctx.drawImage(S.img, fr * S.FW, 0, S.FW, S.FH, -S.FW / 2, 2 - S.FH, S.FW, S.FH);
  ctx.restore();
}
