import { addFire, balloonY } from './combat.js';
import { CALLOUT_T, WRONG_COLOR, WRONG_T } from './config.js';
import { B, keys } from './state.js';
import { bossAlive, giantLieY } from './boss.js';
import { flyToCard, restoreLie } from './world.js';
import { acertoSfx, sfx } from '../core/audio.js';
import { gradeIdx, powerDur, runeHTML, verseMult } from '../core/progress.js';
import { $, D } from '../core/utils.js';
import { setShield } from '../input/controls.js';

export const tema = v => D.temas[v.tema]; // cores do tema do versículo
// "1 Coríntios 10:13" → "1Co 10:13" (livro sem abreviação cadastrada: 2 primeiras letras)
export const abrevRef = ref => { const m = ref.match(/^(.+) (\d+:\d+.*)$/); return m ? `${D.abrev[m[1]] || m[1].slice(0, 2)} ${m[2]}` : ref; };
export function buildHotbar() {
  $('hotbar').innerHTML = !B.deck.length ? '<div class="deck-empty">Nenhum versículo — derrube os ídolos de ouro para encontrar a Palavra</div>' : B.deck.map((v, i) => `
    <div class="card" id="card${i}" style="--tc:${tema(v).cor}" title="${v.ref}">
      <button class="use" id="use${i}" onclick="useVerse(${i})">
        <span class="k">${i + 1}</span>
        <span class="r">${runeHTML(gradeIdx(v.id))}<span class="full">${v.ref}</span><span class="ab">${abrevRef(v.ref)}</span></span>
        <span class="cd" id="cd${i}"></span>
      </button>
      <button class="eye" id="eye${i}" title="Ler o versículo" onclick="togglePeek(${i})">👁</button>
    </div>`).join('');
  $('peek').classList.remove('on');
}
// ---------- Pausa (P) ----------
export const halted = () => B && (B.peek >= 0 || B.paused);
export function setPause(on) {
  if (!B || (on && B.over)) return;
  B.paused = on; setShield(false);
  if (!on) document.activeElement.blur(); // foco de teclado não fica preso num botão da pausa
  for (const k in keys) keys[k] = false;
  $('pauseOverlay').classList.toggle('on', on);
  showPauseView('main');
}
// telas do menu de pausa: 'main' (opções), 'list' (ataques/versículos), 'controls'
export const PAUSE_VIEWS = { main: ['pauseMain', 'Pausado'], list: ['pauseList', 'Ataques (versículos)'], controls: ['pauseControls', 'Controles'], settings: ['pauseSettings', 'Configurações'] };
export function showPauseView(view) {
  for (const [k, [id]] of Object.entries(PAUSE_VIEWS)) $(id).style.display = k === view ? '' : 'none';
  $('pauseBack').style.display = view === 'main' ? 'none' : '';
  $('pauseTitle').textContent = PAUSE_VIEWS[view][1];
  document.querySelector('.pause-body').scrollTop = 0;
  if (view === 'list') $('pauseVerses').innerHTML = B.deck.map((v, i) =>
    `<div class="pv"><b><span class="muted" style="font-family:system-ui">${i + 1}</span>${runeHTML(gradeIdx(v.id))}${v.ref} <span class="muted" style="font-family:system-ui;font-size:13px">· dano ×${verseMult(v.id)} · poder ${powerDur(v.id)}s</span></b>${v.texto}</div>`).join('');
}
// reveal = versículo recém-conquistado: pergaminho dourado; ao fechar, o livro voa até o card
export function togglePeek(i, reveal = false) {
  B.peek = B.peek === i ? -1 : i;
  B.deck.forEach((_, k) => $('eye' + k).classList.toggle('on', k === B.peek));
  const v = B.deck[B.peek];
  $('peek').classList.toggle('on', !!v);
  $('peek').classList.toggle('gold', !!v && reveal);
  if (v) $('peek').innerHTML = `<div class="parch${reveal ? ' reveal' : ''}" onclick="event.stopPropagation()">
      <button class="x" title="Fechar (Esc)" onclick="closePeek()">✕</button>
      ${reveal ? '<div class="newv">✦ NOVO VERSÍCULO ✦</div>' : ''}
      <div class="pref">${v.ref}</div>${v.texto}
      <div class="tag">Jogo pausado · ✕${reveal ? ', Enter' : ''} ou Esc para ${reveal ? 'continuar' : 'voltar'}</div>
    </div>`;
  if (!v && B.pendingFly) { const f = B.pendingFly; B.pendingFly = null; flyToCard(f.b, f.i); }
}
// a barra de versículos fica recolhida no botão ⚔📖; as teclas 1–9 funcionam com ela aberta ou fechada
export function closePeek() { if (B && B.peek >= 0) togglePeek(B.peek); }
export function toggleDeck(open) {
  const h = $('hotbar'), on = open ?? h.classList.contains('closed');
  h.classList.toggle('closed', !on); $('deckBtn').classList.toggle('open', on);
  $('deckState').textContent = on ? '▸ fechar' : '◂ abrir'; // cards abrem para a esquerda do botão
}
export function useVerse(i) {
  if (!B || B.over || B.fatal || B.trans > 0 || B.paused) return;
  if (B.peek >= 0) togglePeek(B.peek); // escolher um versículo fecha a leitura e despausa
  const v = B.deck[i]; if (!v || (B.cd[i] || 0) > 0) return;
  const G = B.boss && bossAlive(B.boss) && B.boss.lie && B.boss.lie.ideal.includes(v.id) ? B.boss : null; // chefões também mentem (Golias, Naja)
  const target = B.demons.find(d => d.lie && d.lie.ideal.includes(v.id)) || G; // pode refutar já na entrada
  // versículo errado: não revela o nome, só "Versículo errado" em vermelho, e trava TODOS os cards por 2,5s
  if (!target) { sfx('wrong'); B.deck.forEach((_, k) => B.cd[k] = 2.5); B.callout = { s: 'Versículo errado', t: WRONG_T, dur: WRONG_T, c: WRONG_COLOR }; addFire(-1); return; }
  if (B.tut) B.tut.refuted = true;
  B.callout = { s: v.ref, t: CALLOUT_T, dur: CALLOUT_T, c: tema(v) }; // referência certa aparece na cor do tema acima do herói
  if (!acertoSfx()) sfx('refute'); // o som do escudo, mais agudo
  // a mentira continua visível até o demônio morrer; o balão só ganha um brilho na cor do versículo
  B.fx.push({ burst: true, x: Math.min(B.cam + 900, Math.max(B.cam + 60, target.x)), y: target.kind ? giantLieY(target) - 30 : balloonY(target) - 30, t: .25, c: tema(v) });
  target.vuln = true; target.lastVerse = v;
  if (B.power && B.power.target !== target && B.power.target.hp > 0) restoreLie(B.power.target);
  B.power = { t: powerDur(v.id), dur: powerDur(v.id), target, v, mult: verseMult(v.id) };
}
