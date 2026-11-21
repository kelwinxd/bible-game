// ---------- O chefão do mar: o Leviatã (Isaías 27:1) e a pele Naja — chefona do Exodus ----------
// Mora no `mar` que estiver em x e nunca sai dele. Surge quando o herói chega perto (ou pisa na laje que espera no mar), segue o herói
// dentro da água, dá o bote de perto e, a cada 3 ataques, mergulha e reaparece em outro ponto. Da metade da vida para baixo, também
// o ácido. A Naja (pele) mente, fica a distância (vem para o bote e recua) e faz chover rãs na jangada. Ao morrer, a terra sobe da água.
// A classe só COORDENA (o nado, o mergulho e qual ataque fazer). O resto fica ao lado:
//   leviata.config.js  → números e as peles     leviata.attacks.js → o bote e o ácido
//   leviata.sprites.js → as artes                leviata.draw.js    → o desenho (dentro do mar)
// data/jornadas → { tipo: "chefe", x, vida, pele? }
import { dragaoSom } from '../../../../core/audio.js';
import { GROUND } from '../../../config.js';
import { B } from '../../../state.js';
import { Chefe } from '../../base/chefe.js';
import { rasNaJangada } from '../../bichos/index.js';
import { respingo } from '../../efeitos.js';
import { acido, bote } from './leviata.attacks.js';
import { DISTANTE, MAR, MERGULHO, PELES } from './leviata.config.js';
import { desenharNoMar } from './leviata.draw.js';

export class Leviata extends Chefe {
  /** devolve null se não houver mar no lugar */
  static criar(e) { const mar = B.holes.find(o => o.mar && e.x >= o.x && e.x <= o.x + o.w); return mar ? new Leviata(e, mar) : null; }
  constructor(e, mar) {
    const pele = PELES[e.pele] || PELES.leviata;
    super(e, { kind: 'leviata', vida: MAR.vida, mentiras: pele.mentiras });
    Object.assign(this, { pele, sea: mar, cd: 1.5, bitHit: false, spat: false, nextAcid: false, fase2: false });
    this.ataques = { bote, acido };
  }
  get nome() { return this.pele.nome; }
  get textoBarra() { return this.state === 'mergulho' || this.state === 'submerso' ? `${this.pele.nome} · mergulhou…` : `${this.pele.nome} · ${this.pele.titulo}`; }
  get corBarra() { return this.fase2 ? '#5f9e1c' : '#b3261e'; }
  get lieY() { return this.pele.lieY || GROUND - 285; }
  get avisoMorte() { return { lines: [this.pele.morte, 'O mar se acalma e a terra aparece… siga até a cruz'], t: 4, c: '#f2c84b' }; }
  get distante() { return this.pele.distancia; } // Naja: guarda N px e só chega perto para o bote
  caixa() { const sc = this.pele.sc; return [this.x - 95 * sc * .7, GROUND + MAR.agua - 200 * sc, this.x + 95 * sc * .7, GROUND + 20]; } // da água até a cabeça
  dentroDoMar(x) { return Math.max(this.sea.x + MAR.margem, Math.min(this.sea.x + this.sea.w - MAR.margem, x)); }
  irPara(x, v, dt) { this.x += Math.sign(x - this.x) * Math.min(Math.abs(x - this.x), v * dt); return Math.abs(x - this.x) < 8; }

  // ----- surgir -----
  deveSurgir(h) {
    const laje = B.platforms.find(pl => pl.espera && pl.x < this.sea.x + this.sea.w && pl.x + pl.w > this.sea.x);
    const pisou = laje && h.ground && Math.abs(h.y - laje.top) < 1 && h.x > laje.x - 10 && h.x < laje.x + laje.w + 10;
    return laje ? pisou : h.x > this.sea.x - 420;
  }
  surgir() {
    super.surgir(); dragaoSom('rugido', 1, .8); respingo(this.x, 22); // voz de dragão, grave (é grande)
    B.notice = { lines: [`${this.pele.nome}, ${this.pele.titulo}!`, 'Golpeie-o da laje ou da margem — e cuidado com o bote'], t: 4, c: '#ff7a6a' };
  }

  // ----- dano e morte -----
  aoSofrer() { // Naja: a cada 1/6 da vida perdida, rãs entram na fila para cair na jangada
    if (this.hp > 0 && B.time - (this.ultDor || -9) > .6) { this.ultDor = B.time; dragaoSom('dor', .9, .8); }
    if (!this.pele.ras) return;
    const k = Math.min(5, Math.floor((this.maxHp - Math.max(0, this.hp)) / (this.maxHp / 6)));
    while ((this.rasK || 0) < k) { this.rasK = (this.rasK || 0) + 1; if (this.hp > 0) { this.fila = (this.fila || 0) + this.pele.ras; if (!(this.rasT > 0)) this.rasT = 0; this.rasAviso = true; } }
  }
  aoMorrer() { dragaoSom('morte', 1, .75); B.acid = []; B.risers.forEach(r => { r.up = true; }); respingo(this.x, 30); } // a terra do fim sobe da água
  morto(dt) { this.sink = Math.min(1, this.sink + dt / 1.6); }

  // ----- a luta: cada estado tem o seu método -----
  agir(h, dt) {
    this.chuvaDeRas(dt);
    if (!this.fase2 && this.hp <= this.maxHp / 2 && this.state !== 'surge') this.enfurecer();
    const passo = { surge: this.subindo, nadar: this.nadar, aproximar: this.aproximar, recuar: this.recuar, mergulho: this.mergulhando, submerso: this.submerso }[this.state];
    if (passo) return passo.call(this, h, dt);
    const ataque = this.ataqueAtual; // bote ou ácido
    if (ataque && ataque.atualizar(this, h, dt)) this.fimDoAtaque(ataque.estado);
  }
  subindo() { if (this.t >= MAR.surge) { this.state = 'nadar'; this.t = 0; } }
  enfurecer() { // metade da vida: passa a cuspir ácido também
    this.fase2 = true; this.nextAcid = true;
    B.notice = { lines: [this.pele.furia, 'Agora ele cospe ácido — erga o escudo [J] ou saia do caminho'], t: 4, c: '#a8ff4a' };
  }
  /** segue o herói dentro do mar e olha para ele; com a espera acabada, escolhe o ataque */
  nadar(h, dt) {
    const N = this.distante, alvo = N ? this.longe(h, N) : this.dentroDoMar(h.x + (h.x < this.x ? 150 : -150));
    this.irPara(alvo, MAR.velocidade * (N ? 1.6 : 1), dt);
    this.face = h.x < this.x ? -1 : 1;
    this.cd -= dt;
    if (this.cd > 0 || h.deadAt != null) return;
    const d = Math.abs(h.x - this.x);
    if (this.fase2 && (this.nextAcid || d >= MAR.alcance) && d < acido.alcance(this)) acido.iniciar(this);
    else if (N) { if (d > N * .75 || this.cd < -1.5) { this.state = 'aproximar'; this.t = 0; } } // vem para o bote (depois de se afastar)
    else if (d < MAR.alcance) bote.iniciar(this);
  }
  /** Naja: avança rápido até ficar perto e dá o bote */
  aproximar(h, dt) {
    this.face = h.x < this.x ? -1 : 1;
    if (this.irPara(this.dentroDoMar(h.x - this.face * DISTANTE.bote), DISTANTE.vem, dt) || this.t > 1.6) bote.iniciar(this);
  }
  /** Naja: depois do bote, recua até a distância e mergulha */
  recuar(h, dt) {
    this.face = h.x < this.x ? -1 : 1;
    if (this.irPara(this.longe(h, this.distante), DISTANTE.volta, dt) || this.t > 1.4) this.mergulhar();
  }
  mergulhar() { this.state = 'mergulho'; this.t = 0; respingo(this.x, 14); }
  mergulhando() { if (this.t >= MERGULHO.desce) { this.state = 'submerso'; this.t = 0; } }
  /** embaixo d'água: reaparece perto do herói, de surpresa */
  submerso(h) {
    if (this.t < MERGULHO.embaixo) return;
    const N = this.distante, d = N ? N + Math.random() * 60 : 170 + Math.random() * 120;
    this.x = this.dentroDoMar(h.x + (Math.random() < .5 ? -1 : 1) * d);
    this.face = h.x < this.x ? -1 : 1; this.state = 'surge'; this.t = 0; this.cd = .8; respingo(this.x, 18); dragaoSom('rosnar', .9, .8); // reaparece rosnando
  }
  /** depois de cada ataque: a cada 3, mergulha (a Naja: depois do bote recua, e aí mergulha) */
  fimDoAtaque(qual) {
    this.atks++; this.t = 0; this.cd = MAR.cd;
    if (this.distante) { this.state = qual === bote.estado ? 'recuar' : 'nadar'; return; }
    if (this.atks % MAR.mergulhaACada) this.state = 'nadar'; else this.mergulhar();
  }
  /** ponto a N px do herói, do lado em que ela já está (se não couber no mar, do outro lado) */
  longe(h, N) {
    let s = Math.sign(this.x - h.x) || 1, x = h.x + s * N;
    if (x !== this.dentroDoMar(x)) { s = -s; x = h.x + s * N; }
    return this.dentroDoMar(x);
  }
  /** rãs na jangada: uma a cada MAR.rasACada s (no máximo 6 vivas lá em cima) */
  chuvaDeRas(dt) {
    if (!(this.fila > 0) || (this.rasT -= dt) > 0) return;
    const pl = B.platforms.find(p => p.espera) || B.platforms[0];
    if (pl && B.frogs.filter(f => f.pl && !f.dead).length < MAR.maxRasNaJangada) { rasNaJangada(1, pl, this.rasAviso); this.rasAviso = false; this.fila--; }
    this.rasT = MAR.rasACada;
  }

  desenhar() {} // ele é desenhado dentro do mar (desenharNoMar), atrás das ondas
  desenharNoMar(mar) { if (mar === this.sea) desenharNoMar(this); }
}
