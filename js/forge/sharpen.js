import { sfx } from '../core/audio.js';
import { opts } from '../core/options.js';
import { powerDur } from '../core/progress.js';
import { $, D, shuffle } from '../core/utils.js';
import { strike } from './forge.js';
import { levelResult } from './verse.js';
import { show } from '../ui/screens.js';
import { burst } from '../ui/sparks.js';

// ---------- Afiação ----------
// Quiz sobre o versículo; as opções ficam paradas nos blocos e uma mancha de tinta corre pela faixa:
// o jogador só pode escolher quando a mancha está na mira. Fora da mira ou opção errada = erro.
// Nível 1: autor · Nível 2: contexto histórico · Nível 3: contexto da passagem.
export let curSharp = null;
export const clearSharp = () => { curSharp = null; };
export function openSharpen(v, level = 1) {
  show('sharpen');
  // nível 1: "quem escreveu?" + pergunta sorteada sobre a pessoa do autor (completa 2)
  const qs = level === 1 ? [...v.afiacao[0], ...shuffle(D.autores[v.autor].perguntas).slice(0, 2 - v.afiacao[0].length)] : v.afiacao[level - 1];
  curSharp = { v, level, qs, i: 0, errors: 0, x: -40, done: false };
  $('sharpTitle').innerHTML = `🗡 Afiação · Nível ${level} <span class="muted">— ${D.niveis.afiacao.descr[level - 1]}</span>`;
  $('sharpDone').innerHTML = '';
  $('sharpMira').style.display = opts.forge === 'sempressa' ? 'none' : '';
  $('sharpMira').style.width = (opts.forge === 'calma' ? 120 : 80) + 'px';
  $('stain').style.display = opts.forge === 'sempressa' ? 'none' : '';
  $('stain').classList.remove('silver');
  $('sharpStrip').style.setProperty('--p', '0%');
  renderSharp();
}
export function renderSharp() {
  const s = curSharp, q = s.qs[s.i];
  $('sharpQ').innerHTML = `<div class="ref">${s.v.ref} · Pergunta ${s.i + 1} de ${s.qs.length}</div>${q.p}`;
  $('sharpOpts').innerHTML = shuffle([q.certa, ...q.erradas]).map((o, k) =>
    `<button data-o="${o.replace(/"/g, '&quot;')}" onclick="pickSharp(this)"><span class="k">${k + 1}</span>${o}</button>`).join('');
  $('sharpInfo').textContent = `Erros: ${s.errors}` + (opts.forge === 'sempressa' ? '' : ' · escolha quando a mancha estiver na mira');
}
export function sharpTick(dt) {
  const s = curSharp; if (!s || s.done || opts.forge === 'sempressa') return;
  const W = $('sharpStrip').clientWidth, speed = opts.forge === 'calma' ? 140 : 250;
  s.x += speed * dt; if (s.x > W + 40) s.x = -40;
  $('stain').style.left = s.x + 'px';
}
export function sharpError(btn, msg) {
  const s = curSharp; s.errors++; sfx('miss');
  const st = $('sharpStrip'); st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake');
  if (btn) { btn.classList.add('bad'); setTimeout(() => btn.classList.remove('bad'), 400); }
  $('sharpInfo').textContent = `${msg} · erros: ${s.errors}`;
}
export function pickSharp(btn) {
  const s = curSharp; if (!s || s.done) return;
  strike('hammerS');
  if (opts.forge !== 'sempressa') {
    const W = $('sharpStrip').clientWidth, win = opts.forge === 'calma' ? 60 : 40;
    if (Math.abs(s.x - W / 2) > win) return sharpError(null, 'Fora da mira');
  }
  const q = s.qs[s.i];
  if (btn.dataset.o !== q.certa) return sharpError(btn, 'Resposta errada');
  sfx('hit'); const r = btn.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 24, '#dfe8f0');
  s.i++;
  // acerto: mancha vira prata, faixa pisca amarelo e fica um pouco mais prateada
  const st = $('sharpStrip'), stain = $('stain');
  st.style.setProperty('--p', Math.round(s.i / s.qs.length * 100) + '%');
  st.classList.remove('flash'); void st.offsetWidth; st.classList.add('flash');
  stain.classList.add('silver'); clearTimeout(s.silverT);
  if (s.i < s.qs.length) s.silverT = setTimeout(() => stain.classList.remove('silver'), 700);
  if (s.i < s.qs.length) return renderSharp();
  s.done = true; $('sharpOpts').innerHTML = ''; $('sharpInfo').textContent = '';
  $('sharpQ').innerHTML = `<div class="ref">${s.v.ref}</div>${s.v.texto}`;
  levelResult('sharpDone', 'afia', s.v, s.level, s.errors, () => `O poder deste versículo agora dura ${powerDur(s.v.id)}s.`);
}
