import { stoneSfx } from '../core/audio.js';
import { reduced } from '../core/utils.js';
import { GROUND, ctx } from './config.js';
import { B } from './state.js';

// ---------- Cena: a estátua de ouro desperta (fim da Babilônia, depois que Nabucodonosor cai) ----------
// Tela cheia por cima da fase (o jogo fica parado). 8 quadros de 439×437 (assets/img/cenas/estatua-desperta.webp, do GIF):
// 0–3 a estátua se solta do pedestal — TRAVADOS, devagar, com a tela tremendo; 4–7 o pulo até cair na frente da tela —
// SOLTOS, rápidos; no 7 o impacto (tremor forte) e a legenda. Entra e sai com escurecimento.
// QUADROS = [quadro, até que segundo da cena]; a imagem é encaixada pela altura, com o próprio quadro borrado nas laterais.
const IMG = Object.assign(new Image(), { src: 'assets/img/cenas/estatua-desperta.webp' });
const FW = 439, FH = 437, ENTRA = .35, SAI = .45;
const QUADROS = [[0, .7], [1, 1.05], [2, 1.4], [3, 1.75], [4, 1.83], [5, 1.91], [6, 1.99], [7, 3.3]];
const IMPACTO = 1.99, FIM = 3.3 + SAI;

export function startCena() { B.cena = { t: 0, rangeu: 0, caiu: false }; }

// ---------- Antes da cena: ainda no jogo ----------
// O chão treme, o herói pergunta "O que é isso?" e a câmera vai até a estátua do fundo (o fundo desliza e dá zoom nela);
// aí corta para a animação. O jogo fica parado (o herói não anda) enquanto isso.
export const PRE = { T: 3.4, FALA: [.35, 2.6], FOCO: [.7, 2.9] };
export function startPreCena() { B.prec = { t: 0, rangeu: 0 }; }
export function updatePreCena(dt) {
  const P = B.prec; if (!P) return false;
  P.t += dt; B.time += dt; // o tempo da fase segue (animações paradas do herói respiram)
  B.shake = Math.max(B.shake, .1 + .12 * Math.min(1, P.t / PRE.T)); // o tremor cresce
  if ((P.rangeu -= dt) <= 0) { P.rangeu = .45; stoneSfx('crack', .3 + .5 * P.t / PRE.T); }
  B.shake = Math.max(0, B.shake - dt * .5);
  if (P.t >= PRE.T) { B.prec = null; B.shake = 0; startCena(); }
  return true;
}
// quanto a câmera já foi até a estátua (0–1, suave)
export function focoEstatua() {
  const P = B.prec; if (!P) return 0;
  const k = Math.max(0, Math.min(1, (P.t - PRE.FOCO[0]) / (PRE.FOCO[1] - PRE.FOCO[0])));
  return k * k * (3 - 2 * k);
}
// o balão de fala do herói (coordenadas do mundo)
export function drawFalaPre() {
  const P = B.prec; if (!P || P.t < PRE.FALA[0] || P.t > PRE.FALA[1]) return;
  const h = B.hero, txt = 'O que é isso?!', a = Math.min(1, (P.t - PRE.FALA[0]) / .15, (PRE.FALA[1] - P.t) / .25);
  ctx.save(); ctx.globalAlpha = a; ctx.font = '700 20px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(txt).width + 30, bh = 40, x = h.x, y = GROUND + h.y - 205;
  ctx.fillStyle = '#fbf3e2'; ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - bh, w, bh, 12); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 10, y - 1); ctx.lineTo(x - 2, y + 14); ctx.lineTo(x + 8, y - 1); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillRect(x - 9, y - 4, 16, 4); // emenda da ponta com o balão
  ctx.fillStyle = '#2a1a10'; ctx.fillText(txt, x, y - bh / 2 + 1);
  ctx.restore();
}

// avança a cena; devolve true enquanto ela estiver na tela (o jogo fica parado)
export function updateCena(dt) {
  const C = B.cena; if (!C) return false;
  C.t += dt;
  if (C.t < QUADROS[3][1] && (C.rangeu -= dt) <= 0) { C.rangeu = .35; stoneSfx('crack', .4 + C.t / 2); } // a pedra rangendo enquanto ela se solta
  if (!C.caiu && C.t >= IMPACTO) { C.caiu = true; stoneSfx('collapse'); }
  if (C.t >= FIM) B.cena = null;
  return true;
}

export function drawCena() {
  const C = B.cena; if (!C) return;
  const W = 960, H = 540;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const k = ctx.canvas.width / W; ctx.scale(k, k); // a cena ocupa a tela toda, qualquer que seja a escala do canvas
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (IMG.naturalWidth) {
    const q = (QUADROS.find(([, ate]) => C.t < ate) || QUADROS[QUADROS.length - 1])[0];
    // tremor: leve enquanto ela se solta, forte no impacto
    const solta = C.t < QUADROS[3][1], dImp = C.t - IMPACTO, amp = reduced ? 0 : solta ? 3 : dImp >= 0 && dImp < .5 ? 14 * (1 - dImp / .5) : 0;
    const sx = (Math.random() - .5) * amp, sy = (Math.random() - .5) * amp;
    // laterais: o mesmo quadro ampliado, borrado e escuro (cobre a tela 16:9)
    ctx.save(); ctx.filter = 'blur(14px) brightness(.45)';
    const cs = W / FW; ctx.drawImage(IMG, q * FW, 0, FW, FH, 0, (H - FH * cs) / 2, W, FH * cs);
    ctx.restore();
    const s = H / FH, w = FW * s; // o quadro inteiro pela altura, no meio
    ctx.drawImage(IMG, q * FW, 0, FW, FH, (W - w) / 2 + sx, sy, w, H);
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, 0, (W - w) / 2, H); ctx.fillRect((W + w) / 2, 0, (W - w) / 2, H);
    if (C.t >= IMPACTO + .25) { // legenda
      const a = Math.min(1, (C.t - IMPACTO - .25) / .3);
      ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.lineJoin = 'round';
      ctx.font = '800 34px Cinzel, Georgia, serif'; ctx.lineWidth = 7; ctx.strokeStyle = '#1a0a04'; ctx.fillStyle = '#ffd36a';
      ctx.strokeText('O Ídolo Babilônico despertou!', W / 2, H - 70); ctx.fillText('O Ídolo Babilônico despertou!', W / 2, H - 70);
      ctx.font = '600 18px Georgia, serif'; ctx.lineWidth = 5; ctx.fillStyle = '#f3e7d3';
      ctx.strokeText('"Não serviremos a teus deuses, nem adoraremos a estátua de ouro" — Daniel 3:18', W / 2, H - 38);
      ctx.fillText('"Não serviremos a teus deuses, nem adoraremos a estátua de ouro" — Daniel 3:18', W / 2, H - 38);
      ctx.globalAlpha = 1;
    }
  }
  // entra e sai no escuro
  const fade = C.t < ENTRA ? 1 - C.t / ENTRA : C.t > FIM - SAI ? (C.t - (FIM - SAI)) / SAI : 0;
  if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, fade)})`; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}
