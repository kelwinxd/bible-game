import { barsHTML, dashDmg, found, progOf, saveProg, shieldMax, spiritLvl } from '../core/progress.js';
import { $, D } from '../core/utils.js';

export function renderList() {
  const vs = D.versiculos.filter(v => found.includes(v.id)), hidden = D.versiculos.length - vs.length;
  $('vlist').innerHTML = (vs.length ? '' : '<p class="muted">Nenhum versículo ainda. Quebre as pedras brilhantes na jornada para encontrá-los.</p>') + vs.map(v => `
    <div class="vitem" tabindex="0" onclick="openVerse(byId['${v.id}'])">
      <div><b>${v.ref}</b> <span class="tag">${D.temas[v.tema].nome}</span></div>
      <div class="vbars"><span>Forja ${barsHTML(progOf(v.id).forja, 'gold')}</span><span>Afiação ${barsHTML(progOf(v.id).afia, 'silver')}</span></div>
    </div>`).join('') + (vs.length && hidden ? `<p class="muted">🔒 ${hidden} versículo${hidden > 1 ? 's' : ''} ainda escondido${hidden > 1 ? 's' : ''} pelo caminho.</p>` : '');
  $('shieldInfo').innerHTML = `🛡 <b>${shieldMax}s</b>${shieldMax >= D.fe.escudoMax ? ' (máx.)' : ''}`;
  $('spiritInfo').innerHTML = `💨 dano <b>${dashDmg()}</b>${spiritLvl >= D.espirito.nivelMax ? ' (máx.)' : ''}`;
}
export function forgeAll() { D.versiculos.filter(v => found.includes(v.id)).forEach(v => { const p = progOf(v.id); p.forja = Math.max(1, p.forja); }); saveProg(); renderList(); }
