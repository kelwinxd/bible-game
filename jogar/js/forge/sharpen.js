import { sfx } from '../core/audio.js';
import { opts } from '../core/options.js';
import { powerDur, progOf, saveProg } from '../core/progress.js';
import { log } from '../core/log.js';
import { $, D, shuffle } from '../core/utils.js';
import { show } from '../ui/screens.js';
import { burst } from '../ui/sparks.js';

// ---------- Afiação ----------
// Quiz sobre o versículo; as opções ficam paradas nos blocos e uma mancha de tinta corre pela faixa:
// o jogador ESCOLHE a resposta (clique ou 1–4: só marca) e AFIA com o botão Afiar ou K/Espaço (como o Martelar da forja) quando a
// mancha está na mira. Afiar fora da mira ou com a opção errada = erro; afiar sem escolher nada só avisa.
// Nível 1: autor · Nível 2: contexto histórico · Nível 3: contexto da passagem.
export let curSharp = null;
export const clearSharp = () => { curSharp = null; };
export function openSharpen(v, level = 1) {
  show('sharpen');
  // nível 1: "quem escreveu?" + pergunta sorteada sobre a pessoa do autor (completa 2)
  const qs = level === 1 ? [...v.afiacao[0], ...shuffle(D.autores[v.autor].perguntas).slice(0, 2 - v.afiacao[0].length)] : v.afiacao[level - 1];
  curSharp = { v, level, qs, i: 0, errors: 0, x: -40, done: false };
  $('sharpTitle').innerHTML = `🗡 Afiação · Nível ${level} <span class="muted">— ${D.niveis.afiacao.descr[level - 1]}</span>`;
  $('sharpDone').innerHTML = ''; $('sharpen').classList.remove('result'); $('sharpBtn').style.display = '';
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
    `<button data-o="${o.replace(/"/g, '&quot;')}" onclick="selectSharp(this)"><span class="k">${k + 1}</span>${o}</button>`).join('');
  $('sharpInfo').textContent = `Erros: ${s.errors}` + (opts.forge === 'sempressa' ? ' · escolha e afie' : ' · escolha a resposta e afie [K] com a mancha na mira');
}
export function sharpTick(dt) {
  const s = curSharp; if (!s || s.done || opts.forge === 'sempressa') return;
  const W = $('sharpStrip').clientWidth, speed = opts.forge === 'calma' ? 140 : 250;
  s.x += speed * dt; if (s.x > W + 40) s.x = -40;
  $('stain').style.left = s.x + 'px';
}
// o afiador (style/forge.css → .smith-sprite.afia): afia em loop; errou = a careta (4 quadros, uma vez) piscando vermelho e volta
// a afiar; acertou = pisca dourado. Em cima da cabeça: Certo! (dourado) ou Errado! (vermelho)
let afiaT = null;
new Image().src = 'assets/sprites/forge/afiador-errou.webp'; // já carregada antes do 1º erro (senão a careta aparecia vazia enquanto baixava)
function afiadorReage(ok) {
  const el = $('smithS'), say = $('smithSayS'); clearTimeout(afiaT);
  el.classList.remove('ok', 'errou'); void el.offsetWidth; el.classList.add(ok ? 'ok' : 'errou');
  afiaT = setTimeout(() => el.classList.remove('ok', 'errou'), ok ? 650 : 720); // volta a afiar exatamente quando a careta acaba
  say.textContent = ok ? 'Certo!' : 'Errado!'; say.className = 'smith-say'; void say.offsetWidth; say.classList.add(ok ? 'ok' : 'bad');
}
export function sharpError(btn, msg) {
  const s = curSharp; s.errors++; sfx('miss'); afiadorReage(false); // o afiador erra: careta, pisca vermelho, "Errado!"
  const st = $('sharpStrip'); st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake');
  if (btn) { btn.classList.add('bad'); setTimeout(() => btn.classList.remove('bad'), 400); }
  $('sharpInfo').textContent = `${msg} · erros: ${s.errors}`;
}
/** marca a resposta (clique ou 1–4): ainda não conta — quem decide é o Afiar */
export function selectSharp(btn) {
  const s = curSharp; if (!s || s.done || !btn) return;
  [...$('sharpOpts').children].forEach(b => b.classList.toggle('sel', b === btn)); sfx('whoosh');
  $('sharpInfo').textContent = `Erros: ${s.errors}` + (opts.forge === 'sempressa' ? ' · afie [K]' : ' · afie [K] com a mancha na mira');
}
/** o botão Afiar / K / Espaço: afia com a resposta marcada */
export function afiar() {
  const s = curSharp; if (!s || s.done) return;
  const b = $('sharpOpts').querySelector('button.sel');
  if (!b) { $('sharpInfo').textContent = `Escolha uma resposta (1–4) · erros: ${s.errors}`; return; }
  pickSharp(b);
}
export function pickSharp(btn) {
  const s = curSharp; if (!s || s.done) return;
  if (opts.forge !== 'sempressa') {
    const W = $('sharpStrip').clientWidth, win = opts.forge === 'calma' ? 60 : 40;
    if (Math.abs(s.x - W / 2) > win) return sharpError(null, 'Fora da mira');
  }
  const q = s.qs[s.i];
  if (btn.dataset.o !== q.certa) return sharpError(btn, 'Resposta errada');
  sfx('hit'); afiadorReage(true); // o afiador acerta: pisca dourado (sem parar de afiar), "Certo!"
  const r = btn.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 24, '#dfe8f0');
  s.i++;
  // acerto: mancha vira prata, faixa pisca amarelo e fica um pouco mais prateada
  const st = $('sharpStrip'), stain = $('stain');
  st.style.setProperty('--p', Math.round(s.i / s.qs.length * 100) + '%');
  st.classList.remove('flash'); void st.offsetWidth; st.classList.add('flash');
  stain.classList.add('silver'); clearTimeout(s.silverT);
  if (s.i < s.qs.length) s.silverT = setTimeout(() => stain.classList.remove('silver'), 700);
  if (s.i < s.qs.length) return renderSharp();
  s.done = true; $('sharpOpts').innerHTML = ''; $('sharpInfo').textContent = ''; $('sharpBtn').style.display = 'none'; // acabou: some o Afiar (como o Martelar no resultado da forja)
  $('sharpQ').innerHTML = `<div class="ref">${s.v.ref}</div>${s.v.texto}`;
  sharpResult(s);
}

$('sharpBtn').onclick = e => { e.stopPropagation(); afiar(); };

// fim da afiação: a tela troca para só o resultado (como na forja — some a pergunta, o afiador e o Afiar): acertos, erros e precisão.
// Sem erros passa de nível (o poder dura mais) e oferece o próximo; com erros, Tentar de novo
function sharpResult(s) {
  if (curSharp !== s) return;
  const v = s.v, n = s.qs.length, bad = s.errors, passou = bad === 0, last = s.level >= 3, p = progOf(v.id), pct = Math.round(n / (n + bad) * 100);
  if (passou && s.level > p.afia) { p.afia = s.level; saveProg(); log('versiculo_afiado', { verso: v.id, nivel: s.level }); }
  if (!passou) log('afiacao_errou', { verso: v.id, nivel: s.level, erros: bad });
  const descr = D.niveis.afiacao.descr;
  $('sharpen').classList.add('result');
  $('sharpDone').innerHTML = `<div class="fres${passou ? ' win' : ''}">
    <h2>${passou ? (last ? '✦ Lâmina afiada! ✦' : `✓ Nível ${s.level} concluído!`) : 'Afiação não concluída'}</h2>
    <p class="fres-ref">${v.ref} · Nível ${s.level} · ${descr[s.level - 1]}</p>
    <div class="fres-stats">
      <div class="fres-st ok"><b>${n}</b><span>acerto${n === 1 ? '' : 's'}</span></div>
      <div class="fres-st${bad ? ' bad' : ''}"><b>${bad}</b><span>erro${bad === 1 ? '' : 's'}</span></div>
      <div class="fres-st${passou ? ' ok' : ''}"><b>${pct}%</b><span>precisão</span></div>
    </div>
    ${passou ? `<p class="fres-dano">O poder agora dura <b>${powerDur(v.id)}s</b></p>
    <p class="muted">${last ? 'Você conhece o autor, a história e a passagem. A lâmina está no máximo.' : `Parabéns, nenhuma resposta errada! Próximo nível: ${descr[s.level]}.`}</p>`
      : '<p class="muted">Responda todas as perguntas sem nenhum erro (e com a mancha na mira) para passar de nível.</p>'}
    <div class="row fres-btns">
      <button onclick="show('menu')">← Voltar ao menu</button>
      ${!passou ? `<button class="primary" onclick="openSharpen(byId['${v.id}'], ${s.level})">↻ Tentar de novo</button>`
        : last ? `<button class="primary" onclick="openVerse(byId['${v.id}'])">Ver o versículo</button>`
        : `<button class="primary" onclick="openSharpen(byId['${v.id}'], ${s.level + 1})">Nível ${s.level + 1} →</button>`}
    </div>
  </div>`;
  $('sharpDone').querySelector('.primary').focus();
  if (passou) { const r = $('sharpDone').querySelector('h2').getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 10, 50, '#dfe8f0'); }
}
