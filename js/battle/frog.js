import { sfx } from '../core/audio.js';
import { reduced } from '../core/utils.js';
import { GROUND, ctx } from './config.js';
import { drawShadow, relevo } from './draw/world.js';
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
// cada bicho que patrulha e ataca (lobo, soldado) = uma ficha: vida, dano, velocidades, alcances, tempos e o desenho.
// arma = s armando (brilho vermelho); golpe = s do golpe; salto = px que avança no golpe; arcoAt = px acima do chão por quadro
// do ataque; perto/ronda/coleira como nas rãs; ataca = começa a armar a esta distância; colado = não chega mais perto que isso
const BICHO = {
  lobo: { vida: 40, dano: 8, anda: 55, corre: 150, perto: 200, ronda: 170, coleira: 340, arma: .35, golpe: .4, salto: 95, cd: 1.4, ataca: 150, colado: 90,
    run: { ...LOBO.run, FW: 190, FH: 136, ax: 97, n: 6 }, atk: { ...LOBO.atk, FW: 190, FH: 136, ax: 97, n: 6 }, nArma: 3, arcoAt: LOBO.arco,
    caixa: (f, y) => [f.x - 55, y - 72, f.x + 55, y], sombra: 120, som: 'slash' },
  // soldado esqueleto (Babilônia): estocada de lança — arma erguendo a lança (2 quadros) e estoca (3); a ponta pega até ~145 px à frente
  // (a arte do ataque veio ~17% maior que a da corrida, medido pelo capacete: reduzida para igualar)
  soldado: { vida: 40, dano: 8, anda: 50, corre: 130, perto: 230, ronda: 160, coleira: 320, arma: .45, golpe: .45, salto: 22, cd: 1.6, ataca: 145, colado: 95,
    run: { img: new Image(), FW: 127, FH: 153, ax: 59, n: 8 }, atk: { img: new Image(), FW: 183, FH: 129, ax: 34, n: 5 }, nArma: 2, arcoAt: [0, 0, 0, 0, 0],
    caixa: (f, y) => [f.x - 30, y - 125, f.x + 30, y],
    ponta: (f, y, fr) => fr >= 2 && fr <= 3 ? [Math.min(f.x, f.x + f.face * 145), y - 105, Math.max(f.x, f.x + f.face * 145), y - 40] : null, sombra: 80, som: 'slash' }
};
BICHO.soldado.run.img.src = 'assets/sprites/enemy/soldado-run.webp'; BICHO.soldado.atk.img.src = 'assets/sprites/enemy/soldado-attack.webp';
function makeWolf(e) {
  const P = BICHO[e.tipo] || BICHO.lobo;
  return { kind: e.tipo in BICHO ? e.tipo : 'lobo', P, bando: e.bando, x: e.x, home: e.x, face: Math.random() < .5 ? -1 : 1, hp: P.vida, maxHp: P.vida, state: 'walk', t: 0, wait: 0, ph: Math.random() * 6, flash: 0, cd: 0, moving: false };
}
// quadro do ataque (-1 = andando): armando → nArma quadros; golpe → os outros
const wolfFrame = f => { const P = f.P, nG = P.atk.n - P.nArma; return f.state === 'arm' ? Math.min(P.nArma - 1, Math.floor(f.t / P.arma * P.nArma)) : f.state === 'leap' ? P.nArma + Math.min(nG - 1, Math.floor(f.t / P.golpe * nG)) : -1; };
const wolfBox = f => { const fr = wolfFrame(f), y = GROUND + terrainTop(f.x) - (fr >= 0 ? f.P.arcoAt[fr] : 0); return f.P.caixa(f, y); };
function updateWolf(f, h, dt) {
  const P = f.P, dx = h.x - f.x, perto = Math.abs(dx) < P.perto && Math.abs(h.y - terrainTop(f.x)) < 90 && h.deadAt == null;
  const ok = x => terrainTop(x) !== Infinity && terrainTop(x) >= terrainTop(f.x) - 30; // sem buraco nem parede
  f.moving = false; f.t += dt;
  if (f.state === 'walk') {
    if (perto && !(f.chaseOff > 0)) f.face = Math.sign(dx) || f.face;
    if (perto && Math.abs(dx) < P.ataca && f.cd <= 0) { f.state = 'arm'; f.t = 0; return; } // ao alcance: arma o golpe
    if (perto && Math.abs(dx) < P.colado) return; // colado no herói: espera o próximo golpe
    // perto mas não alcança (fim da coleira, buraco, parede): não fica parado encarando — volta a patrulhar
    if (perto && (Math.abs(f.x + f.face * 20 - f.home) > P.coleira || !ok(f.x + f.face * 50))) f.chaseOff = 1.5;
    const caca = perto && !(f.chaseOff > 0);
    if (f.chaseOff > 0) f.chaseOff -= dt;
    if (!caca && perto && f.chaseOff > 0 && Math.sign(dx) === f.face) f.face = -f.face;
    const v = caca ? P.corre : P.anda, lim = caca ? P.coleira : P.ronda, nx = f.x + f.face * v * dt;
    const volta = Math.abs(nx - f.home) < Math.abs(f.x - f.home); // fora da ronda (depois de caçar): pode voltar para casa
    if ((Math.abs(nx - f.home) <= lim || volta) && ok(nx + f.face * 50)) { f.x = nx; f.moving = true; }
    else f.face = -f.face; // fim da ronda, buraco ou parede: dá meia-volta
  } else if (f.state === 'arm') {
    if (f.t >= P.arma) { f.state = 'leap'; f.t = 0; f.hit = false; f.x0 = f.x; sfx(P.som); }
  } else if (f.state === 'leap') {
    const k = Math.min(1, f.t / P.golpe), stop = h.x - f.face * 45;
    let to = f.x0 + f.face * P.salto * Math.sin(k * Math.PI / 2);
    to = f.face > 0 ? Math.min(to, Math.max(f.x, stop)) : Math.max(to, Math.min(f.x, stop)); // não atravessa o herói
    if (ok(to)) f.x = to;
    const fr = wolfFrame(f), y = GROUND + terrainTop(f.x), golpe = P.ponta ? P.ponta(f, y, fr) : wolfBox(f); // lança: só a ponta, nos quadros da estocada
    if (!f.hit && golpe && overlap(golpe, heroBox(h))) { f.hit = true; hitHero(P.dano); }
    if (f.t >= P.golpe) { f.state = 'walk'; f.t = 0; f.cd = P.cd; }
  }
}
function drawWolf(f) {
  const P = f.P, fr = wolfFrame(f), S = fr >= 0 ? P.atk : P.run; if (!S.img.naturalWidth) return;
  const q = fr >= 0 ? fr : f.moving ? Math.floor(f.ph * (f.cd > 0 || Math.abs(B.hero.x - f.x) < P.perto ? 12 : 7)) % S.n : 0;
  drawShadow(f.x + f.face * 4, GROUND + terrainTop(f.x) + relevo(f.x), P.sombra, fr >= 0 ? P.arcoAt[fr] : 0);
  ctx.save(); ctx.translate(f.x, GROUND + terrainTop(f.x) + relevo(f.x)); ctx.scale(f.face, 1);
  if (f.flash > 0) ctx.filter = 'brightness(3) saturate(0)';
  else if (f.state === 'arm') ctx.filter = 'drop-shadow(0 0 10px #ff2020)';
  ctx.drawImage(S.img, q * S.FW, 0, S.FW, S.FH, -S.ax, 2 - S.FH, S.FW, S.FH);
  ctx.restore();
}

export function makeFrog(e) {
  if (e.tipo in BICHO) return makeWolf(e); // lobo, soldado
  // ronda (data.js): só patrulha, nunca persegue; ensina: a dica do tutorial "[K] atacar" aparece perto dela
  return { bando: e.bando, x: e.x, home: e.x, ronda: !!e.ronda, ensina: !!e.ensina, face: Math.random() < .5 ? -1 : 1, hp: VIDA, maxHp: VIDA, state: 'idle', t: 0, wait: .8 + Math.random() * 1.6, ph: Math.random() * 6, flash: 0, cd: 0, x0: e.x, x1: e.x };
}
// chuva de rãs (data.js → grupo com ras: N): quando a arena acaba, N rãs caem do céu espalhadas pela tela, longe do herói
export function rainFrogs(n, ar) {
  const hx = B.hero.x, xs = [];
  for (let tries = 0; xs.length < n && tries < 600; tries++) {
    const x = ar.left + 50 + Math.random() * (ar.right - ar.left - 100), gap = tries < 300 ? 50 : 25; // sem lugar: aceita mais juntas
    if (Math.abs(x - hx) < 120 || xs.some(o => Math.abs(o - x) < gap) || terrainTop(x) > 200) continue;
    xs.push(x);
  }
  xs.forEach((x, i) => { const f = makeFrog({ x }); f.cai = 520 + i * 70; f.wait = 1 + Math.random() * 1.5; B.frogs.push(f); });
  B.notice = { lines: ['Uma praga de rãs!', 'Elas caem do céu: cuidado para não encostar'], t: 3, c: '#9be07a' };
}
// rãs que caem na plataforma do chefão (a jangada): andam junto com ela e não saem de cima
const chao = f => f.pl ? f.pl.top : terrainTop(f.x);
const piso = f => f.pl ? f.pl.top : terrainTop(f.x) + relevo(f.x); // no desenho: acompanha o relevo da arte do chão
export function rainOnPlatform(n, pl, aviso = true) {
  const hx = B.hero.x, xs = B.frogs.filter(f => f.pl === pl && !f.dead).map(f => f.x), ja = xs.length; // longe das que já estão lá
  for (let tries = 0; xs.length < ja + n && tries < 400; tries++) {
    const x = pl.x + 30 + Math.random() * (pl.w - 60), gap = tries < 200 ? 45 : 20;
    if (Math.abs(x - hx) < 60 || xs.some(o => Math.abs(o - x) < gap)) continue;
    xs.push(x);
  }
  xs.slice(ja).forEach((x, i) => { const f = makeFrog({ x }); Object.assign(f, { pl, plx: pl.x, cai: 520 + i * 80, wait: 1 + Math.random() * 1.5 }); B.frogs.push(f); });
  if (aviso) B.notice = { lines: ['Rãs caem do céu na jangada!', 'Derrube-as antes que encostem em você'], t: 3, c: '#9be07a' };
}
const frame = f => f.state === 'hop' ? Math.min(5, Math.floor(f.t / HOP_T * 6)) : 0;
export const frogBox = f => {
  if (f.P) return wolfBox(f);
  const y = GROUND + chao(f) - (f.cai || 0) - (f.state === 'hop' ? ARCO[frame(f)] * SC : 0);
  return [f.x - 28, y - 42, f.x + 28, y];
};

export function updateFrogs(dt) {
  const h = B.hero;
  B.frogs.forEach(f => {
    f.flash = Math.max(0, f.flash - dt); f.cd = Math.max(0, f.cd - dt); f.ph += dt;
    if (f.P) return updateWolf(f, h, dt);
    if (f.pl) { const d = f.pl.x - f.plx; f.plx = f.pl.x; f.x += d; f.x0 += d; f.x1 += d; f.home = f.pl.x + f.pl.w / 2; } // vai junto com a jangada
    if (f.cai > 0) { f.cai = Math.max(0, f.cai - 700 * dt); if (!f.cai) sfx('croak'); return; } // ainda caindo do céu
    const dx = h.x - f.x, perto = !f.ronda && Math.abs(dx) < PERTO && Math.abs(h.y) < 120 && h.deadAt == null;
    if (f.state === 'idle' && (f.wait -= dt) <= 0) {
      // perto: pula na direção do herói (sem sair da coleira); longe: ronda, indo e voltando em volta de casa
      if (perto) f.face = Math.sign(dx) || f.face;
      else if (Math.abs(f.x + f.face * HOP_D - f.home) > RONDA) f.face = -f.face;
      const lim = perto ? COLEIRA : RONDA;
      let to = f.x + f.face * (perto ? Math.min(HOP_D, Math.max(30, Math.abs(dx) - 20)) : HOP_D);
      to = Math.max(f.home - lim, Math.min(f.home + lim, to));
      const ok = x => f.pl ? x > f.pl.x + 25 && x < f.pl.x + f.pl.w - 25 : terrainTop(x) !== Infinity && terrainTop(x) >= terrainTop(f.x) - 40; // sem buraco nem parede (na jangada: sem cair dela)
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
    B.shards.push({ x: f.x + (Math.random() - .5) * 50, y: b[1] + 30, vx: (Math.random() - .5) * 300, vy: -100 - Math.random() * 260, r: Math.random() * 6, t: .7, c: f.kind === 'soldado' ? (Math.random() < .5 ? '200,170,120' : '170,40,30') : f.kind === 'lobo' ? (Math.random() < .5 ? '70,60,58' : '150,40,30') : Math.random() < .5 ? '120,160,50' : '200,170,80', sz: .4 + Math.random() * .5 });
}
// toca no herói (golpe/rasgo/impulso): cada fonte de dano chama isto com a sua caixa
export function frogsIn(box, fn) { B.frogs.forEach(f => { if (!f.dead && overlap(box, frogBox(f))) fn(f); }); }
export const cleanFrogs = () => { B.frogs = B.frogs.filter(f => !f.dead); };

export function drawFrog(f) {
  if (f.x < B.cam - 120 || f.x > B.cam + 1080) return;
  if (f.P) return drawWolf(f);
  const S = f.state === 'hop' ? RA.pulo : RA.idle; if (!S.img.naturalWidth) return;
  const fr = f.state === 'hop' ? frame(f) : Math.floor(f.ph * 6) % S.n;
  drawShadow(f.x, GROUND + piso(f), 62, (f.cai || 0) + (f.state === 'hop' ? ARCO[fr] * SC : 0));
  ctx.save(); ctx.translate(f.x, GROUND + piso(f) - (f.cai || 0)); ctx.scale(f.face * SC, SC);
  if (f.flash > 0) ctx.filter = 'brightness(3) saturate(0)';
  ctx.drawImage(S.img, fr * S.FW, 0, S.FW, S.FH, -S.FW / 2, 2 - S.FH, S.FW, S.FH);
  ctx.restore();
}
