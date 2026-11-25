// Golias: os ataques. Cada um = { estado, atualizar(chefe, h, dt) → true quando acabou } (veja Chefe.executarAtaque)
import { stoneSfx, swordSfx } from '../../../../core/audio.js';
import { GROUND } from '../../../config.js';
import { hitHero, overlap } from '../../../combat.js';
import { B } from '../../../state.js';
import { avisarUmaVez, caixaHeroi, lascas, tremor } from '../../efeitos.js';
import { EMPURRAO, ESTOCADA, GOLIAS, GOLPE_NO_CHAO, GOLPES } from './golias.config.js';

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
      if (h.ground && h.y > -20 && !(h.dash > 0) && !B.over) { // no ar, numa plataforma ou no impulso: não pega
        tremor(h, GOLPE_NO_CHAO.dano); // o escudo não segura o chão tremendo
        const A = GOLPE_NO_CHAO.arremesso; h.kb = (Math.sign(h.x - L.x) || L.face) * A.vx; h.vy = -A.vy; h.ground = false; // e é jogado para longe dele
      }
    }
    return L.t >= GOLPE_NO_CHAO.T;
  }
};

// ---------- 2ª fase (sem capacete) ----------

// EMPURRÃO: arma e corre pela arena na direção em que olha; bate no herói (dano + empurrão), na parede ou o fôlego acaba
export const empurrao = {
  estado: 'empurrao',
  atualizar(L, h, dt) {
    const E = EMPURRAO;
    const ini = E.grito + E.arma; // grita, arma (brilho vermelho) e só então corre
    if (L.t < ini) return false;
    if (!L.correu) { L.correu = true; L.parou = null; swordSfx('swing'); avisarUmaVez('empurrao', { lines: GOLIAS.textos.avisoEmpurrao, t: 3, c: '#ffb46a' }); }
    if (L.parou == null) {
      const x0 = L.x; L.x += L.face * E.velocidade * dt; L.prenderNaArena();
      if (L.x === x0 || L.t >= ini + E.corrida) L.parou = L.t; // bateu na parede da arena ou cansou
      if (Math.floor(L.t * 6) !== Math.floor((L.t - dt) * 6)) lascas(L.x - L.face * 40, GROUND - 6, 3, { cores: ['150,120,90', '110,90,70'], vel: [120, 140, 60], vida: .5, tam: [.4, .5], espalho: 20 }); // poeira dos pés
      if (!L.hit && h.y > -E.alturaLivre && !B.over && overlap(L.caixa(), caixaHeroi(h))) { // o tranco
        L.hit = true; L.parou = L.t; B.shake = .35; hitHero(E.dano);
        const lim = B.arena ? [B.arena.left + 30, B.arena.right - 30] : [-Infinity, Infinity];
        h.x = Math.max(lim[0], Math.min(lim[1], h.x + L.face * E.empurra)); // empurrado para longe (mesmo de escudo)
      }
    }
    return L.parou != null && L.t >= L.parou + E.recupera;
  }
};

// GOLPES: a sequência de lança de perto — cada janela de acerto fere uma vez
export const golpes = {
  estado: 'golpes',
  atualizar(L, h, dt) {
    L.acertou = L.acertou || [];
    GOLPES.acertos.forEach(([a, b], i) => {
      if (L.acertou[i] || L.t < a || L.t > b) return;
      if (L.t - dt < a) swordSfx('swing');
      const p = L.x + L.face * 40, q = L.x + L.face * GOLPES.alcance * GOLIAS.escala;
      if (overlap([Math.min(p, q), GROUND - 230, Math.max(p, q), GROUND - 60], caixaHeroi(h))) { L.acertou[i] = true; hitHero(GOLPES.dano); }
    });
    if (L.t >= GOLPES.T) { L.acertou = null; return true; }
    return false;
  }
};
