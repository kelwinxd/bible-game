// Golias: os ataques. Cada um = { estado, atualizar(chefe, h, dt) → true quando acabou } (veja Chefe.executarAtaque)
import { stoneSfx, swordSfx } from '../../../../core/audio.js';
import { GROUND } from '../../../config.js';
import { hitHero, overlap } from '../../../combat.js';
import { B } from '../../../state.js';
import { avisarUmaVez, caixaHeroi, lascas, tremor } from '../../efeitos.js';
import { ESTOCADA, GOLIAS, GOLPE_NO_CHAO } from './golias.config.js';

/** a ponta da lança: para o lado em que ele olha, na altura do peito do herói */
const caixaLanca = L => { const a = L.x + L.face * 40, b = L.x + L.face * 300 * GOLIAS.escala; return [Math.min(a, b), GROUND - 200, Math.max(a, b), GROUND - 80]; };

// ESTOCADA: de perto, arma (brilho vermelho) e estoca com a lança à frente; o escudo bloqueia
export const estocada = {
  estado: 'estocada',
  atualizar(L, h, dt) {
    const [a, b] = ESTOCADA.acerta;
    if (!L.hit && L.t >= a && L.t <= b) {
      if (L.t - dt < a) swordSfx('swing'); // o vento da lança
      if (overlap(caixaLanca(L), caixaHeroi(h))) { L.hit = true; hitHero(ESTOCADA.dano); }
    }
    return L.t >= ESTOCADA.T;
  }
};

// GOLPE NO CHÃO: ergue a lança e bate no chão — a tela treme e quem está no chão leva dano (o escudo não segura: pule na hora)
export const golpeNoChao = {
  estado: 'golpeNoChao',
  atualizar(L, h) {
    if (!L.hit && L.t >= GOLPE_NO_CHAO.acerta) {
      L.hit = true; B.shake = .55; stoneSfx('crack', 1);
      lascas(L.x + L.face * 150 * GOLIAS.escala, GROUND - 4, 18, { cores: ['255,190,90', '120,95,70'], vel: [420, 320, 120], vida: .9, tam: [.5, .7], espalho: 80 });
      avisarUmaVez('golpeNoChao', { lines: GOLIAS.textos.avisoGolpeNoChao, t: 3.5, c: '#ffb46a' });
      if (h.ground && !(h.dash > 0) && !B.over) tremor(h, GOLPE_NO_CHAO.dano); // no ar ou no impulso: não pega
    }
    return L.t >= GOLPE_NO_CHAO.T;
  }
};
