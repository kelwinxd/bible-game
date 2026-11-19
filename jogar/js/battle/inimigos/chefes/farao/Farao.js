// ---------- O Faraó, o rei do Egito (Êxodo 5–12) — chefão das Pragas, no fim da tumba ----------
// Guarda ~300 px e ataca na ordem de FARAO.sequencia; de perto, a cobra tem prioridade. Ao cair: ajoelha, fica prostrado e fala.
// A classe só COORDENA. O resto fica ao lado:
//   farao.config.js  → números, textos e a sequência     farao.attacks.js → praga, cobra, praga das rãs, onda do cajado
//   farao.sprites.js → as artes                           farao.draw.js    → o desenho (cajado, onda, fala)
// data.js → { tipo: "gigante", pele: "farao", x, vida, caverna: true }
import { GROUND } from '../../../config.js';
import { B } from '../../../state.js';
import { ChefeDeArena } from '../../base/chefeDeArena.js';
import { atualizarBolas } from '../../efeitos.js';
import { cobra, moverOnda, ondaDoCajado, praga, pragaDasRas } from './farao.attacks.js';
import { COBRA, FARAO, MORTE, RAS } from './farao.config.js';
import { desenharFarao } from './farao.draw.js';

export class Farao extends ChefeDeArena {
  constructor(e) {
    super(e, { vida: FARAO.vida, mentiras: FARAO.mentiras, bando: 'farao' });
    Object.assign(this, { farao: true, onda: null });
    this.ataques = { praga, cobra, pragaDasRas, ondaDoCajado };
  }
  get nome() { return FARAO.textos.nome; }
  get anuncio() { return FARAO.textos.anuncio; }
  get avisoMorte() { return null; } // ele fala primeiro; o aviso vem depois (morto)
  get imortalNoBestiario() { return false; } // no Bestiário também cai (para ver a cena)
  get lieY() { return GROUND - FARAO.balaoY; }
  caixa() { const { meiaLargura: w, altura } = FARAO.caixa; return [this.x - w, GROUND - altura, this.x + w, GROUND]; }
  aoMorrer() { super.aoMorrer(); this.onda = null; }

  lutar(h, dt) {
    atualizarBolas(this, h, dt);
    moverOnda(this, h, dt);
    this.olharPara(h);
    if (this.state === 'walk') this.andar(h, dt);
    else this.executarAtaque(h, dt, FARAO.cd);
  }
  andar(h, dt) {
    this.cd -= dt;
    this.anda = this.guardarDistancia(h, FARAO.distancia, FARAO.velocidade, dt);
    if (this.cd > 0 || h.deadAt != null) return;
    this.iniciar(this.proximoAtaque(h)); this.anda = false;
  }
  /** de perto: a cobra; senão a próxima da sequência (com rãs demais, a praga) */
  proximoAtaque(h) {
    if (Math.abs(h.x - this.x) < COBRA.alcance) return cobra.estado;
    const a = this.escolherAtaque(FARAO.sequencia);
    return a === pragaDasRas.estado && this.ajudantesVivos() >= RAS.maximo - 1 ? praga.estado : a;
  }
  // morto: prostrado (não some), fala; depois o aviso de seguir
  morto() { if (!this.avisou && this.t > MORTE.fala[1] && (!this.caverna || B.zona === 'caverna')) { this.avisou = true; B.notice = { lines: FARAO.textos.caiu, t: 4, c: '#f2c84b' }; } }
  desenhar() { desenharFarao(this); }
}
