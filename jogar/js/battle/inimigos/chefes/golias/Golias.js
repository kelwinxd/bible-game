// ---------- Golias, o gigante de Gate (1 Samuel 17) — chefão do Vale da sombra ----------
// A classe só COORDENA: anda até o herói e escolhe o próximo ataque. O resto fica nos arquivos ao lado:
//   golias.config.js  → números e textos      golias.attacks.js → os ataques
//   golias.sprites.js → as artes               golias.draw.js    → o desenho
// data.js → { tipo: "gigante", x, vida }
// Duas fases: de capacete (1ª vida, menor: estocada e golpe no chão) e, quando ela acaba, ele PERDE O CAPACETE (cambaleia
// cansado, sem levar golpe) e volta com a 2ª vida: mais rápido, com a sequência de golpes de lança e o empurrão (corre até o herói).
import { sfx } from '../../../../core/audio.js';
import { GROUND } from '../../../config.js';
import { B } from '../../../state.js';
import { ChefeDeArena } from '../../base/chefeDeArena.js';
import { lascas } from '../../efeitos.js';
import { empurrao, estocada, golpeNoChao, golpes } from './golias.attacks.js';
import { GOLIAS, PERDE_CAPACETE } from './golias.config.js';
import { desenharGolias } from './golias.draw.js';

export class Golias extends ChefeDeArena {
  constructor(e) {
    super(e, { vida: GOLIAS.vida, mentiras: GOLIAS.mentiras });
    this.ataques = { estocada, golpeNoChao, empurrao, golpes };
    this.semCapacete = false; // 2ª fase
    this.parado = false;      // sem andar (o desenho usa o idle)
  }
  get nome() { return this.semCapacete ? GOLIAS.textos.nome2 : GOLIAS.textos.nome; }
  get anuncio() { return GOLIAS.textos.anuncio; }
  get avisoMorte() { return { lines: GOLIAS.textos.morte, t: 4, c: '#f2c84b' }; }
  get imortalNoBestiario() { return this.semCapacete; } // no Bestiário a 1ª vida também acaba (para ver a 2ª fase)
  caixa() { const { meiaLargura: w, altura } = GOLIAS.caixa; return [this.x - w, GROUND - altura * (this.semCapacete ? .92 : 1), this.x + w, GROUND]; }
  vulneravel() { return this.state !== 'perdeCapacete' && super.vulneravel(); }
  iniciar(estado) { super.iniciar(estado); this.correu = false; this.parou = null; this.acertou = null; }

  /** a 1ª vida acabou: em vez de morrer, perde o capacete e volta com a 2ª */
  morrer() {
    if (this.semCapacete) return super.morrer();
    this.semCapacete = true; this.hp = this.maxHp = GOLIAS.vidaSemCapacete;
    this.state = 'perdeCapacete'; this.t = 0; this.atks = 0; this.cd = .6; B.shake = .4; sfx('refute');
    lascas(this.x + this.face * 20, GROUND - 300 * GOLIAS.escala, 16, { cores: ['200,205,215', '140,145,155'], vel: [260, 340, 160], vida: 1, tam: [.5, .7], espalho: 30 }); // o capacete estoura
    B.notice = { lines: GOLIAS.textos.perdeCapacete, t: 3.5, c: '#ff7a6a' };
  }

  lutar(h, dt) {
    if (this.state === 'perdeCapacete') { this.parado = true; if (this.t >= PERDE_CAPACETE.T) { this.state = 'walk'; this.t = 0; } return; }
    if (this.state === 'walk') this.andar(h, dt);
    else this.executarAtaque(h, dt, this.semCapacete ? GOLIAS.cd2 : GOLIAS.cd);
  }
  /** anda até o herói; com a espera acabada, escolhe o ataque */
  andar(h, dt) {
    this.olharPara(h); this.cd -= dt;
    const v = this.semCapacete ? GOLIAS.velocidade2 : GOLIAS.velocidade, alc = this.semCapacete ? GOLIAS.alcance2 : GOLIAS.alcance;
    this.parado = !this.aproximar(h, v, alc - 40, dt);
    if (this.cd > 0 || h.deadAt != null) return;
    const ataque = this.proximoAtaque(h);
    if (ataque) { this.parado = false; this.iniciar(ataque.estado); }
  }
  proximoAtaque(h) {
    const d = Math.abs(h.x - this.x);
    if (this.semCapacete) { // a cada 2 ataques (ou com o herói longe) o empurrão; de perto, os golpes
      if (this.atks % GOLIAS.empurraoACada === GOLIAS.empurraoACada - 1 || (d > GOLIAS.alcance2 + 80 && this.t > 1)) return empurrao;
      return d < GOLIAS.alcance2 ? golpes : null;
    }
    // de capacete: a cada 3 ataques (ou com o herói longe) bate no chão; de perto, estoca
    if (this.atks % GOLIAS.golpeNoChaoACada === GOLIAS.golpeNoChaoACada - 1 || (d > GOLIAS.alcance + 80 && this.t > 1.2)) return golpeNoChao;
    return d < GOLIAS.alcance ? estocada : null;
  }
  desenhar() { desenharGolias(this); }
}
