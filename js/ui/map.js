import { opts } from '../core/options.js';
import { abertaBase, venceu } from '../core/progress.js';
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
  // As Pragas: céu roxo, sol amarelo doentio atrás de uma nuvem de gafanhotos/piolhos, obelisco e uma rã na água roxa
  pragas: u => `
    <defs>
      <linearGradient id="ceu${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e0a33"/><stop offset=".55" stop-color="#5a2382"/><stop offset="1" stop-color="#c79a2a"/></linearGradient>
      <radialGradient id="sol${u}"><stop offset="0" stop-color="#fff6a0"/><stop offset=".45" stop-color="#f2cc3a"/><stop offset="1" stop-color="#f2cc3a00"/></radialGradient>
    </defs>
    <rect width="100" height="100" fill="url(#ceu${u})"/>
    <circle cx="36" cy="44" r="24" fill="url(#sol${u})"/>
    <path d="M0 30 Q20 22 40 30 T80 26 T100 30 V36 Q80 32 60 36 T20 34 T0 38Z" fill="#8a4ab8" opacity=".55"/>
    <g fill="#2a1406">
      <ellipse cx="22" cy="40" rx="2.2" ry="1.1" transform="rotate(-15 22 40)"/><ellipse cx="30" cy="34" rx="1.8" ry=".9"/><ellipse cx="41" cy="38" rx="2.4" ry="1.2" transform="rotate(10 41 38)"/>
      <ellipse cx="48" cy="46" rx="1.7" ry=".9"/><ellipse cx="34" cy="50" rx="2" ry="1" transform="rotate(-20 34 50)"/><ellipse cx="55" cy="36" rx="1.6" ry=".8"/>
      <ellipse cx="62" cy="44" rx="2.1" ry="1" transform="rotate(15 62 44)"/><ellipse cx="26" cy="54" rx="1.5" ry=".8"/><ellipse cx="45" cy="56" rx="1.9" ry=".9"/>
      <ellipse cx="70" cy="38" rx="1.5" ry=".7"/><ellipse cx="18" cy="48" rx="1.4" ry=".7"/><ellipse cx="52" cy="28" rx="1.4" ry=".7"/>
    </g>
    <g stroke="#f2d860" stroke-width=".5" opacity=".7"><path d="M21 39 l-2 -2 M40 37 l-2 -2.5 M61 43 l-2 -2 M33 49 l-2 -2"/></g>
    <path d="M74 74 L77 30 L80 26 L83 30 L86 74Z" fill="#3a1a52"/><path d="M80 26 L83 30 L86 74 L81 74Z" fill="#24102f"/>
    <path d="M0 72 Q25 64 50 70 T100 68 V100 H0Z" fill="#c8962a"/>
    <path d="M0 82 Q30 74 60 82 T100 80 V100 H0Z" fill="#4a1e6a"/>
    <path d="M10 88 Q30 84 50 88 T90 87" stroke="#9a62c8" stroke-width="1" fill="none" opacity=".7"/>
    <g transform="translate(24 76)"><ellipse cx="0" cy="3" rx="7" ry="4" fill="#d8b23a"/><circle cx="-4" cy="-1" r="2.2" fill="#d8b23a"/><circle cx="4" cy="-1" r="2.2" fill="#d8b23a"/>
      <circle cx="-4" cy="-1.3" r=".9" fill="#2a1406"/><circle cx="4" cy="-1.3" r=".9" fill="#2a1406"/></g>`,
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
  zigurate: u => `
    <defs>
      <linearGradient id="ceu${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1840"/><stop offset=".6" stop-color="#c0602a"/><stop offset="1" stop-color="#f0b050"/></linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#ceu${u})"/>
    <path d="M20 26 Q16 16 22 10 Q20 18 26 22Z M80 30 Q76 18 82 12 Q80 22 86 26Z" fill="#2a1a1a" opacity=".55"/>
    <path d="M18 76 H82 V66 H74 V56 H66 V46 H58 V36 H42 V46 H34 V56 H26 V66 H18Z" fill="#c8862e"/>
    <path d="M50 36 V76 M42 46 H58 M34 56 H66 M26 66 H74" stroke="#7a4a16" stroke-width="1.4" fill="none"/>
    <path d="M47 76 V64 H53 V76Z" fill="#3a2a5a"/>
    <path d="M0 76 H100 V100 H0Z" fill="#8a5a24"/><path d="M0 86 Q30 80 60 86 T100 84 V100 H0Z" fill="#2a6a8a"/>`,
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

// Fundo geográfico (unidades do mapa deitado: 160×90, oeste à esquerda, norte em cima): pergaminho com textura, o Mar
// Grande, o Nilo e o delta, o Sinai entre os braços do Mar Vermelho, o Jordão e o Mar Morto em Canaã, o Eufrates e o Tigre
// até o golfo. Em pé, o mapa é transposto (x ↔ y), como as posições das jornadas.
const GEO = `
  <defs>
    <filter id="geoPapel" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="7" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 .78  0 0 0 0 .62  0 0 0 0 .38  0 0 0 .22 0"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
    <filter id="geoManchas" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3"/>
      <feColorMatrix type="matrix" values="0 0 0 0 .1  0 0 0 0 .06  0 0 0 0 .03  0 0 0 1.4 -.55"/>
    </filter>
    <linearGradient id="geoMar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2c35"/><stop offset="1" stop-color="#24394a"/></linearGradient>
  </defs>
  <rect width="160" height="90" fill="#4a3522"/>
  <rect width="160" height="90" fill="#6a4c2e" filter="url(#geoPapel)"/>
  <path d="M0 0 H62 Q60 6 57 10 Q54 15 52 22 Q50 29 46 34 Q40 37 34 37 Q30 39 27 37 Q20 35 12 37 Q6 38 0 37Z" fill="url(#geoMar)"/>
  <path d="M46 49 Q48 57 51 62 L58 74 L63 90 H76 L70 79 Q64 70 61 64 Q59 58 58 50 Q56 55 55 59 Q51 55 48 48Z" fill="url(#geoMar)"/>
  <path d="M141 90 Q146 82 151 79 Q156 77 160 76 V90Z" fill="url(#geoMar)"/>
  <g fill="none" stroke-linecap="round">
    <path d="M58 37 Q56 52 59 62" stroke="#c9a45c55" stroke-width=".5" stroke-dasharray="1 1.4"/>
    <path d="M22 90 Q26 78 27 68 Q29 56 30 47 Q30 43 29 40 M30 47 Q33 43 35 39 M30 47 Q27 43 24 39 M30 47 Q30 42 30 38" stroke="#4f7488" stroke-width=".6"/>
    <path d="M57 14 Q58 20 57 26 Q57 29 57 31" stroke="#4f7488" stroke-width=".4"/>
    <path d="M78 6 Q86 14 96 26 Q106 40 116 52 Q126 63 138 72 Q144 76 146 80" stroke="#4f7488" stroke-width=".7"/>
    <path d="M100 4 Q106 18 112 30 Q120 44 128 56 Q134 66 140 72" stroke="#4f7488" stroke-width=".55"/>
  </g>
  <ellipse cx="57" cy="33" rx=".9" ry="2.4" fill="#2c4352"/>
  <g fill="#7a5a36" opacity=".55">
    <path d="M24 64 l2 -3 l2 3Z M27 66 l1.4 -2 l1.4 2Z"/>
    <path d="M60 18 q2 -3 4 0 q2 -3 4 0 M64 26 q2 -3 4 0 M70 20 q2 -3 4 0" fill="none" stroke="#7a5a36" stroke-width=".5"/>
    <path d="M48 66 q2 -2.6 4 0 q2 -2.6 4 0 M50 72 q2 -2.6 4 0" fill="none" stroke="#7a5a36" stroke-width=".5"/>
  </g>
  <g fill="none" stroke="#8a6a3a55" stroke-width=".25" stroke-dasharray=".8 1.6">
    <path d="M40 90 Q41 70 44 56 Q46 46 50 40"/>
    <path d="M66 0 Q68 30 70 50 Q74 70 78 90"/>
  </g>
  <rect width="160" height="90" filter="url(#geoManchas)"/>
`;
// nomes das regiões (posição em % do mapa deitado; em pé, transpostos como tudo) — escritos à parte para não espelhar
const REGIOES = [
  { t: 'Mar Grande', x: 16, y: 18, mar: true }, { t: 'Egito', x: 13, y: 78 }, { t: 'Gósen', x: 31, y: 58, peq: true },
  { t: 'Sinai', x: 33, y: 74, peq: true }, { t: 'Mar Vermelho', x: 41, y: 90, mar: true, peq: true }, { t: 'Canaã', x: 41, y: 16 },
  { t: 'Deserto da Arábia', x: 57, y: 64 }, { t: 'Eufrates', x: 63, y: 30, rio: true, peq: true }, { t: 'Babilônia', x: 82, y: 72 }
];
const fasePorId = id => D.fases.find(f => f.id === id);

export function renderMap() {
  const stage = $('mapStage'), P = portrait(), VW = P ? 90 : 160, VH = P ? 160 : 90;
  const fases = D.fases.filter(f => f.mapa);
  const aberta = f => abertaBase(f) || opts.all || D.jornadasLiberadas;
  const cur = fases.find(f => aberta(f) && !venceu(f.id)) || fases[fases.length - 1]; // o escudo: a próxima a jogar
  const pt = f => { const [x, y] = pos(f); return [x * VW / 100, y * VH / 100]; };
  // trilhas: de cada jornada até as que ela abre (data.js → abre); dourada se já vencida. Depois da última, segue e some na névoa
  const arestas = fases.flatMap(f => (f.abre || []).map(id => fasePorId(id)).filter(Boolean).map(o => ({ a: o, b: f })));
  const L = fases[fases.length - 1], Lp = pt(L), Pv = (arestas.find(e => e.b === L) || {}).a, Pp = Pv ? pt(Pv) : [Lp[0] - 20, Lp[1]];
  const d = Math.hypot(Lp[0] - Pp[0], Lp[1] - Pp[1]) || 1, ext = [Lp[0] + (Lp[0] - Pp[0]) / d * 30, Lp[1] + (Lp[1] - Pp[1]) / d * 30];
  // as duas do Egito (começo) ficam ligadas por uma trilha curta
  const inicio = fases.filter(f => !f.abre), laco = inicio.length > 1 ? trail(inicio.map(pt)) : [];
  const curva = (p, q) => { const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2 - Math.abs(q[0] - p[0]) * .08; return `M${p} Q${mx},${my} ${q}`; };
  const svg = `<svg class="map-trail" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="fadeTrail" gradientUnits="userSpaceOnUse" x1="${Lp[0]}" y1="${Lp[1]}" x2="${ext[0]}" y2="${ext[1]}"><stop offset="0" stop-color="#c9a45c"/><stop offset="1" stop-color="#c9a45c00"/></linearGradient></defs>
    ${laco.map(s => `<path d="${s}" class="${inicio.every(f => venceu(f.id)) ? 'done' : ''}"/>`).join('')}
    ${arestas.map(e => `<path d="${curva(pt(e.a), pt(e.b))}" class="${venceu(e.a.id) ? 'done' : ''}"/>`).join('')}
    <path d="M${Lp} L${ext}" class="fog"/>
  </svg>`;
  const geo = `<svg class="map-geo" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="none" aria-hidden="true"><g${P ? ' transform="matrix(0 1 1 0 0 0)"' : ''}>${GEO}</g></svg>`;
  const nomes = REGIOES.map(r => { const [x, y] = P ? [r.y, r.x] : [r.x, r.y]; return `<span class="map-reg${r.mar ? ' mar' : ''}${r.rio ? ' rio' : ''}${r.peq ? ' peq' : ''}" style="left:${x}%;top:${y}%">${r.t}</span>`; }).join('');
  const nodes = fases.map(f => {
    const i = D.fases.indexOf(f), open = aberta(f), won = venceu(f.id), [x, y] = pos(f);
    const ico = (ICONES[f.mapa.icone] || ICONES.ruinas)(i), req = (f.abre || []).map(id => (fasePorId(id) || {}).nome).filter(Boolean).join(' ou ');
    return `<button class="map-node${f === cur ? ' primary cur' : ''}${open ? '' : ' locked'}${won ? ' won' : ''}" style="left:${x}%;top:${y}%;--c:${f.mapa.cor || '#c9a45c'}"
      ${open ? '' : `disabled title="Vença ${req}"`} onclick="startBattle(${i})" aria-label="Jornada ${i + 1}: ${f.nome}${open ? '' : ' (trancada)'}">
      ${f === cur ? `<span class="here">${ESCUDO}</span>` : ''}
      <span class="medal"><svg viewBox="0 0 100 100" aria-hidden="true">${ico}</svg>${open ? '' : '<span class="lock">🔒</span>'}${won ? '<span class="seal">✓</span>' : ''}</span>
      <span class="cap"><small>Jornada ${i + 1}</small><b>${f.nome}</b></span>
    </button>`;
  }).join('');
  stage.innerHTML = geo + nomes + svg + nodes;
}

// Esc volta ao menu; girar a tela redesenha (x e y trocam)
addEventListener('keydown', e => { if (e.code === 'Escape' && $('mapa').classList.contains('on')) show('menu'); });
matchMedia('(orientation: portrait)').addEventListener('change', () => { if ($('mapa').classList.contains('on')) renderMap(); });
$('optAll').addEventListener('change', () => { if ($('mapa').classList.contains('on')) renderMap(); });
