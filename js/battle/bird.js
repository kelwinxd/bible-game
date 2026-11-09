import { demonBox, heroBox, hitHero, overlap } from './combat.js';
import { GROUND } from './config.js';
import { B } from './state.js';
import { sfx } from '../core/audio.js';

// Ave da Dúvida (data.js → inimigos[].mergulho): paira no alto encarando o herói; no aviso ergue as asas e
// mergulha reto até onde o herói ESTAVA (sair do lugar ou erguer o escudo evita), passa raspando com as garras,
// sobe em curva do outro lado e vira (direto, sem animar a virada) para encarar o herói de novo. Só uma ave mergulha por vez.
// BIRD_HOVER_Y: altura em que paira — baixa o bastante para o rasgo do poder (mesmo do chão) pegar a parte de baixo dela
export const BIRD_HOVER_Y = 285, DIVE_SPEED = 640, RISE_VX = 380, RISE_VY = 560;
export function updateBird(d, h, dt) {
  const hb = heroBox(h);
  if (d.state === 'idle' || d.state === 'arm') {
    d.face = Math.sign(h.x - d.x) || d.face;
    d.y += (BIRD_HOVER_Y - d.y) * Math.min(1, dt * 3);
  }
  if (d.state === 'idle') {
    d.timer -= dt;
    const busy = B.demons.some(o => o !== d && ['arm', 'dive', 'rise'].includes(o.state));
    if (d.timer <= 0 && !busy) { d.state = 'arm'; d.arm = d.s.tell; }
  } else if (d.state === 'arm') {
    d.arm -= dt;
    if (d.arm > 0) return;
    const dx = h.x - d.x, dy = Math.min(GROUND - 70, (hb[1] + hb[3]) / 2) - d.y, L = Math.hypot(dx, dy) || 1;
    Object.assign(d, { state: 'dive', vx: dx / L * DIVE_SPEED, vy: dy / L * DIVE_SPEED, diveLen: L, dived: 0, hitDone: false });
    d.face = Math.sign(dx) || d.face; sfx('whoosh');
  } else {
    if (d.state === 'dive') {
      d.dived += DIVE_SPEED * dt;
      if (d.dived >= d.diveLen) { d.state = 'rise'; d.vx = d.face * RISE_VX; d.vy = -RISE_VY * .25; }
    } else d.vy = Math.max(-RISE_VY, d.vy - 1500 * dt); // sobe em curva
    d.x += d.vx * dt; d.y += d.vy * dt;
    if (B.arena) { const x = Math.max(B.arena.left + 70, Math.min(B.arena.right - 70, d.x)); if (x !== d.x) { d.x = x; d.vx = 0; } }
    if (!d.hitDone && overlap(demonBox(d), hb)) { d.hitDone = true; hitHero(d.s.dano); }
    if (d.state === 'rise' && d.y <= BIRD_HOVER_Y) { d.y = BIRD_HOVER_Y; d.state = 'idle'; d.timer = d.s.cadencia; }
  }
}
