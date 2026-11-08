import { heroDies, renderFires } from './combat.js';
import { FIRE_MAX, GROUND, IDOL, cv } from './config.js';
import { buildHotbar, toggleDeck, togglePeek } from './hud.js';
import { B, setB } from './state.js';
import { sfx, stoneSfx } from '../core/audio.js';
import { opts } from '../core/options.js';
import { faseMax, found, markFound, shieldMax } from '../core/progress.js';
import { $, D, byId, rand, reduced } from '../core/utils.js';
import { show } from '../ui/screens.js';
import { burst, sp } from '../ui/sparks.js';

// Jornada fi (data.js → fases): o herói começa só com os versículos achados nas jornadas anteriores e encontra
// os novos em pedras brilhantes pelo caminho. all = true (teste): começa já com todos os versículos.
export const ROCK_HP = 3; // golpes para quebrar a pedra
export function startBattle(fi = Math.min(faseMax, D.fases.length - 1), all = opts.all) {
  show('battle');
  const fase = D.fases[fi];
  const prev = D.fases.slice(0, fi).flatMap(f => f.eventos.filter(e => e.tipo === 'pedra' && found.includes(e.verso)).map(e => byId[e.verso]));
  setB({
    fase, faseIdx: fi,
    hp: 100, demons: [], fireballs: [], slashes: [], fx: [], floats: [], shards: [], embers: [], shake: 0,
    shield: false, power: null, deck: all ? D.versiculos.slice() : prev, cd: {}, peek: -1, usedLies: [], shieldE: shieldMax, shieldLock: false, dashCd: 0, dashBack: 0, dashQueued: false, ghosts: [], fire: all ? FIRE_MAX : 0, notice: fase.dica && !all ? { lines: fase.dica, t: 7, c: '#9fc3ff' } : null,
    tut: all || fi > 0 ? null : { refuted: false, attacked: false, shielded: false, killed: false, done: false }, // tutorial só na 1ª jornada normal
    hero: { x: 200, y: 0, vy: 0, face: 1, anim: 'idle', at: 0, hurt: 0, swing: 0, hitDone: true, ground: true, safe: null, dash: 0, dashHit: null },
    time: 0, trans: 0, fatal: null, over: false,
    cam: 0, arena: null, holes: [], terrain: [], platforms: [], rocks: [], books: [], groups: []
  });
  // y do mundo: 0 = chão normal, negativo = mais alto, positivo = mais baixo, Infinity = buraco
  fase.eventos.forEach(e => {
    if (e.tipo === 'buraco' || e.tipo === 'mar') { B.holes.push({ x: e.x, w: e.w, mar: e.tipo === 'mar' }); B.terrain.push({ x: e.x + 18, w: e.w - 36, top: Infinity }); }
    else if (e.tipo === 'terreno') B.terrain.push({ x: e.x, w: e.w, top: -e.altura });
    else if (e.tipo === 'plataforma') B.platforms.push({ x: e.x, w: e.w, top: -e.altura });
    else if (e.tipo === 'inimigos') B.groups.push({ ...e, done: false });
  });
  // pedras ficam apoiadas no que estiver embaixo delas (chão, terreno alto/baixo ou plataforma)
  fase.eventos.filter(e => e.tipo === 'pedra').forEach(e => {
    const base = Math.min(terrainTop(e.x), ...B.platforms.filter(pl => e.x > pl.x && e.x < pl.x + pl.w).map(pl => pl.top));
    B.rocks.push({ x: e.x, base, v: byId[e.verso], hp: ROCK_HP, maxHp: ROCK_HP, flash: 0 });
  });
  buildHotbar(); toggleDeck(false); renderFires(); B.trans = 1.8;
}
export const terrainTop = x => { const t = B.terrain.find(t => x >= t.x && x < t.x + t.w); return t ? t.top : 0; };
// chão sob o herói: terreno, ou plataforma se ele estiver em cima dela (plataformas deixam passar por baixo)
export function floorAt(h) {
  let f = terrainTop(h.x);
  for (const pl of B.platforms) if (h.x > pl.x - 10 && h.x < pl.x + pl.w + 10 && h.y <= pl.top + 1 && pl.top < f) f = pl.top;
  return f;
}
// parede: terreno mais alto que os pés na frente do herói bloqueia (precisa pular)
export const HERO_HW = 22;
export function moveX(h, nx) {
  const dir = Math.sign(nx - h.x);
  return dir && terrainTop(nx + dir * HERO_HW) < h.y - 6 ? h.x : nx;
}
export const rockBox = r => [r.x - 62, GROUND + r.base - 155, r.x + 62, GROUND + r.base];
// distância mínima entre inimigos (~3 larguras de demônio) para os balões de mentira não se sobreporem
export const ENEMY_GAP = 270;
// vaga k (0 = mais à direita): entram em fila já espaçados e param a ENEMY_GAP um do outro
export function makeDemon(type, k, vidaMult, n = 1) {
  const s = D.inimigos[type], hp = Math.round(s.vida * vidaMult), cam = B.arena ? B.arena.left : B.cam;
  return {
    type, s, hp, maxHp: hp, lieFlash: 0, x: cam + 1000 + (n - 1 - k) * ENEMY_GAP, y: s.chao ? GROUND : 200,
    tx: cam + 900 - k * ENEMY_GAP, state: 'enter', timer: s.cadencia, arm: 0, strikeAnim: 0,
    lie: null, myLie: null, lastVerse: null, vuln: false, flash: 0, bob: Math.random() * 6, face: -1
  };
}
// ídolo (bezerro de ouro): 3 golpes (ou rasgos) derrubam; de dentro salta o livro dourado com o versículo
export function hitRock(r) {
  r.hp--; r.flash = .12;
  // som de construção: trinca a cada golpe (mais forte quanto mais rachado); no último, desaba
  if (r.hp > 0) stoneSfx('crack', 1 - r.hp / r.maxHp); else stoneSfx('collapse');
  const n = reduced ? 4 : 10;
  for (let k = 0; k < n; k++) B.shards.push({ x: r.x + (Math.random() - .5) * 80, y: GROUND + r.base - 60 - Math.random() * 70, vx: (Math.random() - .5) * 320, vy: -Math.random() * 320, r: Math.random() * 6, t: .7, c: '214,160,60' });
  if (r.hp > 0) return;
  sfx('refute');
  // o bezerro desmorona: cada pedaço cai com gravidade, gira, quica uma vez e assenta no entulho (ou no chão, se cair fora do pedestal)
  const { sc, foot, cx } = IDOL, gy = GROUND + r.base;
  r.pieces = IDOL.pieces.map(([sx, sy, w, h, px, py], i) => {
    const x = r.x + (px + w / 2 - cx) * sc, onBase = px + w / 2 > 30 && px + w / 2 < 390;
    return { sx, sy, w, h, x, y: gy - (foot - py - h / 2) * sc, vx: Math.sign(x - r.x || 1) * (30 + Math.random() * 70), vy: -60 - Math.random() * 120,
      a: 0, va: (Math.random() - .5) * (h > 150 ? 3 : 8), floor: gy - (onBase ? (52 + (i % 3) * 8) * sc : 0), rest: false };
  });
  for (let k = 0; k < n * 2; k++) B.shards.push({ x: r.x + (Math.random() - .5) * 110, y: GROUND + r.base - Math.random() * 140, vx: (Math.random() - .5) * 520, vy: -Math.random() * 480, r: Math.random() * 6, t: 1, c: k % 3 ? '170,120,50' : '255,214,90' });
  B.books.push({ x: r.x, y: GROUND + r.base - 90, restY: GROUND + r.base - 100, vy: -420, t: 0, v: r.v });
}
export function stepIdol(r, dt) {
  r.pieces.forEach(p => {
    if (p.rest) return;
    p.vy += 1500 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.va * dt;
    const hh = p.h * IDOL.sc / 2;
    if (p.y + hh >= p.floor) {
      p.y = p.floor - hh;
      if (p.vy > 220) { p.vy *= -.3; p.vx *= .5; p.va *= .4; }
      else Object.assign(p, { vy: 0, vx: 0, va: 0, rest: true });
    }
  });
}
// tocar no livro (ou passar por ele) adiciona o versículo ao HUD
export function collectBook(b) {
  b.got = true; sfx('hit');
  B.callout = { s: b.v.ref, t: 1.8, dur: 1.8, c: { cor: '#f2c84b', brilho: '#ffd34d' } };
  B.floats.push({ x: b.x, y: b.y - 40, t: 1.4, s: 'Novo versículo!', c: '#ffe08a' });
  markFound(b.v.id);
  if (B.deck.includes(b.v)) return;
  B.deck.push(b.v); buildHotbar();
  B.pendingFly = { b, i: B.deck.length - 1 };
  togglePeek(B.deck.length - 1, true);
}
// um livro voa da fase até o card novo e solta faíscas douradas no HUD
export function flyToCard(b, i) {
  const card = $('card' + i); if (!card) return;
  const r = cv.getBoundingClientRect(), c = card.getBoundingClientRect();
  const sx = r.left + (b.x - B.cam) * r.width / 960, sy = r.top + b.y * r.height / 540;
  const tx = c.left + c.width / 2, ty = c.top + c.height / 2;
  card.style.visibility = 'hidden';
  const el = document.createElement('div'); el.className = 'flybook'; el.textContent = '📖';
  el.style.left = sx + 'px'; el.style.top = sy + 'px'; document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transform = `translate(${tx - sx}px, ${ty - sy}px) scale(.6)`; }));
  setTimeout(() => {
    el.remove(); card.style.visibility = '';
    card.classList.remove('newcard'); void card.offsetWidth; card.classList.add('newcard');
    burst(tx, ty, 36, '#f2c84b'); sfx('refute');
  }, 750);
}
export function fallInHole(h) {
  const mar = B.holes.find(o => o.mar && h.x > o.x - 20 && h.x < o.x + o.w + 20);
  if (mar) for (let k = 0; k < (reduced ? 6 : 16); k++) // espirro d'água onde ele afundou
    B.shards.push({ x: h.x + (Math.random() - .5) * 60, y: GROUND + 20, vx: (Math.random() - .5) * 260, vy: -150 - Math.random() * 300, r: Math.random() * 6, t: .8, c: '214,232,240', sz: .4 + Math.random() * .5 });
  const sp = h.safe || { x: 200, y: 0 }; h.x = sp.x; h.y = sp.y; h.vy = 0; // volta ao último ponto firme
  sfx('hurt'); if (!opts.god) B.hp = Math.max(0, B.hp - 10); h.hurt = .3;
  B.floats.push({ x: h.x, y: GROUND - 250, t: 1, s: mar ? 'Caiu no mar! -10' : 'Caiu! -10', c: '#ff5a4a' });
  if (B.hp <= 0) heroDies();
}
// Cada demônio carrega uma única mentira do seu tema até morrer; o próximo traz outra ainda não usada.
export function pickLie(d) {
  const ofType = D.mentiras.filter(m => m.tipo === d.type && m.ideal.some(id => B.deck.some(v => v.id === id)));
  const fresh = ofType.filter(m => !B.usedLies.includes(m));
  if (!fresh.length) B.usedLies = B.usedLies.filter(m => m.tipo !== d.type); // repertório esgotado: recomeça
  d.myLie = (d.frase && D.mentiras.find(m => m.texto === d.frase)) || rand(fresh.length ? fresh : ofType.length ? ofType : D.mentiras.filter(m => m.tipo === d.type));
  B.usedLies.push(d.myLie);
  restoreLie(d);
}
// depois do poder acabar, o balão volta com a mesma mentira
export function restoreLie(d) { d.lie = d.myLie; d.vuln = false; }
