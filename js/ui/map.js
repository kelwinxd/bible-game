import { opts } from '../core/options.js';
import { faseMax } from '../core/progress.js';
import { $, D } from '../core/utils.js';
import { show } from './screens.js';

// ---------- Mapa das jornadas (tela Jogar) ----------
// Cada jornada é um ponto do mapa (data.js → fases[].mapa: x/y em %, icone, cor), ligados por uma trilha
// na ordem das fases. A trilha já percorrida (jornadas vencidas) é dourada; depois da última ela some na névoa.
// Em tela em pé o mapa gira: x e y trocam de lugar.

// Desenhos dos pontos (viewBox 0 0 100 100, dentro de um medalhão redondo). `u` = sufixo único dos ids dos degradês.
export const ICONES = {
  piramide: u => `
    <defs>
      <linearGradient id="ceu${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a0f0a"/><stop offset=".55" stop-color="#b8431a"/><stop offset="1" stop-color="#f0a040"/></linearGradient>
      <radialGradient id="sol${u}"><stop offset="0" stop-color="#fff2b0"/><stop offset=".4" stop-color="#ffc24d"/><stop offset="1" stop-color="#ff8a2a00"/></radialGradient>
    </defs>
    <rect width="100" height="100" fill="url(#ceu${u})"/>
    <circle cx="70" cy="58" r="22" fill="url(#sol${u})"/>
    <path d="M58 70 L74 50 L90 70Z" fill="#7a3414"/><path d="M74 50 L90 70 L80 70Z" fill="#4a1c0c"/>
    <path d="M14 72 L44 30 L74 72Z" fill="#c8682a"/><path d="M44 30 L74 72 L54 72Z" fill="#6e2a10"/>
    <path d="M44 30 L30 49 M44 30 L38 52 M36 41 L50 41 M31 54 L56 54 M25 62 L63 62" stroke="#8a3c16" stroke-width="1.2" fill="none"/>
    <path d="M0 74 Q25 64 50 72 T100 70 V100 H0Z" fill="#9a4a1c"/>
    <path d="M0 84 Q30 74 60 82 T100 80 V100 H0Z" fill="#6e3012"/>`,
  vale: u => `
    <defs>
      <linearGradient id="ceu${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1026"/><stop offset="1" stop-color="#2c3a62"/></linearGradient>
      <linearGradient id="nevoa${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb4d800"/><stop offset="1" stop-color="#9fb4d855"/></linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#ceu${u})"/>
    <circle cx="27" cy="24" r="9" fill="#e3ecff"/><circle cx="31" cy="21" r="8" fill="#141c3a"/>
    <circle cx="62" cy="14" r=".9" fill="#cfdcff"/><circle cx="78" cy="26" r=".7" fill="#cfdcff"/><circle cx="48" cy="30" r=".6" fill="#cfdcff"/>
    <path d="M-4 100 L-4 40 L14 28 L30 46 L44 82 L50 100Z" fill="#2a3560"/>
    <path d="M104 100 L104 34 L84 22 L70 42 L56 82 L50 100Z" fill="#232d54"/>
    <path d="M14 28 L22 38 L18 44Z M84 22 L76 32 L80 38Z" fill="#6a80b8"/>
    <path d="M14 28 L30 46 L44 82 M84 22 L70 42 L56 82" stroke="#8aa0d8" stroke-width="1.2" fill="none" opacity=".7"/>
    <rect y="58" width="100" height="42" fill="url(#nevoa${u})"/>
    <path d="M50 100 Q42 90 50 82 Q58 74 50 66" stroke="#c9b27a" stroke-width="2" stroke-dasharray="3 3" fill="none" opacity=".8"/>`,
  ruinas: u => `
    <defs><linearGradient id="ceu${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a14"/><stop offset="1" stop-color="#6a4028"/></linearGradient></defs>
    <rect width="100" height="100" fill="url(#ceu${u})"/>
    <path d="M24 78 V40 H34 V78Z M46 78 V30 H56 V78Z M68 78 V48 H78 V78Z" fill="#3a2418"/>
    <path d="M20 40 H38 V35 H20Z M42 30 H60 V25 H42Z" fill="#4a3020"/>
    <path d="M0 78 H100 V100 H0Z" fill="#2a1a12"/>`
};
// marcador "você está aqui": escudo do templário
const ESCUDO = `<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M2 2 H22 V12 C22 20 16 25 12 27 C8 25 2 20 2 12Z" fill="#f3e7d3" stroke="#3a2a20" stroke-width="1.5"/><path d="M12 5 V23 M5.5 11.5 H18.5" stroke="#b3261e" stroke-width="3.2"/></svg>`;

const portrait = () => matchMedia('(orientation: portrait)').matches;
// posição de uma jornada em % do mapa (girada em tela em pé)
const pos = f => portrait() ? [f.mapa.y, f.mapa.x] : [f.mapa.x, f.mapa.y];

// trilha suave passando pelos pontos (Catmull-Rom → Bézier), nas unidades do viewBox
function trail(pts) {
  return pts.slice(0, -1).map((p, i) => {
    const a = pts[i - 1] || p, b = pts[i + 1], c = pts[i + 2] || b;
    const c1 = [p[0] + (b[0] - a[0]) / 6, p[1] + (b[1] - a[1]) / 6], c2 = [b[0] - (c[0] - p[0]) / 6, b[1] - (c[1] - p[1]) / 6];
    return `M${p} C${c1} ${c2} ${b}`;
  });
}

export function renderMap() {
  const stage = $('mapStage'), P = portrait(), VW = P ? 90 : 160, VH = P ? 160 : 90;
  const fases = D.fases.filter(f => f.mapa), cur = Math.min(faseMax, fases.length - 1);
  const pts = fases.map(f => { const [x, y] = pos(f); return [x * VW / 100, y * VH / 100]; });
  // depois da última jornada a trilha segue (na direção do último trecho) e some na névoa: há mais por vir
  const L = pts[pts.length - 1], Pv = pts[pts.length - 2] || [L[0] - 20, L[1]];
  const d = Math.hypot(L[0] - Pv[0], L[1] - Pv[1]) || 1, ext = [L[0] + (L[0] - Pv[0]) / d * 40, L[1] + (L[1] - Pv[1]) / d * 40];
  const segs = trail([...pts, ext]);
  const svg = `<svg class="map-trail" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="fadeTrail" gradientUnits="userSpaceOnUse" x1="${L[0]}" y1="${L[1]}" x2="${ext[0]}" y2="${ext[1]}"><stop offset="0" stop-color="#c9a45c"/><stop offset="1" stop-color="#c9a45c00"/></linearGradient></defs>
    ${segs.map((s, i) => `<path d="${s}" class="${i === segs.length - 1 ? 'fog' : i < faseMax ? 'done' : ''}"/>`).join('')}
  </svg>`;
  const nodes = fases.map((f, i) => {
    const open = i <= faseMax || opts.all || D.jornadasLiberadas, won = i < faseMax, [x, y] = pos(f);
    const ico = (ICONES[f.mapa.icone] || ICONES.ruinas)(i);
    return `<button class="map-node${i === cur ? ' primary cur' : ''}${open ? '' : ' locked'}${won ? ' won' : ''}" style="left:${x}%;top:${y}%;--c:${f.mapa.cor || '#c9a45c'}"
      ${open ? '' : 'disabled title="Vença a jornada anterior"'} onclick="startBattle(${i})" aria-label="Jornada ${i + 1}: ${f.nome}${open ? '' : ' (trancada)'}">
      ${i === cur ? `<span class="here">${ESCUDO}</span>` : ''}
      <span class="medal"><svg viewBox="0 0 100 100" aria-hidden="true">${ico}</svg>${open ? '' : '<span class="lock">🔒</span>'}${won ? '<span class="seal">✓</span>' : ''}</span>
      <span class="cap"><small>Jornada ${i + 1}</small><b>${f.nome}</b></span>
    </button>`;
  }).join('');
  stage.innerHTML = svg + nodes;
}

// Esc volta ao menu; girar a tela redesenha (x e y trocam)
addEventListener('keydown', e => { if (e.code === 'Escape' && $('mapa').classList.contains('on')) show('menu'); });
matchMedia('(orientation: portrait)').addEventListener('change', () => { if ($('mapa').classList.contains('on')) renderMap(); });
$('optAll').addEventListener('change', () => { if ($('mapa').classList.contains('on')) renderMap(); });
