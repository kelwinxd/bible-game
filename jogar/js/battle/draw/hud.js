import { balloonBelow, balloonY } from '../combat.js';
import { drawBossBar } from '../boss.js';
import { ctx } from '../config.js';
import { Rachaduras } from './cracks.js';
import { tema } from '../hud.js';
import { B } from '../state.js';
import { escudoAtual, nivelAtual } from '../../core/progress.js';
import { D, reduced } from '../../core/utils.js';

export function tutTip() {
  const T = B.tut; if (!T || T.done || B.peek >= 0 || B.pendingFly) return null;
  const h = B.hero, hole = B.holes[0], rock = B.rocks[0];
  // dicas graduais, uma coisa de cada vez; cada uma some assim que o jogador faz o que ela pede
  // 1) andar e pular: só até atravessar o 1º buraco
  if (!T.pulou && hole && h.x > hole.x + hole.w) T.pulou = true;
  if (!T.pulou) return hole ? ['[A] [D] andar   ·   [W] ou [Espaço] pular', 'Pule o buraco!'] : null;
  // 2) atacar: a 1ª rã (depois do buraco, só patrulha) ensina o [K]; some no 1º golpe
  const ra = B.frogs.find(f => f.ensina && !f.dead);
  if (!T.golpe && ra && Math.abs(h.x - ra.x) < 260) return ['[K] atacar', 'Golpeie a rã antes que ela encoste em você'];
  // 3) o versículo: bezerro → livro → refutar
  if (rock && rock.hp > 0) return rock.hp === rock.maxHp && h.x > rock.x - 260 ? ['Destrua o bezerro de ouro com [K]'] : null;
  if (!B.deck.length) return ['Pegue o livro dourado!'];
  if (!T.refuted) return B.arena ? ['Os versículos são suas armas. Utilize o certo para refutar e atacar.', 'Pressione [1] ou clique no card'] : null;
  if (!T.attacked && !T.killed) return ['Sua lâmina brilha: [K] ataque o demônio'];
  // 4) escudo: só quando aparece a cobra verde que cospe ácido
  if (B.demons.some(d => d.s.acido && d.hp > 0)) { T.acido = true; if (!T.shielded) return ['Segure [J] para erguer o escudo', 'Ele bloqueia o ácido da cobra']; }
  if (T.shielded) T.done = true;
  return null;
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
  bar(16, 14, 210, 22, B.hp / B.hpMax, '#c62828', `Vida ${Math.ceil(B.hp)}/${B.hpMax} · Nv ${nivelAtual()}`);
  const cs = B.shieldLock ? '#4a5a72' : '#5d8fd8';
  shieldIcon(500, 25, cs); // o símbolo do escudo ao lado da barra
  bar(516, 14, 190, 22, B.shieldE / escudoAtual(), cs, B.shieldLock ? 'Escudo recarregando…' : `Escudo ${B.shieldE.toFixed(1)}s / ${escudoAtual()}s`);
  const P = B.power;
  swordBar(238, 25, 238, P ? P.t / P.dur : 0, !P ? '#f2c84b' : B.shield ? '#6a6a6a' : tema(P.v).cor);
  drawBossBar(bar);
  // canto direito: só o nome do lugar especial (sem a porcentagem da jornada)
  const lugar = B.fase.treino ? 'Treinamento' : B.fase.dev ? 'Bestiário' : B.zona === 'caverna' ? 'Caverna' : '';
  if (lugar) { ctx.fillStyle = '#f3e7d3'; ctx.font = '700 20px Cinzel, serif'; ctx.textAlign = 'right'; ctx.fillText(lugar, W - 16, 33); ctx.textAlign = 'center'; }
}
// barra do poder em forma de espada (pomo, punho, guarda e lâmina com ponta): a lâmina enche com a cor do versículo ativo
// conforme o tempo de poder que resta; sem poder, fica de aço escuro. Rótulo fixo "Poder da Palavra"
function swordBar(x, cy, w, p, c) {
  const gx = x + 30, b0 = gx + 7, tip = x + w, hh = 9; // guarda em gx; a lâmina vai de b0 até a ponta
  ctx.save();
  // pomo e punho
  ctx.fillStyle = '#c9a45c'; ctx.beginPath(); ctx.arc(x + 6, cy, 5.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5a3a24'; ctx.fillRect(x + 10, cy - 4, gx - x - 10, 8);
  ctx.strokeStyle = '#3a2416'; ctx.lineWidth = 1; for (let k = x + 14; k < gx; k += 5) { ctx.beginPath(); ctx.moveTo(k, cy - 4); ctx.lineTo(k + 3, cy + 4); ctx.stroke(); }
  // lâmina
  const lam = () => { ctx.beginPath(); ctx.moveTo(b0, cy - hh); ctx.lineTo(tip - 22, cy - hh); ctx.lineTo(tip, cy); ctx.lineTo(tip - 22, cy + hh); ctx.lineTo(b0, cy + hh); ctx.closePath(); };
  lam(); ctx.fillStyle = '#262a31'; ctx.fill();
  ctx.save(); lam(); ctx.clip();
  if (p > 0) { ctx.fillStyle = c; ctx.fillRect(b0, cy - hh, (tip - b0) * Math.min(1, p), hh * 2); }
  ctx.fillStyle = '#ffffff22'; ctx.fillRect(b0, cy - hh, tip - b0, hh * .7); // brilho do fio
  ctx.strokeStyle = '#00000055'; ctx.beginPath(); ctx.moveTo(b0, cy); ctx.lineTo(tip - 6, cy); ctx.stroke(); // o sulco do meio
  ctx.restore();
  lam(); ctx.strokeStyle = '#d9c9a8'; ctx.lineWidth = 1.5; ctx.stroke();
  // guarda (por cima da base da lâmina)
  ctx.fillStyle = '#c9a45c'; ctx.fillRect(gx, cy - 15, 7, 30); ctx.strokeStyle = '#6b4a24'; ctx.lineWidth = 1; ctx.strokeRect(gx, cy - 15, 7, 30);
  // rótulo
  ctx.font = '700 13px Cinzel, serif'; ctx.textAlign = 'left'; ctx.fillStyle = '#000a'; ctx.fillText('Poder da Palavra', b0 + 11, cy + 5);
  ctx.fillStyle = '#fff'; ctx.fillText('Poder da Palavra', b0 + 10, cy + 4);
  ctx.restore(); ctx.textAlign = 'center';
}
// símbolo de escudo (de cavaleiro, com a cruz), centrado em (cx, cy)
function shieldIcon(cx, cy, c) {
  ctx.save(); ctx.translate(cx, cy);
  ctx.beginPath(); ctx.moveTo(-9, -11); ctx.lineTo(9, -11); ctx.lineTo(9, -1); ctx.quadraticCurveTo(8, 8, 0, 13); ctx.quadraticCurveTo(-8, 8, -9, -1); ctx.closePath();
  ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = '#dbe8ff'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = '#eef4ff'; ctx.fillRect(-1.5, -8, 3, 17); ctx.fillRect(-6, -3.5, 12, 3);
  ctx.restore();
}
export function bar(x, y, w, hh, p, c, label) {
  ctx.fillStyle = '#2a1d16'; ctx.fillRect(x, y, w, hh);
  ctx.fillStyle = c; ctx.fillRect(x, y, w * Math.max(0, p), hh);
  ctx.strokeStyle = '#000'; ctx.strokeRect(x, y, w, hh);
  ctx.fillStyle = '#fff'; ctx.font = '600 13px system-ui'; ctx.textAlign = 'left'; ctx.fillText(label, x + 6, y + 16); ctx.textAlign = 'center';
}
export function drawHpBar(d) {
  const y = d.barraY(); // acima da cabeça (cada monstro sabe a sua altura)
  ctx.fillStyle = '#000'; ctx.fillRect(d.x - 40, y, 80, 8);
  ctx.fillStyle = d.vuln && d.lastVerse ? tema(d.lastVerse).cor : '#e04a3a'; ctx.fillRect(d.x - 40, y, 80 * Math.max(0, d.hp) / d.maxHp, 8);
}
// mede os balões e, se dois ainda se tocarem (ex.: presos na borda durante a entrada), sobe um acima do outro
export function layoutBalloons() {
  ctx.font = '600 18px system-ui';
  const placed = [];
  // ave: a frase some no mergulho e na subida (só aparece pairando)
  B.demons.filter(d => d.mostraMentira()).sort((a, b) => a.x - b.x).forEach(d => {
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
  // o balão racha junto com a vida do demônio (inteiro → rachado → despedaçado); a cada estágio caem lascas de papel
  const R = d.rachas || (d.rachas = new Rachaduras(Math.random() * 1e9 | 0)), x0 = cx - bw / 2;
  const est = Rachaduras.estagio(Math.max(0, d.hp) / d.maxHp);
  if (est > (d.balaoEst || 0)) B.shards.push(...R.lascas(x0, y, bw, bh, est));
  d.balaoEst = est; d.balao = { x: x0, y, w: bw, h: bh }; // combat.js estoura o balão daqui quando ele morre
  R.recortar(ctx, x0, y, bw, bh, est);
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
  R.riscar(ctx, x0, y, bw, bh, est, '#5a2a1c', c => { c.beginPath(); c.roundRect(x0, y, bw, bh, 10); }); // por baixo do texto: a frase segue legível
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
