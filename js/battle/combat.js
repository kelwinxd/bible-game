import { BASE_DMG, COMBO_WIN, DASH_BACK_WIN, DASH_CD, DASH_T, FATAL_SPIRIT_T, FATAL_T, FIRE_MAX, GROUND, HERO_ATK } from './config.js';
import { BIRD_HOVER_Y } from './bird.js';
import { halted, tema } from './hud.js';
import { B } from './state.js';
import { bossAlive, bossBox, damageBoss } from './boss.js';
import { frogsIn, hitFrog } from './frog.js';
import { hitRock, rockBox } from './world.js';
import { fatalSound, poderSfx, sfx, swordSfx } from '../core/audio.js';
import { opts } from '../core/options.js';
import { abertaBase, dashDmg, marcarVitoria, venceu } from '../core/progress.js';
import { $, D, reduced, rgbOf } from '../core/utils.js';
import { rainFrogs } from './frog.js';

// ave: balão EMBAIXO dela (em cima ficava atrás do HUD), preso à altura de pairar para não descer junto no mergulho
export const balloonBelow = d => !!d.s.mergulho;
export function balloonY(d) { return d.s.mergulho ? Math.min(d.y, BIRD_HOVER_Y) + 55 : d.s.sprite ? d.y - (d.s.sprite === 'verde' ? 250 : d.s.sprite === 'leao' ? 205 : 262) : d.s.chao ? d.y - 230 : d.y - 90; }

// caixas de colisão
export const heroBox = h => [h.x - 30, GROUND + h.y - 160, h.x + 30, GROUND + h.y]; // acompanha o templário menor
export function demonBox(d) {
  if (d.s.mergulho) return [d.x - 70, d.y - 55, d.x + 70, d.y + 65]; // ave: corpo e garras, sem as pontas das asas
  if (d.s.sprite === 'leao') return [d.x - 80, d.y - 150, d.x + 80, d.y]; // leão: baixo e comprido
  if (d.s.chao) return [d.x - 45, d.y - 200, d.x + 45, d.y];
  const fy = Math.sin(d.bob * 2) * 10;
  return [d.x - 50, d.y + fy - 70, d.x + 50, d.y + fy + 60];
}
export const overlap = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];

// o golpe sai para onde o herói está virado (não segue o mouse).
// Combo: K = 1º golpe (corte lateral); K de novo durante o golpe (ou logo depois) = 2º golpe em seguida
// (corte de cima para baixo); continuando, alterna 1º, 2º, 1º…
export function attack() {
  const h = B && B.hero;
  if (!h || B.over || B.fatal || B.shield || halted()) return;
  if (h.swing > 0) { h.comboQ = true; return; } // guarda o próximo golpe: sai assim que este acabar
  const chain = B.time - (h.swingEnd ?? -9) <= COMBO_WIN;
  h.combo = chain ? 1 - (h.combo || 0) : 0; h.comboQ = false;
  const g = HERO_ATK[h.combo]; h.swingT = g.T; h.swingHit = g.HIT;
  h.swing = h.swingT; h.hitDone = false; h.anim = 'attack'; h.at = 0;
  if (!B.power) swordSfx('swing'); else if (!poderSfx()) swordSfx('laser'); // a lâmina corta o ar; com poder, o som gravado (poder.mp3)
  if (B.tut && B.tut.pulou) B.tut.golpe = true; // tutorial: a dica do [K] na rã some no 1º golpe depois do buraco
  if (B.tut && B.tut.refuted) B.tut.attacked = true; // tutorial: a dica do [K] no demônio some
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
  h.dash = DASH_T; h.dashHit = new Set(); h.swing = 0; h.comboQ = false; h.vy = 0; B.dashCd = DASH_CD; // recarga conta a partir do último
  if (!poderSfx()) { sfx('whoosh'); sfx('beam'); } // o mesmo som do poder (poder.mp3); o sintetizado só se não carregou
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
  frogsIn(box, f => { if (!h.dashHit.has(f)) { h.dashHit.add(f); hitFrog(f, dashDmg(), '#9fe4ff'); } });
  if (bossAlive(B.boss) && !h.dashHit.has(B.boss) && overlap(box, bossBox(B.boss))) { h.dashHit.add(B.boss); sfx('slash'); damageBoss(dashDmg(), '#9fe4ff'); }
}
export function damageDemon(d, impulso = false) {
  const P = B.power, powered = !impulso && P && P.target === d;
  const dmg = impulso ? dashDmg() : powered ? 8 * P.mult : BASE_DMG;
  d.hp -= dmg; d.flash = .15;
  const b = demonBox(d);
  if (B.fase.dev && d.hp <= 0) { d.hp = d.maxHp; B.floats.push({ x: d.x, y: b[1] - 50, t: 1, s: 'imortal · vida cheia', c: '#9fe4ff' }); } // Bestiário
  B.floats.push({ x: d.x, y: b[1] - 20, t: .8, s: dmg.toFixed(dmg % 1 ? 1 : 0), c: impulso ? '#9fe4ff' : powered ? tema(P.v).claro : '#bbb' });
  if (d.hp <= 0) startFatal(d, impulso ? null : d.lastVerse, impulso);
  return powered;
}
// Com o poder ativo, o golpe vira um rasgo de luz que voa reto (horizontal) para onde o herói está virado,
// na altura em que ele está — no chão ou no ar durante o pulo. Sem diagonais por enquanto.
export function launchSlash() {
  const h = B.hero, k = HERO_ATK[h.combo || 0].corte, x = h.x + h.face * 50, y = GROUND + h.y - k.y; // altura e tamanho seguem o golpe
  B.slashes.push({ x, y, sy: k.sy, vx: h.face * 900, vy: 0, ang: h.face > 0 ? 0 : Math.PI, hit: new Set(), c: tema(B.power.v) });
}
export function swingHit() {
  const h = B.hero;
  if (B.power) return launchSlash();
  const reach = h.face > 0 ? [h.x + 10, h.x + 145] : [h.x - 145, h.x - 10];
  const box = [reach[0], GROUND + h.y - 215, reach[1], GROUND + h.y - 30];
  B.demons.forEach(d => {
    if (d.state === 'dead' || d.state === 'enter' || !overlap(box, demonBox(d))) return;
    swordSfx('cut'); damageDemon(d); // golpe na carne
  });
  B.rocks.forEach(r => { if (r.hp > 0 && overlap(box, rockBox(r))) hitRock(r); });
  frogsIn(box, f => { swordSfx('cut'); hitFrog(f, 10); }); // rã: 2 golpes de espada
  if (bossAlive(B.boss) && overlap(box, bossBox(B.boss))) { swordSfx('cut'); damageBoss(BASE_DMG); } // Leviatã: da laje ou da margem
}

export function heroDies() { B.over = true; B.hero.deadAt = B.time; setTimeout(() => endScreen(false), 1400); } // dá tempo de ver a queda
export function hitHero(dmg) {
  if (B.over || B.hero.dash > 0) return; // atravessando no impulso: intocável
  if (B.shield) { B.fx.push({ ring: true, t: .3 }); return; }
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
  // o balão da mentira estoura em lascas de papel (se estava à vista: a ave esconde a frase no mergulho)
  const shown = d.lie && d.balao && !(d.s.mergulho && (d.state === 'dive' || d.state === 'rise'));
  if (shown) B.shards.push(...d.rachas.lascas(d.balao.x, d.balao.y, d.balao.w, d.balao.h, 3));
  d.state = 'dead'; d.lie = null; fatalSound(); explodeDemon(d);
  addFire(1); if (B.tut) B.tut.killed = true;
  const t = espirito ? FATAL_SPIRIT_T : FATAL_T;
  B.fatal = { t, dur: t, d, v, espirito }; // espirito: morto pelo Impulso → frase azul
}
export function endFatal() {
  B.demons = B.demons.filter(d => d !== B.fatal.d); B.fatal = null;
  if (!B.demons.length && B.arena) {
    const gr = B.arena.gr; if (gr && gr.ras) rainFrogs(gr.ras, B.arena); // data.js ras: N → rãs caem do céu quando a arena acaba
    B.arena = null; B.hp = Math.min(100, B.hp + 20);
    B.floats.push({ x: B.hero.x, y: GROUND - 250, t: 1.2, s: '+20', c: '#7dff8a' });
  }
}
export function endScreen(win) {
  if (!B) return; // saiu da batalha antes da tela final
  if (B.fase.dev) { // Bestiário: só dá para cair (os monstros são imortais)
    $('endTitle').textContent = 'Você caiu'; $('endText').textContent = `Bestiário · ${B.fase.nome}`;
    $('endBtns').innerHTML = `<button onclick="openBestiary()">← Bestiário</button><button class="primary" onclick="startBestiary('${B.fase.dev}')">Lutar de novo</button>`;
    return $('endOverlay').classList.add('on');
  }
  // vitória: marca a jornada; as que essa vitória abriu (data.js → abre) aparecem no texto, e a 1ª delas vira o botão principal
  const fi = B.faseIdx, antes = D.fases.filter(abertaBase);
  if (win) marcarVitoria(B.fase.id);
  const novas = win ? D.fases.filter(f => abertaBase(f) && !antes.includes(f)) : [];
  const prox = win && (novas[0] || D.fases.find(f => abertaBase(f) && !venceu(f.id))), pi = prox ? D.fases.indexOf(prox) : -1;
  $('endTitle').textContent = win ? 'Vitória' : 'Você caiu';
  $('endText').textContent = !win ? 'Levante-se. Volte à forja, afie a lâmina e tente de novo.'
    : novas.length ? `Jornada ${fi + 1} concluída. Liberada: ${novas.map(f => f.nome).join(' e ')}.`
    : prox ? `Jornada ${fi + 1} concluída.` : 'Todas as jornadas concluídas. Você encontrou a Palavra e refutou as mentiras.';
  $('endBtns').innerHTML = `<button onclick="habView('hub')">Habilidades</button>` + (!win
    ? `<button class="primary" onclick="startBattle(${fi})">Jogar de novo</button>`
    : `<button onclick="show('mapa')">Mapa</button>` + (prox ? `<button class="primary" onclick="startBattle(${pi})">${prox.nome} →</button>` : `<button class="primary" onclick="show('menu')">Menu</button>`));
  $('endOverlay').classList.add('on');
}
