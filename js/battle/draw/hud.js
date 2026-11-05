import { balloonBelow, balloonY } from '../combat.js';
import { ctx } from '../config.js';
import { tema } from '../hud.js';
import { B } from '../state.js';
import { shieldMax } from '../../core/progress.js';
import { D, reduced } from '../../core/utils.js';

export function tutTip() {
  const T = B.tut; if (!T || T.done || B.peek >= 0 || B.pendingFly) return null;
  const h = B.hero, hole = B.holes[0], rock = B.rocks[0];
  if (hole && h.x < hole.x + hole.w + 40) return ['[A] [D] andar   ·   [W] ou [Espaço] pular', 'Pule o buraco!'];
  if (rock && rock.hp > 0) return h.x > rock.x - 330 ? ['[K] atacar', 'Golpeie a pedra brilhante: 3 golpes a quebram'] : ['Há uma luz no caminho… siga em frente'];
  if (!B.deck.length) return ['Pegue o livro dourado!'];
  if (!T.refuted) return ['Os versículos são suas armas contra as mentiras.', 'Use o versículo CERTO para refutar: aperte [1] ou clique no card'];
  if (!T.killed) return ['Mentira refutada! Sua lâmina brilha: [K] ataque o demônio', 'Segure [J] para erguer o escudo'];
  T.done = true; return null;
}
// caixa no alto da tela; trechos entre [ ] viram teclas desenhadas
export function drawTip() {
  const N = B.notice, lines = N ? N.lines : tutTip(); if (!lines) return;
  const W = 960, LH = 34, accent = N ? N.c : '#f2c84b';
  ctx.save(); ctx.font = '600 19px system-ui'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const parts = lines.map(l => l.split(/(\[[^\]]+\])/).filter(Boolean));
  const wOf = t => t[0] === '[' ? ctx.measureText(t.slice(1, -1)).width + 18 : ctx.measureText(t).width;
  const widths = parts.map(ps => ps.reduce((a, t) => a + wOf(t) + (t[0] === '[' ? 4 : 0), 0));
  const bw = Math.max(...widths) + 40, bh = lines.length * LH + 18, x0 = (W - bw) / 2, y0 = 64;
  ctx.globalAlpha = N ? Math.min(1, N.t * 2) : 1;
  ctx.fillStyle = '#0b0d14dd'; ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.shadowColor = accent; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.roundRect(x0, y0, bw, bh, 10); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  parts.forEach((ps, li) => {
    let x = (W - widths[li]) / 2; const y = y0 + 9 + LH * li + LH / 2;
    ps.forEach(t => {
      if (t[0] === '[') { // tecla: pulsa para chamar atenção
        const k = t.slice(1, -1), kw = wOf(t), pulse = reduced ? 0 : (Math.sin(B.time * 6) + 1) / 2;
        ctx.fillStyle = '#f3e7d3'; ctx.strokeStyle = accent; ctx.shadowColor = accent; ctx.shadowBlur = 6 + pulse * 10;
        ctx.beginPath(); ctx.roundRect(x, y - 14, kw, 28, 6); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
        ctx.fillStyle = '#1a0f0b'; ctx.font = '800 17px system-ui'; ctx.fillText(k, x + 9, y + 1); ctx.font = '600 19px system-ui';
        x += kw + 4;
      } else { ctx.fillStyle = li ? '#e8dcc6' : '#fff'; ctx.fillText(t, x, y); x += ctx.measureText(t).width; }
    });
  });
  ctx.restore();
}
export function drawHUD() {
  const W = 960;
  ctx.fillStyle = '#000a'; ctx.fillRect(0, 0, W, 52);
  bar(16, 14, 210, 22, B.hp / 100, '#c62828', `Vida ${Math.ceil(B.hp)}`);
  bar(490, 14, 200, 22, B.shieldE / shieldMax, B.shieldLock ? '#4a5a72' : '#5d8fd8', B.shieldLock ? 'Escudo recarregando…' : `Escudo ${B.shieldE.toFixed(1)}s / ${shieldMax}s`);
  const P = B.power;
  bar(240, 14, 236, 22, P ? P.t / P.dur : 0, !P ? '#f2c84b' : B.shield ? '#6a6a6a' : tema(P.v).cor, P ? (B.shield ? 'Poder (pausado — escudo)' : `Poder · ${P.v.ref}`) : 'Espada inerte — refute');
  ctx.fillStyle = '#f3e7d3'; ctx.font = '700 20px Cinzel, serif'; ctx.textAlign = 'right'; ctx.fillText(`Jornada ${Math.min(100, Math.round(B.hero.x / B.fase.comprimento * 100))}%`, W - 16, 33); ctx.textAlign = 'center';
}
export function bar(x, y, w, hh, p, c, label) {
  ctx.fillStyle = '#2a1d16'; ctx.fillRect(x, y, w, hh);
  ctx.fillStyle = c; ctx.fillRect(x, y, w * Math.max(0, p), hh);
  ctx.strokeStyle = '#000'; ctx.strokeRect(x, y, w, hh);
  ctx.fillStyle = '#fff'; ctx.font = '600 13px system-ui'; ctx.textAlign = 'left'; ctx.fillText(label, x + 6, y + 16); ctx.textAlign = 'center';
}
export function drawHpBar(d) {
  const y = d.s.mergulho ? d.y - 140 : d.s.sprite ? d.y - 252 : d.s.chao ? d.y - 200 : d.y - 85; // sprite: acima da cabeça
  ctx.fillStyle = '#000'; ctx.fillRect(d.x - 40, y, 80, 8);
  ctx.fillStyle = d.vuln && d.lastVerse ? tema(d.lastVerse).cor : '#e04a3a'; ctx.fillRect(d.x - 40, y, 80 * Math.max(0, d.hp) / d.maxHp, 8);
}
// mede os balões e, se dois ainda se tocarem (ex.: presos na borda durante a entrada), sobe um acima do outro
export function layoutBalloons() {
  ctx.font = '600 18px system-ui';
  const placed = [];
  // ave: a frase some no mergulho e na subida (só aparece pairando)
  B.demons.filter(d => d.lie && !(d.s.mergulho && (d.state === 'dive' || d.state === 'rise'))).sort((a, b) => a.x - b.x).forEach(d => {
    const words = d.lie.texto.split(' '), lines = []; let ln = '';
    words.forEach(w => { if (ctx.measureText(ln + ' ' + w).width > 210 && ln) { lines.push(ln); ln = w; } else ln = ln ? ln + ' ' + w : w; });
    lines.push(ln);
    const bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 28, bh = lines.length * 24 + 16;
    const below = balloonBelow(d);
    const b = { d, lines, bw, bh, below, cx: Math.min(B.cam + 960 - bw / 2 - 8, Math.max(B.cam + bw / 2 + 8, d.x)), y: below ? balloonY(d) + 14 : balloonY(d) - bh };
    for (let moved = true, n = 0; moved && n < 6; n++) {
      moved = false;
      for (const o of placed) if (Math.abs(b.cx - o.cx) < (b.bw + o.bw) / 2 + 6 && b.y < o.y + o.bh + 6 && b.y + b.bh > o.y - 6) { b.y = b.below ? o.y + o.bh + 10 : o.y - b.bh - 10; moved = true; }
    }
    placed.push(b);
  });
  return placed;
}
export function drawBalloon({ d, lines, bw, bh, cx, y, below }) {
  ctx.save(); ctx.globalAlpha = 1 - d.lieFlash / .3; // balão nasce com fade-in quando a mentira troca
  ctx.font = '600 18px system-ui';
  const headY = balloonY(d);
  if (below && y > headY + 18) { ctx.strokeStyle = '#f7efe2aa'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(d.x, headY); ctx.lineTo(d.x, y); ctx.stroke(); } // empurrado para baixo
  if (!below && y + bh < headY - 4) { ctx.strokeStyle = '#f7efe2aa'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(d.x, y + bh); ctx.lineTo(d.x, headY); ctx.stroke(); } // balão empurrado para cima: linha até a cabeça
  // refutada (poder ativo contra ele): borda e brilho na cor do versículo; a frase continua até ele morrer
  const tc = d.vuln && d.lastVerse && tema(d.lastVerse);
  ctx.fillStyle = '#f7efe2'; ctx.strokeStyle = tc ? tc.cor : '#5a1010'; ctx.lineWidth = tc ? 4 : 3;
  if (tc) { ctx.shadowColor = tc.brilho; ctx.shadowBlur = 16; }
  ctx.beginPath(); ctx.roundRect(cx - bw / 2, y, bw, bh, 10); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.beginPath(); // ponta virada para o dono (para cima quando o balão fica embaixo)
  if (below) { ctx.moveTo(d.x - 10, y); ctx.lineTo(d.x, y - 14); ctx.lineTo(d.x + 10, y); } else { ctx.moveTo(d.x - 10, y + bh); ctx.lineTo(d.x, y + bh + 14); ctx.lineTo(d.x + 10, y + bh); }
  ctx.fill();
  ctx.fillStyle = '#3a0c0c'; lines.forEach((l, i) => ctx.fillText(l, cx, y + 30 + i * 24));
  ctx.restore();
}
export function drawFatal() {
  const F = B.fatal, W = 960, H = 540, k = 1 - F.t / F.dur;
  // fade in (0–20%), fica visível, pisca (55–75%), fade out (75–100%)
  let a = Math.max(0, Math.min(1, k / .2, (1 - k) / .25));
  if (!reduced && k > .55 && k < .75) a *= Math.floor(k * 40) % 2 ? .25 : 1;
  ctx.save(); ctx.globalAlpha = a;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  // frase do Espírito quebrada em 2 linhas menores (numa linha só tomava a tela inteira)
  const lines = F.espirito ? ['O Espírito sopra', 'para onde quer'] : [F.v ? F.v.ref : 'Está escrito'];
  const fs = F.espirito ? 58 : 84, lh = fs * 1.15;
  ctx.font = `800 ${fs}px Cinzel, "Trajan Pro", Georgia, serif`; ctx.lineJoin = 'round'; ctx.lineWidth = 8;
  lines.forEach((ln, i) => {
    const y = H / 2 + (i - (lines.length - 1) / 2) * lh;
    ctx.shadowBlur = 0; ctx.strokeStyle = '#000'; ctx.strokeText(ln, W / 2, y);
    if (F.espirito) { ctx.fillStyle = '#4fc3ff'; ctx.shadowColor = '#3ab4ff'; } else { ctx.fillStyle = '#d4151b'; ctx.shadowColor = '#ff2a2a'; }
    ctx.shadowBlur = 24; ctx.fillText(ln, W / 2, y);
  });
  ctx.restore();
}
