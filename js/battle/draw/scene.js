import { GROUND, HERO, HERO_ATK, HERO_DEF, HERO_DEFWALK, HERO_IDLE, HERO_SCALE, HERO_THRUST, SWING_HIT, ctx } from '../config.js';
import { drawBird, drawDuvida, drawSpriteDemon, drawTentacao } from './enemies.js';
import { drawBalloon, drawFatal, drawHUD, drawHpBar, drawTip, layoutBalloons } from './hud.js';
import { bordaBuraco, drawBook, drawCaveExit, drawCaveMouth, drawEstrutura, drawShadow, drawCrescent, drawGoal, drawGround, drawHole, drawHoleFire, drawPlatform, drawRock, drawRubble, drawSky, relevo } from './world.js';
import { halted, tema } from '../hud.js';
import { drawAcid, drawGiant, drawGiantLie } from '../boss.js';
import { drawFrog } from '../frog.js';
import { drawSheep } from '../sheep.js';
import { passagemAlfa } from '../update.js';
import { drawCena, drawFalaPre } from '../cena.js';
import { drawEstatua } from '../giant.js';
import { B } from '../state.js';
import { terrainTop } from '../world.js';
import { D } from '../../core/utils.js';

// ---------- Desenho ----------
// o pé acompanha o relevo da arte do chão (fora de plataformas e sem estar caindo num buraco)
export const pisoHeroi = h => h.y > 0 || B.platforms.some(pl => h.x > pl.x - 10 && h.x < pl.x + pl.w + 10 && h.y <= pl.top + 1) ? 0 : relevo(h.x);
export const DASH_FILTER = 'grayscale(1) sepia(1) hue-rotate(165deg) saturate(6) brightness(1.25)'; // herói azul no impulso
export function drawBattle() {
  const W = 960, H = 540, h = B.hero, cam = B.cam;
  drawSky(cam);

  const sh = B.shake * 30, screen = ctx.getTransform(); // tremor da explosão; screen = coordenadas da tela (para a dica)
  ctx.save(); ctx.translate(-cam + (Math.random() - .5) * sh, (Math.random() - .5) * sh); // daqui até o restore: coordenadas do mundo
  drawCaveMouth();
  drawEstatua(); // atrás do chão
  drawGround(cam);
  drawCaveExit();
  B.estruturas.forEach(drawEstrutura);
  B.holes.forEach(drawHole);
  B.platforms.forEach(drawPlatform);
  drawGoal(B.fase.comprimento - 160);
  B.rocks.forEach(r => r.hp > 0 ? drawRock(r) : drawRubble(r));
  B.frogs.forEach(drawFrog);
  B.ovelhas.forEach(drawSheep);
  B.books.forEach(drawBook);

  // herói
  // quadro do herói: morte > impulso > golpe (espada erguida → estocada) > escudo no chão > no ar > correndo > parado
  let img = HERO.run, fr = 0, dim = HERO, def = false;
  if (h.deadAt != null) { img = HERO.death; fr = Math.min(4, Math.floor((B.time - h.deadAt) / .16)); }
  else if (h.anim === 'dash') { img = HERO.jump; fr = HERO_THRUST; }
  else if (h.anim === 'attack' && h.ground && HERO_ATK[h.combo || 0].img.naturalWidth) { // no chão: o golpe do combo (1º ou 2º), 6 quadros
    dim = HERO_ATK[h.combo || 0]; img = dim.img; dim.quadros.forEach(([t, q]) => { if (h.at >= t) fr = q; });
  }
  else if (B.shield && h.anim === 'run' && HERO_DEFWALK.img.naturalWidth) { // andando defendendo: passos curtos atrás do escudo
    def = true; dim = HERO_DEFWALK; img = HERO_DEFWALK.img; fr = Math.floor(h.at * HERO_DEFWALK.fps) % HERO_DEFWALK.n;
  }
  else if (B.shield && h.ground && h.anim !== 'attack' && HERO_DEF.img.naturalWidth) { // defendendo parado: ergue o escudo e para no último quadro
    def = true; dim = HERO_DEF; img = HERO_DEF.img; fr = Math.min(HERO_DEF.n - 1, Math.floor((B.time - (B.shieldAt ?? B.time)) / HERO_DEF.step));
  }
  else if (h.anim === 'attack') { img = HERO.jump; fr = h.at < SWING_HIT ? 2 : HERO_THRUST; } // no ar: espada erguida → estocada
  else if (!h.ground) { img = HERO.jump; fr = h.vy < -150 ? 1 : h.vy > 150 ? 4 : 0; }
  else if (h.anim === 'run') fr = Math.floor(h.at * 12) % 8;
  else if (HERO_IDLE.img.naturalWidth) { dim = HERO_IDLE; img = HERO_IDLE.img; fr = Math.floor(B.time * 5) % HERO_IDLE.n; } // parado: respira
  // rastro do impulso: cópias azuis do herói que somem, e um feixe de luz ligando ao herói
  if (B.ghosts.length && HERO.jump.naturalWidth) {
    const g0 = B.ghosts[0];
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createLinearGradient(g0.x, 0, h.x, 0); gr.addColorStop(0, 'rgba(60,170,255,0)'); gr.addColorStop(1, `rgba(120,210,255,${Math.min(.55, g0.t * 2)})`);
    ctx.fillStyle = gr; ctx.fillRect(Math.min(g0.x, h.x), GROUND + h.y - 150, Math.abs(h.x - g0.x), 70);
    ctx.restore();
    B.ghosts.forEach((g, k) => {
      if (k % 2) return; // metade das cópias basta
      ctx.save(); ctx.globalAlpha = g.t / .32 * .55; ctx.filter = DASH_FILTER;
      ctx.translate(g.x, GROUND + g.y); ctx.scale(g.face, 1);
      ctx.scale(HERO_SCALE, HERO_SCALE); ctx.drawImage(HERO.jump, HERO_THRUST * HERO.FW, 0, HERO.FW, HERO.FH, -HERO.ax, 2 - HERO.FH, HERO.FW, HERO.FH);
      ctx.restore();
    });
  }

  // caindo num buraco: o herói só aparece entre as bordas do chão e acima da linha d'água (afunda no mar)
  const pit = h.y > 0 && B.holes.find(o => h.x > o.x && h.x < o.x + o.w);
  // sombra de contato sob o herói (no chão, na laje ou na jangada): encolhe e clareia quando ele pula
  if (!pit && h.deadAt == null) {
    const pl = B.platforms.find(p => h.x > p.x - 10 && h.x < p.x + p.w + 10 && h.y <= p.top + 1), gy = pl ? pl.top : terrainTop(h.x);
    if (gy !== Infinity) drawShadow(h.x, GROUND + gy + (pl ? 0 : relevo(h.x)), 92, gy - h.y);
  }
  ctx.save();
  if (pit) { const bb = bordaBuraco(B.fase); ctx.beginPath(); ctx.rect(pit.x + bb, 0, pit.w - 2 * bb, GROUND + 28); ctx.clip(); }
  if (h.dash > 0) ctx.filter = DASH_FILTER + ' drop-shadow(0 0 16px #3ab4ff)'; // todo azul no impulso
  else if (B.power && !B.shield) ctx.filter = `drop-shadow(0 0 14px ${tema(B.power.v).brilho})`;
  if (h.hurt > 0 && Math.floor(h.hurt * 30) % 2) ctx.globalAlpha = .4;
  ctx.translate(h.x - (B.shield && !def ? 12 * h.face : 0), GROUND + h.y + pisoHeroi(h)); ctx.scale(h.face, 1);
  ctx.scale(HERO_SCALE * (dim.sc || 1), HERO_SCALE * (dim.sc || 1));
  if (img.naturalWidth) ctx.drawImage(img, fr * dim.FW, 0, dim.FW, dim.FH, -dim.ax, 2 - dim.FH, dim.FW, dim.FH);
  ctx.restore();
  B.holes.forEach(drawHoleFire); // mãos na frente do herói: quem cai é engolido por elas
  if (B.shield) { // escudo erguido
    const sc = D.temas.duvida; // escudo usa o azul do tema Dúvida
    ctx.save(); ctx.strokeStyle = sc.cor; ctx.lineWidth = 6; ctx.shadowColor = sc.brilho; ctx.shadowBlur = 20; ctx.globalAlpha = .85;
    ctx.beginPath(); ctx.arc(h.x + 10 * h.face, GROUND + h.y - 120, 110, h.face > 0 ? -1.1 : Math.PI - 1.1, h.face > 0 ? 1.1 : Math.PI + 1.1); ctx.stroke(); ctx.restore();
  }

  // sombras leves no chão embaixo dos monstros (antes deles, para ficarem por baixo)
  B.demons.forEach(d => {
    if (d.state === 'dead' || d.state === 'enter' && d.x > B.cam + 1000) return;
    const gy = GROUND + terrainTop(d.x);
    if (d.s.mergulho) return drawShadow(d.x, gy, 100, gy - d.y - 40, .3); // ave: sombra no chão, menor quanto mais alto
    if (d.s.chao) drawShadow(d.x, d.y, { leao: 165, verde: 95 }[d.s.sprite] || 120); // de chão: pisam em d.y
  });
  if (B.boss && B.boss.kind === 'gigante' && !['hidden', 'dead'].includes(B.boss.state)) drawShadow(B.boss.x, GROUND, B.boss.rei ? 120 : 190, 0, .42);
  // demônios
  B.demons.forEach(d => { if (d.state === 'dead' && !(d.pop > 0)) return; d.s.mergulho ? drawBird(d) : d.s.sprite ? drawSpriteDemon(d) : d.s.chao ? drawTentacao(d) : drawDuvida(d); }); // morto: só o clarão antes de estourar
  drawGiant(); // Golias (chefão da Jornada 2)
  B.demons.forEach(d => { if (d.state !== 'dead') drawHpBar(d); });
  // dica/aviso no alto da tela: desenhada antes dos balões, para a mentira do inimigo ficar na frente dela
  if (!B.fatal && !(B.trans > 0)) { ctx.save(); ctx.setTransform(screen); drawTip(); ctx.restore(); }
  layoutBalloons().forEach(drawBalloon);
  drawGiantLie(); // balão do Golias (mais forte)

  B.fireballs.forEach(f => {
    ctx.save(); ctx.shadowColor = '#ff6a00'; ctx.shadowBlur = 20;
    const gr = ctx.createRadialGradient(f.x, f.y, 2, f.x, f.y, 16); gr.addColorStop(0, '#fff2b0'); gr.addColorStop(.5, '#ff7a1a'); gr.addColorStop(1, '#a3100000');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(f.x, f.y, 16, 0, 7); ctx.fill(); ctx.restore();
  });
  B.fx.forEach(f => {
    ctx.save();
    if (f.ring) { ctx.strokeStyle = D.temas.duvida.cor; ctx.shadowColor = D.temas.duvida.brilho; ctx.shadowBlur = 20; ctx.lineWidth = 10 * f.t / .3; ctx.beginPath(); ctx.arc(h.x, GROUND + h.y - 120, 110 + (1 - f.t / .3) * 60, 0, 7); ctx.stroke(); }
    else if (f.boom) { // clarão + onda de choque
      const k = 1 - f.t / .45, R = 30 + k * 150;
      const gr = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, R); gr.addColorStop(0, `rgba(255,250,220,${.9 * (1 - k)})`); gr.addColorStop(.4, `rgba(255,170,60,${.6 * (1 - k)})`); gr.addColorStop(1, 'rgba(255,120,30,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(f.x, f.y, R, 0, 7); ctx.fill();
      ctx.strokeStyle = f.c.claro; ctx.shadowColor = f.c.brilho; ctx.shadowBlur = 20; ctx.globalAlpha = 1 - k; ctx.lineWidth = 8 * (1 - k) + 1;
      ctx.beginPath(); ctx.arc(f.x, f.y, 20 + k * 190, 0, 7); ctx.stroke();
    }
    else if (f.burst) { const k = f.t / .25; ctx.strokeStyle = f.c.claro; ctx.shadowColor = f.c.brilho; ctx.shadowBlur = 20; ctx.lineWidth = 4 * k; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r1 = 10 + (1 - k) * 20, r2 = r1 + 26 * k; ctx.beginPath(); ctx.moveTo(f.x + Math.cos(a) * r1, f.y + Math.sin(a) * r1); ctx.lineTo(f.x + Math.cos(a) * r2, f.y + Math.sin(a) * r2); ctx.stroke(); } }
    ctx.restore();
  });
  B.slashes.forEach(sl => {
    drawCrescent(sl.x, sl.y, sl.ang, 1, 1, sl.c, sl.sy); // um corte só voando (sem cópias atrás)
  });
  drawAcid(); // ácido do Leviatã voando
  B.shards.forEach(s => { ctx.fillStyle = `rgba(${s.c || '240,230,210'},${s.t})`; ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.r); const z = s.sz || 1; ctx.fillRect(-5 * z, -3 * z, 10 * z, 6 * z); ctx.restore(); });
  ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 3; ctx.shadowBlur = 10; // faíscas: risco brilhante na direção do voo
  B.embers.forEach(e => { const a = Math.min(1, e.t * 2); ctx.strokeStyle = `rgba(${e.c},${a})`; ctx.shadowColor = `rgb(${e.c})`; ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x - e.vx * .025, e.y - e.vy * .025); ctx.stroke(); });
  ctx.restore();
  ctx.textAlign = 'center'; ctx.font = 'bold 20px system-ui';
  B.floats.forEach(f => { ctx.fillStyle = f.c; ctx.globalAlpha = Math.min(1, f.t * 2); ctx.fillText(f.s, f.x, f.y - (1 - f.t) * 40); });
  ctx.globalAlpha = 1;
  if (B.callout) { // fade in rápido, sobe um pouco e some
    const k = 1 - B.callout.t / B.callout.dur;
    ctx.save(); ctx.globalAlpha = Math.min(1, k / .15, (1 - k) / .35);
    ctx.font = '800 30px Cinzel, Georgia, serif'; ctx.lineJoin = 'round'; ctx.lineWidth = 6; ctx.strokeStyle = '#1a0f0b';
    const cy = GROUND + h.y - 250 - k * 24;
    ctx.strokeText(B.callout.s, h.x, cy); ctx.fillStyle = B.callout.c.cor; ctx.shadowColor = B.callout.c.brilho; ctx.shadowBlur = 16; ctx.fillText(B.callout.s, h.x, cy);
    ctx.restore();
  }
  drawFalaPre(); // "O que é isso?!" (antes da cena da estátua)
  ctx.restore(); // fim das coordenadas do mundo

  drawHUD();
  if (B.trans > 0 && !B.fatal && B.peek < 0) {
    ctx.fillStyle = '#000a'; ctx.fillRect(0, 230, W, 70);
    ctx.fillStyle = '#f2c84b'; ctx.font = '800 36px Cinzel, serif'; ctx.fillText(B.fase.dev ? `Bestiário · ${B.fase.nome}` : `Jornada ${B.faseIdx + 1} · ${B.fase.nome}`, W / 2, 278);
  }
  if (B.fatal) drawFatal();
  if (halted()) { ctx.fillStyle = '#000a'; ctx.fillRect(0, 0, W, H); }
  drawCena(); // a estátua desperta (por cima de tudo)
  if (B.passagem) { ctx.save(); ctx.globalAlpha = passagemAlfa(B.passagem); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore(); } // entrar/sair da caverna
}
// céu muda ao longo da jornada (noite → aurora dourada perto do fim) e tem 3 camadas de parallax
