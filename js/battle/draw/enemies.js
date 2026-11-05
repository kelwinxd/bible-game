import { ESPR, ctx } from '../config.js';

export function drawTentacao(d) {
  const arm = d.state === 'arm', dead = d.state === 'dead';
  const lunge = d.strikeAnim > 0 ? -40 : arm ? 10 : 0;
  ctx.save(); ctx.translate(d.x, d.y + (d.state === 'enter' ? Math.abs(Math.sin(d.bob * 10)) * -6 : 0)); ctx.scale(-d.face, 1); ctx.translate(lunge, 0);
  if (dead) ctx.scale(1.12, 1.12); // incha no clarão antes de estourar
  if (arm) { ctx.shadowColor = '#ff2020'; ctx.shadowBlur = 30; }
  const body = d.flash > 0 ? '#ffffff' : d.s.cor;
  ctx.fillStyle = body;
  ctx.beginPath(); ctx.ellipse(0, -80, 46, 72, 0, 0, 7); ctx.fill();         // corpo
  ctx.beginPath(); ctx.arc(0, -165, 30, 0, 7); ctx.fill();                   // cabeça
  ctx.fillStyle = '#d8c8a8';                                                 // chifres
  ctx.beginPath(); ctx.moveTo(-18, -185); ctx.lineTo(-38, -220); ctx.lineTo(-8, -190); ctx.fill();
  ctx.beginPath(); ctx.moveTo(18, -185); ctx.lineTo(38, -220); ctx.lineTo(8, -190); ctx.fill();
  ctx.fillStyle = arm ? '#ffeb3b' : '#ffb000'; ctx.fillRect(-20, -172, 12, 5); ctx.fillRect(-2, -172, 12, 5);
  ctx.strokeStyle = body; ctx.lineWidth = 14; ctx.lineCap = 'round';      // braço com garra
  ctx.beginPath(); ctx.moveTo(-30, -110); ctx.lineTo(arm ? -40 : -70, arm ? -170 : -60); ctx.stroke();
  ctx.strokeStyle = '#d8c8a8'; ctx.lineWidth = 3;
  const cx = arm ? -40 : -70, cy = arm ? -170 : -60;
  for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 14, cy + k * 8 - 6); ctx.stroke(); }
  ctx.fillStyle = body; ctx.fillRect(-30, -20, 18, 20); ctx.fillRect(12, -20, 18, 20);
  ctx.restore();
}
// inimigo com sprite: anda/parado = tira run em loop; 'arm' (aviso) = ataque 1→3 (abre a boca);
// o bote = quadro 4 (com o rasgo) e volta no 5
export function drawSpriteDemon(d) {
  const S = ESPR[d.s.sprite];
  if (!S.attack.naturalWidth || !S.run.naturalWidth) return drawTentacao(d);
  let img = S.run, fr;
  if (d.state === 'arm') { img = S.attack; fr = Math.min(2, Math.floor((1 - d.arm / d.s.tell) * 3)); }
  else if (d.strikeAnim > 0) { img = S.attack; fr = d.strikeAnim > .08 ? 3 : 4; }
  else fr = Math.floor(d.bob * (d.moving ? 11 : 6)) % S.nRun; // parado: o mesmo ciclo, mais lento (respira)
  ctx.save();
  ctx.translate(d.x, d.y + (d.state === 'enter' ? Math.abs(Math.sin(d.bob * 10)) * -6 : 0)); ctx.scale(d.face, 1);
  if (d.state === 'dead') ctx.scale(1.12, 1.12); // incha no clarão antes de estourar
  if (d.flash > 0) ctx.filter = 'brightness(3) saturate(0)';
  else if (d.state === 'arm') ctx.filter = 'drop-shadow(0 0 14px #ff2020)';
  ctx.drawImage(img, fr * S.FW, 0, S.FW, S.FH, -S.ax, 2 - S.FH, S.FW, S.FH);
  ctx.restore();
}
export function drawDuvida(d) {
  const arm = d.state === 'arm', dead = d.state === 'dead';
  const fy = Math.sin(d.bob * 2) * 10;
  ctx.save(); ctx.translate(d.x, d.y + fy);
  if (dead) ctx.scale(1.12, 1.12);
  ctx.fillStyle = d.flash > 0 ? '#fff' : '#3d1a5c';
  ctx.beginPath(); ctx.moveTo(0, -70); ctx.quadraticCurveTo(60, -40, 50, 60);  // manto
  for (let k = 0; k < 5; k++) ctx.lineTo(50 - k * 25 - 12, 40 + (k % 2) * 25);
  ctx.lineTo(-50, 60); ctx.quadraticCurveTo(-60, -40, 0, -70); ctx.fill();
  ctx.fillStyle = '#1a0a28'; ctx.beginPath(); ctx.ellipse(0, -35, 26, 22, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#e9d8ff'; ctx.beginPath(); ctx.arc(-10, -40, 6, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(9, -38, 3, 0, 7); ctx.fill(); // olhos desiguais
  if (arm) { ctx.shadowColor = '#ff7a1a'; ctx.shadowBlur = 25; ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.ellipse(-2, -24, 10, 6, 0, 0, 7); ctx.fill(); ctx.shadowBlur = 0; }
  ctx.fillStyle = '#b48cff'; ctx.font = '800 34px serif'; ctx.fillText('?', 0, 30);
  ctx.restore();
}
