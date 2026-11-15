import { attack, startDash } from '../battle/combat.js';
import { JUMP, cv } from '../battle/config.js';
import { setPause, togglePeek, useVerse } from '../battle/hud.js';
import { B, keys } from '../battle/state.js';
import { escudoSom } from '../core/audio.js';
import { $ } from '../core/utils.js';
import { hammer } from '../forge/forge.js';
import { curSharp, pickSharp } from '../forge/sharpen.js';

// ---------- Entrada ----------
export function setShield(on) {
  if (!B) return escudoSom(false);
  if (on && (B.shieldLock || B.shieldE <= 0)) on = false;
  if (on && !B.shield) B.shieldAt = B.time; // começo da animação de erguer o escudo
  if (on !== !!B.shield) escudoSom(on); // o zumbido do escudo (escudo.mp3) em loop enquanto erguido
  B.shield = on; $('shieldBtn').classList.toggle('on', on);
  if (on && B.tut && B.tut.acido) B.tut.shielded = true; // tutorial: a dica do [J] (na cobra do ácido) some
}
export const sb = $('shieldBtn');
sb.addEventListener('pointerdown', e => { e.preventDefault(); sb.setPointerCapture(e.pointerId); setShield(true); });
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => sb.addEventListener(ev, () => setShield(false)));
// botão de ataque do HUD (o medalhão): o mesmo que apertar K
const ab = $('atkBtn');
ab.addEventListener('pointerdown', e => { e.preventDefault(); if (B && !B.paused) attack(); ab.classList.add('hit'); });
['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => ab.addEventListener(ev, () => ab.classList.remove('hit')));
// celular: setas e pulo por toque (seguram como as teclas A/D; o pulo é o mesmo do W)
const segurar = (id, tecla) => { const b = $(id); if (!b) return;
  b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); keys[tecla] = true; b.classList.add('on'); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => b.addEventListener(ev, () => { keys[tecla] = false; b.classList.remove('on'); })); };
segurar('tLeft', 'KeyA'); segurar('tRight', 'KeyD');
const tj = $('tJump');
if (tj) { tj.addEventListener('pointerdown', e => { e.preventDefault(); tj.classList.add('on'); if (B && !B.paused && B.hero.ground && !B.over && B.peek < 0) { B.hero.vy = -JUMP; B.hero.ground = false; } });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => tj.addEventListener(ev, () => tj.classList.remove('on'))); }
export const GAME_KEYS = ['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyJ', 'KeyK', 'KeyL', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'];
addEventListener('keydown', e => {
  if (B && GAME_KEYS.includes(e.code)) e.preventDefault();
  keys[e.code] = true;
  if (e.repeat) return;
  // Espaço ou K martelam (K = o mesmo botão do ataque na batalha); tira o foco de botão para não "clicar" nele junto
  if ($('forge').classList.contains('on') && (e.code === 'Space' || e.code === 'KeyK')) { e.preventDefault(); document.activeElement.blur(); hammer(); }
  if (curSharp && /^Digit[1-4]$/.test(e.code)) { const b = $('sharpOpts').children[+e.code.slice(5) - 1]; b && pickSharp(b); }
  if (B) {
    if (e.code === 'KeyP' && !B.over && B.peek < 0) { setPause(!B.paused); return; }
    if (e.code === 'Escape' || (e.code === 'Enter' && B.peek >= 0)) { e.preventDefault(); if (B.peek >= 0) togglePeek(B.peek); else if (B.paused) setPause(false); else if (!B.over && !B.fatal) setPause(true); return; } // Esc também pausa
    if (B.paused) return;
    if (['Space', 'KeyW', 'ArrowUp'].includes(e.code) && B.hero.ground && !B.over && B.peek < 0) { B.hero.vy = -JUMP; B.hero.ground = false; }
    if (e.code === 'KeyS' || e.code === 'ArrowDown' || e.code === 'KeyJ') setShield(true);
    if (e.code === 'KeyK') { attack(); ab.classList.add('hit'); } // o medalhão acende enquanto o K está apertado
    if (e.code === 'KeyL') startDash();
    const n = parseInt(e.key); if (n >= 1 && n <= 9) useVerse(n - 1);
  }
});
addEventListener('keyup', e => {
  keys[e.code] = false;
  if (B && GAME_KEYS.includes(e.code)) e.preventDefault();
  if (B && (e.code === 'KeyS' || e.code === 'ArrowDown' || e.code === 'KeyJ')) setShield(false);
  if (e.code === 'KeyK') ab.classList.remove('hit');
});
addEventListener('blur', () => { for (const k in keys) keys[k] = false; setShield(false); ab.classList.remove('hit'); });
cv.addEventListener('pointerdown', e => {
  if (!B) return; e.preventDefault();
  if (e.button === 2) setShield(true); else attack();
});
cv.addEventListener('pointerup', e => { if (e.button === 2) setShield(false); });
cv.addEventListener('contextmenu', e => e.preventDefault());
