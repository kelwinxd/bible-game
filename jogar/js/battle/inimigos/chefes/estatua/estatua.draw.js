// O Ídolo Babilônico: o desenho. Ela fica ATRÁS do piso (desenharEstatua, antes do chão); as bolas de fogo vão na frente
import { GROUND, ctx } from '../../../config.js';
import { B } from '../../../state.js';
import { quadroNoTempo } from '../../efeitos.js';
import { ESTATUA, MORTE, SOCO, SOPRO } from './estatua.config.js';
import { SPRITES } from './estatua.sprites.js';

/** a arte e o quadro do estado atual (viva) */
function quadro(L) {
  if (L.state === 'soco') return [SPRITES.soco, quadroNoTempo(SOCO.quadros, L.t)];
  if (L.state === 'sopro' && SPRITES.sopro.img.naturalWidth) {
    const fr = L.t >= SOPRO.loop0 ? 4 + Math.floor((L.t - SOPRO.loop0) / SOPRO.troca) % 2 : quadroNoTempo(SOPRO.abre, L.t); // os 2 últimos em loop
    return [SPRITES.sopro, fr];
  }
  const S = SPRITES.parada; return [S, Math.floor(B.time * S.fps) % S.n];
}
const armando = L => (L.state === 'soco' && L.t < SOCO.impacto) || (L.state === 'sopro' && L.t < SOPRO.loop0);

export function desenharEstatua(L) {
  if (L.state === 'dead') return desenharMorte(L);
  const [S, fr] = quadro(L); if (!S.img.naturalWidth) return;
  const sc = ESTATUA.escala;
  ctx.save();
  if (L.flash > 0) ctx.filter = 'brightness(2.4) saturate(.3)';
  else if (armando(L)) ctx.filter = `drop-shadow(0 0 ${14 + 10 * Math.sin(L.t * 30)}px #ff5010)`;
  ctx.drawImage(S.img, fr * S.FW, 0, S.FW, S.FH, L.x - S.FW / 2 * sc, L.topo(), S.FW * sc, S.FH * sc);
  ctx.restore();
}
/** urra, cambaleia, cai de joelhos e tomba; deitada um tempo, afunda atrás do piso */
function desenharMorte(L) {
  const M = SPRITES.morte; if (!M.img.naturalWidth) return;
  let q = 0; MORTE.quadros.forEach((t0, i) => { if (L.t >= t0) q = i; });
  const sc = ESTATUA.escala, pe = GROUND + MORTE.base[q] + L.sink * 380; // a linha dos pés (atrás do piso)
  ctx.save(); ctx.globalAlpha = 1 - L.sink * .5;
  ctx.drawImage(M.img, q * M.FW, 0, M.FW, M.FH, L.x - M.FW / 2 * sc, pe - M.pe * sc, M.FW * sc, M.FH * sc);
  ctx.restore();
}
