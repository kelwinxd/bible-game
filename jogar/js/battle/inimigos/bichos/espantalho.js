// ---------- Espantalho (Treinamento) ----------
// Alvo parado: não anda nem ataca; imortal (a fase de treino é de teste: a vida volta cheia) e mostra o dano de cada golpe.
// espantalho.webp 1 quadro 165×219 (os pés na base)
import { GROUND } from '../../config.js';
import { drawShadow } from '../../draw/world.js';
import { terrainTop } from '../../world.js';
import { Bicho } from '../base/bicho.js';
import { FILTRO_ACERTO, desenharQuadro } from '../efeitos.js';

const SPR = { img: Object.assign(new Image(), { src: 'assets/sprites/enemy/espantalho.webp' }), FW: 165, FH: 219, ax: 82 };

export class Espantalho extends Bicho {
  constructor(e) { super(e, { vida: 200 }); this.face = 1; }
  get cores() { return ['210,170,90', '150,50,30']; }
  caixa() { const y = GROUND + terrainTop(this.x); return [this.x - 40, y - 200, this.x + 40, y]; }
  agir() {} // fica onde está
  desenhar() {
    drawShadow(this.x, this.piso(), 90, 0);
    desenharQuadro(SPR, 0, this.x, this.piso(), { filtro: this.flash > 0 ? FILTRO_ACERTO : null });
  }
}
