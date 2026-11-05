import { B } from '../battle/state.js';
import { $ } from '../core/utils.js';

// ---------- Navegação dos menus pelo teclado ----------
// Setas movem o foco para o botão mais próximo naquela direção; Enter ativa. Vale em toda tela,
// menos na batalha em andamento (lá as setas movem o herói) — na pausa e no fim da batalha vale.
export const NAV_SEL = 'button, .vitem, input[type=checkbox], select, summary';
export const NAV_DIR = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
export function navScope() {
  for (const id of ['pauseOverlay', 'endOverlay']) if ($(id).classList.contains('on')) return $(id);
  if (B && !B.over) return null; // batalha rodando
  return document.querySelector('.screen.on');
}
export const navItems = root => [...root.querySelectorAll(NAV_SEL)].filter(el => !el.disabled && el.offsetParent && el.getClientRects().length);
export function navMove(code) {
  const root = navScope(); if (!root) return false;
  const items = navItems(root); if (!items.length) return false;
  const cur = document.activeElement;
  if (!items.includes(cur)) { // primeira seta: foca o botão principal da tela (ou o primeiro item)
    const first = items.find(el => el.classList.contains('primary') || el.classList.contains('next')) || items[0];
    first.focus(); first.scrollIntoView({ block: 'nearest' }); return true;
  }
  const [dx, dy] = NAV_DIR[code], a = cur.getBoundingClientRect();
  const ax = a.left + a.width / 2, ay = a.top + a.height / 2;
  let best = null, bestScore = Infinity;
  for (const el of items) {
    if (el === cur) continue;
    const r = el.getBoundingClientRect(), vx = r.left + r.width / 2 - ax, vy = r.top + r.height / 2 - ay;
    const along = vx * dx + vy * dy, across = Math.abs(vx * dy - vy * dx);
    if (along <= 4) continue; // só o que está na direção da seta
    const score = along + across * 2;
    if (score < bestScore) { bestScore = score; best = el; }
  }
  if (best) { best.focus(); best.scrollIntoView({ block: 'nearest' }); }
  return true;
}
addEventListener('keydown', e => {
  const scope = navScope(), el = document.activeElement;
  if (!scope) return;
  if (NAV_DIR[e.code]) {
    // select: ← → trocam a opção, ↑ ↓ saem dele
    if (el && el.tagName === 'SELECT' && (e.code === 'ArrowLeft' || e.code === 'ArrowRight')) {
      e.preventDefault(); const n = el.options.length;
      el.selectedIndex = (el.selectedIndex + (e.code === 'ArrowRight' ? 1 : n - 1)) % n;
      el.dispatchEvent(new Event('change', { bubbles: true })); return;
    }
    e.preventDefault(); navMove(e.code);
  } else if (e.code === 'Enter' && el && scope.contains(el) && el.tagName !== 'BUTTON' && el.tagName !== 'SELECT' && el.tagName !== 'SUMMARY') {
    e.preventDefault(); el.click(); // .vitem e checkbox não ativam com Enter por padrão
  }
});
