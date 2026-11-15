// Nabucodonosor: o desenho (o rei, o jato de fogo das mãos e as bolas de fogo)
import { GROUND, ctx } from '../../../config.js';
import { B } from '../../../state.js';
import { FILTRO_ACERTO, brilho, desenharBolas, desenharQuadro } from '../../efeitos.js';
import { CHAMAS, FOGO, JATO, RAJADA, REI, SOLDADOS } from './nabucodonosor.config.js';
import { SPRITES } from './nabucodonosor.sprites.js';

function quadro(L) {
  if (L.state === 'invocarSoldados' && SPRITES.invoca.img.naturalWidth) return [SPRITES.invoca, Math.min(5, Math.floor(L.t / SOLDADOS.surgem * 6))];
  if (L.state === 'lancaChamas' && SPRITES.chamas.img.naturalWidth) return [SPRITES.chamas, Math.min(5, Math.floor(L.t / CHAMAS.arma * 6))];
  const S = L.state === 'walk' && L.anda ? SPRITES.anda : SPRITES.parado;
  return [S, L.state === 'dead' ? 0 : Math.floor(B.time * S.fps) % S.n];
}
/** armando: o brilho de fogo antes de atirar */
const armando = L => (L.state === 'fogoDosOlhos' && L.t < FOGO.arma) || (L.state === 'rajada' && L.t < RAJADA.tiros[0]) || (L.state === 'lancaChamas' && L.t < CHAMAS.arma);

export function desenharRei(L) {
  const [S, fr] = quadro(L), morto = L.state === 'dead';
  desenharQuadro(S, fr, L.x, GROUND + REI.afunda + (morto ? L.sink * 40 : 0), {
    face: L.face, alpha: morto ? 1 - L.sink : 1, filtro: L.flash > 0 ? FILTRO_ACERTO : armando(L) ? brilho('#ff4010', 18) : null });
  if (L.state === 'lancaChamas') desenharJato(L, L.t - CHAMAS.arma);
  desenharBolas(L);
}
/** o jato de fogo saindo das mãos: cresce, depois os 3 últimos quadros em loop; some no fim */
function desenharJato(L, tj) {
  const S = SPRITES.jato; if (tj < 0 || tj >= CHAMAS.dura || !S.img.naturalWidth) return;
  const q = tj < CHAMAS.cresce ? Math.min(4, Math.floor(tj / CHAMAS.cresce * 5)) : 5 + Math.floor((tj - CHAMAS.cresce) * 10) % 3;
  ctx.save(); ctx.translate(L.x + L.face * JATO.maos[0], GROUND - JATO.maos[1]); ctx.scale(L.face, 1); ctx.rotate(JATO.ang); ctx.scale(JATO.sx, 1);
  ctx.globalAlpha = tj > CHAMAS.dura - .2 ? (CHAMAS.dura - tj) / .2 : 1;
  ctx.drawImage(S.img, q * S.FW, 0, S.FW, S.FH, -6, -JATO.cy, S.FW, S.FH);
  ctx.restore();
}
