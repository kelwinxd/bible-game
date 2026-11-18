// O Faraó: os ataques. Cada um = { estado, atualizar(chefe, h, dt) → true quando acabou }
import { sapoSom, sfx, stoneSfx } from '../../../../core/audio.js';
import { GROUND } from '../../../config.js';
import { hitHero, overlap } from '../../../combat.js';
import { B } from '../../../state.js';
import { avisarUmaVez, caixaHeroi, lancar } from '../../efeitos.js';
import { COBRA, FARAO, ONDA, PRAGA, RAS } from './farao.config.js';

// PRAGA: estende o cajado e lança uma nuvem de gafanhotos até onde o herói está (o escudo bloqueia)
export const praga = {
  estado: 'praga',
  atualizar(L, h) {
    if (!L.tiros && L.t >= FARAO.arma) {
      L.tiros = 1; sfx('whoosh');
      lancar(L, L.x + L.face * FARAO.cajado[0], GROUND - FARAO.cajado[1], h.x, GROUND + h.y - 90, PRAGA.voo, { r: PRAGA.raio, dmg: PRAGA.dano, praga: true });
    }
    return L.t >= PRAGA.T;
  }
};

// COBRA (de perto): estica o cajado, que vira uma cobra dourada e morde à frente (o escudo bloqueia). Não avança a sequência
export const cobra = {
  estado: 'cobra',
  contaNaSequencia: false,
  atualizar(L, h, dt) {
    const [a, b] = COBRA.acerta, [p0, p1, y0, y1] = COBRA.mordida;
    if (!L.hit && L.t >= a && L.t <= b) {
      if (L.t - dt < a) sfx('whoosh');
      const p = L.x + L.face * p0, q = L.x + L.face * p1;
      if (overlap([Math.min(p, q), GROUND - y1, Math.max(p, q), GROUND - y0], caixaHeroi(h))) { L.hit = true; hitHero(COBRA.dano); }
    }
    return L.t >= COBRA.T;
  }
};

// PRAGA DAS RÃS: rãs saem do chão ao lado dele (no máximo 3 vivas; somem quando ele cai)
export const pragaDasRas = {
  estado: 'pragaDasRas',
  atualizar(L) {
    if (!L.tiros && L.t >= FARAO.arma) {
      L.tiros = 1; sapoSom('coaxar', 1, .9); B.shake = .2;
      L.invocar('ra', RAS.quantas, { d0: 100, passo: 80, cores: ['170,90,220', '120,160,50'], prepara: r => { r.wait = .4; } });
      avisarUmaVez('faraoRas', { lines: FARAO.textos.avisoRas, t: 2.5, c: '#c79aff' });
    }
    return L.t >= RAS.T;
  }
};

// ONDA DO CAJADO: ergue e bate o cajado no chão — uma onda roxa corre rente ao chão para a frente dele (pule ou erga o escudo)
export const ondaDoCajado = {
  estado: 'ondaDoCajado',
  atualizar(L) {
    if (!L.tiros && L.t >= ONDA.bate) {
      L.tiros = 1; B.shake = .4; stoneSfx('crack', 1);
      L.onda = { x: L.x + L.face * 40, x0: L.x + L.face * 40, face: L.face, hit: false };
      avisarUmaVez('faraoOnda', { lines: FARAO.textos.avisoOnda, t: 3.5, c: '#c79aff' });
    }
    return L.t >= ONDA.T;
  }
};
/** a onda continua andando depois do ataque: pega o herói no chão quando passa (pulando, passa por baixo) */
export function moverOnda(L, h, dt) {
  const o = L.onda; if (!o) return;
  o.x += o.face * ONDA.velocidade * dt;
  if (!o.hit && Math.abs(h.x - o.x) < 40 && h.y > -50 && h.deadAt == null) { o.hit = true; hitHero(ONDA.dano); }
  if (Math.abs(o.x - o.x0) > ONDA.alcance || o.x < B.cam - 40 || o.x > B.cam + 1000) L.onda = null;
}
