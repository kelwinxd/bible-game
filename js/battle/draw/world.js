import { GROUND, IDOL, ctx } from '../config.js';
import { drawBoss } from '../boss.js';
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
// fundo "estica": uma imagem só, ampliada (F.estica) e presa no topo (lua abaixo do HUD), que atravessa a fase inteira bem devagar:
// no início mostra a borda esquerda e no fim a direita (sem repetir, sem emenda, sem perder qualidade)
// quadros (opcional) = a imagem é uma tira de N quadros lado a lado (GIF animado), tocada a `qps` quadros por segundo
function drawStretchedBg(F, img, cam) {
  const n = F.quadros || 1, fw = img.naturalWidth / n, H = 540 * F.estica, W = fw * H / img.naturalHeight;
  const q = n > 1 ? Math.floor(B.time * (F.qps || 5)) % n : 0;
  const t = Math.max(0, Math.min(1, cam / Math.max(1, B.fase.comprimento - 960)));
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, q * fw, 0, fw, img.naturalHeight, -Math.round(t * (W - 960)), 0, W, H); // presa no topo: a sobra embaixo fica atrás do chão
  if (F.escuro) { ctx.fillStyle = `rgba(6, 3, 8, ${F.escuro})`; ctx.fillRect(0, 0, 960, 540); }
}
export function drawSky(cam) {
  const F = B.fase.fundo;
  if (F) {
    const img = BG[F.img] || (BG[F.img] = Object.assign(new Image(), { src: F.img }));
    if (img.naturalWidth && F.estica) return drawStretchedBg(F, img, cam);
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
// Outra arte de chão pode trazer as próprias medidas em data.js → fases[].chaoMedidas (mesmos campos) e chaoCor (null = sem tingir).
const GSRC = { cap: 120, surf: 100, band: [160, 340], fade: 160, s: .5 };
// borda do buraco: a laje vai até o.x + 14 e a ponta passa mais capOut (a arte é opaca até a ponta, na altura em que se pisa).
// O colisor do buraco começa exatamente aí — o herói cai onde o chão desenhado acaba (data.js → B.terrain em js/battle/world.js)
export function bordaBuraco(fase) {
  if (!fase.chao) return 18; // chão desenhado por código: a borda é a do próprio retângulo
  const M = { ...GSRC, ...(fase.chaoMedidas || {}) };
  return Math.round(14 + (M.capOut ?? M.cap * .25) * M.s);
}
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
// capR (opcional) = largura da ponta direita, se for diferente da esquerda; capFade (opcional) = px em que a ponta se
// dissolve no miolo (sem ele, metade da ponta) — pontas largas com objetos (elmos, flechas) precisam de dissolução curta;
// capOut (opcional) = px da ponta que passam da borda para dentro do buraco/desnível (sem ele, 25% da ponta)
function groundKit(img, M = GSRC) {
  const { cap, fade, s, band } = M, capR = M.capR || cap, H = Math.round(img.height * s), cw = cap * s;
  const mk = (w, h) => { const c = Object.assign(document.createElement('canvas'), { width: w, height: h }); return [c, c.getContext('2d')]; };
  // miolo repetível, com a base arredondada (usado nas lajes flutuantes)
  const midSrc = img.width - cap - capR, W = midSrc * s, P = W - fade * s;
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
  const capCv = (sx, inner, w) => {
    const cwi = w * s, [c, x] = mk(cwi, H); x.drawImage(img, sx, 0, w, img.height, 0, 0, cwi, H);
    const gg = x.createLinearGradient(0, 0, cwi, 0), f = M.capFade ? M.capFade / w : null;
    gg.addColorStop(inner ? 0 : f ? 1 - f : .45, inner ? '#0000' : '#000'); gg.addColorStop(inner ? f || .55 : 1, inner ? '#000' : '#0000');
    x.globalCompositeOperation = 'destination-in'; x.fillStyle = gg; x.fillRect(0, 0, cwi, H); // a largura desta ponta (a direita pode ser maior)
    return c;
  };
  const capL = capCv(0, false, cap), capRc = capCv(img.width - capR, true, capR);
  return { mid, tall, capL, capR: capRc, cw, cwR: capR * s, outL: (M.capOut ?? cap * .25) * s, outR: (M.capOut ?? capR * .25) * s, fadeL: (M.capFade || cap * .55) * s, fadeR: (M.capFade || capR * .55) * s, surf: M.surf * s, pat: ctx.createPattern(tall, 'repeat-x'), patMid: ctx.createPattern(mid, 'repeat-x') };
}
const GK = {};
function groundImg() {
  const F = B.fase.chao; if (!F) return null;
  if (!BG[F]) { // monta o kit só depois de decodificar: antes disso o tingimento saía chapado, sem a textura
    BG[F] = Object.assign(new Image(), { src: F });
    const cor = B.fase.chaoCor === undefined ? CHAO_COR : B.fase.chaoCor, M = { ...GSRC, ...(B.fase.chaoMedidas || {}) };
    BG[F].decode().then(() => { GK[F] = groundKit(cor ? tingir(BG[F], cor) : BG[F], M); });
  }
  return GK[F] || null;
}
// um pedaço de laje entre a e b com a superfície em y; tampas arredondadas onde capL/capR
function slab(k, a, b, y, capL, capR, sc = 1, fundo = false) {
  const cw = k.cw * sc, cwR = (k.cwR || k.cw) * sc, top = y - k.surf * sc, h = (fundo ? k.mid.height : k.tall.height) * sc;
  // a ponta passa um pouco da borda (só o arredondado); o miolo começa embaixo da parte dela que se dissolve
  const oL = (k.outL ?? k.cw * .25) * sc, oR = (k.outR ?? k.cw * .25) * sc;
  const ma = capL ? a - oL + cw - k.fadeL * sc : a, mb = capR ? b + oR - cwR + k.fadeR * sc : b;
  const p = fundo ? k.patMid : k.pat; p.setTransform(new DOMMatrix().translate(0, top).scale(sc));
  if (mb > ma) { ctx.fillStyle = p; ctx.fillRect(ma, top, mb - ma, h); }
  // chão firme (não laje flutuante): a parede de pedras continua por baixo das pontas, de borda a borda
  // (pontas largas não deixam buraco embaixo); começa onde a ponta já ficou para trás
  if (!fundo && (capL || capR) && y < GROUND - 1) { // só em terreno elevado (no chão normal ela ficaria solta embaixo)
    const y0 = top + k.capL.height * sc * .8, xa = capL ? a : ma, xb = capR ? b : mb;
    ctx.fillStyle = p; ctx.fillRect(xa, y0, xb - xa, h - (y0 - top));
  }
  if (capL) ctx.drawImage(k.capL, a - oL, top, cw, k.capL.height * sc);
  if (capR) ctx.drawImage(k.capR, b + oR - cwR, top, cwR, k.capR.height * sc);
}
function drawGroundImg(k, cam) {
  const x0 = cam - 80, x1 = cam + 1040;
  // trechos visíveis com a altura de cada um (buracos = Infinity)
  let segs = [{ a: x0, b: x1, top: 0 }];
  const cut = (x, w, top) => {
    segs = segs.flatMap(s => s.b <= x || s.a >= x + w ? [s]
      : [{ ...s, b: x }, { a: Math.max(s.a, x), b: Math.min(s.b, x + w), top }, { ...s, a: x + w }].filter(q => q.b > q.a));
  };
  B.terrain.filter(t => t.top !== Infinity && !t.oculto).forEach(t => cut(t.x, t.w, t.top)); // degraus de estrutura: a arte dela já mostra
  B.holes.forEach(o => cut(o.x + 14, o.w - 28, Infinity)); // a laje avança um pouco sobre a borda do buraco, onde ainda dá pé
  // fundo dos buracos: escuridão por trás das lajes (no mar: o mar agitado)
  B.holes.forEach(o => { if (o.mar) return drawSea(o); if (drawSeaHands(o)) return; const gr = ctx.createLinearGradient(0, GROUND - 10, 0, 540); gr.addColorStop(0, '#0000'); gr.addColorStop(.35, '#000'); gr.addColorStop(1, '#0a0503'); ctx.fillStyle = gr; ctx.fillRect(o.x, GROUND - 10, o.w, 550 - GROUND); });
  // terra submersa subindo (ou já em cima): na frente do mar
  B.risers.forEach(r => { if (r.k > 0) slab(k, r.x, r.x + r.w, GROUND + riseOff(r), true, false); });
  // do mais baixo para o mais alto: a parede de quem é mais alto fica na frente
  segs.map((s, i) => ({ s, l: segs[i - 1], r: segs[i + 1] })).filter(q => q.s.top !== Infinity).sort((p, q) => q.s.top - p.s.top)
    .forEach(({ s, l, r }) => slab(k, s.a, s.b, GROUND + s.top, l && l.top > s.top, r && r.top > s.top));
}
// chão em faixas: terreno normal, mais alto ou mais baixo (buracos são desenhados por cima)
// quanto a terra submersa ainda está abaixo da superfície (0 = em cima); sobe desacelerando
export const riseOff = r => (1 - (1 - Math.pow(1 - r.k, 3))) * 230;
export function drawGround(cam) {
  const k = groundImg(); if (k) return drawGroundImg(k, cam);
  B.risers.forEach(r => { if (r.k > 0) { ctx.fillStyle = '#1a0f0b'; ctx.fillRect(r.x, GROUND + riseOff(r), r.w, 540); } });
  const H = 540, x0 = cam - 20, x1 = cam + 980;
  const strip = (a, b, top) => {
    if (b <= a) return;
    ctx.fillStyle = '#1a0f0b'; ctx.fillRect(a, GROUND + top, b - a, H - GROUND - top);
    ctx.fillStyle = '#3a2418'; ctx.fillRect(a, GROUND + top, b - a, 4);
    ctx.fillStyle = '#2d1c14';
    for (let x = Math.ceil(a / 60) * 60; x < b - 30; x += 60) ctx.fillRect(x, GROUND + top + 10 + ((x / 60) % 3 + 3) % 3 * 14, 30, 4);
  };
  let cur = x0;
  B.terrain.filter(t => t.top !== Infinity && !t.oculto && t.x + t.w > x0 && t.x < x1).sort((a, b) => a.x - b.x).forEach(t => {
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
  if (o.mar) return drawSea(o);
  if (drawSeaHands(o)) return;
  const gr = ctx.createLinearGradient(0, GROUND, 0, 540); gr.addColorStop(0, '#000'); gr.addColorStop(1, '#0a0503');
  ctx.fillStyle = gr; ctx.fillRect(o.x, GROUND, o.w, 540 - GROUND);
  ctx.fillStyle = '#3a2418'; ctx.fillRect(o.x - 4, GROUND, 6, 540 - GROUND); ctx.fillRect(o.x + o.w - 2, GROUND, 6, 540 - GROUND);
}
// Buraco = 3 mãos em chamas (sprite com o próprio fogo) saindo do fundo: sobem e agarram quando o herói chega perto,
// afundam quando ele se afasta; cada uma com seu ritmo. Em buraco com laje, ficam nos vãos livres.
export const HAND = { img: new Image(), FW: 177, FH: 209, ax: 89, n: 3, scale: .55 }; // quadros 0–4: agarrando (loop) · 5–9: afundando
HAND.img.src = 'assets/sprites/hazard/mao-fogo.png';
// Mar: buraco cheio de ondas (4 quadros 470×206 em loop). Os quadros se repetem lado a lado, um normal e o seguinte
// espelhado (as bordas emendam sem corte); as cristas passam um pouco acima da borda do chão, por trás das lajes
export const SEA = { img: new Image(), FW: 470, FH: 206, n: 4, sc: .5, fps: 5 };
SEA.img.src = 'assets/sprites/hazard/mar.webp';
export function drawSea(o) {
  const gr = ctx.createLinearGradient(0, GROUND, 0, 540); gr.addColorStop(0, '#0e1a26'); gr.addColorStop(1, '#060c12'); // água funda atrás das ondas
  ctx.fillStyle = gr; ctx.fillRect(o.x, GROUND + 10, o.w, 540 - GROUND);
  drawBoss(o); // o Leviatã fica entre a água funda e as ondas (as ondas cobrem a base do corpo)
  if (!SEA.img.naturalWidth) return;
  // recorta 6 px de cada lado do quadro (a borda da arte é mais clara/transparente). Espelhando um sim, um não, os dois lados
  // de cada emenda mostram a mesma coluna da arte; largura e posições em pixel inteiro (sem fresta de meio pixel): sem linha entre eles
  const IN = 6, w = Math.round((SEA.FW - IN * 2) * SEA.sc), h = SEA.FH * SEA.sc, fr = Math.floor(B.time * SEA.fps) % SEA.n, y = 548 - h;
  ctx.save(); ctx.beginPath(); ctx.rect(o.x, 0, o.w, 560); ctx.clip(); // só dentro do buraco
  for (let i = 0, x = Math.round(o.x - 10); x < o.x + o.w; i++, x += w) {
    ctx.save(); ctx.translate(x + (i % 2 ? w : 0), y); ctx.scale(i % 2 ? -1 : 1, 1);
    ctx.drawImage(SEA.img, fr * SEA.FW + IN, 0, SEA.FW - IN * 2, SEA.FH, 0, 0, w + (i % 2 ? 0 : 1), h); // +1 px por baixo do vizinho
    ctx.restore();
  }
  ctx.restore();
}
// Buraco comum: água agitada com mãos de esqueleto saindo dela (do GIF: 4 quadros 524×260, 0,18 s cada).
// A cena inteira (as 3 mãos) na largura do buraco, um pouco maior para as pontas ficarem atrás das lajes; base abaixo da borda da tela
export const SEA_HANDS = { img: new Image(), FW: 524, FH: 260, n: 4, dur: .18 };
SEA_HANDS.img.src = 'assets/sprites/hazard/mar-maos.webp';
// outra arte por jornada: data.js → fases[].maos = { img, FW, FH, n, dur, agua (y da superfície no quadro), fundo: [cor1, cor2] }
const MAOS = {};
export function drawSeaHands(o) {
  const M = B.fase.maos, S = M ? (MAOS[M.img] || (MAOS[M.img] = { ...M, img: Object.assign(new Image(), { src: M.img }) })) : SEA_HANDS;
  if (!S.img.naturalWidth) return false;
  const cor = S.fundo || ['#0e1a26', '#060c12'];
  const gr = ctx.createLinearGradient(0, GROUND, 0, 540); gr.addColorStop(0, cor[0]); gr.addColorStop(1, cor[1]);
  ctx.fillStyle = gr; ctx.fillRect(o.x, GROUND + 10, o.w, 540 - GROUND);
  const sc = Math.max(.3, (o.w + 24) / S.FW), w = S.FW * sc, h = S.FH * sc, fr = Math.floor(B.time / S.dur) % S.n;
  const y = S.agua != null ? GROUND + 10 - S.agua * sc : 546 - h; // agua: a superfície do mar na borda do chão
  ctx.save(); ctx.beginPath(); ctx.rect(o.x, 0, o.w, 560); ctx.clip();
  ctx.drawImage(S.img, fr * S.FW, 0, S.FW, S.FH, Math.round(o.x + o.w / 2 - w / 2), Math.round(y), w, h);
  ctx.restore();
  return true;
}
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
  if (!HAND.img.naturalWidth || o.mar || SEA_HANDS.img.naturalWidth) return; // mãos de fogo: só se a arte do mar com mãos não carregar
  const t = B.time, p = o.hand || 0;
  handSpots(o).forEach(hd => {
    const q = Math.max(0, Math.min(1, p * 1.5 - hd.delay)); // uma depois da outra
    const fr = q >= 1 ? Math.floor(t * 8 + hd.ph) % 5 : 5 + Math.round((1 - q) * 4);
    ctx.save(); ctx.translate(hd.x, 548 + hd.dy); ctx.scale(hd.sc * hd.flip, hd.sc);
    ctx.drawImage(HAND.img, fr * HAND.FW, 0, HAND.FW, HAND.FH, -HAND.ax, -HAND.FH, HAND.FW, HAND.FH);
    ctx.restore();
  });
}
// Ídolo (bezerro de ouro): um quadro por golpe; brilha dourado (o livro está lá dentro). Derrubado: pedestal + peças caindo
export function drawRock(r) {
  if (!IDOL.img.naturalWidth) return;
  const { W, H, foot, cx, sc } = IDOL, fr = Math.min(2, r.maxHp - r.hp), pulse = .5 + .5 * Math.sin(B.time * 3);
  ctx.save(); ctx.translate(r.x, GROUND + r.base); ctx.scale(sc, sc);
  ctx.shadowColor = '#ffd34d'; ctx.shadowBlur = 14 + pulse * 22;
  if (r.flash > 0) ctx.filter = 'brightness(1.9)';
  ctx.drawImage(IDOL.img, fr * W, 0, W, H, -cx, -foot, W, H);
  ctx.restore();
}
export function drawRubble(r) {
  if (!IDOL.img.naturalWidth) return;
  const { W, H, foot, cx, sc } = IDOL;
  ctx.save(); ctx.translate(r.x, GROUND + r.base); ctx.scale(sc, sc);
  ctx.drawImage(IDOL.img, 3 * W, 0, W, H, -cx, -foot, W, H);
  ctx.restore();
  (r.pieces || []).forEach(p => {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.scale(sc, sc);
    ctx.drawImage(IDOL.pecas, p.sx, p.sy, p.w, p.h, -p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
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
// Fim da jornada: a cruz com o manto ao vento (4 quadros 350×412, base das pedras alinhada) sob um facho de luz vindo de cima.
// Se o chão dela estiver submerso, ela sobe junto com ele (dy)
export const CROSS = { img: new Image(), FW: 350, FH: 412, ax: 120, foot: 406, sc: .42, ordem: [0, 1, 2, 3, 2, 1] };
CROSS.img.src = 'assets/sprites/object/cruz.webp';
// estrutura (data.js → { tipo: "estrutura" }): uma arte inteira (ex.: a escadaria do zigurate) em pé no chão, com a base
// `base` px abaixo da superfície; os degraus dela são terreno invisível (B.terrain com oculto) — ver js/battle/world.js
// sombra leve no chão embaixo de um bicho: elipse escura e suave. alt = quanto o corpo está acima do chão
// (no pulo/voo a sombra encolhe e clareia)
export function drawShadow(x, gy, w, alt = 0, a = .38) {
  const k = Math.max(.35, 1 - alt / 260), rx = w / 2 * k, ry = Math.max(3, w * .11 * k);
  ctx.save(); ctx.translate(x, gy - 2); ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, `rgba(0,0,0,${a * k})`); g.addColorStop(.6, `rgba(0,0,0,${a * k * .55})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, 7); ctx.fill(); ctx.restore();
}
const EST = {};
export function drawEstrutura(e) {
  const img = EST[e.img] || (EST[e.img] = Object.assign(new Image(), { src: e.img }));
  if (!img.naturalWidth || e.x > B.cam + 1000 || e.x + e.w * e.sc < B.cam - 40) return;
  ctx.drawImage(img, e.x, GROUND + e.base - e.h * e.sc, e.w * e.sc, e.h * e.sc);
}
export function drawGoal(x) {
  const r = B.risers.find(r => x >= r.x && x <= r.x + r.w), dy = r ? riseOff(r) : 0;
  const gr = ctx.createLinearGradient(x - 50, 0, x + 50, 0); // a luz desce do céu até o chão (marca o fim mesmo com a terra submersa)
  gr.addColorStop(0, 'rgba(255,220,120,0)'); gr.addColorStop(.5, `rgba(255,236,170,${.35 + .15 * Math.sin(B.time * 2)})`); gr.addColorStop(1, 'rgba(255,220,120,0)');
  ctx.fillStyle = gr; ctx.fillRect(x - 50, 60, 100, GROUND - 60);
  if (!CROSS.img.naturalWidth) return;
  const fr = CROSS.ordem[Math.floor(B.time * 5) % CROSS.ordem.length]; // o manto vai e volta com o vento
  ctx.save(); ctx.translate(x, GROUND + dy); ctx.scale(CROSS.sc, CROSS.sc);
  ctx.shadowColor = '#ffe9a8'; ctx.shadowBlur = 30 + 12 * Math.sin(B.time * 2); // brilho da luz sobre ela
  ctx.drawImage(CROSS.img, fr * CROSS.FW, 0, CROSS.FW, CROSS.FH, -CROSS.ax, -CROSS.foot, CROSS.FW, CROSS.FH);
  ctx.restore();
}
// rasgo em forma de meia-lua, com o lado convexo apontando na direção do voo
export function drawCrescent(x, y, ang, alpha, sc, c, sy = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc, sc * sy); ctx.globalAlpha = alpha; // sy: estica só na altura
  ctx.shadowColor = c.brilho; ctx.shadowBlur = 25;
  const g = ctx.createLinearGradient(-10, 0, 30, 0); g.addColorStop(0, c.brilho + '00'); g.addColorStop(.6, c.claro); g.addColorStop(1, '#ffffff');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(-20, 0, 50, -1.15, 1.15); ctx.arc(-38, 0, 46, 1.05, -1.05, true); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// Tutorial do começo da jornada: uma dica por vez, conforme o que o jogador já fez
