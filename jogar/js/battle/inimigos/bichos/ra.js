// ---------- Rã (Êxodo 8, a praga das rãs) ----------
// Solta pela fase ({ tipo: "ra", x }), fora das arenas: não ataca nem mente, mas ENCOSTAR FERE. Parada (a papada enchendo) um tempo,
// dá um pulo curto: longe do herói vai e volta em volta de casa; perto, pula na direção dele (sem se afastar muito de casa).
// Também cai do céu (chuva de rãs depois de uma arena; na jangada da Naja, presa a ela). ronda = só patrulha; ensina = a dica do [K].
// ra-idle.webp 6 quadros 106×84; ra-pulo.webp 6 quadros 172×210 (a altura do pulo já vem desenhada; o chão é a borda de baixo)
import { sfx } from '../../../core/audio.js';
import { GROUND } from '../../config.js';
import { drawShadow, relevo } from '../../draw/world.js';
import { B } from '../../state.js';
import { terrainTop } from '../../world.js';
import { Bicho } from '../base/bicho.js';
import { FILTRO_ACERTO, desenharQuadro } from '../efeitos.js';

const img = src => Object.assign(new Image(), { src });
export const RA = { idle: { img: img('assets/sprites/enemy/ra-idle.webp'), FW: 106, FH: 84, ax: 53, n: 6 }, pulo: { img: img('assets/sprites/enemy/ra-pulo.webp'), FW: 172, FH: 210, ax: 86, n: 6 } };
const ARCO = [0, 1, 23, 67, 63, 0]; // altura do corpo em cada quadro do pulo (px), para a caixa acompanhar
const PULO_T = .55, PULO_D = 90, VIDA = 20, DANO = 4, PERTO = 180, RONDA = 110, COLEIRA = 230, TOQUE_CD = 1, SC = .72, QUEDA_V = 700;

export class Ra extends Bicho {
  constructor(e) {
    super(e, { vida: VIDA });
    Object.assign(this, { ronda: !!e.ronda, ensina: !!e.ensina, state: 'idle', wait: .8 + Math.random() * 1.6, x0: e.x, x1: e.x, cai: 0, pl: null });
  }
  /** a rã cai do céu de `altura` px (chuva de rãs); na jangada (pl), fica presa nela */
  cairDoCeu(altura, pl = null) { this.cai = altura; this.wait = 1 + Math.random() * 1.5; if (pl) { this.pl = pl; this.plx = pl.x; } return this; }
  quadro() { return this.state === 'hop' ? Math.min(5, Math.floor(this.t / PULO_T * 6)) : 0; }
  chao() { return this.pl ? this.pl.top : terrainTop(this.x); }
  piso() { return GROUND + (this.pl ? this.pl.top : terrainTop(this.x) + relevo(this.x)); } // no desenho: acompanha o relevo
  caixa() { const y = GROUND + this.chao() - this.cai - (this.state === 'hop' ? ARCO[this.quadro()] * SC : 0); return [this.x - 28, y - 42, this.x + 28, y]; }
  podePisar(x) { return this.pl ? x > this.pl.x + 25 && x < this.pl.x + this.pl.w - 25 : super.podePisar(x, 40); } // na jangada: sem cair dela

  agir(h, dt) {
    if (this.pl) { const d = this.pl.x - this.plx; this.plx = this.pl.x; this.x += d; this.x0 += d; this.x1 += d; this.home = this.pl.x + this.pl.w / 2; } // vai junto com a jangada
    if (this.cai > 0) { this.cai = Math.max(0, this.cai - QUEDA_V * dt); if (!this.cai) sfx('croak'); return; } // ainda caindo do céu
    const dx = h.x - this.x, perto = !this.ronda && Math.abs(dx) < PERTO && Math.abs(h.y) < 120 && h.deadAt == null;
    if (this.state === 'idle' && (this.wait -= dt) <= 0) this.pular(dx, perto);
    else if (this.state === 'hop') {
      this.t += dt;
      const k = Math.min(1, this.t / PULO_T), e = k * k * (3 - 2 * k);
      this.x = this.x0 + (this.x1 - this.x0) * e;
      if (this.t >= PULO_T) { this.state = 'idle'; this.wait = 1.1 + Math.random() * 1.1; }
    }
    this.ferirAoEncostar(h, DANO, TOQUE_CD);
  }
  /** perto: pula na direção do herói (sem sair da coleira); longe: ronda, indo e voltando em volta de casa */
  pular(dx, perto) {
    if (perto) this.face = Math.sign(dx) || this.face;
    else if (Math.abs(this.x + this.face * PULO_D - this.home) > RONDA) this.face = -this.face;
    const lim = perto ? COLEIRA : RONDA;
    let to = this.x + this.face * (perto ? Math.min(PULO_D, Math.max(30, Math.abs(dx) - 20)) : PULO_D);
    to = Math.max(this.home - lim, Math.min(this.home + lim, to));
    if (Math.abs(to - this.x) > 10 && this.podePisar(to)) { this.state = 'hop'; this.t = 0; this.x0 = this.x; this.x1 = to; if (Math.abs(this.x - B.cam - 480) < 560) sfx('croak'); }
    else { this.face = -this.face; this.wait = .6; } // travou (buraco, parede ou fim da coleira): vira e tenta o outro lado
  }

  desenhar() {
    const S = this.state === 'hop' ? RA.pulo : RA.idle, fr = this.state === 'hop' ? this.quadro() : Math.floor(this.ph * 6) % S.n;
    drawShadow(this.x, this.piso(), 62, this.cai + (this.state === 'hop' ? ARCO[fr] * SC : 0));
    desenharQuadro(S, fr, this.x, this.piso() - this.cai, { face: this.face, sc: SC, filtro: this.flash > 0 ? FILTRO_ACERTO : null });
  }
}
