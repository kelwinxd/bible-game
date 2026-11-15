import { setB } from '../battle/state.js';
import { treino } from '../core/progress.js';
import { escudoSom } from '../core/audio.js';
import { $ } from '../core/utils.js';
import { clearForge } from '../forge/forge.js';
import { renderList } from '../forge/list.js';
import { clearSharp } from '../forge/sharpen.js';
import { renderMap } from './map.js';
import { showMenuView } from './menu.js';

// ---------- Telas ----------
export function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
  $('endOverlay').classList.remove('on');
  $('pauseOverlay').classList.remove('on');
  if (id === 'battle') window.Radio?.suspender(); else window.Radio?.retomar(); // rádio só nos menus (nas jornadas, as músicas de cada fase)
  if (id !== 'battle') treino.on = false; // saiu do treino: os poderes voltam a ser os do progresso salvo
  if (id === 'forgeList') renderList();
  if (id === 'menu') showMenuView('main');
  if (id === 'mapa') renderMap();
  if (id !== 'forge') clearForge();
  if (id !== 'sharpen') clearSharp();
  if (id !== 'battle') { setB(null); escudoSom(false); } // saiu da batalha: o loop do escudo para
}
