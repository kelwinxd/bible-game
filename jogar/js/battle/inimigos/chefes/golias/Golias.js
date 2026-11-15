// ---------- Golias, o gigante de Gate (1 Samuel 17) — chefão do Vale da sombra ----------
// A classe só COORDENA: anda até o herói e escolhe o próximo ataque. O resto fica nos arquivos ao lado:
//   golias.config.js  → números e textos      golias.attacks.js → a estocada e o golpe no chão
//   golias.sprites.js → as artes               golias.draw.js    → o desenho
// data.js → { tipo: "gigante", x, vida }
import { GROUND } from '../../../config.js';
import { ChefeDeArena } from '../../base/chefeDeArena.js';
import { estocada, golpeNoChao } from './golias.attacks.js';
import { GOLIAS } from './golias.config.js';
import { desenharGolias } from './golias.draw.js';

export class Golias extends ChefeDeArena {
  constructor(e) {
    super(e, { vida: GOLIAS.vida, mentiras: GOLIAS.mentiras });
    this.ataques = { estocada, golpeNoChao };
  }
  get nome() { return GOLIAS.textos.nome; }
  get anuncio() { return GOLIAS.textos.anuncio; }
  get avisoMorte() { return { lines: GOLIAS.textos.morte, t: 4, c: '#f2c84b' }; }
  caixa() { const { meiaLargura: w, altura } = GOLIAS.caixa; return [this.x - w, GROUND - altura, this.x + w, GROUND]; }

  lutar(h, dt) {
    if (this.state === 'walk') this.andar(h, dt);
    else this.executarAtaque(h, dt, GOLIAS.cd);
  }
  /** anda até o herói; com a espera acabada, escolhe o ataque */
  andar(h, dt) {
    this.olharPara(h); this.cd -= dt;
    this.aproximar(h, GOLIAS.velocidade, GOLIAS.alcance - 40, dt);
    if (this.cd > 0 || h.deadAt != null) return;
    const ataque = this.proximoAtaque(h);
    if (ataque) this.iniciar(ataque.estado);
  }
  /** a cada 3 ataques (ou com o herói longe) bate no chão; de perto, estoca */
  proximoAtaque(h) {
    const d = Math.abs(h.x - this.x), longe = d > GOLIAS.alcance + 80;
    if (this.atks % GOLIAS.golpeNoChaoACada === GOLIAS.golpeNoChaoACada - 1 || (longe && this.t > 1.2)) return golpeNoChao;
    if (d < GOLIAS.alcance) return estocada;
    return null;
  }
  desenhar() { desenharGolias(this); }
}
