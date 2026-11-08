import { opts } from './options.js';

// ---------- Som ----------
export let actx;
export function sfx(type) {
  if (!opts.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
    o.connect(g); g.connect(actx.destination);
    const P = {
      hit: ['square', 880, 440, .12, .15], miss: ['sine', 120, 80, .2, .25], refute: ['triangle', 600, 1400, .35, .2],
      beam: ['sawtooth', 1200, 600, .08, .05], block: ['square', 300, 900, .15, .15], hurt: ['sawtooth', 160, 60, .2, .2],
      wrong: ['sine', 200, 150, .2, .2], slash: ['square', 500, 200, .08, .1], whoosh: ['sine', 400, 200, .1, .05], fire: ['sawtooth', 300, 100, .3, .08]
    }[type];
    o.type = P[0]; o.frequency.setValueAtTime(P[1], t); o.frequency.exponentialRampToValueAtTime(P[2], t + P[3]);
    g.gain.setValueAtTime(P[4], t); g.gain.exponentialRampToValueAtTime(.001, t + P[3]);
    o.start(t); o.stop(t + P[3]);
  } catch (e) {}
  if (navigator.vibrate && (type === 'hit' || type === 'hurt')) navigator.vibrate(30);
}

// Fatality: batida de metal + trecho curto de melodia medieval (~2s), tudo sintetizado
export function fatalSound() {
  if (!opts.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = actx.currentTime, out = actx.createGain(); out.gain.value = .5; out.connect(actx.destination);
    // metal: parciais inarmônicos com decaimento rápido + estalo de ruído
    [523, 1307, 2091, 2960, 3870].forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.value = f; o.connect(g); g.connect(out);
      g.gain.setValueAtTime(.35 / (i + 1), t0); g.gain.exponentialRampToValueAtTime(.001, t0 + .9 - i * .12);
      o.start(t0); o.stop(t0 + 1);
    });
    const n = actx.createBuffer(1, actx.sampleRate * .08, actx.sampleRate), d = n.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const ns = actx.createBufferSource(), nf = actx.createBiquadFilter(), ng = actx.createGain();
    ns.buffer = n; nf.type = 'highpass'; nf.frequency.value = 2500; ng.gain.value = .5;
    ns.connect(nf); nf.connect(ng); ng.connect(out); ns.start(t0);
    // melodia em Ré dórico, timbre de alaúde (dente de serra filtrado) sobre bordão de quinta
    const notes = [[62, .18], [65, .18], [67, .18], [69, .36], [67, .18], [65, .18], [64, .18], [62, .5]];
    const lute = (midi, at, dur, vol) => {
      const o = actx.createOscillator(), f = actx.createBiquadFilter(), g = actx.createGain();
      o.type = 'sawtooth'; o.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
      f.type = 'lowpass'; f.frequency.setValueAtTime(2400, at); f.frequency.exponentialRampToValueAtTime(500, at + dur);
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + .01); g.gain.exponentialRampToValueAtTime(.001, at + dur + .15);
      o.connect(f); f.connect(g); g.connect(out); o.start(at); o.stop(at + dur + .2);
    };
    let at = t0 + .25;
    notes.forEach(([m, dur]) => { lute(m, at, dur, .16); at += dur; });
    lute(50, t0 + .25, at - t0 - .25, .07); lute(57, t0 + .25, at - t0 - .25, .05); // bordão Ré + Lá
  } catch (e) {}
}

// Espada (sintetizada): ruído filtrado = o ar/lâmina e o corpo; senoides = a pancada e o laser.
//   'swing' = só vento, a lâmina cortando o ar ("fu!"), sempre igual · 'laser' = vento leve + feixe de luz fino (golpe com poder) · 'cut' = golpe acertando o corpo do inimigo (carne, sem metal)
const noise = len => { const b = actx.createBuffer(1, Math.ceil(actx.sampleRate * len), actx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; };
export function swordSfx(kind) {
  if (!opts.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime, out = actx.createGain(); out.gain.value = .55; out.connect(actx.destination);
    const hiss = (len, f0, f1, q, vol, type = 'bandpass', at = t) => { // ruído com filtro varrendo f0 → f1
      const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
      s.buffer = noise(len); f.type = type; f.Q.value = q; f.frequency.setValueAtTime(f0, at); f.frequency.exponentialRampToValueAtTime(f1, at + len);
      g.gain.setValueAtTime(.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + len * .35); g.gain.exponentialRampToValueAtTime(.0005, at + len);
      s.connect(f); f.connect(g); g.connect(out); s.start(at);
    };
    if (kind === 'swing') {
      hiss(.17, 380, 1300, .8, 1.3); // sopro curto: o filtro sobe e cai rápido, sem tom de metal
    } else if (kind === 'laser') { // poder do versículo: vento leve + feixe de luz fino (senoides limpas que deslizam, sem zumbido grave)
      hiss(.22, 1000, 3300, .8, .6);
      const L = .3;
      [[2050, 870, .14], [3075, 1300, .05]].forEach(([f0, f1, v]) => { // o feixe e um harmônico bem baixo
        const o = actx.createOscillator(), g = actx.createGain(), vib = actx.createOscillator(), vg = actx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + L);
        vib.frequency.value = 38; vg.gain.value = f0 * .012; vib.connect(vg); vg.connect(o.frequency); // tremor leve = brilho de energia
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .02); g.gain.exponentialRampToValueAtTime(.0005, t + L);
        o.connect(g); g.connect(out); o.start(t); o.stop(t + L); vib.start(t); vib.stop(t + L);
      });
    } else if (kind === 'cut') { // golpe na carne: pancada surda + tapa úmido do corte, sem nada de metal
      const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; // a pancada no corpo
      o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(48, t + .14);
      g.gain.setValueAtTime(.9, t); g.gain.exponentialRampToValueAtTime(.001, t + .16); o.connect(g); g.connect(out); o.start(t); o.stop(t + .17);
      hiss(.09, 1800, 500, .9, 1.3, 'lowpass'); // o tapa (ruído abafado, curto)
      hiss(.13, 900, 350, 2.5, .6, 'bandpass', t + .015); // o rasgo úmido logo depois
    }
  } catch (e) {}
}

// Ídolo (bezerro de ouro) apanhando como uma construção: tudo sintetizado com ruído filtrado + batidas graves
//   'crack'    = cada golpe: estalo seco, trincas pipocando e cascalho escorrendo (mais forte quanto mais rachado: dano 0–1)
//   'collapse' = o último golpe: estrondo grave, a estrutura desabando e os pedaços batendo no chão (~1,4 s)
export function stoneSfx(kind, dano = 0) {
  if (!opts.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime, out = actx.createGain(); out.gain.value = .7; out.connect(actx.destination);
    const burst = (at, len, type, f, q, vol, f1 = f) => { // ruído filtrado com ataque instantâneo e queda exponencial
      const s = actx.createBufferSource(), fl = actx.createBiquadFilter(), g = actx.createGain();
      s.buffer = noise(len); fl.type = type; fl.frequency.setValueAtTime(f, at); fl.frequency.exponentialRampToValueAtTime(f1, at + len); fl.Q.value = q;
      g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(.0005, at + len);
      s.connect(fl); fl.connect(g); g.connect(out); s.start(at);
    };
    const thump = (at, f0, vol, len = .18) => { // batida grave de pedra pesada
      const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine';
      o.frequency.setValueAtTime(f0, at); o.frequency.exponentialRampToValueAtTime(f0 * .45, at + len);
      g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(.0005, at + len); o.connect(g); g.connect(out); o.start(at); o.stop(at + len);
    };
    const crack = (at, k) => { // estalo + trincas + cascalho
      burst(at, .035, 'highpass', 1800, .7, 1.2);
      thump(at, 110, .55 + k * .3);
      const n = 3 + Math.round(k * 4);
      for (let i = 0; i < n; i++) burst(at + .02 + Math.random() * (.1 + k * .1), .018, 'bandpass', 2200 + Math.random() * 2500, 2.5, .5 + Math.random() * .4);
      burst(at + .03, .3 + k * .25, 'lowpass', 1400, .6, .35 + k * .2, 300); // cascalho escorrendo
    };
    if (kind === 'crack') crack(t, dano);
    else if (kind === 'collapse') {
      crack(t, 1);
      burst(t + .05, 1.4, 'lowpass', 260, .8, .9, 70); // estrondo: a estrutura cedendo
      thump(t + .08, 75, .8, .5);
      for (let i = 0; i < 9; i++) { // pedaços caindo e batendo no chão, cada vez mais leves
        const at = t + .15 + i * .11 + Math.random() * .08, v = 1 - i / 10;
        thump(at, 90 + Math.random() * 60, .5 * v); burst(at, .12, 'bandpass', 500 + Math.random() * 500, 1.2, .5 * v);
      }
      burst(t + .3, 1, 'bandpass', 2600, 1.5, .18, 1400); // poeira e cascalho no fim
    }
  } catch (e) {}
}
