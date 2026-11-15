// ---------- Ave da Dúvida (data.js → inimigos[].mergulho) ----------
// Paira no alto encarando o herói; no aviso ergue as asas e MERGULHA reto até onde o herói ESTAVA (sair do lugar ou erguer o escudo
// evita), passa raspando com as garras, sobe em curva do outro lado e vira para encarar o herói de novo. Só uma ave mergulha por vez.
// O balão fica EMBAIXO dela (em cima ficaria atrás do HUD) e some no mergulho e na subida.
// Sprite: config.js → ESPR.ave (fly + attack). Sem a arte carregada, o desenho à mão da Dúvida (manto e "?")
import { sfx } from '../../../core/audio.js';
import { GROUND, ESPR, ctx } from '../../config.js';
import { heroBox, hitHero, overlap } from '../../combat.js';
import { B } from '../../state.js';
import { Monstro } from '../base/monstro.js';
import { FILTRO_ACERTO, brilho } from '../efeitos.js';

export const PAIRA_Y = 285; // altura em que paira: baixa o bastante para o rasgo do poder (mesmo do chão) pegar a parte de baixo dela
const MERGULHO_V = 640, SOBE_VX = 380, SOBE_VY = 560;

export class Ave extends Monstro {
  get balaoEmbaixo() { return true; }
  caixa() { return [this.x - 70, this.y - 55, this.x + 70, this.y + 65]; } // corpo e garras, sem as pontas das asas
  balaoY() { return Math.min(this.y, PAIRA_Y) + 55; } // preso à altura de pairar: não desce junto no mergulho
  barraY() { return this.y - 140; }
  mostraMentira() { return !!this.lie && this.state !== 'dive' && this.state !== 'rise'; }
  desenharSombra() { this.sombraNoChao(100, .3); }

  // não segue o ciclo idle/arm padrão: paira, arma, mergulha e sobe
  agir(h, dt) {
    const hb = heroBox(h);
    if (this.state === 'idle' || this.state === 'arm') {
      this.face = Math.sign(h.x - this.x) || this.face;
      this.y += (PAIRA_Y - this.y) * Math.min(1, dt * 3);
    }
    if (this.state === 'idle') {
      this.timer -= dt;
      const ocupada = B.demons.some(o => o !== this && ['arm', 'dive', 'rise'].includes(o.state)); // só uma mergulha por vez
      if (this.timer <= 0 && !ocupada) { this.state = 'arm'; this.arm = this.s.tell; }
    } else if (this.state === 'arm') {
      this.arm -= dt;
      if (this.arm <= 0) this.mergulhar(h, hb);
    } else {
      if (this.state === 'dive') {
        this.dived += MERGULHO_V * dt;
        if (this.dived >= this.diveLen) { this.state = 'rise'; this.vx = this.face * SOBE_VX; this.vy = -SOBE_VY * .25; }
      } else this.vy = Math.max(-SOBE_VY, this.vy - 1500 * dt); // sobe em curva
      this.x += this.vx * dt; this.y += this.vy * dt;
      if (B.arena) { const x = Math.max(B.arena.left + 70, Math.min(B.arena.right - 70, this.x)); if (x !== this.x) { this.x = x; this.vx = 0; } }
      if (!this.hitDone && overlap(this.caixa(), hb)) { this.hitDone = true; hitHero(this.s.dano); }
      if (this.state === 'rise' && this.y <= PAIRA_Y) { this.y = PAIRA_Y; this.state = 'idle'; this.timer = this.s.cadencia; }
    }
  }
  mergulhar(h, hb) {
    const dx = h.x - this.x, dy = Math.min(GROUND - 70, (hb[1] + hb[3]) / 2) - this.y, L = Math.hypot(dx, dy) || 1;
    Object.assign(this, { state: 'dive', vx: dx / L * MERGULHO_V, vy: dy / L * MERGULHO_V, diveLen: L, dived: 0, hitDone: false });
    this.face = Math.sign(dx) || this.face; sfx('whoosh');
  }

  // voo = tira fly em loop (bate mais rápido subindo); aviso = ataque 0→1 (ergue as asas); mergulho = 6/7 (corpo esticado) e,
  // perto do alvo, 2→5 (garras e rasgo); na subida inclina o bico para cima
  desenhar() {
    const S = ESPR.ave;
    if (!S.attack.naturalWidth || !S.run.naturalWidth) return this.desenharAMao();
    let img = S.run, fr;
    if (this.state === 'arm') { img = S.attack; fr = this.arm > this.s.tell / 2 ? 0 : 1; }
    else if (this.state === 'dive') { img = S.attack; const p = this.dived / this.diveLen; fr = p < .55 ? 6 + Math.floor(this.bob * 12) % 2 : 2 + Math.min(3, Math.floor((p - .55) / .45 * 4)); }
    else fr = Math.floor(this.bob * (this.state === 'rise' ? 16 : 10)) % S.nRun;
    const bobY = this.state === 'idle' || this.state === 'enter' ? Math.sin(this.bob * 2) * 8 : 0;
    ctx.save(); ctx.translate(this.x, this.y + bobY); ctx.scale(this.face, 1);
    if (this.state === 'rise') ctx.rotate(-.35);
    if (this.state === 'dead') ctx.scale(1.12, 1.12);
    if (this.flash > 0) ctx.filter = FILTRO_ACERTO;
    else if (this.state === 'arm') ctx.filter = brilho('#5fb8ff', 14);
    ctx.drawImage(img, fr * S.FW, 0, S.FW, S.FH, 60 - S.ax, 10 - S.ay, S.FW, S.FH); // olho 60 px à frente do centro do corpo
    ctx.restore();
  }
  /** a Dúvida desenhada à mão: manto roxo, olhos desiguais e o "?" (reserva se a imagem não carregar) */
  desenharAMao() {
    const arm = this.state === 'arm', fy = Math.sin(this.bob * 2) * 10;
    ctx.save(); ctx.translate(this.x, this.y + fy);
    if (this.state === 'dead') ctx.scale(1.12, 1.12);
    ctx.fillStyle = this.flash > 0 ? '#fff' : '#3d1a5c';
    ctx.beginPath(); ctx.moveTo(0, -70); ctx.quadraticCurveTo(60, -40, 50, 60);
    for (let k = 0; k < 5; k++) ctx.lineTo(50 - k * 25 - 12, 40 + (k % 2) * 25);
    ctx.lineTo(-50, 60); ctx.quadraticCurveTo(-60, -40, 0, -70); ctx.fill();
    ctx.fillStyle = '#1a0a28'; ctx.beginPath(); ctx.ellipse(0, -35, 26, 22, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#e9d8ff'; ctx.beginPath(); ctx.arc(-10, -40, 6, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(9, -38, 3, 0, 7); ctx.fill();
    if (arm) { ctx.shadowColor = '#ff7a1a'; ctx.shadowBlur = 25; ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.ellipse(-2, -24, 10, 6, 0, 0, 7); ctx.fill(); ctx.shadowBlur = 0; }
    ctx.fillStyle = '#b48cff'; ctx.font = '800 34px serif'; ctx.fillText('?', 0, 30);
    ctx.restore();
  }
}
