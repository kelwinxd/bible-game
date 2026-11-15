// Rachaduras reaproveitáveis para qualquer painel retangular (balão da mentira, placas, cartazes…).
// Tudo é sorteado uma vez por semente, em coordenadas 0–1 do painel: o mesmo painel racha sempre do mesmo jeito,
// em qualquer tamanho. Três estágios:
//   0 = inteiro · 1 = rachado (riscos saindo das bordas) · 2 = despedaçado (mais riscos e pedaços faltando nas bordas)
// Uso:
//   const r = new Rachaduras(semente);
//   ctx.save(); r.recortar(ctx, x, y, w, h, est); …desenha o painel…; r.riscar(ctx, x, y, w, h, est); ctx.restore();
//   r.lascas(x, y, w, h, est) → partículas soltas quando o painel muda de estágio (ou quebra: est = 3)
export class Rachaduras {
  // estágio pela fração de vida que resta (1 = cheia): acima de 2/3 inteiro, acima de 1/3 rachado, abaixo despedaçado
  static estagio(frac) { return frac > 2 / 3 ? 0 : frac > 1 / 3 ? 1 : 2; }

  constructor(semente = 1) {
    let s = (semente * 2654435761) >>> 0 || 1;
    const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
    // um risco: parte de uma borda e avança para dentro em zigue-zague, às vezes com um galho
    const risco = (borda) => {
      const p = borda === 0 ? [.15 + rnd() * .7, 0] : borda === 1 ? [.15 + rnd() * .7, 1] : borda === 2 ? [0, .2 + rnd() * .6] : [1, .2 + rnd() * .6];
      const dir = borda === 0 ? [0, 1] : borda === 1 ? [0, -1] : borda === 2 ? [1, 0] : [-1, 0];
      // de cima/baixo: atravessa o painel quase na vertical; das laterais: curto, só na beira (não risca o texto na horizontal)
      const lado = borda >= 2, pts = [p.slice()], n = lado ? 2 + Math.floor(rnd() * 2) : 3 + Math.floor(rnd() * 2);
      for (let i = 0; i < n; i++) {
        const last = pts[pts.length - 1];
        pts.push(lado ? [last[0] + dir[0] * .05 + (rnd() - .5) * .03, last[1] + (rnd() - .5) * .3]
          : [last[0] + (rnd() - .5) * .12, last[1] + dir[1] * .22 + (rnd() - .5) * .08]);
      }
      const k = 1 + Math.floor(rnd() * (pts.length - 2)), g = pts[k];
      const galho = [g.slice(), [g[0] + (rnd() - .5) * .16, g[1] + (rnd() - .5) * .4]];
      return [pts, galho];
    };
    const b1 = Math.floor(rnd() * 2); // o 1º risco sai de cima ou de baixo; o 2º da borda oposta
    this.riscos = [
      risco(b1), risco(1 - b1), // estágio 1
      risco(2 + Math.floor(rnd() * 2)), risco(Math.floor(rnd() * 4)) // + estágio 2
    ];
    // pedaços que faltam no estágio 2: dois cantos opostos + uma mordida numa borda (longe do centro, onde fica o texto)
    const canto = (cx, cy) => {
      const w = .09 + rnd() * .05, h = .38 + rnd() * .14, sx = cx ? -1 : 1, sy = cy ? -1 : 1; // na beira: a frase continua legível
      return [[cx - sx * .02, cy - sy * .05], [cx + sx * w, cy - sy * .05], [cx + sx * w * .6, cy + sy * h * .45], [cx + sx * w * .25, cy + sy * h * .6], [cx - sx * .02, cy + sy * h]];
    };
    // mordida numa borda, fora do meio (lá fica a ponta do balão)
    const c = Math.floor(rnd() * 2), mx = (rnd() < .5 ? .2 : .66) + rnd() * .14, mw = .06 + rnd() * .05, emCima = rnd() < .5, y0 = emCima ? -.05 : 1.05, dy = emCima ? 1 : -1;
    this.pedacos = [canto(c, 0), canto(1 - c, 1),
      [[mx - mw, y0], [mx - mw * .4, y0 + dy * (.15 + rnd() * .06)], [mx + mw * .2, y0 + dy * (.2 + rnd() * .06)], [mx + mw, y0]]];
  }
  // tira do desenho os pedaços que faltam (chamar antes de desenhar o painel, dentro de um save/restore)
  recortar(ctx, x, y, w, h, est) {
    if (est < 2) return;
    ctx.beginPath(); ctx.rect(x - 60, y - 60, w + 120, h + 120); // folga para a ponta do balão e o brilho
    this.pedacos.forEach(p => { p.forEach(([u, v], i) => i ? ctx.lineTo(x + u * w, y + v * h) : ctx.moveTo(x + u * w, y + v * h)); ctx.closePath(); });
    ctx.clip('evenodd');
  }
  // risca as rachaduras (e a borda quebrada dos pedaços) por cima do painel; contorno = forma do painel (os riscos não vazam)
  riscar(ctx, x, y, w, h, est, cor = '#3a0c0c', contorno = null) {
    if (est < 1) return;
    ctx.save();
    if (contorno) { contorno(ctx); ctx.clip(); }
    const linha = pts => { ctx.beginPath(); pts.forEach(([u, v], i) => i ? ctx.lineTo(x + u * w, y + v * h) : ctx.moveTo(x + u * w, y + v * h)); };
    const riscos = this.riscos.slice(0, est >= 2 ? 4 : 2);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.translate(1, 1); ctx.strokeStyle = '#ffffff99'; ctx.lineWidth = 1.2; // luz na beira de cada risco (dá profundidade)
    riscos.forEach(([pts, galho]) => { linha(pts); ctx.stroke(); linha(galho); ctx.stroke(); });
    ctx.translate(-1, -1); ctx.strokeStyle = cor; ctx.lineWidth = 1.8;
    riscos.forEach(([pts, galho]) => { linha(pts); ctx.stroke(); ctx.lineWidth = 1.2; linha(galho); ctx.stroke(); ctx.lineWidth = 1.8; });
    if (est >= 2) { ctx.lineWidth = 2.4; this.pedacos.forEach(p => { linha(p); ctx.closePath(); ctx.stroke(); }); } // beira quebrada
    ctx.restore();
  }
  // lascas que se soltam ao mudar de estágio (est = 3: o painel inteiro estoura). Formato das partículas de B.shards.
  lascas(x, y, w, h, est, c = '247,239,226') {
    const n = est >= 3 ? 26 : est === 2 ? 10 : 5, out = [];
    for (let i = 0; i < n; i++) {
      const p = est === 2 ? this.pedacos[i % 3][2] : [Math.random(), Math.random()]; // estágio 2: saem de onde abriu o buraco
      out.push({ x: x + p[0] * w + (Math.random() - .5) * 16, y: y + p[1] * h, vx: (Math.random() - .5) * (est >= 3 ? 420 : 200),
        vy: -Math.random() * (est >= 3 ? 320 : 140), r: Math.random() * 6, t: est >= 3 ? 1 : .8, c, sz: .5 + Math.random() * .7 });
    }
    return out;
  }
}
