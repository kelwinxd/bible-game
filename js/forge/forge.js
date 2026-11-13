import { sfx } from '../core/audio.js';
import { opts } from '../core/options.js';
import { progOf, saveProg, verseMult } from '../core/progress.js';
import { $, D, shuffle } from '../core/utils.js';
import { levelResult } from './verse.js';
import { show } from '../ui/screens.js';
import { burst } from '../ui/sparks.js';

// ---------- Forja ----------
// O versículo é "digitado" e pausa em cada lacuna até o jogador acertar a palavra.
// A pausa acontece algumas palavras depois da lacuna, para dar contexto ("resisti ___ ao diabo").
// Nível 1: 2 lacunas · Nível 2: 4 lacunas · Nível 3: todas as palavras do versículo.
export const TYPE_SPEED = 32; // caracteres por segundo
export const CONTEXT_WORDS = 3;
export const PUNCT = /[,;.:!?"]/;
export function stopAfter(t, from, nextGap) {
  let e = from;
  while (e < t.length && PUNCT.test(t[e])) e++; // pontuação colada na lacuna não conta como palavra
  for (let w = 0; w < CONTEXT_WORDS; w++) {
    while (e < t.length && t[e] === ' ') e++;
    if (e >= nextGap || e >= t.length) break;
    while (e < t.length && t[e] !== ' ' && e < nextGap) e++;
    if (/[,;.:!?]$/.test(t.slice(0, e))) break;
  }
  return Math.min(e, nextGap);
}
// posição da palavra inteira (não pega "Deus" dentro de outra palavra)
export function findWord(t, w, from = 0) {
  for (let i = t.indexOf(w, from); i >= 0; i = t.indexOf(w, i + 1)) {
    const a = t[i - 1], b = t[i + w.length];
    if ((!a || !/[\p{L}-]/u.test(a)) && (!b || !/[\p{L}-]/u.test(b))) return i;
  }
  return -1;
}
export function buildGaps(v, level) {
  const t = v.texto;
  if (level < 3) {
    const lac = level === 1 ? v.lacunas : [...v.lacunas, ...v.lacunas2];
    return lac.map(l => ({ ...l, pos: findWord(t, l.certa) })).sort((a, b) => a.pos - b.pos);
  }
  // nível 3: cada palavra do versículo é uma lacuna; distratores = outras palavras do próprio versículo
  const words = [], re = /[^\s,;.:!?"]+/g; let m;
  while ((m = re.exec(t))) words.push({ certa: m[0], pos: m.index });
  const pool = [...new Set(words.map(w => w.certa))];
  return words.map(w => {
    const others = pool.filter(o => o.toLowerCase() !== w.certa.toLowerCase());
    return { ...w, distratores: shuffle(others).slice(0, 3) };
  });
}
export const FORGE_LIVES = 3; // errou 3 vezes: perde a forja (vai para a tela de resultado)
// corações no canto da caixa do forjador: cheios = vidas que restam; o que acabou de ser perdido quebra
const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z"/></svg>';
function renderLives(lost = false) {
  const f = curForge, left = FORGE_LIVES - f.errors;
  $('smithHp').innerHTML = Array.from({ length: FORGE_LIVES }, (_, i) => `<i class="${i < left ? 'on' : ''}${lost && i === left ? ' lost' : ''}">${HEART}</i>`).join('');
  $('smithHp').title = `${left} de ${FORGE_LIVES} vidas`;
}
export let curForge = null;
export const clearForge = () => { curForge = null; };
export function openForge(v, level = 1) {
  show('forge');
  const t = v.texto, gaps = buildGaps(v, level);
  gaps.forEach((g, i) => g.stop = stopAfter(t, g.pos + g.certa.length, i + 1 < gaps.length ? gaps[i + 1].pos : t.length));
  curForge = { v, level, gaps, gap: 0, errors: 0, words: [], queue: [], done: false, typed: 0, typing: true, shown: -1 };
  $('forgeTitle').innerHTML = `🔨 Forja · Nível ${level} <span class="muted">— ${D.niveis.forja.descr[level - 1]}</span>`;
  $('forgeDone').innerHTML = ''; $('forge').classList.remove('result');
  renderLives();
  $('hammerBtn').style.display = opts.forge === 'sempressa' ? 'none' : '';
  clearStrip(); renderScroll();
}
export function renderScroll() {
  const f = curForge, t = f.v.texto, n = Math.floor(f.typed);
  let html = '', c = 0;
  for (let i = 0; i < f.gaps.length; i++) {
    const g = f.gaps[i];
    if (n <= g.pos) break;
    const cls = i < f.gap ? 'done' : i === f.gap ? 'active' : '';
    html += t.slice(c, g.pos) + `<span class="gap ${cls}" id="gap${i}" style="min-width:${Math.max(4, g.certa.length + 1)}ch">${g.certa}</span>`;
    c = g.pos + g.certa.length;
  }
  html += t.slice(c, Math.max(c, n));
  if (f.typing) html += '<span class="caret">▍</span>';
  $('scroll').innerHTML = `<div class="ref">${f.v.ref}</div>${html}`;
  f.shown = n;
  if (!f.done) $('forgeInfo').textContent = f.typing ? 'Lendo…' : `Lacuna ${f.gap + 1} de ${f.gaps.length} · erros: ${f.errors}`;
}
export function clearStrip() {
  const s = $('strip'), f = curForge;
  s.querySelectorAll('.w').forEach(e => e.remove());
  f.words = []; f.queue = [];
  s.classList.toggle('static', opts.forge === 'sempressa');
  $('zone').style.display = opts.forge === 'sempressa' ? 'none' : '';
  $('zone').style.width = (opts.forge === 'calma' ? 180 : 120) + 'px';
}
export function startStrip() {
  const s = $('strip'), f = curForge, lac = f.gaps[f.gap];
  clearStrip();
  if (opts.forge === 'sempressa') {
    shuffle([lac.certa, ...lac.distratores]).forEach(t => {
      const e = document.createElement('div'); e.className = 'w'; e.textContent = t;
      e.onclick = ev => { ev.stopPropagation(); judge(t, e); };
      s.appendChild(e);
    });
  }
}
export function forgeTick(dt) {
  const f = curForge; if (!f || f.done) return;
  if (f.typing) {
    const limit = f.gap < f.gaps.length ? f.gaps[f.gap].stop : f.v.texto.length;
    f.typed = Math.min(limit, f.typed + TYPE_SPEED * dt);
    f.gaps.forEach(g => { const end = g.pos + g.certa.length; if (f.typed > g.pos && f.typed < end) f.typed = end; }); // lacuna aparece inteira como espaço em branco
    if (f.typed >= limit) { f.typing = false; if (f.gap < f.gaps.length) startStrip(); else return finishForge(); }
    if (Math.floor(f.typed) !== f.shown || !f.typing) renderScroll();
    return;
  }
  if (opts.forge === 'sempressa') return;
  const s = $('strip'), W = s.clientWidth, speed = opts.forge === 'calma' ? 85 : 150, GAP = 190;
  f.words.forEach(w => { w.x -= speed * dt; w.el.style.left = w.x + 'px'; });
  f.words = f.words.filter(w => w.x > -150 || (w.el.remove(), false));
  const last = f.words[f.words.length - 1];
  if (!last || last.x < W + 40) {
    if (!f.queue.length) { const l = f.gaps[f.gap]; f.queue = shuffle([l.certa, ...l.distratores]); }
    const el = document.createElement('div'); el.className = 'w'; el.textContent = f.queue.shift(); s.appendChild(el);
    const x = last ? last.x + GAP : W + 60; el.style.left = x + 'px';
    f.words.push({ x, el, text: el.textContent });
  }
}
export function hammer() {
  const f = curForge; if (!f || f.done || f.typing) return;
  const W = $('strip').clientWidth, win = opts.forge === 'calma' ? 90 : 60;
  let best = null;
  f.words.forEach(w => { const d = Math.abs(w.x - W / 2); if (d <= win && (!best || d < best.d)) best = { d, w }; });
  judge(best ? best.w.text : null, best && best.w.el);
}
// martelada: reinicia a animação a cada toque (mesmo com toques rápidos seguidos)
export function strike(id) { const h = $(id); h.classList.remove('hit'); void h.getBoundingClientRect(); h.classList.add('hit'); }
// forjador: parado, em idle (respira, 4 quadros em loop); a cada martelada ergue (1), bate (2, com faíscas) e solta (3), e volta ao idle.
// No impacto pisca dourado (acertou a palavra) ou vermelho (errou)
let smithT = [];
function smithStrike(ok) {
  const el = $('smithF'); smithT.forEach(clearTimeout);
  const fr = n => { el.classList.remove('f1', 'f2', 'f3', 'idle'); el.classList.add(n ? 'f' + n : 'idle'); };
  fr(1);
  const say = $('smithSay'); // palavra em cima da cabeça dele: Certo! (dourado) ou Errado! (vermelho)
  smithT = [setTimeout(() => {
    fr(2); el.classList.remove('ok', 'bad'); void el.offsetWidth; el.classList.add(ok ? 'ok' : 'bad');
    say.textContent = ok ? 'Certo!' : 'Errado!'; say.className = 'smith-say'; void say.offsetWidth; say.classList.add(ok ? 'ok' : 'bad');
  }, 90),
    setTimeout(() => fr(3), 230), setTimeout(() => fr(0), 400),
    setTimeout(() => el.classList.remove('ok', 'bad'), 700)]; // tira o piscar ao fim dele: senão a animação dele trava o idle
}
export function judge(text, el) {
  const f = curForge, lac = f.gaps[f.gap];
  smithStrike(text === lac.certa);
  if (text === lac.certa) {
    sfx('hit'); const r = (el || $('strip')).getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 30, '#ffb347');
    f.gap++; f.typing = true;
    clearStrip(); renderScroll();
  } else {
    sfx('miss'); f.errors++; renderLives(true);
    if (f.errors >= FORGE_LIVES) { f.done = true; clearStrip(); setTimeout(() => forgeFail(f, true), 700); return; } // sem vidas: perde
    const s = $('strip'); s.classList.remove('shake'); void s.offsetWidth; s.classList.add('shake');
    renderScroll(); const g = $('gap' + f.gap); g && g.classList.add('blot');
  }
}
export function finishForge() {
  const f = curForge; f.done = true; renderScroll();
  $('forgeInfo').textContent = '';
  const m = D.niveis.forja;
  if (f.errors) return forgeFail(f);
  forgeWin(f);
}
// passou de nível: a mesma tela de resultado, mas de parabéns (métricas, o dano novo e o próximo passo)
function forgeWin(f) {
  if (curForge !== f) return;
  const p = progOf(f.v.id), m = D.niveis.forja;
  if (f.level > p.forja) { p.forja = f.level; saveProg(); }
  const n = f.gaps.length, last = f.level >= 3;
  $('forge').classList.add('result');
  $('forgeDone').innerHTML = `<div class="fres win">
    <h2>${last ? '✦ Versículo forjado! ✦' : `✓ Nível ${f.level} concluído!`}</h2>
    <p class="fres-ref">${f.v.ref} · Nível ${f.level}</p>
    <div class="fres-stats">
      <div class="fres-st ok"><b>${n}</b><span>acerto${n === 1 ? '' : 's'}</span></div>
      <div class="fres-st"><b>0</b><span>erros</span></div>
      <div class="fres-st ok"><b>100%</b><span>precisão</span></div>
    </div>
    <p class="fres-dano">Dano agora <b>×${verseMult(f.v.id)}</b> · ${m.nomes[p.forja - 1]}</p>
    <p class="muted">${last ? 'Você forjou o versículo inteiro, palavra por palavra. A lâmina está no máximo.' : `Parabéns, nenhuma palavra errada! Próximo nível: ${m.descr[f.level]}.`}</p>
    <div class="row fres-btns">
      <button onclick="show('menu')">← Voltar ao menu</button>
      ${last ? `<button class="primary" onclick="openVerse(byId['${f.v.id}'])">Ver o versículo</button>`
        : `<button class="primary" onclick="openForge(byId['${f.v.id}'], ${f.level + 1})">Nível ${f.level + 1} →</button>`}
    </div>
  </div>`;
  $('forgeDone').querySelector('.primary').focus();
  const r = $('forgeDone').querySelector('h2').getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 10, 50, '#ffd34d');
}
$('hammerBtn').onclick = e => { e.stopPropagation(); hammer(); };
$('strip').onclick = () => { if (opts.forge !== 'sempressa') hammer(); };

// errou alguma palavra: não passa de nível. A tela troca para só o resultado (some versículo, forjador e Martelar):
// quantas acertou, quantas errou, e Voltar ao menu / Tentar de novo
function forgeFail(f, dead = false) {
  if (curForge !== f) return; // saiu da forja antes
  const ok = dead ? f.gap : f.gaps.length, bad = f.errors, pct = Math.round(ok / (ok + bad) * 100);
  $('forge').classList.add('result');
  $('forgeDone').innerHTML = `<div class="fres">
    <h2>${dead ? 'Sem vidas' : 'Forja não concluída'}</h2>
    <p class="fres-ref">${f.v.ref} · Nível ${f.level}</p>
    <div class="fres-stats">
      <div class="fres-st ok"><b>${ok}</b><span>acerto${ok === 1 ? '' : 's'}</span></div>
      <div class="fres-st bad"><b>${bad}</b><span>erro${bad === 1 ? '' : 's'}</span></div>
      <div class="fres-st"><b>${pct}%</b><span>precisão</span></div>
    </div>
    <p class="muted">${dead ? `Você errou ${FORGE_LIVES} vezes e perdeu esta forja (${ok} de ${f.gaps.length} palavras acertadas). ` : ''}Acerte todas as palavras, sem nenhum erro, para passar de nível.</p>
    <div class="row fres-btns">
      <button onclick="show('menu')">← Voltar ao menu</button>
      <button class="primary" onclick="openForge(byId['${f.v.id}'], ${f.level})">↻ Tentar de novo</button>
    </div>
  </div>`;
  $('forgeDone').querySelector('.primary').focus();
}
