// ---------- Monstros de chão: a Serpente (e quem herda dela: o Leão e a Cobra verde) ----------
// Serpente (Tentação, Mentira, Idolatria — data.js → inimigos[].chao): persegue o herói pelo chão sem chegar a menos de ENEMY_GAP de
// outro monstro; ao alcance arma (brilho vermelho, abre a boca) e dá o BOTE (fere se o herói estiver perto e no chão).
// Leão (Orgulho, Babilônia): igual, mas o bote é um SALTO que avança `salto` px. Cobra verde (aparencia { sprite: "verde", acido }):
// não chega perto — guarda ~300 px e CUSPE ÁCIDO em arco.
// Sprites: config.js → ESPR[sprite] (run + attack; olham para a direita; sem a arte carregada, o desenho à mão da Tentação)
import { GROUND, ESPR, SPIT_ANIM, ctx } from '../../config.js';
import { hitHero } from '../../combat.js';
import { drawShadow } from '../../draw/world.js';
import { B } from '../../state.js';
import { ENEMY_GAP } from '../../world.js';
import { Monstro } from '../base/monstro.js';
import { FILTRO_ACERTO, brilho, spitAcid } from '../efeitos.js';

export class Serpente extends Monstro {
  get alcanceBote() { return 150 + (this.s.salto || 0); }
  caixa() { return [this.x - 45, this.y - 200, this.x + 45, this.y]; }
  balaoY() { return this.s.sprite ? this.y - 262 : this.y - 230; }
  barraY() { return this.s.sprite ? this.y - 252 : this.y - 200; }
  mover(h, dt, dist) {
    if (Math.abs(dist) > 110) { // persegue o herói, mas não chega a menos de ENEMY_GAP de outro monstro
      const nx = this.x + Math.sign(dist) * this.s.passo * dt;
      if (this.livreDosOutros(nx, ENEMY_GAP)) { this.x = nx; this.moving = true; }
    }
    this.face = Math.sign(dist) || this.face;
  }
  noAlcance(dist) { return Math.abs(dist) < this.alcanceBote + 20; }
  golpear(h) { if (Math.abs(h.x - this.x) < this.alcanceBote && h.y > -60) hitHero(this.s.dano); } // o bote: perto e no chão
  desenharSombra() { drawShadow(this.x, this.y, 120); }

  /** o quadro do sprite: andando/parado = run em loop; armando = ataque 1→3 (abre a boca); o bote = 4 (com o rasgo) e volta no 5 */
  quadro(S) {
    if (this.state === 'arm') return [S.attack, Math.min(2, Math.floor((1 - this.arm / this.s.tell) * 3))];
    if (this.strikeAnim > 0) return [S.attack, this.strikeAnim > .08 ? 3 : 4];
    return [S.run, Math.floor(this.bob * (this.moving ? 11 : 6)) % S.nRun]; // parado: o mesmo ciclo, mais lento (respira)
  }
  get corAviso() { return '#ff2020'; }
  desenhar() {
    const S = ESPR[this.s.sprite];
    if (!S || !S.attack.naturalWidth || !S.run.naturalWidth) return this.desenharAMao();
    const [img, fr] = this.quadro(S), sc = S.sc || 1;
    ctx.save();
    ctx.translate(this.x, this.y + this.saltinho()); ctx.scale(this.face * sc, sc);
    if (this.state === 'dead') ctx.scale(1.12, 1.12); // incha no clarão antes de estourar
    if (this.flash > 0) ctx.filter = FILTRO_ACERTO;
    else if (this.state === 'arm') ctx.filter = brilho(this.corAviso, 14);
    ctx.drawImage(img, fr * S.FW, 0, S.FW, S.FH, -S.ax, 2 - S.FH, S.FW, S.FH);
    ctx.restore();
  }
  /** o demônio desenhado à mão (antes das artes; fica de reserva se a imagem não carregar) */
  desenharAMao() {
    const arm = this.state === 'arm', lunge = this.strikeAnim > 0 ? -40 : arm ? 10 : 0;
    ctx.save(); ctx.translate(this.x, this.y + this.saltinho()); ctx.scale(-this.face, 1); ctx.translate(lunge, 0);
    if (this.state === 'dead') ctx.scale(1.12, 1.12);
    if (arm) { ctx.shadowColor = '#ff2020'; ctx.shadowBlur = 30; }
    const body = this.flash > 0 ? '#ffffff' : this.s.cor;
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(0, -80, 46, 72, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -165, 30, 0, 7); ctx.fill();
    ctx.fillStyle = '#d8c8a8';
    ctx.beginPath(); ctx.moveTo(-18, -185); ctx.lineTo(-38, -220); ctx.lineTo(-8, -190); ctx.fill();
    ctx.beginPath(); ctx.moveTo(18, -185); ctx.lineTo(38, -220); ctx.lineTo(8, -190); ctx.fill();
    ctx.fillStyle = arm ? '#ffeb3b' : '#ffb000'; ctx.fillRect(-20, -172, 12, 5); ctx.fillRect(-2, -172, 12, 5);
    ctx.strokeStyle = body; ctx.lineWidth = 14; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-30, -110); ctx.lineTo(arm ? -40 : -70, arm ? -170 : -60); ctx.stroke();
    ctx.strokeStyle = '#d8c8a8'; ctx.lineWidth = 3;
    const cx = arm ? -40 : -70, cy = arm ? -170 : -60;
    for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 14, cy + k * 8 - 6); ctx.stroke(); }
    ctx.fillStyle = body; ctx.fillRect(-30, -20, 18, 20); ctx.fillRect(12, -20, 18, 20);
    ctx.restore();
  }
}

// ---------- Leão do Orgulho (Babilônia, Daniel 6): o bote é um salto que avança `salto` px ----------
export class Leao extends Serpente {
  caixa() { return [this.x - 80, this.y - 150, this.x + 80, this.y]; } // baixo e comprido
  balaoY() { return this.y - 205; }
  agir(h, dt) {
    if (this.strikeAnim > 0) { // o salto: avança durante o bote, sem passar por dentro do herói nem sair da arena
      const nx = this.x + this.face * this.s.salto / .2 * dt, stop = h.x - this.face * 70;
      this.x = this.face > 0 ? Math.min(nx, Math.max(this.x, stop)) : Math.max(nx, Math.min(this.x, stop));
      if (B.arena) this.x = Math.max(B.arena.left + 60, Math.min(B.arena.right + 100, this.x));
    }
    super.agir(h, dt);
  }
  desenharSombra() { drawShadow(this.x, this.y, 165); }
}

// ---------- Cobra verde (a 1ª Mentira do Exodus): guarda ~300 px e cospe ácido em arco ----------
export class CobraVerde extends Serpente {
  get duracaoGolpe() { return SPIT_ANIM; }
  get corAviso() { return '#9cff3a'; }
  balaoY() { return this.y - 250; }
  barraY() { return this.y - 296; }
  noAlcance(dist) { return Math.abs(dist) < 560; }
  mover(h, dt, dist) { // chega perto se ele foge, recua se ele encosta; o corpo inteiro dentro da tela
    const want = Math.abs(dist) > 380 ? 1 : Math.abs(dist) < 240 ? -1 : 0;
    const lim = B.arena ? [B.arena.left + 140, B.arena.right - 130] : [-Infinity, Infinity];
    if (this.x > lim[1]) { this.x -= this.s.passo * dt; this.moving = true; } // entrou pela borda: anda até aparecer inteira
    else if (want) { const nx = this.x + Math.sign(dist) * want * this.s.passo * dt; if (nx > lim[0] && nx < lim[1]) { this.x = nx; this.moving = true; } }
    this.face = Math.sign(dist) || this.face;
  }
  golpear(h) { const S = ESPR[this.s.sprite]; spitAcid(this.x + this.face * S.boca[0], this.y + S.boca[1], h.x, GROUND + h.y - 80, this.s.dano, .7); }
  quadro(S) { // arma (0–3) enquanto se prepara, cospe (4–7) depois
    if (this.state === 'arm') return [S.attack, Math.min(3, Math.floor((1 - this.arm / this.s.tell) * 4))];
    if (this.strikeAnim > 0) return [S.attack, 4 + Math.min(3, Math.floor((1 - this.strikeAnim / SPIT_ANIM) * 4))];
    return [S.run, Math.floor(this.bob * (this.moving ? 8 : 5)) % S.nRun];
  }
  desenharSombra() { drawShadow(this.x, this.y, 95); }
}
