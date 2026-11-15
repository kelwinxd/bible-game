// ---------- Monstro flutuante (sem chao nem mergulho na ficha): flutua parado e cospe BOLAS DE FOGO no herói ----------
// O demônio da Dúvida do protótipo (antes da ave). Hoje nenhuma fase usa, mas fica pronto: basta uma ficha sem chao/mergulho.
// As bolas de fogo vão para B.fireballs (atualizadas e desenhadas em update.js / draw/scene.js).
import { sfx } from '../../../core/audio.js';
import { heroBox } from '../../combat.js';
import { B } from '../../state.js';
import { Ave } from './ave.js';
import { Monstro } from '../base/monstro.js';

export class Flutuante extends Monstro {
  oscila() { return Math.sin(this.bob * 2) * 10; }
  caixa() { const fy = this.oscila(); return [this.x - 50, this.y + fy - 70, this.x + 50, this.y + fy + 60]; }
  balaoY() { return this.y - 90; }
  barraY() { return this.y - 85; }
  mover() {}
  noAlcance() { return true; }
  golpear(h) {
    sfx('fire');
    const sx = this.x - 20, sy = this.y + 10, hb = heroBox(h), dx = h.x - sx, dy = (hb[1] + hb[3]) / 2 - sy, L = Math.hypot(dx, dy);
    B.fireballs.push({ x: sx, y: sy, vx: dx / L * 380, vy: dy / L * 380, dmg: this.s.dano });
  }
  desenharSombra() {}
  desenhar() { Ave.prototype.desenharAMao.call(this); } // o mesmo desenho à mão da Dúvida
}
