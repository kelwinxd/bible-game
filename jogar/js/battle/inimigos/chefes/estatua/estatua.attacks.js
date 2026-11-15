// O Ídolo Babilônico: os ataques. Cada um = { estado, atualizar(chefe, h, dt) → true quando acabou }
import { sfx, stoneSfx } from '../../../../core/audio.js';
import { GROUND } from '../../../config.js';
import { B } from '../../../state.js';
import { arremessar, avisarUmaVez, lascas, tremor } from '../../efeitos.js';
import { ESTATUA, SOCO, SOPRO } from './estatua.config.js';

// SOCO NO CHÃO: ergue o punho (brilho) → gira o braço → o punho bate no chão: treme tudo; quem está no chão leva dano (pule na hora)
export const soco = {
  estado: 'soco',
  atualizar(L, h) {
    if (!L.hit && L.t >= SOCO.impacto) {
      L.hit = true; B.shake = .7; stoneSfx('crack', 1);
      lascas(L.x - 75 * ESTATUA.escala, GROUND - 50, 26, { cores: ['255,200,90', '110,90,70'], vel: [520, 380, 150], vida: 1, tam: [.6, .8], espalho: 160 }); // o punho (lado esquerdo da tela)
      avisarUmaVez('soco', { lines: ESTATUA.textos.avisoSoco, t: 3.5, c: '#ffb46a' });
      if (h.ground && !(h.dash > 0) && !B.over) tremor(h, SOCO.dano);
    }
    return L.t >= SOCO.T;
  }
};

// SOPRO DE FOGO: a cada volta do loop do fogo, cospe uma bola em arco até onde o herói está (fere no voo e onde cai)
export const sopro = {
  estado: 'sopro',
  atualizar(L, h) {
    while (L.tiros < SOPRO.voltas && L.t >= SOPRO.loop0 + L.tiros * 2 * SOPRO.troca) { L.tiros++; cuspirFogo(L, h); }
    return L.t >= SOPRO.T;
  }
};
function cuspirFogo(L, h) {
  const sc = ESTATUA.escala, x = L.x + SOPRO.boca[0] * sc, y = L.topo() + SOPRO.boca[1] * sc;
  arremessar(L, x, y, h.x + (Math.random() - .5) * 60, GROUND + h.y - 30, SOPRO.voo, SOPRO.g, { dmg: SOPRO.dano, chao: true, r: 22 });
  sfx('fire');
}
