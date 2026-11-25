// ---------- Patrulheiro: bicho que patrulha e ataca (o Lobo, o Soldado e a Mulher dos piolhos) ----------
// Anda devagar indo e voltando em volta de casa; com o herói perto (e na mesma altura) corre atrás dele (sem sair da coleira) e, ao
// alcance, ARMA (brilho vermelho) e GOLPEIA. Cada subclasse só traz a FICHA (os números e a arte) e, se for diferente, o golpe.
// Ficha: vida, dano, anda/corre (px/s), perto (vê o herói), ronda/coleira (px de casa), arma/golpe (s), salto (px que avança no
// golpe), cd (s entre golpes), ataca (arma a esta distância), colado (não chega mais perto), nArma (quadros armando), arcoAt (px
// acima do chão por quadro do ataque), run/atk/idle (sprites; olham para a direita), sombra, som, cores (lascas ao morrer)
import { loboSom, piolhentaSom, sfx, soldadoGemidoSom, soldadoPassoSom, uivoSom } from '../../../core/audio.js';
import { GROUND, ctx } from '../../config.js';
import { heroBox, hitHero, overlap } from '../../combat.js';
import { drawShadow } from '../../draw/world.js';
import { B } from '../../state.js';
import { terrainTop } from '../../world.js';
import { Bicho } from '../base/bicho.js';
import { FILTRO_ACERTO, brilho, desenharQuadro, ouvido } from '../efeitos.js';

const img = src => Object.assign(new Image(), { src });
const SP = 'assets/sprites/enemy/';

export class Patrulheiro extends Bicho {
  /** a ficha da subclasse (contrato: toda subclasse define a sua) */
  static FICHA = null;
  constructor(e) {
    const P = new.target.FICHA;
    super(e, { vida: P.vida });
    Object.assign(this, { P, moving: false, wait: 0 });
  }
  get cores() { return this.P.cores; }
  /** quadro do ataque (−1 = andando): armando → nArma quadros; golpe → os outros */
  quadroAtaque() {
    const P = this.P, n = P.atk.n, nG = n - P.nArma;
    if (this.state === 'arm') return Math.min(P.nArma - 1, Math.floor(this.t / P.arma * P.nArma));
    if (this.state === 'leap') return P.nArma + Math.min(nG - 1, Math.floor(this.t / P.golpe * nG));
    return -1;
  }
  /** y dos pés (sobe no salto do ataque) */
  pe() { const fr = this.quadroAtaque(); return GROUND + terrainTop(this.x) - (fr >= 0 ? this.P.arcoAt[fr] : 0); }
  caixa() { return this.P.caixa(this, this.pe()); }
  /** a parte que fere no golpe (padrão: o corpo inteiro; o soldado: só a ponta da lança) */
  caixaGolpe() { return this.caixa(); }

  agir(h, dt) {
    const P = this.P, dx = h.x - this.x, perto = Math.abs(dx) < P.perto && Math.abs(h.y - terrainTop(this.x)) < 90 && h.deadAt == null;
    this.moving = false; this.t += dt;
    if (this.state === 'walk') this.patrulhar(h, dx, perto, dt);
    else if (this.state === 'arm') { if (this.t >= P.arma) { this.state = 'leap'; this.t = 0; this.hit = false; this.x0 = this.x; sfx(P.som); this.aoGolpear(h); } }
    else if (this.state === 'leap') this.golpear(h);
  }
  patrulhar(h, dx, perto, dt) {
    const P = this.P;
    if (perto && !(this.chaseOff > 0)) this.face = Math.sign(dx) || this.face;
    if (perto && !this.viu) this.aoVer(); this.viu = perto; // acabou de ver o herói
    if (perto && Math.abs(dx) < P.ataca && this.cd <= 0) { this.state = 'arm'; this.t = 0; this.aoArmar(); return; } // ao alcance: arma o golpe
    if (perto && Math.abs(dx) < P.colado) return; // colado no herói: espera o próximo golpe
    // perto mas não alcança (fim da coleira, buraco, parede): não fica parado encarando — volta a patrulhar
    if (perto && (Math.abs(this.x + this.face * 20 - this.home) > P.coleira || !this.podePisar(this.x + this.face * 50))) this.chaseOff = 1.5;
    const caca = perto && !(this.chaseOff > 0);
    if (this.chaseOff > 0) this.chaseOff -= dt;
    if (!caca && perto && this.chaseOff > 0 && Math.sign(dx) === this.face) this.face = -this.face;
    const v = caca ? P.corre : P.anda, lim = caca ? P.coleira : P.ronda, nx = this.x + this.face * v * dt;
    const volta = Math.abs(nx - this.home) < Math.abs(this.x - this.home); // fora da ronda (depois de caçar): pode voltar para casa
    if ((Math.abs(nx - this.home) <= lim || volta) && this.podePisar(nx + this.face * 50)) { this.x = nx; this.moving = true; }
    else this.face = -this.face; // fim da ronda, buraco ou parede: dá meia-volta
  }
  /** gancho: na hora em que o golpe sai (a Mulher dos piolhos cospe aqui) */
  aoGolpear() {}
  aoVer() {}    // gancho: viu o herói (parte atrás dele)
  aoArmar() {}  // gancho: começou a armar o golpe
  golpear(h) {
    const P = this.P, k = Math.min(1, this.t / P.golpe), stop = h.x - this.face * 45;
    let to = this.x0 + this.face * P.salto * Math.sin(k * Math.PI / 2);
    to = this.face > 0 ? Math.min(to, Math.max(this.x, stop)) : Math.max(to, Math.min(this.x, stop)); // não atravessa o herói
    if (this.podePisar(to)) this.x = to;
    const golpe = this.caixaGolpe();
    if (!this.hit && golpe && overlap(golpe, heroBox(h))) { this.hit = true; hitHero(P.dano); }
    if (this.t >= P.golpe) { this.state = 'walk'; this.t = 0; this.cd = P.cd; }
  }

  desenhar() {
    const P = this.P, fr = this.quadroAtaque(), parada = fr < 0 && !this.moving && P.idle && P.idle.img.naturalWidth; // parada: a animação idle (se tiver)
    const S = fr >= 0 ? P.atk : parada ? P.idle : P.run;
    const q = fr >= 0 ? fr : parada ? Math.floor(this.ph * P.idle.fps) % S.n : this.moving ? Math.floor(this.ph * (this.cd > 0 || Math.abs(B.hero.x - this.x) < P.perto ? 12 : 7)) % S.n : 0;
    drawShadow(this.x + this.face * 4, this.piso(), P.sombra, fr >= 0 ? P.arcoAt[fr] : 0);
    desenharQuadro(S, q, this.x, this.piso(), { face: this.face, filtro: this.flash > 0 ? FILTRO_ACERTO : this.state === 'arm' ? brilho('#ff2020', 10) : null });
  }
}

// ---------- Lobo (o Vale da sombra): salta mordendo ----------
// lobo-run.webp 6 quadros 190×136 (andando); lobo-attack.webp 6 quadros (agacha → rosna → arma → SALTO → aterrissa → volta)
export class Lobo extends Patrulheiro {
  // voz: os rosnados da pantera negra (gravados, js/core/audio.js → loboSom) — rosna ao ver o herói (no máx. 1 a cada 4 s), rosna
  // forte ao armar o salto, ganido curto ao levar golpe e o rosnado lento ao morrer; o volume cai com a distância (ouvido)
  aoVer() { if (B.time - (this.ultVe ?? -9) > 4) { this.ultVe = B.time; loboSom('ve', .8 * ouvido(this.x)); } }
  aoArmar() { loboSom('rosnar', ouvido(this.x)); }
  // uiva uma vez quando aparece na tela, se o herói ainda não está em cima dele (o lado do som segue o lado do lobo)
  agir(h, dt) {
    if (!this.uivou && this.visivel() && Math.abs(h.x - this.x) > 260) { this.uivou = true; uivoSom(.2, (this.x - B.cam - 480) / 480); }
    super.agir(h, dt);
  }
  sofrer(dano, cor) { super.sofrer(dano, cor); if (!this.dead && B.time - (this.ultDor ?? -9) > .5) { this.ultDor = B.time; loboSom('dor', ouvido(this.x)); } }
  aoMorrer() { loboSom('morte', ouvido(this.x)); }
  static FICHA = { vida: 40, dano: 8, anda: 55, corre: 150, perto: 200, ronda: 170, coleira: 340, arma: .35, golpe: .4, salto: 95, cd: 1.4, ataca: 150, colado: 90,
    run: { img: img(SP + 'lobo-run.webp'), FW: 190, FH: 136, ax: 97, n: 6 }, atk: { img: img(SP + 'lobo-attack.webp'), FW: 190, FH: 136, ax: 97, n: 6 }, nArma: 3, arcoAt: [3, 5, 3, 20, 2, 0],
    caixa: (f, y) => [f.x - 55, y - 72, f.x + 55, y], sombra: 120, som: 'slash', cores: ['70,60,58', '150,40,30'] };
}

// ---------- Soldado esqueleto (Babilônia): estocada de lança — só a ponta fere, até ~145 px à frente ----------
// soldado-run.webp 8 quadros 127×153; soldado-attack.webp 5 quadros 183×129 (arma erguendo a lança em 2, estoca em 3)
export class Soldado extends Patrulheiro {
  static FICHA = { vida: 40, dano: 8, anda: 50, corre: 130, perto: 230, ronda: 160, coleira: 320, arma: .45, golpe: .45, salto: 22, cd: 1.6, ataca: 145, colado: 95,
    run: { img: img(SP + 'soldado-run.webp'), FW: 127, FH: 153, ax: 59, n: 8 }, atk: { img: img(SP + 'soldado-attack.webp'), FW: 183, FH: 129, ax: 34, n: 5 }, nArma: 2, arcoAt: [0, 0, 0, 0, 0],
    caixa: (f, y) => [f.x - 30, y - 125, f.x + 30, y], sombra: 80, som: 'slash', cores: ['200,170,120', '170,40,30'] };
  // sons (gravados, js/core/audio.js): o PASSO a cada vez que um pé bate no chão (quadros 0 e 4 da corrida, a mesma conta do desenho),
  // só na tela; o GEMIDO ao ver o herói (no máx. 1 a cada 4 s), curto ao levar golpe e lento ao morrer; o volume cai com a distância
  agir(h, dt) {
    super.agir(h, dt);
    const corre = this.cd > 0 || Math.abs(h.x - this.x) < this.P.perto, q = Math.floor(this.ph * (corre ? 12 : 7)) % this.P.run.n;
    if (this.moving && q % 4 === 0 && q !== this.ultPasso && this.visivel()) soldadoPassoSom(ouvido(this.x), corre);
    this.ultPasso = this.moving ? q : -1;
  }
  aoVer() { if (B.time - (this.ultVe ?? -9) > 4) { this.ultVe = B.time; soldadoGemidoSom('ve', ouvido(this.x)); } }
  sofrer(dano, cor) { super.sofrer(dano, cor); if (!this.dead && B.time - (this.ultDor ?? -9) > .5) { this.ultDor = B.time; soldadoGemidoSom('dor', ouvido(this.x)); } }
  aoMorrer() { soldadoGemidoSom('morte', ouvido(this.x)); }
  caixaGolpe() { // a ponta da lança, só nos quadros da estocada
    const fr = this.quadroAtaque(), y = GROUND + terrainTop(this.x);
    return fr >= 2 && fr <= 3 ? [Math.min(this.x, this.x + this.face * 145), y - 105, Math.max(this.x, this.x + this.face * 145), y - 40] : null;
  }
}

// ---------- Mulher dos piolhos (As Pragas, Êxodo 8:16–18): de longe PARA e cospe uma nuvem de piolhos ----------
// O ataque vai do 1º ao último quadro (abre os braços, a boca cospe) e VOLTA do último ao 1º. Os piolhos (pontinhos marrons) voam da
// boca até onde o herói estava; a nuvem fere uma vez (o escudo bloqueia). Não morde. Parada: a animação idle.
// piolhenta-run.webp 6 quadros 132×187; piolhenta-attack.webp 6 quadros 214×196; piolhenta-idle.webp 6 quadros 108×198
export class Piolhenta extends Patrulheiro {
  static FICHA = { vida: 30, dano: 7, anda: 50, corre: 120, perto: 420, ronda: 170, coleira: 380, arma: .6, golpe: .75, salto: 0, cd: 2.2, ataca: 330, colado: 240,
    run: { img: img(SP + 'piolhenta-run.webp'), FW: 132, FH: 187, ax: 70, n: 6 }, atk: { img: img(SP + 'piolhenta-attack.webp'), FW: 214, FH: 196, ax: 57, n: 6 },
    idle: { img: img(SP + 'piolhenta-idle.webp'), FW: 108, FH: 198, ax: 43, n: 6, fps: 6 }, nArma: 6, arcoAt: [0, 0, 0, 0, 0, 0],
    caixa: (f, y) => [f.x - 27, y - 145, f.x + 27, y], sombra: 70, som: 'whoosh', cores: ['200,180,140', '110,70,30'] };
  static NUVEM = { boca: [65, 148], n: 16, solta: .3, vel: [330, 470], abre: .2, vida: 1.5 };
  static VOZ = { som: 'piolho', vol: .35, raio: 700 }; // o murmúrio dela em loop, baixo, saindo dela (js/battle/ambiente.js)
  constructor(e) { super(e); this.piol = []; }
  // voz (gravada, js/core/audio.js → piolhentaSom): vomita ao cuspir a nuvem, geme ao levar golpe e, mais grave, ao morrer
  sofrer(dano, cor) { super.sofrer(dano, cor); if (!this.dead && B.time - (this.ultDor ?? -9) > .4) { this.ultDor = B.time; piolhentaSom('dor', ouvido(this.x)); } }
  aoMorrer() { piolhentaSom('morte', ouvido(this.x)); }
  quadroAtaque() { // vai e volta: arma do 1º ao último, golpe do último ao 1º
    const P = this.P, n = P.atk.n;
    if (this.state === 'arm') return Math.min(n - 1, Math.floor(this.t / P.arma * n));
    if (this.state === 'leap') return Math.max(0, n - 1 - Math.floor(Math.max(0, this.t - .2) / (P.golpe - .2) * n));
    return -1;
  }
  caixaGolpe() { return null; } // não morde: só a nuvem fere
  agir(h, dt) { this.voarPiolhos(h, dt); super.agir(h, dt); }
  /** a nuvem: N piolhos saem da boca em sequência, em leque até onde o herói está */
  aoGolpear(h) {
    piolhentaSom('vomito', ouvido(this.x));
    const C = Piolhenta.NUVEM, x = this.x + this.face * C.boca[0], y = GROUND + terrainTop(this.x) - C.boca[1];
    const mira = Math.atan2(GROUND + h.y - 100 - y, h.x - x), volley = { hit: false };
    this.piol = this.piol.filter(p => !p.dead);
    for (let k = 0; k < C.n; k++) {
      const a = mira + (Math.random() - .5) * 2 * C.abre, v = C.vel[0] + Math.random() * (C.vel[1] - C.vel[0]);
      this.piol.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, espera: k / C.n * C.solta, t: 0, volley, r: 2.4 + Math.random() * 1.4, ph: Math.random() * 6 });
    }
  }
  voarPiolhos(h, dt) {
    this.piol.forEach(p => {
      if (p.espera > 0) { p.espera -= dt; return; } // ainda não saiu da boca
      p.t += dt; p.vy += 160 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.t > Piolhenta.NUVEM.vida || p.y > GROUND + terrainTop(p.x) + 5) { p.dead = true; return; }
      if (overlap([p.x - 5, p.y - 5, p.x + 5, p.y + 5], heroBox(h))) { p.dead = true; if (!p.volley.hit) { p.volley.hit = true; hitHero(this.P.dano); } } // a nuvem fere uma vez
    });
    this.piol = this.piol.filter(p => !p.dead);
  }
  desenhar() { super.desenhar(); this.desenharPiolhos(); }
  desenharPiolhos() { // pontinho marrom: corpo oval com contorno escuro e um brilho, tremendo um pouco no voo
    ctx.save();
    this.piol.forEach(p => {
      if (p.espera > 0) return;
      const a = Math.atan2(p.vy, p.vx), w = p.r * (1.15 + .15 * Math.sin(p.ph + p.t * 40));
      ctx.globalAlpha = Math.min(1, (Piolhenta.NUVEM.vida - p.t) / .25); ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(a);
      ctx.fillStyle = '#381808'; ctx.beginPath(); ctx.ellipse(0, 0, w + 1.2, p.r * .8 + 1.2, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#86562a'; ctx.beginPath(); ctx.ellipse(0, 0, w, p.r * .8, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#c08a48'; ctx.beginPath(); ctx.arc(w * .3, -p.r * .25, p.r * .3, 0, 7); ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  }
}
