// O Faraó: o desenho (ele, a ponta do cajado acesa, a onda, as nuvens de praga e a fala quando cai)
import { GROUND, ctx } from '../../../config.js';
import { B } from '../../../state.js';
import { FILTRO_ACERTO, brilho, desenharBolas, desenharQuadro, quadroNoTempo } from '../../efeitos.js';
import { COBRA, FARAO, MORTE, ONDA, PRAGA } from './farao.config.js';
import { SPRITES } from './farao.sprites.js';

function quadro(L) {
  const temAtaque = SPRITES.ataque.img.naturalWidth;
  if (L.state === 'dead' && SPRITES.morte.img.naturalWidth) return [SPRITES.morte, quadroNoTempo(MORTE.quadros, L.t)];
  if (temAtaque && L.state === 'cobra') return [SPRITES.ataque, quadroNoTempo(COBRA.quadros, L.t)];
  if (temAtaque && L.state === 'praga') return [SPRITES.ataque, L.t < FARAO.arma * .4 ? 1 : L.t < PRAGA.T - .15 ? 2 : 5]; // arma e estende o cajado
  if (temAtaque && L.state === 'pragaDasRas') return [SPRITES.ataque, L.t < FARAO.arma ? 1 : 5];
  const S = SPRITES.anda, anda = (L.state === 'walk' && L.anda) || L.state === 'enter';
  return [S, anda ? Math.floor(B.time * S.fps) % S.n : 0]; // parado: o 1º quadro
}
/** armando: o brilho roxo antes do golpe */
const armando = L => ((L.state === 'praga' || L.state === 'pragaDasRas') && L.t < FARAO.arma) || (L.state === 'ondaDoCajado' && L.t < ONDA.bate) || (L.state === 'cobra' && L.t < COBRA.acerta[0]);
/** na onda: ergue o corpo e desce na batida */
const ergue = L => L.state !== 'ondaDoCajado' ? 0 : L.t < ONDA.bate ? -Math.min(1, L.t / ONDA.bate) * 14 : Math.max(0, 8 - (L.t - ONDA.bate) * 40);

export function desenharFarao(L) {
  const [S, fr] = quadro(L);
  desenharQuadro(S, fr, L.x, GROUND, { face: L.face, dy: ergue(L), filtro: L.flash > 0 ? FILTRO_ACERTO : armando(L) ? brilho('#b45cff') : null });
  if (armando(L) && (L.state === 'praga' || L.state === 'ondaDoCajado')) pontaDoCajado(L);
  if (L.onda) onda(L.onda);
  desenharBolas(L);
  if (L.state === 'dead') fala(L);
}
function pontaDoCajado(L) {
  const cx = L.x + L.face * FARAO.cajado[0], cy = GROUND - FARAO.cajado[1], k = .6 + .4 * Math.sin(B.time * 18);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 * k); g.addColorStop(0, 'rgba(255,230,255,.95)'); g.addColorStop(.4, 'rgba(190,100,255,.7)'); g.addColorStop(1, 'rgba(120,40,200,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 30 * k, 0, 7); ctx.fill(); ctx.restore();
}
function onda(o) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.max(0, 1 - Math.abs(o.x - o.x0) / ONDA.alcance);
  const g = ctx.createRadialGradient(o.x, GROUND, 0, o.x, GROUND, 60); g.addColorStop(0, 'rgba(230,180,255,.9)'); g.addColorStop(.5, 'rgba(160,70,240,.6)'); g.addColorStop(1, 'rgba(90,20,160,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(o.x, GROUND - 8, 60, 34, 0, Math.PI, 0); ctx.fill(); ctx.restore();
  if (B.time % .05 > .025) B.shards.push({ x: o.x + (Math.random() - .5) * 30, y: GROUND - 4, vx: -o.face * Math.random() * 120, vy: -80 - Math.random() * 160, r: Math.random() * 6, t: .5, c: Math.random() < .5 ? '200,140,255' : '120,95,70', sz: .4 + Math.random() * .4 }); // poeira
}
/** o balão da fala dele, prostrado (papel, como as falas da cena): aparece e some suave */
function fala(L) {
  const [t0, t1] = MORTE.fala; if (L.t < t0 || L.t > t1) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, (L.t - t0) / .2, (t1 - L.t) / .3);
  ctx.font = '700 19px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = Math.max(...MORTE.texto.map(t => ctx.measureText(t).width)) + 34, bh = MORTE.texto.length * 25 + 16;
  const hx = L.x + L.face * 60, x = Math.min(B.cam + 960 - w / 2 - 8, Math.max(B.cam + w / 2 + 8, hx)), y = GROUND - 165;
  ctx.fillStyle = '#fbf3e2'; ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - bh, w, bh, 12); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx - 10, y - 1); ctx.lineTo(hx - 2, y + 14); ctx.lineTo(hx + 8, y - 1); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillRect(hx - 9, y - 4, 16, 4);
  ctx.fillStyle = '#2a1a10'; MORTE.texto.forEach((t, i) => ctx.fillText(t, x, y - bh + 20.5 + i * 25));
  ctx.restore();
}
