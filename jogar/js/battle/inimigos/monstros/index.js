// ---------- Monstros das arenas: a fábrica ----------
// Escolhe a classe pela ficha (data.js → inimigos[tipo], com a aparencia do grupo por cima). Para criar um monstro novo: uma
// classe que herda de Monstro (ou de Serpente, se anda no chão e dá bote) e uma regra em classeDe().
import { D } from '../../../core/utils.js';
import { B } from '../../state.js';
import { Ave } from './ave.js';
import { Flutuante } from './flutuante.js';
import { CobraVerde, Leao, Serpente } from './serpente.js';

const classeDe = s => s.mergulho ? Ave : !s.chao ? Flutuante : s.acido ? CobraVerde : s.sprite === 'leao' ? Leao : Serpente;

/**
 * Um monstro do tipo (tema) na vaga k (0 = mais à direita): entra em fila já espaçado e para a `gap` px do outro.
 * vidaMult = multiplicador da vida (data.js → grupo.vida); n = quantos no grupo; aparencia = troca sprite/ataque sem mudar o tema
 */
export function criarMonstro(tipo, k, vidaMult, n = 1, aparencia = null, gap = 270) {
  const s = aparencia ? { ...D.inimigos[tipo], ...aparencia } : D.inimigos[tipo], cam = B.arena ? B.arena.left : B.cam;
  return new (classeDe(s))(tipo, s, { x: cam + 1000 + (n - 1 - k) * gap, tx: cam + 900 - k * gap, hp: Math.round(s.vida * vidaMult) });
}
