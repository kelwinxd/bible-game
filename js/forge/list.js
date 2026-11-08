import { BASE_DMG } from '../battle/config.js';
import { barsHTML, dashDmg, faseMax, found, powerDur, progOf, saveProg, shieldMax, spiritLvl, verseMult } from '../core/progress.js';
import { $, D } from '../core/utils.js';
import { show } from '../ui/screens.js';

// cadeado em traço dourado (mesmo estilo dos ícones dos títulos)
const LOCK = '<svg class="i-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
// busca sem acento e sem maiúsculas: "exodo" acha "Êxodo", "espirito" acha "espírito"
const plain = s => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
export function renderList() {
  const vs = D.versiculos.filter(v => found.includes(v.id)), hidden = D.versiculos.length - vs.length;
  // tema: só os temas dos versículos já encontrados (mantém a escolha se ainda existir)
  const sel = $('vTema'), temas = [...new Set(vs.map(v => v.tema))], cur = temas.includes(sel.value) ? sel.value : '';
  sel.innerHTML = '<option value="">Todos os temas</option>' + temas.map(t => `<option value="${t}">${D.temas[t].nome}</option>`).join('');
  sel.value = cur;
  $('vtools').hidden = !vs.length;
  renderVerses(vs);
  $('vhidden').innerHTML = vs.length && hidden ? `${LOCK}${hidden} versículo${hidden > 1 ? 's' : ''} ainda escondido${hidden > 1 ? 's' : ''} pelo caminho.` : '';
  $('shieldInfo').innerHTML = `🛡 <b>${shieldMax}s</b>${shieldMax >= D.fe.escudoMax ? ' (máx.)' : ''}`;
  $('spiritInfo').innerHTML = `💨 dano <b>${dashDmg()}</b>${spiritLvl >= D.espirito.nivelMax ? ' (máx.)' : ''}`;
  renderHeroStats(vs);
  renderArmor(vs);
  renderHub(vs);
}
// lista filtrada pela busca (referência ou texto) e pelo tema; a altura da lista vem do CSS (ocupa a tela) e o resto rola
function renderVerses(vs = D.versiculos.filter(v => found.includes(v.id))) {
  const q = plain($('vSearch').value.trim()), tema = $('vTema').value;
  const shown = vs.filter(v => (!tema || v.tema === tema) && (!q || plain(v.ref + ' ' + v.texto).includes(q)));
  const list = $('vlist');
  list.innerHTML = !vs.length ? '<p class="muted">Nenhum versículo ainda. Derrube os ídolos de ouro na jornada para encontrá-los.</p>'
    : !shown.length ? '<p class="muted">Nenhum versículo com essa busca.</p>'
    : shown.map(v => `
    <div class="vitem" tabindex="0" onclick="openVerse(byId['${v.id}'])">
      <div><b>${v.ref}</b> <span class="tag">${D.temas[v.tema].nome}</span></div>
      <div class="vbars"><span>Forja ${barsHTML(progOf(v.id).forja, 'gold')}</span><span>Afiação ${barsHTML(progOf(v.id).afia, 'silver')}</span></div>
    </div>`).join('');
  list.scrollTop = 0;
}
$('vSearch').addEventListener('input', () => renderVerses());
$('vTema').addEventListener('change', () => renderVerses());
// painel do herói (à direita da lista): o que ele já conquistou — fé, Espírito, espada, Palavra e jornadas
function renderHeroStats(vs) {
  const fe = D.fe, feLvl = Math.round((shieldMax - fe.escudoBase) / fe.ganho), feMax = Math.round((fe.escudoMax - fe.escudoBase) / fe.ganho);
  const best = vs.length ? Math.max(...vs.map(v => 8 * verseMult(v.id))) : 0, longest = vs.length ? Math.max(...vs.map(v => powerDur(v.id))) : 0;
  const n = s => +s.toFixed(1); // 9.6, não 9.600000000000001
  const stat = (ico, nome, valor, detalhe, nivel, max, cls) => `
    <div class="hstat"><span class="hico" aria-hidden="true">${ico}</span>
      <div><b>${nome}</b><small>${detalhe}</small></div>
      <div class="hval">${valor}${max ? barsHTML(nivel, cls, max) : ''}</div></div>`;
  $('heroStats').innerHTML = '<h3>Templário</h3>' +
    stat('🛡', 'Fé', `${shieldMax}s`, 'escudo erguido', feLvl, feMax, 'gold') +
    stat('🕊', 'Espírito', `${dashDmg()}`, 'dano do impulso [L]', spiritLvl, D.espirito.nivelMax, 'gold') +
    stat('⚔', 'Espada', `${BASE_DMG}`, 'dano do golpe sem versículo') +
    stat('📖', 'Palavra', `${vs.length}/${D.versiculos.length}`, vs.length ? `até ${n(best)} de dano · ${longest}s de poder` : 'nenhum versículo ainda') +
    stat('🗺', 'Jornadas', `${Math.min(faseMax, D.fases.length)}/${D.fases.length}`, 'vencidas');
}
export function forgeAll() { D.versiculos.filter(v => found.includes(v.id)).forEach(v => { const p = progOf(v.id); p.forja = Math.max(1, p.forja); }); saveProg(); renderList(); }

// ---------- Vistas das Habilidades ----------
// hub = templário no centro + 3 entradas na frente; cada entrada abre uma vista isolada
const VIEWS = { hub: 'Habilidades', versos: 'Forjar versículos', fe: 'Exercitar a fé', armadura: 'Armadura' };
export function habView(v = 'hub') {
  if (!$('forgeList').classList.contains('on')) show('forgeList');
  $('forgeList').dataset.view = v;
  $('habTitle').textContent = VIEWS[v];
  $('habBack').textContent = v === 'hub' ? '← Menu' : '← Habilidades';
  if (v === 'versos') renderVerses(); // a altura da lista depende da vista estar visível
  document.activeElement && document.activeElement.blur(); // as setas recomeçam pelo botão principal da vista
  scrollTo(0, 0);
}
export const habBack = () => $('forgeList').dataset.view === 'hub' ? show('menu') : habView('hub');

// ---------- Armadura de Deus (Efésios 6:13-17) ----------
// cada peça é um card dos lados do templário; as que já têm efeito no jogo mostram o nível e abrem a vista que as melhora
const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ARMADURA = [
  { lado: 'L', nome: 'Capacete da salvação', ref: 'Ef 6:17', ico: '<path d="M5 20v-8a7 7 0 0 1 14 0v8z"/><path d="M5 14h14M12 5v15M9 17h6"/>' },
  { lado: 'L', nome: 'Couraça da justiça', ref: 'Ef 6:14', ico: '<path d="M6 4l3 2h6l3-2 2 5-3 2v9H7v-9L4 9z"/><path d="M12 6v14"/>' },
  { lado: 'L', nome: 'Cinto da verdade', ref: 'Ef 6:14', ico: '<path d="M3 10h18v4H3z"/><rect x="9.5" y="9" width="5" height="6" rx="1"/>' },
  { lado: 'R', nome: 'Escudo da fé', ref: 'Ef 6:16', ico: '<path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z"/><path d="M12 7.5v9M8.5 11h7"/>', vista: 'fe',
    info: () => { const fe = D.fe, n = Math.round((shieldMax - fe.escudoBase) / fe.ganho), m = Math.round((fe.escudoMax - fe.escudoBase) / fe.ganho); return { txt: `escudo de ${shieldMax}s [J]`, n, m }; } },
  { lado: 'R', nome: 'Espada do Espírito', ref: 'Ef 6:17', ico: '<path d="M14.5 3H21v6.5L9 21.5 2.5 15z"/><path d="M5 12l7 7M3 21l3-3"/>', vista: 'versos',
    info: vs => ({ txt: `${vs.filter(v => progOf(v.id).forja > 0).length} de ${vs.length} versículos forjados`, n: vs.length ? Math.max(...vs.map(v => progOf(v.id).forja)) : 0, m: 3 }) },
  { lado: 'R', nome: 'Calçados do evangelho', ref: 'Ef 6:15', ico: '<path d="M7 3v10l-3 3v4h16v-2l-6-3-2-4V3z"/><path d="M4 16h9"/>', vista: 'fe',
    info: () => ({ txt: `Impulso [L] · dano ${dashDmg()}`, n: spiritLvl, m: D.espirito.nivelMax }) },
];
function renderArmor(vs) {
  const card = a => {
    const i = a.info && a.info(vs);
    return `<button class="arm-card${i ? '' : ' locked'}" ${a.vista ? `onclick="habView('${a.vista}')"` : 'disabled'}>
      <span class="arm-ico">${SVG(a.ico)}</span>
      <span class="arm-txt"><b>${a.nome}</b><small>${a.ref}</small>
        <span class="arm-info">${i ? `${i.txt}${barsHTML(i.n, 'gold', i.m)}` : `${LOCK}Em breve`}</span></span>
    </button>`;
  };
  $('armL').innerHTML = ARMADURA.filter(a => a.lado === 'L').map(card).join('');
  $('armR').innerHTML = ARMADURA.filter(a => a.lado === 'R').map(card).join('');
}
// legenda de cada entrada do hub
function renderHub(vs) {
  $('hbVersos').textContent = `${vs.length} de ${D.versiculos.length} encontrados`;
  $('hbFe').textContent = `escudo ${shieldMax}s · impulso ${dashDmg()}`;
  $('hbArm').textContent = `${ARMADURA.filter(a => a.info).length} de ${ARMADURA.length} peças`;
}
