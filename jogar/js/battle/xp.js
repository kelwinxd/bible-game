import { sfx } from '../core/audio.js';
import { ganharXp, nivel, vidaMax } from '../core/progress.js';
import { D } from '../core/utils.js';
import { B } from './state.js';
import { log } from '../core/log.js';

// dá XP (data/progresso/xp.js → xp: pequeno, grande, ovelha) com um "+N xp" roxo onde aconteceu; subiu de nível: a vida máxima cresce e
// o herói fica de vida cheia, com o aviso. No Bestiário não conta
export function darXp(tipo, x, y) {
  const n = D.xp[tipo]; if (!B || B.fase.dev || !n) return;
  const subiu = ganharXp(n);
  B.floats.push({ x, y: y - 26, t: 1.1, s: `+${n} xp`, c: '#c9a6ff' });
  if (!subiu) return;
  log('nivel_subiu', { nivel: nivel(), fase: B.fase.id });
  B.hpMax = vidaMax(); B.hp = B.hpMax;
  B.notice = { lines: [`Nível ${nivel()}!`, `Vida máxima: ${B.hpMax}`], t: 3.5, c: '#c9a6ff' }; sfx('refute');
}
