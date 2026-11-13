import { bleat } from '../core/audio.js';
import { reduced } from '../core/utils.js';
import { GROUND, ctx } from './config.js';
import { drawShadow } from './draw/world.js';
import { B } from './state.js';
import { terrainTop } from './world.js';

// ---------- Ovelha perdida (Vale da sombra, antes da boca da caverna) ----------
// data.js → { tipo: "ovelha", x }. Parada, olhando para o herói (idle, 6 quadros); quando ele chega a ~120 px dela, ela se
// assusta, vira, dispara na direção da boca da caverna e despenca lá dentro (some). Não fere nem leva golpe: é cenário vivo.
// A arte olha para a direita. Escala SC sobre a tira (as tiras já foram reduzidas a 40% da arte enviada).
const OV = { idle: { img: new Image(), FW: 128, FH: 126, n: 6, fps: 6 }, run: { img: new Image(), FW: 132, FH: 104, n: 6, fps: 14, k: 1.25 } }; // k: a arte da corrida veio ~25% menor (medido pelo corpo de lã): igualada ao idle
OV.idle.img.src = 'assets/sprites/enemy/ovelha-idle.webp'; OV.run.img.src = 'assets/sprites/enemy/ovelha-run.webp';
// a ovelha achada no fim da caverna (data.js → calma: true): idle tranquilo (6 quadros 128×130, fecha os olhos e ergue o focinho)
OV.calma = { img: new Image(), FW: 128, FH: 130, n: 6, fps: 4 }; OV.calma.img.src = 'assets/sprites/enemy/ovelha-calma.webp';
const CURA = 50; // vida que ela dá ao ser tocada (uma vez)
const SC = .7, CORRE = 260, GRAV = 1400, PERTO = 120, MEIA = 40; // PERTO: px entre a borda do herói e a dela para ela se assustar // MEIA: meia largura do corpo (desenhado)

export const makeSheep = e => ({ x: e.x, y: 0, vy: 0, face: -1, state: e.calma ? 'calma' : 'idle', t: Math.random() * 3, bala: 1.5 });

export function updateSheep(dt) {
  const h = B.hero;
  B.ovelhas.forEach(o => {
    o.t += dt;
    if (o.state === 'calma') { // a ovelha achada: parada, olhando para o herói; tocar nela dá vida; bale baixinho de vez em quando
      o.face = h.x < o.x ? -1 : 1;
      const d = Math.abs(h.x - o.x);
      if (d < 450 && (o.bala -= dt) <= 0) { o.bala = 3.5 + Math.random() * 3; bleat(d < 150 ? .06 : .035); }
      if (!o.deu && d < MEIA + 22 && Math.abs(h.y - terrainTop(o.x)) < 60 && h.deadAt == null) {
        o.deu = true; o.bala = 3; bleat(.07);
        const ganho = Math.min(CURA, 100 - B.hp); B.hp = Math.min(100, B.hp + CURA);
        B.floats.push({ x: o.x, y: GROUND - 120, t: 1.4, s: ganho > 0 ? `+${Math.round(ganho)} vida` : 'vida cheia', c: '#7dff8a' });
        B.notice = { lines: ['Você achou a ovelha perdida!', 'O Senhor é o meu pastor: nada me faltará'], t: 3.5, c: '#f2c84b' };
        for (let k = 0; k < (reduced ? 6 : 18); k++) B.shards.push({ x: o.x + (Math.random() - .5) * 60, y: GROUND - 40 - Math.random() * 40, vx: (Math.random() - .5) * 120, vy: -120 - Math.random() * 160, r: Math.random() * 6, t: 1, c: '255,225,140', sz: .4 + Math.random() * .4 });
      }
    } else if (o.state === 'idle') {
      o.face = h.x < o.x ? -1 : 1; // parada, olha para o herói
      if (Math.abs(h.x - o.x) - MEIA - 22 <= PERTO && h.deadAt == null) { o.state = 'run'; o.t = 0; o.face = h.x < o.x ? 1 : -1; } // assustou: vira e foge
    } else if (o.state === 'run') {
      o.x += o.face * CORRE * dt;
      if (terrainTop(o.x) > 200) { o.state = 'fall'; o.vy = 0; } // passou da borda (buraco ou boca da caverna): despenca
    } else if (o.state === 'fall') {
      o.x += o.face * CORRE * .5 * dt; o.vy += GRAV * dt; o.y += o.vy * dt;
      if (o.y > 360) o.gone = true; // já saiu inteira por baixo da tela
    }
  });
  B.ovelhas = B.ovelhas.filter(o => !o.gone);
}

export function drawSheep(o) {
  if (o.x < B.cam - 120 || o.x > B.cam + 1080) return;
  const S = o.state === 'calma' ? OV.calma : o.state === 'idle' ? OV.idle : OV.run; if (!S.img.naturalWidth) return;
  const fr = Math.floor(o.t * S.fps) % S.n;
  const gy = GROUND + (o.state === 'fall' ? 0 : terrainTop(o.x));
  ctx.save();
  if (o.state !== 'fall') drawShadow(o.x, gy, 70); // caindo: sem corte, desce inteira até sair da tela
  const sc = SC * (S.k || 1);
  ctx.translate(o.x, gy + o.y); ctx.scale(o.face * sc, sc);
  if (o.state === 'fall' && !reduced) ctx.rotate(Math.min(.6, o.y / 300));
  ctx.drawImage(S.img, fr * S.FW, 0, S.FW, S.FH, -S.FW / 2, 1 - S.FH, S.FW, S.FH);
  ctx.restore();
}
