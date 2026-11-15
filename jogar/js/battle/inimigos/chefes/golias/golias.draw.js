// Golias: o desenho (qual arte e qual quadro em cada estado)
import { GROUND } from '../../../config.js';
import { B } from '../../../state.js';
import { FILTRO_ACERTO, brilho, desenharQuadro, quadroNoTempo } from '../../efeitos.js';
import { ESTOCADA, GOLIAS, GOLPE_NO_CHAO } from './golias.config.js';
import { SPRITES } from './golias.sprites.js';

/** a arte e o quadro do estado atual */
function quadro(L) {
  if (L.state === 'estocada' && SPRITES.estocada.img.naturalWidth) return [SPRITES.estocada, quadroNoTempo(ESTOCADA.quadros, L.t)];
  if (L.state === 'golpeNoChao' && SPRITES.golpeNoChao.img.naturalWidth) return [SPRITES.golpeNoChao, quadroNoTempo(GOLPE_NO_CHAO.quadros, L.t)];
  const S = SPRITES.anda;
  return [S, L.state === 'dead' ? 0 : Math.floor(B.time * S.fps) % S.n];
}
/** armando: o brilho vermelho antes de o golpe acertar */
const armando = L => (L.state === 'estocada' && L.t < ESTOCADA.acerta[0]) || (L.state === 'golpeNoChao' && L.t < GOLPE_NO_CHAO.acerta);

export function desenharGolias(L) {
  const [S, fr] = quadro(L), morto = L.state === 'dead';
  desenharQuadro(S, fr, L.x, GROUND + GOLIAS.afunda + (morto ? L.sink * 40 : 0), {
    face: L.face, sc: GOLIAS.escala, alpha: morto ? 1 - L.sink : 1,
    filtro: L.flash > 0 ? FILTRO_ACERTO : armando(L) ? brilho('#ff2020') : null });
}
