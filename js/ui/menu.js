import { $ } from '../core/utils.js';

// Menu inicial: Jogar (mapa das jornadas) · Habilidades (forja) · Configurações; Configurações abre um painel no lugar da lista
const MENU_VIEWS = { main: 'menuMain', settings: 'menuSettings' };
export function showMenuView(view) {
  for (const k in MENU_VIEWS) $(MENU_VIEWS[k]).hidden = k !== view;
  const first = $(MENU_VIEWS[view]).querySelector('button.primary, button, input');
  if (first && document.activeElement && document.activeElement !== document.body) first.focus(); // navegando por teclado: foco vai junto
}
// Esc volta à lista principal
addEventListener('keydown', e => { if (e.code === 'Escape' && $('menu').classList.contains('on') && $('menuMain').hidden) showMenuView('main'); });

