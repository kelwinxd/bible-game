// ---------- Nabucodonosor, o rei de Babilônia (Daniel 3–4) — chefão da Babilônia ----------
// Luta de longe (guarda ~320 px) e ataca na ordem de REI.sequencia. Quando cai, afunda; depois a cena da estátua que desperta,
// e o Ídolo Babilônico vira o próximo chefão na mesma arena. A classe só COORDENA. O resto fica ao lado:
//   nabucodonosor.config.js  → números, textos e a sequência     nabucodonosor.attacks.js → fogo dos olhos, rajada, soldados, lança-chamas
//   nabucodonosor.sprites.js → as artes                           nabucodonosor.draw.js    → o desenho (e o jato)
// data/jornadas → { tipo: "gigante", pele: "rei", x, vida }
import { reiSom } from '../../../../core/audio.js';
import { suspenderMusica } from '../../../../core/musica.js';
import { GROUND } from '../../../config.js';
import { startPreCena } from '../../../cena.js';
import { B } from '../../../state.js';
import { ChefeDeArena } from '../../base/chefeDeArena.js';
import { atualizarBolas } from '../../efeitos.js';
import { Estatua } from '../estatua/Estatua.js';
import { fogoDosOlhos, invocarSoldados, lancaChamas, rajada } from './nabucodonosor.attacks.js';
import { REI, SOLDADOS } from './nabucodonosor.config.js';
import { desenharRei } from './nabucodonosor.draw.js';

export class Nabucodonosor extends ChefeDeArena {
  constructor(e) {
    super(e, { vida: REI.vida, mentiras: REI.mentiras, bando: 'rei' });
    this.rei = true;
    this.ataques = { fogoDosOlhos, rajada, invocarSoldados, lancaChamas };
  }
  get nome() { return REI.textos.nome; }
  get anuncio() { return REI.textos.anuncio; }
  get avisoMorte() { return { lines: REI.textos.morte, t: 2.5, c: '#f2c84b' }; } // logo depois vem a cena da estátua
  get imortalNoBestiario() { return false; } // no Bestiário também cai (para ver a cena e a estátua)
  get lieY() { return GROUND - REI.balaoY; }
  caixa() { const { meiaLargura: w, altura } = REI.caixa; return [this.x - w, GROUND - altura, this.x + w, GROUND]; }

  aoMorrer() { super.aoMorrer(); if (this.musica) suspenderMusica(); } // a música dele PAUSA quando ele cai; volta com a estátua (Estatua.js)
  iniciar(estado) { super.iniciar(estado); if (this.state === 'invocarSoldados') reiSom('invoca'); } // a voz da invocação ao erguer as mãos

  lutar(h, dt) {
    atualizarBolas(this, h, dt);
    this.olharPara(h);
    if (this.state === 'walk') this.andar(h, dt);
    else this.executarAtaque(h, dt, REI.cd);
  }
  andar(h, dt) {
    this.cd -= dt;
    this.anda = this.guardarDistancia(h, REI.distancia, REI.velocidade, dt);
    if (this.cd <= 0 && h.deadAt == null) this.iniciar(this.proximoAtaque());
  }
  /** a próxima da sequência; se já tem soldados demais, atira em vez de invocar */
  proximoAtaque() {
    const a = this.escolherAtaque(REI.sequencia);
    return a === invocarSoldados.estado && this.ajudantesVivos() >= SOLDADOS.maximo - 1 ? fogoDosOlhos.estado : a;
  }
  // morto: afunda; depois a cena da estátua que desperta (uma vez) e ela vira o próximo chefão
  morto(dt) {
    super.morto(dt);
    if (!this.cenaVista && this.sink >= 1) { this.cenaVista = true; startPreCena(); }
    if (this.cenaVista && !B.prec && !B.cena && B.boss === this) {
      B.boss = new Estatua(this.home - 260); B.arena = { left: this.home - 740, right: this.home + 220, boss: true };
      B.notice = { lines: REI.textos.estatuaSeLevanta, t: 3, c: '#ffb46a' };
    }
  }
  desenhar() { desenharRei(this); }
}
