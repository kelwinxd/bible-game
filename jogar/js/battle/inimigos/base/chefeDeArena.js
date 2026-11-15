// ---------- ChefeDeArena: chefão que luta em terra, numa arena que trava a câmera ----------
// Herda de Chefe e já resolve o que todos os chefões de terra fazem igual (Golias, Nabucodonosor, a Estátua, o Faraó):
//  · surge quando o herói chega perto, com a fase limpa: a câmera trava (arena) e ele entra andando pela direita;
//  · fica preso dentro da arena; ao morrer, a arena solta;
//  · ajudantes de movimento: aproximar(h) (vai até o herói) e guardarDistancia(h, d) (luta de longe);
//  · escolherAtaque(sequencia): a ordem dos ataques em loop;
//  · invocar(tipo, n, …): ajudantes (soldados, rãs) que brotam do chão ao lado dele e somem quando ele cai.
// Cada chefão de terra só implementa: nome, caixa(), lutar(h, dt) e desenhar() — e registra os ataques (this.ataques).
import { sfx } from '../../../core/audio.js';
import { GROUND } from '../../config.js';
import { criarBicho } from '../bichos/index.js';
import { B } from '../../state.js';
import { Chefe } from './chefe.js';
import { lascas } from '../efeitos.js';

const ENTRA_V = 220; // px/s entrando na arena

export class ChefeDeArena extends Chefe {
  constructor(e, op = {}) {
    super(e, { kind: 'gigante', ...op });
    this.caverna = !!e.caverna; // pode lutar dentro da caverna (o Faraó, no fim da tumba)
    this.bando = op.bando || null; // nome do bando dos ajudantes que ele invoca
  }
  /** o anúncio quando ele entra (aviso no alto da tela) */
  get anuncio() { return this.nome.split(' · ')[0] + '!'; }

  // ----- contrato de Chefe -----
  deveSurgir(h) {
    const lugar = !B.zona || (this.caverna && B.zona === 'caverna');
    const limpo = !B.arena && !B.demons.length && B.groups.every(g => g.done || g.apos || g.caverna); // as ondas da caverna não contam (ela é opcional)
    return h.x > this.home - 620 && lugar && limpo;
  }
  surgir() {
    B.arena = { left: this.home - 740, right: this.home + 220, boss: true };
    this.state = 'enter'; this.t = 0; this.x = B.arena.right + 160; this.face = -1; sfx('hurt');
    B.notice = { lines: [this.anuncio], t: 3, c: '#ffb46a' };
  }
  agir(h, dt) {
    if (this.state === 'enter') { this.x = Math.max(this.home, this.x - ENTRA_V * dt); if (this.x <= this.home) { this.state = 'walk'; this.t = 0; } return; }
    this.lutar(h, dt);
  }
  /** contrato do chefão de terra: a luta depois de entrar */
  lutar(h, dt) { throw new Error(`${this.constructor.name}.lutar() não implementado (contrato de ChefeDeArena)`); }
  aoMorrer() {
    if (B.arena && B.arena.boss) B.arena = null;
    if (this.bando) B.frogs.forEach(f => { if (f.bando === this.bando && !f.dead) { f.hp = 0; f.dead = true; } }); // os ajudantes caem com ele
  }

  // ----- ajudantes de movimento -----
  prenderNaArena() { if (B.arena) this.x = Math.max(B.arena.left + 80, Math.min(B.arena.right - 60, this.x)); }
  olharPara(h) { this.face = Math.sign(h.x - this.x) || this.face; }
  /** vai até o herói (para a parar a `perto` px); devolve se andou */
  aproximar(h, v, perto, dt) {
    const dx = h.x - this.x, anda = Math.abs(dx) > perto;
    if (anda) this.x += Math.sign(dx) * v * dt;
    this.prenderNaArena(); return anda;
  }
  /** fica a `dist` px do herói (chega perto ou recua); devolve se andou */
  guardarDistancia(h, dist, v, dt) {
    const dx = h.x - this.x, want = Math.abs(dx) - dist, anda = Math.abs(want) > 30;
    if (anda) this.x += Math.sign(dx) * Math.sign(want) * v * dt;
    this.prenderNaArena(); return anda;
  }
  /** o próximo ataque da sequência (em loop) */
  escolherAtaque(seq) { return seq[this.atks % seq.length]; }

  // ----- ajudantes invocados -----
  ajudantesVivos() { return B.frogs.filter(f => f.bando === this.bando && !f.dead).length; }
  /** n ajudantes (makeFrog tipo) brotam do chão à frente dele, a partir de d0 px, um a cada passo px */
  invocar(tipo, n, { d0 = 100, passo = 80, cores, prepara } = {}) {
    for (let k = 0; k < n; k++) {
      const x = Math.max(B.arena.left + 60, Math.min(B.arena.right - 40, this.x + this.face * (d0 + k * passo)));
      const f = criarBicho({ tipo, x, bando: this.bando }); f.face = this.face; if (prepara) prepara(f); B.frogs.push(f);
      lascas(x, GROUND - 10, 14, { cores, vel: [200, 300, 130], vida: .8, tam: [.5, .6], espalho: 55 });
    }
  }
}
