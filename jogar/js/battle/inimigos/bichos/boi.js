// ---------- Boi morto (As Pragas, Êxodo 9:3: a praga nos animais) ----------
// SÓ CORRE (investe): sem golpe próprio, encostar fere (o escudo bloqueia). Com o herói perto, corre direto; quando passa dele,
// chega ao fim da ronda ou a um buraco/parede, só VIRA para o outro lado e continua correndo. Longe do herói, trota indo e voltando.
// boi-run.webp 6 quadros 181×143 (olha para a direita, alinhado pelos cascos)
import { boiSom } from '../../../core/audio.js';
import { GROUND } from '../../config.js';
import { drawShadow } from '../../draw/world.js';
import { B } from '../../state.js';
import { terrainTop } from '../../world.js';
import { Bicho } from '../base/bicho.js';
import { FILTRO_ACERTO, desenharQuadro, ouvido } from '../efeitos.js';

const SPR = { img: Object.assign(new Image(), { src: 'assets/sprites/enemy/boi-run.webp' }), FW: 181, FH: 143, ax: 97, n: 6 };
const BOI = { vida: 40, dano: 9, anda: 75, corre: 190, fps: [8, 5], perto: 620, passa: 380, coleira: 560, toque: 1 }; // fps: [investindo, trotando]

export class Boi extends Bicho {
  constructor(e) { super(e, { vida: BOI.vida }); this.moving = false; }
  get cores() { return ['220,200,160', '140,30,25']; }
  aoMorrer() { boiSom('morte', ouvido(this.x)); }
  caixa() { const y = GROUND + terrainTop(this.x); return [this.x - 62, y - 100, this.x + 62, y]; }
  perto(h) { return Math.abs(h.x - this.x) < BOI.perto && Math.abs(h.y - terrainTop(this.x)) < 120 && h.deadAt == null; }
  agir(h, dt) {
    this.t += dt; this.moving = false;
    const perto = this.perto(h);
    if (perto && !this.viu && B.time - (this.ultMu ?? -9) > 3) { this.ultMu = B.time; boiSom('mugido', ouvido(this.x)); } // muge ao partir para cima do herói
    this.viu = perto;
    const nx = this.x + this.face * (perto ? BOI.corre : BOI.anda) * dt;
    const passou = perto && (h.x - this.x) * this.face < -BOI.passa; // já passou do herói
    const frente = perto && (h.x - this.x) * this.face > 0;        // indo na direção dele: a ronda estica um pouco
    // fim da coleira: só conta se o passo o leva PARA LONGE de casa (voltando, nunca vira por ela). Antes contava sempre, e como a
    // coleira estica indo na direção do herói, ao virar ela encolhia e ele virava de novo: ficava parado virando sem parar
    const fora = Math.abs(nx - this.home) > BOI.coleira + (frente ? 120 : 0) && Math.abs(nx - this.home) > Math.abs(this.x - this.home);
    const barrado = !this.podePisar(nx + this.face * 60); // buraco ou parede à frente
    this.vira = Math.max(0, (this.vira || 0) - dt);
    if (passou || fora || barrado) {
      if (this.vira <= 0) { this.face = -this.face; this.vira = .5; return; } // vira — e espera meio segundo antes de poder virar de novo
      if (fora || barrado) return; // acabou de virar e ainda está barrado (preso entre buraco e parede): fica parado, sem tremer
    }
    this.x = nx; this.moving = true;
    this.ferirAoEncostar(h, BOI.dano, BOI.toque);
  }
  desenhar() {
    const investindo = this.cd > 0 || Math.abs(B.hero.x - this.x) < BOI.perto; // investindo: a corrida anima mais rápido
    const q = this.moving ? Math.floor(this.ph * BOI.fps[investindo ? 0 : 1]) % SPR.n : 0;
    drawShadow(this.x + this.face * 4, this.piso(), 130, 0);
    desenharQuadro(SPR, q, this.x, this.piso(), { face: this.face, filtro: this.flash > 0 ? FILTRO_ACERTO : null });
  }
}
