import { B, setB } from '../battle/state.js';
import { log } from '../core/log.js';
import { treino } from '../core/progress.js';
import { pararMusica } from '../core/musica.js';
import { escudoSom } from '../core/audio.js';
import { $ } from '../core/utils.js';
import { clearForge } from '../forge/forge.js';
import { renderList } from '../forge/list.js';
import { clearSharp } from '../forge/sharpen.js';
import { renderMap } from './map.js';
import { showMenuView } from './menu.js';

// ---------- Telas ----------
// saiu de uma jornada no meio (menu, mapa, recomeçar ou fechou a página): onde parou (% da fase) e há quanto tempo jogava
export const ondeParou = () => ({ fase: B.fase.id, progresso: Math.round(Math.min(1, Math.max(0, B.hero.x / B.fase.comprimento)) * 100), segundos: Math.round(B.time), zona: B.zona || 'fase' });
addEventListener('pagehide', () => { if (B && !B.over && !B.fase.dev) log('jornada_abandonada', { ...ondeParou(), fechou: true }, true); });

export function show(id) {
  if (B && !B.over && !B.fase.dev) log('jornada_abandonada', ondeParou()); // trocou de tela no meio da jornada
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
  $('endOverlay').classList.remove('on');
  $('pauseOverlay').classList.remove('on');
  if (id === 'battle') window.Radio?.suspender(); else { window.Radio?.retomar(); pararMusica(); } // fora da jornada: para a música da fase // rádio só nos menus (nas jornadas, as músicas de cada fase)
  if (id !== 'battle') treino.on = false; // saiu do treino: os poderes voltam a ser os do progresso salvo
  if (id === 'forgeList') renderList();
  if (id === 'menu') showMenuView('main');
  if (id === 'mapa') renderMap();
  if (id !== 'forge') clearForge();
  if (id !== 'sharpen') clearSharp();
  if (id !== 'battle') { setB(null); escudoSom(false); } // saiu da batalha: o loop do escudo para
}
