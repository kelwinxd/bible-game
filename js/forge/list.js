import { BASE_DMG } from '../battle/config.js';
import { barsHTML, dashDmg, faseMax, found, powerDur, progOf, saveProg, shieldMax, spiritLvl, verseMult } from '../core/progress.js';
import { $, D } from '../core/utils.js';

// cadeado em traço dourado (mesmo estilo dos ícones dos títulos)
const LOCK = '<svg class="i-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
// busca sem acento e sem maiúsculas: "exodo" acha "Êxodo", "espirito" acha "espírito"
const plain = s => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const VISIBLE = 5; // a lista mostra até 5 versículos; a partir daí rola
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
}
// lista filtrada pela busca (referência ou texto) e pelo tema; com mais de 5, a altura trava no 5º e o resto rola
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
  const items = list.querySelectorAll('.vitem'), last = items[VISIBLE - 1];
  list.style.maxHeight = items.length > VISIBLE && last ? `${last.offsetTop + last.offsetHeight - items[0].offsetTop}px` : '';
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
