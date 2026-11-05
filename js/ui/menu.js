import { opts } from '../core/options.js';
import { faseMax } from '../core/progress.js';
import { $, D } from '../core/utils.js';

// Menu inicial: Jogar · Habilidades (forja) · Configurações; Jogar e Configurações abrem um painel no lugar da lista
const MENU_VIEWS = { main: 'menuMain', play: 'menuPlay', settings: 'menuSettings' };
export function showMenuView(view) {
  for (const k in MENU_VIEWS) $(MENU_VIEWS[k]).hidden = k !== view;
  if (view === 'play') renderJourneys();
  const first = $(MENU_VIEWS[view]).querySelector('button.primary, button, input');
  if (first && document.activeElement && document.activeElement !== document.body) first.focus(); // navegando por teclado: foco vai junto
}
// Esc volta à lista principal
addEventListener('keydown', e => { if (e.code === 'Escape' && $('menu').classList.contains('on') && $('menuMain').hidden) showMenuView('main'); });

// Jogar: um botão por jornada; as ainda trancadas aparecem com 🔒 (data.js → jornadasLiberadas ou o teste "tudo liberado" abrem todas)
export function renderJourneys() {
  const cur = Math.min(faseMax, D.fases.length - 1);
  $('journeys').innerHTML = D.fases.map((f, i) => {
    const open = i <= faseMax || opts.all || D.jornadasLiberadas;
    return `<button class="${i === cur ? 'primary' : ''}" ${open ? '' : 'disabled title="Vença a jornada anterior"'} onclick="startBattle(${i})">${open ? '' : '🔒 '}Jornada ${i + 1}<small>${f.nome}</small></button>`;
  }).join('');
}
$('optAll').addEventListener('change', renderJourneys);
renderJourneys();
