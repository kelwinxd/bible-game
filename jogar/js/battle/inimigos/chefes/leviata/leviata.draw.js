// O chefão do mar: o desenho — dentro do mar, atrás das ondas (que cobrem a base do corpo)
import { GROUND, ctx } from '../../../config.js';
import { B } from '../../../state.js';
import { FILTRO_ACERTO, brilho } from '../../efeitos.js';
import { ACIDO, BOTE, MAR, MERGULHO } from './leviata.config.js';

/** a arte, o quadro e quanto ele está abaixo da água (0 = em pé, 1 = sumido) */
function quadro(L) {
  const A = L.pele.arte, S = A.nada, nadando = Math.floor(B.time * 8) % S.n;
  if (L.state === 'surge') return [S, nadando, 1 - Math.min(1, L.t / MAR.surge)];
  if (L.state === 'mergulho') return [S, nadando, Math.min(1, L.t / MERGULHO.desce)];
  if (L.state === 'bote' && A.bote.img.naturalWidth) return [A.bote, Math.min(A.bote.n - 1, Math.floor(L.t / BOTE.T * A.bote.n)), 0];
  if (L.state === 'acido' && A.acido.img.naturalWidth) return [A.acido, Math.min(A.acido.n - 1, Math.floor(L.t / ACIDO.T * A.acido.n)), 0];
  if (L.state === 'dead') return [S, 0, L.sink];
  return [S, nadando, 0];
}
function filtro(L) {
  if (L.flash > 0) return FILTRO_ACERTO;
  if (L.state === 'bote' && L.t < BOTE.acerta[0]) return brilho('#ff2020', 14);  // armando o bote
  if (L.state === 'acido' && L.t < ACIDO.cospe) return brilho('#9cff3a', 14);    // armando o ácido
  return null;
}

export function desenharNoMar(L) {
  const P = L.pele; if (L.state === 'hidden' || L.state === 'submerso' || !P.arte.nada.img.naturalWidth) return;
  const [S, fr, abaixo] = quadro(L), s = P.sc, y = GROUND + MAR.agua + abaixo * P.arte.nada.FH * s * .95;
  ctx.save(); ctx.translate(L.x, y); ctx.scale(L.face * P.dir * s, s); // dir: para onde a arte olha
  const f = filtro(L); if (f) ctx.filter = f;
  if (L.state === 'dead') ctx.globalAlpha = 1 - L.sink * .6;
  ctx.drawImage(S.img, fr * S.FW, (S.row || 0) * S.FH, S.FW, S.FH, -S.ax, -S.foot, S.FW, S.FH);
  ctx.restore();
}
