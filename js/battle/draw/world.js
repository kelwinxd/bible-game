import { GROUND, ctx } from '../config.js';
import { B } from '../state.js';
import { D, hash, mix } from '../../core/utils.js';

// fundo com imagem (data.js → fases[].fundo): na altura da tela, rola devagar (parallax) e se repete
// sempre na mesma orientação; o fim da imagem se dissolve no começo dela mesma (faixa de transição de 320 px),
// então o cenário "volta ao início" sem corte nem espelho
const BG = {}, BG_FADE = 320;
function bgTile(img) { // monta 1x a peça repetível: [fim da imagem → começo] dissolvidos + o resto da imagem
  const H = 540, w = Math.round(img.naturalWidth * H / img.naturalHeight), P = w - BG_FADE;
  const t = Object.assign(document.createElement('canvas'), { width: P, height: H }), c = t.getContext('2d');
  c.drawImage(img, 0, 0, w, H);
  const f = Object.assign(document.createElement('canvas'), { width: BG_FADE, height: H }), fc = f.getContext('2d');
  fc.drawImage(img, -P, 0, w, H); // últimos BG_FADE px da imagem
  const g = fc.createLinearGradient(0, 0, BG_FADE, 0); g.addColorStop(0, '#000'); g.addColorStop(1, '#0000');
  fc.globalCompositeOperation = 'destination-in'; fc.fillStyle = g; fc.fillRect(0, 0, BG_FADE, H);
  c.drawImage(f, 0, 0);
  return t;
}
function drawImageBg(F, img, off) {
  const t = F.tile || (F.tile = bgTile(img)), P = t.width;
  for (let x = -Math.round(off % P); x < 960; x += P) ctx.drawImage(t, x, 0);
  if (F.escuro) { ctx.fillStyle = `rgba(10, 5, 3, ${F.escuro})`; ctx.fillRect(0, 0, 960, 540); }
}
export function drawSky(cam) {
  const F = B.fase.fundo;
  if (F) {
    const img = BG[F.img] || (BG[F.img] = Object.assign(new Image(), { src: F.img }));
    if (img.naturalWidth) return drawImageBg(F, img, cam * F.parallax);
  }
  const W = 960, H = 540, t = Math.min(1, cam / (B.fase.comprimento - W));
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, mix('#1b1020', '#2c2a52', t)); g.addColorStop(.7, mix('#3a1a14', '#8a5a2a', t)); g.addColorStop(1, '#120a08');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // camada distante: serras baixas
  ctx.fillStyle = mix('#24131a', '#3a2c3c', t);
  const p1 = cam * .12;
  for (let i = -1; i < 6; i++) { const n = Math.floor(p1 / 260) + i, x = n * 260 - p1; ctx.beginPath(); ctx.moveTo(x - 40, GROUND); ctx.lineTo(x + 130, 300 + hash(n) * 60); ctx.lineTo(x + 300, GROUND); ctx.fill(); }
  // montanhas de alturas variadas
  ctx.fillStyle = mix('#2a1712', '#3a2418', t);
  const p2 = cam * .3;
  for (let i = -1; i < 7; i++) { const n = Math.floor(p2 / 220) + i, x = n * 220 - p2, hh = hash(n + 7); ctx.beginPath(); ctx.moveTo(x, GROUND); ctx.lineTo(x + 60 + hh * 60, 220 + hh * 110); ctx.lineTo(x + 180 + hh * 40, GROUND); ctx.fill(); }
  // ruínas de colunas, mais perto (algumas, espaçadas)
  ctx.fillStyle = '#1e120d';
  const p3 = cam * .55;
  for (let i = -1; i < 3; i++) {
    const n = Math.floor(p3 / 700) + i; if (hash(n + 3) < .45) continue;
    const x = n * 700 - p3 + hash(n) * 300, k = 2 + Math.floor(hash(n + 1) * 3);
    for (let c = 0; c < k; c++) { const ch = 70 + hash(n * 3 + c) * 120; ctx.fillRect(x + c * 46, GROUND - ch, 22, ch); ctx.fillRect(x + c * 46 - 5, GROUND - ch, 32, 8); }
  }
}
// Chão com imagem (data.js → fases[].chao): uma laje de terra e pedras. O miolo vira uma faixa repetível
// (fim dissolvido no começo, como o fundo) e as pontas arredondadas viram "tampas" nas bordas de buracos e desníveis.
// Medidas no arquivo recortado (2000×388): superfície onde se pisa em y=100, pontas de 120 px, faixa de rochas em y 160–340.
const GSRC = { cap: 120, surf: 100, band: [160, 340], fade: 160, s: .5 };
// cor do chão: multiplica a arte (areia clara) para a terra avermelhada e escura do fundo do Exodus.
// Mais escuro/vermelho = baixar os canais; '#ffffff' = arte original.
export const CHAO_COR = '#804a2e';
function tingir(img, cor) { // cópia da imagem multiplicada pela cor, mantendo a transparência
  const c = Object.assign(document.createElement('canvas'), { width: img.naturalWidth, height: img.naturalHeight }), x = c.getContext('2d');
  x.drawImage(img, 0, 0);
  x.globalCompositeOperation = 'multiply'; x.fillStyle = cor; x.fillRect(0, 0, c.width, c.height);
  x.globalCompositeOperation = 'destination-in'; x.drawImage(img, 0, 0);
  return c;
}
function groundKit(img) {
  const { cap, fade, s, band } = GSRC, H = Math.round(img.height * s), cw = cap * s;
  const mk = (w, h) => { const c = Object.assign(document.createElement('canvas'), { width: w, height: h }); return [c, c.getContext('2d')]; };
  // miolo repetível, com a base arredondada (usado nas lajes flutuantes)
  const midSrc = img.width - 2 * cap, W = midSrc * s, P = W - fade * s;
  const [mid, mc] = mk(P, H); mc.drawImage(img, cap, 0, midSrc, img.height, 0, 0, W, H);
  const [f, fc] = mk(fade * s, H); fc.drawImage(img, cap + midSrc - fade, 0, fade, img.height, 0, 0, fade * s, H);
  const g = fc.createLinearGradient(0, 0, fade * s, 0); g.addColorStop(0, '#000'); g.addColorStop(1, '#0000');
  fc.globalCompositeOperation = 'destination-in'; fc.fillStyle = g; fc.fillRect(0, 0, fade * s, H); mc.drawImage(f, 0, 0);
  // chão alto: o miolo até o fim das rochas e, abaixo, a faixa de rochas repetida (escurecendo com a profundidade)
  const b0 = band[0] * s, b1 = band[1] * s, [tall, tc] = mk(P, 420);
  tc.drawImage(mid, 0, 0, P, b1, 0, 0, P, b1);
  // cada repetição entra dissolvendo por cima da anterior (sem linha reta na emenda)
  const bh = b1 - b0, ov = 24, [bd, bc] = mk(P, bh);
  bc.drawImage(mid, 0, b0, P, bh, 0, 0, P, bh);
  const bg2 = bc.createLinearGradient(0, 0, 0, ov); bg2.addColorStop(0, '#0000'); bg2.addColorStop(1, '#000');
  bc.globalCompositeOperation = 'destination-in'; bc.fillStyle = bg2; bc.fillRect(0, 0, P, bh);
  for (let y = b1 - ov; y < 420; y += bh - ov) tc.drawImage(bd, 0, y);
  const dg = tc.createLinearGradient(0, 140, 0, 420); dg.addColorStop(0, 'rgba(20,10,5,0)'); dg.addColorStop(1, 'rgba(20,10,5,.75)');
  tc.globalCompositeOperation = 'source-atop'; tc.fillStyle = dg; tc.fillRect(0, 140, P, 280);
  // pontas: o lado de dentro se dissolve no miolo (que continua por baixo delas)
  const capCv = (sx, inner) => {
    const [c, x] = mk(cw, H); x.drawImage(img, sx, 0, cap, img.height, 0, 0, cw, H);
    const gg = x.createLinearGradient(0, 0, cw, 0);
    gg.addColorStop(inner ? 0 : .45, inner ? '#0000' : '#000'); gg.addColorStop(inner ? .55 : 1, inner ? '#000' : '#0000');
    x.globalCompositeOperation = 'destination-in'; x.fillStyle = gg; x.fillRect(0, 0, cw, H);
    return c;
  };
  const capL = capCv(0, false), capR = capCv(img.width - cap, true);
  return { mid, tall, capL, capR, cw, surf: GSRC.surf * s, pat: ctx.createPattern(tall, 'repeat-x'), patMid: ctx.createPattern(mid, 'repeat-x') };
}
const GK = {};
function groundImg() {
  const F = B.fase.chao; if (!F) return null;
  if (!BG[F]) { // monta o kit só depois de decodificar: antes disso o tingimento saía chapado, sem a textura
    BG[F] = Object.assign(new Image(), { src: F });
    BG[F].decode().then(() => { GK[F] = groundKit(tingir(BG[F], CHAO_COR)); });
  }
  return GK[F] || null;
}
// um pedaço de laje entre a e b com a superfície em y; tampas arredondadas onde capL/capR
function slab(k, a, b, y, capL, capR, sc = 1, fundo = false) {
  const cw = k.cw * sc, top = y - k.surf * sc, h = (fundo ? k.mid.height : k.tall.height) * sc;
  const ma = capL ? a + cw * .2 : a, mb = capR ? b - cw * .2 : b; // o miolo começa onde a ponta ainda é opaca; a ponta se dissolve sobre ele
  if (mb > ma) {
    const p = fundo ? k.patMid : k.pat; p.setTransform(new DOMMatrix().translate(0, top).scale(sc));
    ctx.fillStyle = p; ctx.fillRect(ma, top, mb - ma, h);
  }
  if (capL) ctx.drawImage(k.capL, a - cw * .25, top, cw, k.capL.height * sc);
  if (capR) ctx.drawImage(k.capR, b - cw * .75, top, cw, k.capR.height * sc);
}
function drawGroundImg(k, cam) {
  const x0 = cam - 80, x1 = cam + 1040;
  // trechos visíveis com a altura de cada um (buracos = Infinity)
  let segs = [{ a: x0, b: x1, top: 0 }];
  const cut = (x, w, top) => {
    segs = segs.flatMap(s => s.b <= x || s.a >= x + w ? [s]
      : [{ ...s, b: x }, { a: Math.max(s.a, x), b: Math.min(s.b, x + w), top }, { ...s, a: x + w }].filter(q => q.b > q.a));
  };
  B.terrain.filter(t => t.top !== Infinity).forEach(t => cut(t.x, t.w, t.top));
  B.holes.forEach(o => cut(o.x + 14, o.w - 28, Infinity)); // a laje avança um pouco sobre a borda do buraco, onde ainda dá pé
  // fundo dos buracos: escuridão por trás das lajes
  B.holes.forEach(o => { const gr = ctx.createLinearGradient(0, GROUND - 10, 0, 540); gr.addColorStop(0, '#0000'); gr.addColorStop(.35, '#000'); gr.addColorStop(1, '#0a0503'); ctx.fillStyle = gr; ctx.fillRect(o.x, GROUND - 10, o.w, 550 - GROUND); });
  // do mais baixo para o mais alto: a parede de quem é mais alto fica na frente
  segs.map((s, i) => ({ s, l: segs[i - 1], r: segs[i + 1] })).filter(q => q.s.top !== Infinity).sort((p, q) => q.s.top - p.s.top)
    .forEach(({ s, l, r }) => slab(k, s.a, s.b, GROUND + s.top, l && l.top > s.top, r && r.top > s.top));
}
// chão em faixas: terreno normal, mais alto ou mais baixo (buracos são desenhados por cima)
export function drawGround(cam) {
  const k = groundImg(); if (k) return drawGroundImg(k, cam);
  const H = 540, x0 = cam - 20, x1 = cam + 980;
  const strip = (a, b, top) => {
    if (b <= a) return;
    ctx.fillStyle = '#1a0f0b'; ctx.fillRect(a, GROUND + top, b - a, H - GROUND - top);
    ctx.fillStyle = '#3a2418'; ctx.fillRect(a, GROUND + top, b - a, 4);
    ctx.fillStyle = '#2d1c14';
    for (let x = Math.ceil(a / 60) * 60; x < b - 30; x += 60) ctx.fillRect(x, GROUND + top + 10 + ((x / 60) % 3 + 3) % 3 * 14, 30, 4);
  };
  let cur = x0;
  B.terrain.filter(t => t.top !== Infinity && t.x + t.w > x0 && t.x < x1).sort((a, b) => a.x - b.x).forEach(t => {
    strip(cur, t.x, 0); strip(t.x, t.x + t.w, t.top);
    ctx.fillStyle = '#2a1a12'; // bordas verticais do desnível
    ctx.fillRect(t.x - 2, GROUND + Math.min(0, t.top), 4, Math.abs(t.top)); ctx.fillRect(t.x + t.w - 2, GROUND + Math.min(0, t.top), 4, Math.abs(t.top));
    cur = t.x + t.w;
  });
  strip(cur, x1, 0);
}
export function drawPlatform(pl) {
  const y = GROUND + pl.top, k = groundImg();
  if (k) return slab(k, pl.x, pl.x + pl.w, y + 4, true, true, .5, true); // laje flutuante pequena, com a base arredondada
  ctx.fillStyle = '#4a3a2e'; ctx.beginPath(); ctx.roundRect(pl.x, y, pl.w, 18, 4); ctx.fill();
  ctx.fillStyle = '#6b5240'; ctx.fillRect(pl.x + 3, y, pl.w - 6, 4);
  ctx.fillStyle = '#2e241c'; // pedrinhas penduradas
  for (let x = pl.x + 14; x < pl.x + pl.w - 10; x += 26) { ctx.beginPath(); ctx.moveTo(x, y + 18); ctx.lineTo(x + 8, y + 30); ctx.lineTo(x + 16, y + 18); ctx.fill(); }
}
export function drawHole(o) {
  if (groundImg()) return; // com chão de imagem, o fundo do buraco já foi desenhado atrás das lajes
  const gr = ctx.createLinearGradient(0, GROUND, 0, 540); gr.addColorStop(0, '#000'); gr.addColorStop(1, '#0a0503');
  ctx.fillStyle = gr; ctx.fillRect(o.x, GROUND, o.w, 540 - GROUND);
  ctx.fillStyle = '#3a2418'; ctx.fillRect(o.x - 4, GROUND, 6, 540 - GROUND); ctx.fillRect(o.x + o.w - 2, GROUND, 6, 540 - GROUND);
}
// Buraco = 3 mãos em chamas (sprite com o próprio fogo) saindo do fundo: sobem e agarram quando o herói chega perto,
// afundam quando ele se afasta; cada uma com seu ritmo. Em buraco com laje, ficam nos vãos livres.
export const HAND = { img: new Image(), FW: 177, FH: 209, ax: 89, n: 3, scale: .55 }; // quadros 0–4: agarrando (loop) · 5–9: afundando
HAND.img.src = 'assets/sprites/hazard/mao-fogo.png';
export function handSpots(o) {
  if (!o.hands) {
    // vãos livres do buraco (sem laje por cima)
    let free = [[o.x + 8, o.x + o.w - 8]];
    B.platforms.forEach(p => { free = free.flatMap(([a, b]) => p.x + p.w < a || p.x > b ? [[a, b]] : [[a, p.x - 6], [p.x + p.w + 6, b]].filter(([c, d]) => d - c > 30)); });
    const total = free.reduce((t, [a, b]) => t + b - a, 0);
    o.hands = [];
    free.forEach(([a, b]) => {
      const m = Math.max(1, Math.round(HAND.n * (b - a) / total));
      for (let k = 0; k < m && o.hands.length < HAND.n; k++) {
        const i = o.hands.length, slot = (b - a) / m;
        o.hands.push({ x: a + slot * (k + .5), sc: Math.min(HAND.scale, (slot + 20) / 125) * (.9 + hash(o.x + i * 3.7) * .2),
          flip: i % 2 ? -1 : 1, ph: hash(o.x * .1 + i) * 5, delay: i * .25,
          dy: [16, 2, 34][i % 3] + hash(o.x + i * 9.1) * 6 }); // desalinhadas de propósito (uma mais alta, outra mais baixa), mas a base sempre abaixo da tela: sem faixa preta
      }
    });
  }
  return o.hands;
}
export function drawHoleFire(o) {
  if (!HAND.img.naturalWidth) return;
  const t = B.time, p = o.hand || 0;
  handSpots(o).forEach(hd => {
    const q = Math.max(0, Math.min(1, p * 1.5 - hd.delay)); // uma depois da outra
    const fr = q >= 1 ? Math.floor(t * 8 + hd.ph) % 5 : 5 + Math.round((1 - q) * 4);
    ctx.save(); ctx.translate(hd.x, 548 + hd.dy); ctx.scale(hd.sc * hd.flip, hd.sc);
    ctx.drawImage(HAND.img, fr * HAND.FW, 0, HAND.FW, HAND.FH, -HAND.ax, -HAND.FH, HAND.FW, HAND.FH);
    ctx.restore();
  });
}
// fissuras que aparecem a cada golpe na pedra
export const CRACKS = [[[-12, -150], [-4, -112], [-26, -84], [-14, -50]], [[40, -128], [16, -98], [24, -60]], [[-56, -70], [-30, -58], [-22, -18]]];
export function drawRock(r) {
  const pulse = .5 + .5 * Math.sin(B.time * 3);
  ctx.save(); ctx.translate(r.x, GROUND + r.base);
  ctx.shadowColor = '#ffd34d'; ctx.shadowBlur = 18 + pulse * 26;
  ctx.fillStyle = r.flash > 0 ? '#fff' : '#5c5046';
  ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(-66, -72); ctx.lineTo(-40, -136); ctx.lineTo(0, -158); ctx.lineTo(42, -138); ctx.lineTo(64, -80); ctx.lineTo(58, 0); ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0;
  // brilho do livro lá dentro, atravessando a pedra
  const g = ctx.createRadialGradient(0, -80, 2, 0, -80, 46); g.addColorStop(0, `rgba(255,240,170,${.55 + pulse * .4})`); g.addColorStop(1, 'rgba(255,200,60,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -80, 46, 0, 7); ctx.fill();
  ctx.strokeStyle = `rgba(255,214,90,${.45 + pulse * .5})`; ctx.lineWidth = 3; // veios dourados
  ctx.beginPath(); ctx.moveTo(-30, -36); ctx.lineTo(-10, -78); ctx.lineTo(8, -68); ctx.lineTo(26, -110); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-46, -102); ctx.lineTo(-20, -96); ctx.stroke();
  ctx.strokeStyle = '#140d08'; ctx.lineWidth = 3;
  CRACKS.slice(0, r.maxHp - r.hp).forEach(c => { ctx.beginPath(); c.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); });
  ctx.restore();
}
export function drawRubble(r) {
  ctx.fillStyle = '#4a4038';
  [[-50, 10, 16], [-18, 8, 22], [20, 9, 18], [48, 7, 12]].forEach(([x, ry, rx]) => { ctx.beginPath(); ctx.ellipse(r.x + x, GROUND + r.base - ry / 2, rx, ry, 0, Math.PI, 0); ctx.fill(); });
}
export function drawBook(b) {
  const y = b.y + (b.rest ? Math.sin(B.time * 3) * 6 : 0);
  ctx.save(); ctx.translate(b.x, y); ctx.rotate(Math.sin(B.time * 2) * .08);
  const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 60); glow.addColorStop(0, 'rgba(255,230,140,.7)'); glow.addColorStop(1, 'rgba(255,200,60,0)');
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, 60, 0, 7); ctx.fill();
  ctx.shadowColor = '#ffd34d'; ctx.shadowBlur = 24;
  ctx.fillStyle = '#b8860b'; ctx.fillRect(-24, -18, 48, 36);      // capa
  ctx.fillStyle = '#ffd86b'; ctx.fillRect(-21, -16, 42, 32);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#8a5a10'; ctx.fillRect(-24, -18, 6, 36);        // lombada
  ctx.fillStyle = '#fff6d0'; ctx.fillRect(3, -11, 4, 20); ctx.fillRect(-3, -5, 16, 4); // cruz
  ctx.restore();
}
// fim da fase: coluna de luz
export function drawGoal(x) {
  const gr = ctx.createLinearGradient(x - 40, 0, x + 40, 0);
  gr.addColorStop(0, 'rgba(255,220,120,0)'); gr.addColorStop(.5, `rgba(255,236,170,${.35 + .15 * Math.sin(B.time * 2)})`); gr.addColorStop(1, 'rgba(255,220,120,0)');
  ctx.fillStyle = gr; ctx.fillRect(x - 40, 60, 80, GROUND - 60);
  ctx.fillStyle = '#5c5046'; ctx.fillRect(x - 46, GROUND - 26, 92, 26); ctx.fillRect(x - 36, GROUND - 40, 72, 16);
}
// rasgo em forma de meia-lua, com o lado convexo apontando na direção do voo
export function drawCrescent(x, y, ang, alpha, sc, c) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc, sc); ctx.globalAlpha = alpha;
  ctx.shadowColor = c.brilho; ctx.shadowBlur = 25;
  const g = ctx.createLinearGradient(-10, 0, 30, 0); g.addColorStop(0, c.brilho + '00'); g.addColorStop(.6, c.claro); g.addColorStop(1, '#ffffff');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(-20, 0, 50, -1.15, 1.15); ctx.arc(-38, 0, 46, 1.05, -1.05, true); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// Tutorial do começo da jornada: uma dica por vez, conforme o que o jogador já fez
