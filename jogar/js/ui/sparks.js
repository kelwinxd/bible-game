import { $, reduced } from '../core/utils.js';

// faíscas (DOM overlay)
export const sp = $('sparks'), spx = sp.getContext('2d'); export let sparks = [];
export function burst(x, y, n, c) { if (reduced) n = 6; for (let i = 0; i < n; i++) sparks.push({ x, y, vx: (Math.random() - .5) * 500, vy: -Math.random() * 400, t: .6, c }); if (sparks.length > 200) sparks.splice(0, sparks.length - 200); }
export function sparksTick(dt) {
  if (sp.width !== innerWidth) { sp.width = innerWidth; sp.height = innerHeight; }
  spx.clearRect(0, 0, sp.width, sp.height);
  sparks = sparks.filter(p => (p.t -= dt) > 0);
  sparks.forEach(p => { p.vy += 900 * dt; p.x += p.vx * dt; p.y += p.vy * dt; spx.fillStyle = p.c; spx.globalAlpha = p.t / .6; spx.fillRect(p.x, p.y, 3, 3); });
  spx.globalAlpha = 1;
}
