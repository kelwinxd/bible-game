// O chefão do mar: os ataques. Cada um = { estado, atualizar(chefe, h, dt) → true quando acabou }
import { swordSfx } from '../../../../core/audio.js';
import { GROUND } from '../../../config.js';
import { hitHero, overlap } from '../../../combat.js';
import { caixaHeroi, gosma, spitAcid } from '../../efeitos.js';
import { ACIDO, BOTE, MAR } from './leviata.config.js';

// BOTE: arma (brilho vermelho) e morde para o lado em que olha, na altura do peito do herói (da laje ou da margem)
export const bote = {
  estado: 'bote',
  iniciar(L) { L.state = 'bote'; L.t = 0; L.bitHit = false; L.nextAcid = L.fase2; swordSfx('swing'); },
  atualizar(L, h) {
    const [a, b] = BOTE.acerta;
    if (!L.bitHit && L.t >= a && L.t <= b && overlap(caixaBote(L), caixaHeroi(h, 200))) { L.bitHit = true; hitHero(BOTE.dano); }
    return L.t >= BOTE.T;
  }
};
function caixaBote(L) { const [p0, p1, y0, y1] = BOTE.caixa, a = L.x + L.face * p0, b = L.x + L.face * p1; return [Math.min(a, b), GROUND - y1, Math.max(a, b), GROUND - y0]; }

// ÁCIDO (da metade da vida para baixo): o Leviatã cospe uma bola em arco; a Naja solta um JATO (o próprio sprite fere)
export const acido = {
  estado: 'acido',
  iniciar(L) { L.state = 'acido'; L.t = 0; L.spat = false; L.nextAcid = false; },
  atualizar(L, h) {
    const J = L.pele.jato;
    if (J) { // o jato: pega se o herói estiver nele enquanto o ácido sai da boca
      const fr = Math.floor(L.t / ACIDO.T * L.pele.arte.acido.n);
      if (!L.spat && fr >= J.fr[0] && fr < J.fr[1] && overlap(caixaJato(L, J), caixaHeroi(h, 200))) { L.spat = true; hitHero(ACIDO.dano); gosma(h.x, GROUND + h.y - 100, 12); }
    } else if (!L.spat && L.t >= ACIDO.cospe) { // a bola, que cai em arco onde o herói está
      L.spat = true; const P = L.pele, s = P.sc;
      spitAcid(L.x + L.face * P.boca[0] * s, GROUND + MAR.agua - P.boca[1] * s, h.x, GROUND + h.y - 90, ACIDO.dano, ACIDO.voo);
    }
    return L.t >= ACIDO.T;
  },
  /** até onde ele cospe: com jato, só se o herói estiver ao alcance dele */
  alcance(L) { const J = L.pele.jato; return J ? J.x[1] * L.pele.sc - 30 : ACIDO.alcance; }
};
function caixaJato(L, J) { const s = L.pele.sc, a = L.x + L.face * J.x[0] * s, b = L.x + L.face * J.x[1] * s; return [Math.min(a, b), GROUND + MAR.agua - J.y[1] * s, Math.max(a, b), GROUND + MAR.agua - J.y[0] * s]; }
