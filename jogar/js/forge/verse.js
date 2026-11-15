import { barsHTML, powerDur, progOf, saveProg } from '../core/progress.js';
import { $, D } from '../core/utils.js';
import { curForge } from './forge.js';
import { curSharp } from './sharpen.js';
import { show } from '../ui/screens.js';
import { burst } from '../ui/sparks.js';

// ---------- Tela do versículo (Forja + Afiação, 3 níveis cada) ----------
export let curVerse = null;
export const lvlState = (done, n) => n <= done ? 'done' : n === done + 1 ? 'next' : 'locked';
export function openVerse(v) {
  show('verse'); curVerse = v;
  const p = progOf(v.id), N = D.niveis;
  const track = (kind, title, sub, done, descr, onclick, barCls) => `
    <div class="track">
      <div class="track-head"><b>${title}</b> ${barsHTML(done, barCls)} <span class="muted">${sub}</span></div>
      <div class="lvls">${descr.map((d, i) => {
        const st = lvlState(done, i + 1);
        return `<button class="lvl ${st}" ${st === 'locked' ? 'disabled' : ''} onclick="${onclick}(byId['${v.id}'], ${i + 1})">
          <span>${st === 'done' ? '✓' : st === 'locked' ? '🔒' : '▶'} Nível ${i + 1}</span><small>${d}</small></button>`;
      }).join('')}</div>
    </div>`;
  const dano = p.forja ? `dano ×${N.forja.mult[p.forja - 1]} (${N.forja.nomes[p.forja - 1]})` : 'ainda não forjado — não pode ser usado na batalha';
  $('verseBody').innerHTML = `
    <h2 style="margin-bottom:4px">${v.ref} <span class="tag">${D.temas[v.tema].nome}</span></h2>
    <p class="muted" style="margin-top:0">Só passa para o próximo nível quem acerta tudo.</p>
    ${track('forja', '🔨 Forja', '— aumenta o dano · ' + dano, p.forja, N.forja.descr, 'openForge', 'gold')}
    ${track('afia', '🗡 Afiação', `— aumenta a duração do poder · ${powerDur(v.id)}s`, p.afia, N.afiacao.descr, 'openSharpen', 'silver')}
    <div class="row" style="margin-top:14px"><button onclick="toggleStudy()">📖 Estudar o texto</button></div>
    <div class="scroll" id="study" style="display:none;margin-top:10px"><div class="ref">${v.ref}</div>${v.texto}</div>`;
}
// "← Versículo" das telas de Forja/Afiação
export function backToVerse() { openVerse(curSharp ? curSharp.v : curForge ? curForge.v : curVerse); }
export function toggleStudy() { const s = $('study'); s.style.display = s.style.display === 'none' ? '' : 'none'; }
// tela de resultado comum à Forja e à Afiação
export function levelResult(elId, kind, v, level, errors, extra) {
  const passed = errors === 0, p = progOf(v.id);
  if (passed && level > p[kind]) { p[kind] = level; saveProg(); }
  const next = passed && level < 3;
  extra = passed && extra ? extra() : ''; // mensagem montada depois de salvar o progresso
  const open = kind === 'forja' ? 'openForge' : 'openSharpen';
  $(elId).innerHTML = `<div class="${passed ? 'pass' : 'fail'}">${passed ? `✓ Nível ${level} concluído!` : `✗ ${errors} erro${errors === 1 ? '' : 's'} — acerte tudo para passar de nível.`} ${extra}</div>
    <div class="row" style="margin-top:10px">
      <button onclick="${open}(byId['${v.id}'], ${level})">↻ Refazer</button>
      ${next ? `<button class="primary" onclick="${open}(byId['${v.id}'], ${level + 1})">Nível ${level + 1} →</button>` : ''}
      <button ${next ? '' : 'class="primary"'} onclick="openVerse(byId['${v.id}'])">Voltar ao versículo</button>
    </div>`;
  if (passed) { const r = $(elId).getBoundingClientRect(); burst(r.left + 60, r.top + 10, 40, kind === 'forja' ? '#ffd34d' : '#dfe8f0'); }
}
