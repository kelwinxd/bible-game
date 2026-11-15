// Nabucodonosor: os ataques. Cada um = { estado, atualizar(chefe, h, dt) → true quando acabou }
import { sfx } from '../../../../core/audio.js';
import { GROUND } from '../../../config.js';
import { hitHero, overlap } from '../../../combat.js';
import { B } from '../../../state.js';
import { avisarUmaVez, caixaHeroi, lancar } from '../../efeitos.js';
import { SPRITES } from './nabucodonosor.sprites.js';
import { CHAMAS, FOGO, JATO, RAJADA, REI, SOLDADOS } from './nabucodonosor.config.js';

/** uma bola de fogo dos olhos, reta até o peito do herói (o escudo bloqueia) */
function bolaDeFogo(L, h) { lancar(L, L.x + L.face * REI.olhos[0], GROUND - REI.olhos[1], h.x, GROUND + h.y - 90, FOGO.voo, { dmg: FOGO.dano }); sfx('fire'); }

// FOGO DOS OLHOS: parado, os olhos brilham e soltam uma bola de fogo
export const fogoDosOlhos = {
  estado: 'fogoDosOlhos',
  atualizar(L, h) {
    if (!L.tiros && L.t >= FOGO.arma) { L.tiros = 1; bolaDeFogo(L, h); }
    return L.t >= FOGO.T;
  }
};

// RAJADA: três bolas seguidas
export const rajada = {
  estado: 'rajada',
  atualizar(L, h) {
    while (L.tiros < RAJADA.tiros.length && L.t >= RAJADA.tiros[L.tiros]) { L.tiros++; bolaDeFogo(L, h); }
    return L.t >= RAJADA.T;
  }
};

// INVOCAR SOLDADOS: ergue as mãos e soldados esqueletos brotam do chão em fogo ao lado dele (caem junto com ele)
export const invocarSoldados = {
  estado: 'invocarSoldados',
  atualizar(L) {
    if (!L.tiros && L.t >= SOLDADOS.surgem) {
      L.tiros = 1; sfx('fire'); B.shake = .25;
      L.invocar('soldado', SOLDADOS.quantos, { d0: 110, passo: 90, cores: ['255,170,60', '255,80,20'], prepara: s => { s.cd = .8; } });
      avisarUmaVez('reiInvoca', { lines: REI.textos.avisoSoldados, t: 2.5, c: '#ffb46a' });
    }
    return L.t >= SOLDADOS.T;
  }
};

// LANÇA-CHAMAS: arma e solta um jato de fogo das mãos por 2 s; fere a cada tique dentro dele
export const lancaChamas = {
  estado: 'lancaChamas',
  atualizar(L, h, dt) {
    const tj = L.t - CHAMAS.arma;
    if (tj >= 0 && tj < CHAMAS.dura) {
      if (tj - dt < 0) { sfx('fire'); L.tique = 0; }
      if ((L.tique -= dt) <= 0 && jatoPega(L, tj, caixaHeroi(h))) { hitHero(CHAMAS.dano); L.tique = CHAMAS.tique; }
    }
    return L.t >= CHAMAS.arma + CHAMAS.dura + .25;
  }
};
/** o jato vai das mãos para a frente e para baixo, crescendo no começo: pega se a caixa tocar algum trecho dele */
function jatoPega(L, tj, hb) {
  const len = SPRITES.jato.FW * JATO.sx * Math.min(1, .25 + tj / CHAMAS.cresce), x0 = L.x + L.face * JATO.maos[0], y0 = GROUND - JATO.maos[1];
  const cx = Math.cos(JATO.ang), sy = Math.sin(JATO.ang), r = 20 + 20 * Math.min(1, tj / CHAMAS.cresce); // engrossa na ponta
  for (let d = 0; d <= len; d += 25) {
    const px = x0 + L.face * cx * d, py = y0 + sy * d, rr = r * (.6 + .6 * d / len);
    if (overlap([px - rr, py - rr, px + rr, py + rr], hb)) return true;
  }
  return false;
}
