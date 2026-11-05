import { setB } from '../battle/state.js';
import { $ } from '../core/utils.js';
import { clearForge } from '../forge/forge.js';
import { renderList } from '../forge/list.js';
import { clearSharp } from '../forge/sharpen.js';

// ---------- Telas ----------
export function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
  $('endOverlay').classList.remove('on');
  $('pauseOverlay').classList.remove('on');
  if (id === 'forgeList') renderList();
  if (id !== 'forge') clearForge();
  if (id !== 'sharpen') clearSharp();
  if (id !== 'battle') setB(null);
}
