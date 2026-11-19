// Golias: o desenho (qual arte e qual quadro em cada estado)
import { GROUND } from '../../../config.js';
import { B } from '../../../state.js';
import { FILTRO_ACERTO, brilho, desenharQuadro, quadroNoTempo } from '../../efeitos.js';
import { EMPURRAO, ESTOCADA, GOLIAS, GOLPES, GOLPE_NO_CHAO } from './golias.config.js';
import { SPRITES } from './golias.sprites.js';

const pronto = S => S.img.naturalWidth > 0;
const loop = S => Math.floor(B.time * S.fps) % S.n;

/** a arte e o quadro do estado atual (cada arte nova tem a de antes como reserva enquanto não carrega) */
function quadro(L) {
  const S = SPRITES;
  if (L.semCapacete) {
    if (L.state === 'empurrao' && pronto(S.empurrao)) {
      const E = EMPURRAO, tc = L.t - E.grito - E.arma;
      if (L.t < E.grito && pronto(S.grito)) return [S.grito, quadroNoTempo(E.gritoQuadros, L.t)]; // o grito
      return [S.empurrao, tc < 0 ? 0 : L.parou != null ? 4 : 1 + Math.floor(tc * E.fps) % 3];
    }
    if (L.state === 'golpes' && pronto(S.golpes)) return [S.golpes, quadroNoTempo(GOLPES.quadros, L.t)];
    if ((L.state === 'dead' || L.parado) && pronto(S.cansado)) return [S.cansado, L.state === 'dead' ? 0 : loop(S.cansado)];
    if (pronto(S.anda2)) return [S.anda2, loop(S.anda2)];
  }
  if (L.state === 'estocada' && pronto(S.estocada)) return [S.estocada, quadroNoTempo(ESTOCADA.quadros, L.t)];
  if (L.state === 'golpeNoChao' && pronto(S.golpeNoChao)) return [S.golpeNoChao, quadroNoTempo(GOLPE_NO_CHAO.quadros, L.t)];
  if (L.parado && L.state !== 'dead' && pronto(S.parado)) return [S.parado, loop(S.parado)];
  return [S.anda, L.state === 'dead' ? 0 : loop(S.anda)];
}
/** armando: o brilho vermelho antes de o golpe acertar */
const armando = L => (L.state === 'estocada' && L.t < ESTOCADA.acerta[0]) || (L.state === 'golpeNoChao' && L.t < GOLPE_NO_CHAO.acerta)
  || (L.state === 'empurrao' && L.t >= EMPURRAO.grito && L.t < EMPURRAO.grito + EMPURRAO.arma) || (L.state === 'golpes' && L.t < GOLPES.acertos[0][0]);

export function desenharGolias(L) {
  const [S, fr] = quadro(L), morto = L.state === 'dead';
  desenharQuadro(S, fr, L.x, GROUND + GOLIAS.afunda + (morto ? L.sink * 40 : 0), {
    face: L.face, sc: GOLIAS.escala, alpha: morto ? 1 - L.sink : 1,
    filtro: L.flash > 0 ? FILTRO_ACERTO : armando(L) ? brilho('#ff2020') : null });
}
