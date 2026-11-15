// ---------- O Ídolo Babilônico: a estátua de ouro (Daniel 3) — chefão final da Babilônia ----------
// Surge quando a cena dela despertando acaba (Nabucodonosor já caiu), ATRÁS do chão, no meio da arena. Não anda: alterna os ataques.
// A classe só COORDENA (levantar, alternar soco e sopro, morrer). O resto fica ao lado:
//   estatua.config.js  → números e textos     estatua.attacks.js → o soco no chão e o sopro de fogo
//   estatua.sprites.js → as artes              estatua.draw.js    → o desenho (atrás do piso) e a morte
import { stoneSfx } from '../../../../core/audio.js';
import { GROUND } from '../../../config.js';
import { B } from '../../../state.js';
import { ChefeDeArena } from '../../base/chefeDeArena.js';
import { atualizarBolas, desenharBolas, lascas } from '../../efeitos.js';
import { soco, sopro } from './estatua.attacks.js';
import { ESTATUA, MORTE } from './estatua.config.js';
import { desenharEstatua } from './estatua.draw.js';

export class Estatua extends ChefeDeArena {
  constructor(x) {
    super({ x, vida: ESTATUA.vida });
    Object.assign(this, { estatua: true, state: 'walk', cd: ESTATUA.esperaInicial, aparece: 0 });
    this.ataques = { soco, sopro };
  }
  get nome() { return ESTATUA.textos.nome; }
  get avisoMorte() { return { lines: ESTATUA.textos.morte, t: 4, c: '#f2c84b' }; }
  get imortalNoBestiario() { return false; } // no Bestiário também cai (para ver a morte)
  caixa() { const { meiaLargura: w, altura } = ESTATUA.caixa; return [this.x - w, GROUND - altura, this.x + w, GROUND]; }
  /** px que ainda falta ela subir de trás do piso (desacelera no fim) */
  sobe() { const k = Math.min(1, this.aparece / ESTATUA.sobe); return (1 - (1 - Math.pow(1 - k, 3))) * 480; }
  /** o topo do desenho (o punho chega à borda do piso) */
  topo() { return GROUND - 35 - ESTATUA.punho * ESTATUA.escala + this.sobe() + (this.state === 'dead' ? this.sink * 480 : 0); }
  novaEspera() { const [a, b] = ESTATUA.espera; return a + Math.random() * (b - a); }

  lutar(h, dt) {
    atualizarBolas(this, h, dt);
    this.aparece += dt;
    if (this.aparece < ESTATUA.sobe) return this.levantar(dt);
    if (this.state === 'walk') { if ((this.cd -= dt) <= 0 && h.deadAt == null) this.iniciar(this.atks % 2 ? sopro.estado : soco.estado); } // alterna
    else this.executarAtaque(h, dt, this.novaEspera());
  }
  /** levantando de trás do piso: o chão treme e solta poeira; ainda não ataca */
  levantar(dt) {
    B.shake = Math.max(B.shake, .18);
    if (Math.random() < dt * 30) lascas(this.x, GROUND - 45, 1, { cores: ['200,170,110', '120,95,70'], vel: [260, 260, 120], vida: .9, tam: [.5, .7], espalho: 320 });
    if (this.aparece - dt <= 0) stoneSfx('collapse');
  }
  // morte: urra (a pedra range), cai de joelhos (tremor), tomba (tremor forte e poeira); deitada um tempo, afunda
  morto(dt) {
    const t = this.t, antes = t - dt, q = MORTE.quadros;
    const poeira = (n, f) => lascas(this.x, GROUND - 10, n, { cores: ['255,200,90', '120,100,80'], vel: [420 * f, 260 * f, 80], vida: 1.1, tam: [.6, .9], espalho: 500 });
    if (antes < .05 && t >= .05) { B.shake = Math.max(B.shake, .3); stoneSfx('crack', .6); }
    if (antes < q[2] && t >= q[2]) { B.shake = Math.max(B.shake, .5); stoneSfx('crack', 1); poeira(14, .7); }
    if (antes < q[3] && t >= q[3]) { B.shake = Math.max(B.shake, .85); stoneSfx('collapse'); poeira(34, 1); }
    this.sink = Math.max(0, Math.min(1, (t - MORTE.fica) / MORTE.afunda));
  }
  desenhar() { desenharBolas(this); }          // na frente: as bolas de fogo
  desenharAtras() { desenharEstatua(this); }   // atrás do piso: ela
}
