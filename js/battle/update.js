import { updateBird } from './bird.js';
import { damageDemon, dashHits, demonBox, endFatal, endScreen, heroBox, hitHero, overlap, startDash, swingHit } from './combat.js';
import { DASH_CD, DASH_SPEED, GRAV, GROUND, SHIELD_REGEN, SPEED, SWING, SWING_HIT } from './config.js';
import { B, keys } from './state.js';
import { ENEMY_GAP, stepIdol, collectBook, fallInHole, floorAt, hitRock, makeDemon, moveX, pickLie, restoreLie, rockBox, terrainTop } from './world.js';
import { sfx } from '../core/audio.js';
import { shieldMax } from '../core/progress.js';
import { $, D, reduced } from '../core/utils.js';
import { setShield } from '../input/controls.js';
import { sp } from '../ui/sparks.js';

export function updateBattle(rdt) {
  const ts = B.fatal && !reduced ? .25 : 1, dt = rdt * ts;
  B.time += dt;
  const h = B.hero; h.at += dt; h.hurt = Math.max(0, h.hurt - dt);
  for (const k in B.cd) B.cd[k] = Math.max(0, B.cd[k] - rdt);

  if (B.fatal) { B.fatal.t -= rdt; if (B.fatal.t <= 0) endFatal(); }
  if (B.trans > 0) B.trans -= dt;

  // herói
  if (!B.over) {
    const mx = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
    const sp = SPEED * (B.shield ? .35 : h.swing > 0 ? .5 : 1);
    let lo = B.arena ? B.arena.left + 50 : 50, hi = B.arena ? B.arena.right - 50 : B.fase.comprimento - 50;
    // pedra inteira bloqueia quem está na mesma altura dela (é alta demais para pular)
    const rock = B.rocks.find(r => r.hp > 0 && r.x > h.x && h.y > r.base - 158 && h.y - 200 < r.base);
    if (rock) hi = Math.min(hi, rock.x - 95);
    if (h.dash > 0) { // impulso: dispara reto para frente, sem gravidade, deixando o rastro
      h.dash -= dt;
      h.x = moveX(h, Math.max(lo, Math.min(hi, h.x + h.face * DASH_SPEED * dt)));
      h.vy = 0; dashHits(h);
      B.ghosts.push({ x: h.x, y: h.y, face: h.face, t: .32 });
      if (h.dash <= 0 && h.faceAfter) { h.face = h.faceAfter; h.faceAfter = 0; }
    } else {
      h.x = moveX(h, Math.max(lo, Math.min(hi, h.x + mx * sp * dt)));
      if (mx && h.swing <= 0 && !B.shield) h.face = mx;
    }
    const floor = floorAt(h);
    if (!(h.dash > 0)) h.vy += GRAV * dt;
    h.y = Math.min(floor, h.y + h.vy * dt);
    h.ground = h.y === floor; if (h.ground) h.vy = 0;
    if (h.ground && terrainTop(h.x - 45) !== Infinity && terrainTop(h.x + 45) !== Infinity) h.safe = { x: h.x, y: h.y };
    if (h.y > 420) fallInHole(h);
    if (h.swing > 0) {
      h.swing -= dt;
      if (!h.hitDone && SWING - h.swing >= SWING_HIT) { h.hitDone = true; swingHit(); }
    }
    const moving = mx !== 0 && h.ground;
    const anim = h.dash > 0 ? 'dash' : h.swing > 0 ? 'attack' : moving ? 'run' : 'idle';
    if (anim !== h.anim) { h.anim = anim; if (anim !== 'attack') h.at = 0; }
    // câmera segue o herói; numa luta fica travada na arena
    // (suave: ao destravar a arena a câmera desliza até o herói, sem salto)
    const camT = B.arena ? B.arena.left : Math.max(0, Math.min(B.fase.comprimento - 960, h.x - 360));
    B.cam += (camT - B.cam) * Math.min(1, dt * 5);
  }

  // escudo: dura shieldMax segundos erguido; recarrega abaixado e, se esgotar, só volta com metade da carga
  if (B.shield) {
    B.shieldE -= dt;
    if (B.shieldE <= 0) { B.shieldE = 0; B.shieldLock = true; setShield(false); sfx('wrong'); B.floats.push({ x: h.x, y: GROUND + h.y - 260, t: 1, s: 'Escudo esgotado', c: '#9fc3ff' }); }
  } else {
    B.shieldE = Math.min(shieldMax, B.shieldE + SHIELD_REGEN * dt);
    if (B.shieldLock && B.shieldE >= shieldMax / 2) B.shieldLock = false;
  }

  // poder da espada
  const P = B.power;
  if (P) {
    P.t -= dt;
    if (P.t <= 0 || P.target.hp <= 0) { if (P.target.hp > 0) restoreLie(P.target); B.power = null; }
  }

  // demônios
  B.demons.forEach(d => {
    d.flash = Math.max(0, d.flash - dt); d.strikeAnim = Math.max(0, d.strikeAnim - dt); d.bob += dt; d.moving = d.state === 'enter';
    d.lieFlash = Math.max(0, d.lieFlash - dt);
    if (d.state === 'dead') return;
    if (d.state === 'enter') {
      d.x -= 320 * dt;
      if (d.x <= d.tx) { d.x = d.tx; d.state = 'idle'; }
      return;
    }
    if (B.trans > 0) return;
    if (d.s.mergulho) return updateBird(d, h, dt);
    const dist = h.x - d.x;
    if (d.s.chao) {
      if (d.state === 'idle' && Math.abs(dist) > 110) {
        // persegue o herói, mas não chega a menos de ENEMY_GAP de outro inimigo
        const nx = d.x + Math.sign(dist) * d.s.passo * dt;
        if (!B.demons.some(o => o !== d && o.state !== 'dead' && Math.abs(o.x - nx) < ENEMY_GAP && Math.abs(o.x - nx) < Math.abs(o.x - d.x))) { d.x = nx; d.moving = true; }
      }
      if (d.state === 'idle') d.face = Math.sign(dist) || d.face;
    }
    if (d.state === 'idle') {
      d.timer -= dt;
      const inRange = !d.s.chao || Math.abs(dist) < 170;
      if (d.timer <= 0 && inRange) { d.state = 'arm'; d.arm = d.s.tell; }
    } else if (d.state === 'arm') {
      d.arm -= dt;
      if (d.arm <= 0) {
        d.state = 'idle'; d.timer = d.s.cadencia; d.strikeAnim = .2;
        if (d.s.chao) { if (Math.abs(h.x - d.x) < 150 && h.y > -60) hitHero(d.s.dano); }
        else {
          sfx('fire');
          const sx = d.x - 20, sy = d.y + 10, hb = heroBox(h), dx = h.x - sx, dy = (hb[1] + hb[3]) / 2 - sy, L = Math.hypot(dx, dy);
          B.fireballs.push({ x: sx, y: sy, vx: dx / L * 380, vy: dy / L * 380, dmg: d.s.dano });
        }
      }
    }
  });
  // bolas de fogo
  B.fireballs.forEach(f => {
    f.x += f.vx * dt; f.y += f.vy * dt;
    if (overlap([f.x - 12, f.y - 12, f.x + 12, f.y + 12], heroBox(h))) { f.dead = true; hitHero(f.dmg); }
    if (f.x < B.cam - 40 || f.x > B.cam + 1000 || f.y > GROUND + 20) f.dead = true;
  });
  B.fireballs = B.fireballs.filter(f => !f.dead);

  B.slashes.forEach(sl => {
    sl.trail.unshift({ x: sl.x, y: sl.y }); sl.trail.length = Math.min(sl.trail.length, 8);
    sl.x += sl.vx * dt; sl.y += sl.vy * dt;
    const box = [sl.x - 30, sl.y - 40, sl.x + 30, sl.y + 40];
    B.demons.forEach(d => {
      if (d.state === 'dead' || d.state === 'enter' || sl.hit.has(d) || !overlap(box, demonBox(d))) return;
      sl.hit.add(d);
      if (damageDemon(d)) B.fx.push({ burst: true, x: sl.x, y: sl.y, t: .25, c: sl.c });
    });
    B.rocks.forEach(r => { if (r.hp > 0 && !sl.hit.has(r) && overlap(box, rockBox(r))) { sl.hit.add(r); hitRock(r); } });
    if (sl.x < B.cam - 80 || sl.x > B.cam + 1040 || sl.y < -80 || sl.y > GROUND + 40) sl.dead = true;
  });
  B.slashes = B.slashes.filter(sl => !sl.dead);
  B.fx = B.fx.filter(f => (f.t -= rdt) > 0);
  B.floats = B.floats.filter(f => (f.t -= rdt) > 0);
  B.shards.forEach(s => { s.vy += 700 * rdt; s.x += s.vx * rdt; s.y += s.vy * rdt; s.r += rdt * 6; });
  B.shards = B.shards.filter(s => (s.t -= rdt) > 0);
  B.ghosts = B.ghosts.filter(g => (g.t -= rdt) > 0);
  // mãos do buraco: sobem (0 → 1 em 0,5 s) quando o herói está perto, afunda quando ele se afasta
  B.holes.forEach(o => { const near = Math.abs(B.hero.x - (o.x + o.w / 2)) < o.w / 2 + 280; o.hand = Math.max(0, Math.min(1, (o.hand || 0) + (near ? dt : -dt) / .5)); });
  B.dashCd = Math.max(0, B.dashCd - dt); B.dashBack = Math.max(0, B.dashBack - dt);
  if (B.dashQueued && !(B.hero.dash > 0)) { B.dashQueued = false; startDash(); }
  B.embers.forEach(e => { e.vy += 600 * rdt; e.vx *= 1 - 2 * rdt; e.x += e.vx * rdt; e.y += e.vy * rdt; });
  B.embers = B.embers.filter(e => (e.t -= rdt) > 0);
  B.shake = Math.max(0, B.shake - rdt);
  B.demons.forEach(d => { if (d.pop) d.pop = Math.max(0, d.pop - rdt); });

  // livros dourados: saltam da pedra, flutuam; tocar (ou passar por eles) coleta
  B.rocks.forEach(r => { r.flash = Math.max(0, r.flash - dt); if (r.pieces) stepIdol(r, dt); });
  B.books.forEach(b => {
    b.t += dt;
    if (!b.rest) { b.vy += 1200 * dt; b.y += b.vy * dt; if (b.vy > 0 && b.y >= b.restY) { b.y = b.restY; b.rest = true; } }
    if (b.t > .4 && (overlap(heroBox(h), [b.x - 24, b.y - 24, b.x + 24, b.y + 24]) || h.x > b.x + 40)) collectBook(b);
  });
  B.books = B.books.filter(b => !b.got);
  // inimigos surgem quando o herói chega perto; a câmera trava (arena) até o grupo cair
  if (!B.arena && !B.over) {
    const gr = B.groups.find(g => !g.done && h.x >= g.x - 600); // trava cedo: o herói fica à esquerda e sobra espaço para os inimigos espaçados
    if (gr) { gr.done = true; B.arena = { left: gr.x - 740, right: gr.x + 220 }; // a câmera desliza até a arena; os que voam ficam nas vagas da direita; os de chão (que perseguem) mais perto do herói
      const order = gr.inimigos.map((t, i) => i).sort((a, b) => !!D.inimigos[gr.inimigos[a]].chao - !!D.inimigos[gr.inimigos[b]].chao);
      B.demons = gr.inimigos.map((t, i) => { const d = Object.assign(makeDemon(t, order.indexOf(i), gr.vida || 1, gr.inimigos.length), { frase: gr.frases && gr.frases[i] }); pickLie(d); d.lieFlash = 0; return d; });
    } // já entram com a mentira sobre a cabeça
  }
  if (!B.over && !B.arena && !B.demons.length && h.x >= B.fase.comprimento - 200 && B.groups.every(g => g.done)) { B.over = true; endScreen(true); }

  // HUD DOM
  if (B.callout && (B.callout.t -= rdt) <= 0) B.callout = null;
  if (B.notice && (B.notice.t -= rdt) <= 0) B.notice = null;
  const lock = Math.max(0, ...B.deck.map((_, i) => B.cd[i] || 0));
  $('deckBtn').classList.toggle('locked', lock > 0); $('deckLock').style.width = (lock / 2.5 * 100) + '%';
  $('dashLock').style.width = (B.dashCd / DASH_CD * 100) + '%'; $('dashBtn').classList.toggle('go', h.dash > 0);
  B.deck.forEach((v, i) => {
    const c = $('card' + i); if (!c) return;
    $('cd' + i).style.width = ((B.cd[i] || 0) / 2.5 * 100) + '%';
    $('use' + i).disabled = (B.cd[i] || 0) > 0;
    const act = B.power && B.power.v;
    c.classList.toggle('active', !!act && v === act);
    c.classList.toggle('dim', !!act && v !== act);
  });
}
