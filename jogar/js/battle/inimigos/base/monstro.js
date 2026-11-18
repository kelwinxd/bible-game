// ---------- Monstro: a classe-base (o contrato) dos monstros das arenas, os que MENTEM ----------
// Surgem em grupos (data.js → { tipo: "inimigos", inimigos: [...], frases, aparencia }): a câmera trava numa arena, eles entram pela
// direita já espaçados e cada um carrega UMA mentira num balão até morrer. Só o versículo certo (data.js → mentiras[].ideal) acende o
// poder contra ele; morto, estoura (a fatality, em combat.js). Cada monstro HERDA desta classe e implementa o contrato.
//
// Ciclo (state): 'enter' (entra andando até a vaga) → 'idle' (anda/espera a cadência) ⇄ 'arm' (o aviso: brilho) → golpe → … → 'dead'
//
// Contrato (obrigatório):
//   caixa()            [x0, y0, x1, y1] do corpo (leva golpe; nos de contato, fere)
//   mover(h, dt, dist) como anda enquanto está em 'idle' (dist = h.x − x)
//   noAlcance(dist)    se pode começar a armar o golpe
//   golpear(h)         o golpe, na hora em que o aviso acaba
//   desenhar()         o corpo
//   balaoY()           a altura do balão da mentira (a ponta aponta para ela)
// Ganchos (opcionais): agir(h, dt) (para quem não segue o ciclo idle/arm, como a ave), barraY(), desenharSombra(),
//   mostraMentira(), get balaoEmbaixo
// Sons (opcionais): somChegar() ao parar na vaga, somArmar() no começo do aviso, somDor() ao levar golpe sem morrer,
//   somMorte() no estouro (combat.js), somParado(dt) a cada quadro enquanto ele vive (rosnados soltos)
import { GROUND } from '../../config.js';
import { drawShadow } from '../../draw/world.js';
import { B } from '../../state.js';
import { terrainTop } from '../../world.js';

const naoImplementado = (classe, metodo) => { throw new Error(`${classe}.${metodo}() não implementado (contrato de Monstro)`); };
const ENTRA_V = 320; // px/s entrando na arena

export class Monstro {
  /**
   * @param {string} tipo   o tema (data.js → inimigos[tipo]: tentacao, duvida, mentira, idolatria, orgulho)
   * @param {object} s      a ficha (data.js → inimigos[tipo], com a aparencia do grupo por cima): vida, dano, tell, cadencia, …
   * @param {object} vaga   x de onde entra, tx onde para, vida já multiplicada
   */
  constructor(tipo, s, { x, tx, hp }) {
    Object.assign(this, {
      type: tipo, s, hp, maxHp: hp, x, tx, y: s.chao ? GROUND : 200, face: -1,
      state: 'enter', timer: s.cadencia, arm: 0, strikeAnim: 0, flash: 0, bob: Math.random() * 6, moving: false,
      lie: null, myLie: null, lastVerse: null, vuln: false, lieFlash: 0
    });
  }

  // ----- contrato -----
  caixa() { return naoImplementado(this.constructor.name, 'caixa'); }
  mover(h, dt, dist) { return naoImplementado(this.constructor.name, 'mover'); }
  noAlcance(dist) { return naoImplementado(this.constructor.name, 'noAlcance'); }
  golpear(h) { return naoImplementado(this.constructor.name, 'golpear'); }
  desenhar() { return naoImplementado(this.constructor.name, 'desenhar'); }
  balaoY() { return naoImplementado(this.constructor.name, 'balaoY'); }

  // ----- ganchos (padrões) -----
  get balaoEmbaixo() { return false; }      // o balão vai embaixo dele (a ave: em cima ficaria atrás do HUD)
  get duracaoGolpe() { return .2; }         // quanto dura a animação do golpe (strikeAnim)
  barraY() { return this.y - 200; }         // a barrinha de vida, acima da cabeça
  mostraMentira() { return !!this.lie; }    // o balão aparece (a ave esconde a frase no mergulho)
  desenharSombra() { drawShadow(this.x, this.y, 120); }
  somChegar() {} somArmar() {} somDor() {} somMorte() {} somParado(dt) {}
  /** quem não segue o ciclo idle/arm (a ave) sobrescreve este */
  agir(h, dt) { const dist = h.x - this.x; if (this.state === 'idle') this.mover(h, dt, dist); this.cicloDeAtaque(h, dt, dist); }

  // ----- ciclo (chamado todo quadro) -----
  atualizar(h, dt) {
    this.flash = Math.max(0, this.flash - dt); this.strikeAnim = Math.max(0, this.strikeAnim - dt); this.bob += dt;
    this.lieFlash = Math.max(0, this.lieFlash - dt); this.moving = this.state === 'enter';
    if (this.state === 'dead') return;
    if (this.state === 'enter') { this.x -= ENTRA_V * dt; if (this.x <= this.tx) { this.x = this.tx; this.state = 'idle'; this.somChegar(); } return; }
    if (B.trans > 0) return;
    this.somParado(dt);
    this.agir(h, dt);
  }
  /** espera a cadência → arma (o aviso, `tell` s) → golpeia → volta a esperar */
  cicloDeAtaque(h, dt, dist) {
    if (this.state === 'idle') {
      this.timer -= dt;
      if (this.timer <= 0 && this.noAlcance(dist)) { this.state = 'arm'; this.arm = this.s.tell; this.somArmar(); }
    } else if (this.state === 'arm') {
      this.arm -= dt;
      if (this.arm <= 0) { this.state = 'idle'; this.timer = this.s.cadencia; this.strikeAnim = this.duracaoGolpe; this.golpear(h); }
    }
  }
  /** se na arena este x fica longe o bastante dos outros monstros (os balões não se sobrepõem) */
  livreDosOutros(nx, gap) { return !B.demons.some(o => o !== this && o.state !== 'dead' && Math.abs(o.x - nx) < gap && Math.abs(o.x - nx) < Math.abs(o.x - this.x)); }
  /** sombra no chão (para os que voam: menor quanto mais alto) */
  sombraNoChao(tam, opac) { const gy = GROUND + terrainTop(this.x); drawShadow(this.x, gy, tam, gy - this.y - 40, opac); }
  /** pula na entrada (o passinho) */
  saltinho() { return this.state === 'enter' ? Math.abs(Math.sin(this.bob * 10)) * -6 : 0; }
}
