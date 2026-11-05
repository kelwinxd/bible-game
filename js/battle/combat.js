import { BASE_DMG, DASH_BACK_WIN, DASH_CD, DASH_T, FATAL_SPIRIT_T, FATAL_T, FIRE_MAX, GROUND, SWING } from './config.js';
import { halted, tema } from './hud.js';
import { B } from './state.js';
import { hitRock, rockBox } from './world.js';
import { fatalSound, sfx } from '../core/audio.js';
import { opts } from '../core/options.js';
import { dashDmg } from '../core/progress.js';
import { $, D, reduced, rgbOf } from '../core/utils.js';

export function balloonY(d) { return d.s.sprite ? d.y - 262 : d.s.chao ? d.y - 230 : d.y - 90; }

// caixas de colisão
export const heroBox = h => [h.x - 30, GROUND + h.y - 160, h.x + 30, GROUND + h.y]; // acompanha o templário menor
export function demonBox(d) {
  if (d.s.chao) return [d.x - 45, d.y - 200, d.x + 45, d.y];
  const fy = Math.sin(d.bob * 2) * 10;
  return [d.x - 50, d.y + fy - 70, d.x + 50, d.y + fy + 60];
}
export const overlap = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];

// o golpe sai para onde o herói está virado (não segue o mouse)
export function attack() {
  const h = B && B.hero;
  if (!h || B.over || B.fatal || B.shield || h.swing > 0 || halted()) return;
  h.swing = SWING; h.hitDone = false; h.anim = 'attack'; h.at = 0;
}
export function renderFires(changed = -1, cls = '') {
  [...$('dashFires').children].forEach((f, k) => {
    f.classList.toggle('on', k < B.fire);
    if (k === changed) { f.classList.remove('pop', 'lose'); void f.offsetWidth; f.classList.add(cls); }
  });
  $('dashBtn').classList.toggle('locked', B.fire < 1);
  $('dashBtn').classList.toggle('full', B.fire >= FIRE_MAX); // impulso duplo disponível
}
export function addFire(n) {
  const before = B.fire; B.fire = Math.max(0, Math.min(FIRE_MAX, B.fire + n));
  if (B.fire === before) return;
  renderFires(n > 0 ? B.fire - 1 : B.fire, n > 0 ? 'pop' : 'lose');
  if (n > 0 && B.fire === 1 && !B.dashTold) { B.dashTold = true; B.notice = { lines: ['Impulso do Espírito liberado!', 'Aperte [L] para avançar atravessando os inimigos'], t: 4.5, c: '#7fd8ff' }; sfx('beam'); }
  else if (B.fire === FIRE_MAX) { B.notice = { lines: ['Impulso duplo! 3 fogos acesos', 'Aperte [L] [L] rápido: vai e volta atravessando'], t: 4.5, c: '#7fd8ff' }; sfx('beam'); }
}
export function startDash() {
  const h = B && B.hero;
  if (!h || B.over || B.fatal || B.shield || B.paused || halted()) return;
  if (B.fire < 1) { // bloqueado: precisa de ao menos 1 fogo
    sfx('wrong'); B.notice = { lines: ['Impulso bloqueado: nenhum fogo aceso', 'Derrote inimigos para acender os fogos do Espírito'], t: 2.5, c: '#7fd8ff' };
    return;
  }
  const back = B.fire >= FIRE_MAX && B.dashBack > 0; // 2º toque do impulso duplo
  if (h.dash > 0) { if (back) B.dashQueued = true; return; } // apertou L L durante o 1º: volta assim que ele acabar
  if (B.dashCd > 0 && !back) return;
  if (back) { h.faceAfter = h.face; h.face = -h.face; B.dashBack = 0; } // volta pelo mesmo caminho e depois encara a frente de novo
  else B.dashBack = B.fire >= FIRE_MAX ? DASH_T + DASH_BACK_WIN : 0;
  h.dash = DASH_T; h.dashHit = new Set(); h.swing = 0; h.vy = 0; B.dashCd = DASH_CD; // recarga conta a partir do último
  sfx('whoosh'); sfx('beam');
}
// durante o impulso: fere quem o herói atravessa (uma vez por impulso) e acerta a pedra
export function dashHits(h) {
  const box = [h.x - 55, GROUND + h.y - 210, h.x + 55, GROUND + h.y - 10];
  B.demons.forEach(d => {
    if (d.state === 'dead' || d.state === 'enter' || h.dashHit.has(d) || !overlap(box, demonBox(d))) return;
    h.dashHit.add(d); sfx('slash'); damageDemon(d, true);
    B.fx.push({ burst: true, x: d.x, y: GROUND + h.y - 120, t: .25, c: { cor: '#4fc3ff', claro: '#d8f4ff', brilho: '#3ab4ff' } });
  });
  B.rocks.forEach(r => { if (r.hp > 0 && !h.dashHit.has(r) && overlap(box, rockBox(r))) { h.dashHit.add(r); hitRock(r); } });
}
export function damageDemon(d, impulso = false) {
  const P = B.power, powered = !impulso && P && P.target === d;
  const dmg = impulso ? dashDmg() : powered ? 8 * P.mult : BASE_DMG;
  d.hp -= dmg; d.flash = .15;
  const b = demonBox(d);
  B.floats.push({ x: d.x, y: b[1] - 20, t: .8, s: dmg.toFixed(dmg % 1 ? 1 : 0), c: impulso ? '#9fe4ff' : powered ? tema(P.v).claro : '#bbb' });
  if (d.hp <= 0) startFatal(d, impulso ? null : d.lastVerse, impulso);
  return powered;
}
// Com o poder ativo, o golpe vira um rasgo de luz que voa reto (horizontal) para onde o herói está virado,
// na altura em que ele está — no chão ou no ar durante o pulo. Sem diagonais por enquanto.
export function launchSlash() {
  const h = B.hero, x = h.x + h.face * 50, y = GROUND + h.y - 140;
  B.slashes.push({ x, y, vx: h.face * 900, vy: 0, ang: h.face > 0 ? 0 : Math.PI, hit: new Set(), trail: [], c: tema(B.power.v) });
  sfx('beam');
}
export function swingHit() {
  const h = B.hero;
  if (B.power) return launchSlash();
  const reach = h.face > 0 ? [h.x + 10, h.x + 145] : [h.x - 145, h.x - 10];
  const box = [reach[0], GROUND + h.y - 215, reach[1], GROUND + h.y - 30];
  let any = false;
  B.demons.forEach(d => {
    if (d.state === 'dead' || d.state === 'enter' || !overlap(box, demonBox(d))) return;
    any = true; sfx('slash'); damageDemon(d);
  });
  B.rocks.forEach(r => { if (r.hp > 0 && overlap(box, rockBox(r))) { any = true; hitRock(r); } });
  if (!any) sfx('whoosh');
}

export function heroDies() { B.over = true; B.hero.deadAt = B.time; setTimeout(() => endScreen(false), 1400); } // dá tempo de ver a queda
export function hitHero(dmg) {
  if (B.over || B.hero.dash > 0) return; // atravessando no impulso: intocável
  if (B.shield) { sfx('block'); B.fx.push({ ring: true, t: .3 }); return; }
  sfx('hurt'); if (!opts.god) B.hp -= dmg; B.hero.hurt = .3;
  B.floats.push({ x: B.hero.x, y: GROUND + B.hero.y - 250, t: .9, s: '-' + dmg, c: '#ff5a4a' });
  if (B.hp <= 0) { B.hp = 0; heroDies(); }
}
// derrota: o demônio pisca branco, estoura em pedaços e faíscas (tempo real, mesmo na câmera lenta) e a tela treme
export function explodeDemon(d) {
  const b = demonBox(d), cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, tc = d.lastVerse ? tema(d.lastVerse) : D.temas.tentacao;
  const n = reduced ? 24 : 46, body = rgbOf(d.s.cor);
  d.pop = .12; d.flash = 1; B.shake = reduced ? .12 : .35; // movimento reduzido: tremor curtinho
  B.fx.push({ boom: true, x: cx, y: cy, t: .45, c: tc });
  const cols = ['255,240,190', '255,190,70', '255,120,30', rgbOf(tc.cor)];
  for (let k = 0; k < n; k++) { // faíscas
    const a = Math.random() * Math.PI * 2, v = 250 + Math.random() * 650;
    B.embers.push({ x: cx + (Math.random() - .5) * 40, y: cy + (Math.random() - .5) * 60, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 150, t: .5 + Math.random() * .5, max: 1, c: cols[k % cols.length] });
  }
  for (let k = 0; k < (reduced ? 8 : 14); k++) // pedaços do corpo
    B.shards.push({ x: cx + (Math.random() - .5) * 70, y: cy + (Math.random() - .5) * 120, vx: (Math.random() - .5) * 700, vy: -200 - Math.random() * 500, r: Math.random() * 6, t: .9, c: body, sz: 1.4 + Math.random() * 1.2 });
}
export function startFatal(d, v, espirito = false) {
  d.state = 'dead'; d.lie = null; fatalSound(); explodeDemon(d);
  addFire(1); if (B.tut) B.tut.killed = true;
  const t = espirito ? FATAL_SPIRIT_T : FATAL_T;
  B.fatal = { t, dur: t, d, v, espirito }; // espirito: morto pelo Impulso → frase azul
}
export function endFatal() {
  B.demons = B.demons.filter(d => d !== B.fatal.d); B.fatal = null;
  if (!B.demons.length && B.arena) {
    B.arena = null; B.hp = Math.min(100, B.hp + 20);
    B.floats.push({ x: B.hero.x, y: GROUND - 250, t: 1.2, s: '+20', c: '#7dff8a' });
  }
}
export function endScreen(win) {
  $('endTitle').textContent = win ? 'Vitória' : 'Você caiu';
  $('endText').textContent = win ? 'Jornada concluída. Você encontrou a Palavra e refutou as mentiras.' : 'Levante-se. Volte à forja, afie a lâmina e tente de novo.';
  $('endBtns').innerHTML = win
    ? `<button onclick="show('forgeList')">Voltar à forja</button><button class="primary" onclick="show('menu')">Menu</button>`
    : `<button onclick="show('forgeList')">Voltar à forja</button><button class="primary" onclick="startBattle()">Jogar de novo</button>`;
  $('endOverlay').classList.add('on');
}
