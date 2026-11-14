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
      wrong: ['sine', 200, 150, .2, .2], slash: ['square', 500, 200, .08, .1], whoosh: ['sine', 400, 200, .1, .05], fire: ['sawtooth', 300, 100, .3, .08],
      croak: ['sawtooth', 150, 85, .14, .07] // rã pulando
    }[type];
    o.type = P[0]; o.frequency.setValueAtTime(P[1], t); o.frequency.exponentialRampToValueAtTime(P[2], t + P[3]);
    g.gain.setValueAtTime(P[4], t); g.gain.exponentialRampToValueAtTime(.001, t + P[3]);
    o.start(t); o.stop(t + P[3]);
  } catch (e) {}
  if (navigator.vibrate && (type === 'hit' || type === 'hurt')) navigator.vibrate(30);
}

// balido de ovelha, baixinho: "mééé" — dente de serra filtrado (voz anasalada) com tremolo rápido (o tremido do balido),
// o tom cai um pouco no fim; vol = volume (baixo por padrão)
export function bleat(vol = .05) {
  if (!opts.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime, d = .75 + Math.random() * .2, f0 = 330 + Math.random() * 60;
    const o = actx.createOscillator(), lp = actx.createBiquadFilter(), bp = actx.createBiquadFilter(), g = actx.createGain(), trem = actx.createGain();
    const lfo = actx.createOscillator(), lg = actx.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * 1.08, t + .12); o.frequency.linearRampToValueAtTime(f0 * .88, t + d);
    lp.type = 'lowpass'; lp.frequency.value = 1800; bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 1.2;
    lfo.frequency.value = 26; lg.gain.value = .45; lfo.connect(lg); lg.connect(trem.gain); trem.gain.value = .55; // tremolo
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .06); g.gain.setValueAtTime(vol, t + d * .7); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(lp); lp.connect(bp); bp.connect(trem); trem.connect(g); g.connect(actx.destination);
    o.start(t); lfo.start(t); o.stop(t + d + .05); lfo.stop(t + d + .05);
  } catch (e) {}
}

// som celestial (pegar o livro/a Bíblia): coro suave que cresce + arpejo de sinos de vidro subindo + brilho, com cauda longa (eco)
export function celestial() {
  if (!opts.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime, out = actx.createGain(); out.gain.value = .5;
    const eco = actx.createDelay(1), fb = actx.createGain(), wet = actx.createGain(); eco.delayTime.value = .19; fb.gain.value = .38; wet.gain.value = .35;
    out.connect(actx.destination); out.connect(eco); eco.connect(fb); fb.connect(eco); eco.connect(wet); wet.connect(actx.destination);
    // coro: acorde de Ré maior com 3 vozes levemente desafinadas cada, filtro suave, vibrato lento, entra e sai devagar
    const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1900; lp.connect(out);
    [294, 440, 587, 740, 880].forEach(f => [-8, 0, 8].forEach(d => {
      const o = actx.createOscillator(), g = actx.createGain(), vib = actx.createOscillator(), vg = actx.createGain();
      o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = d; vib.frequency.value = 5 + Math.random(); vg.gain.value = 6; vib.connect(vg); vg.connect(o.detune);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.012, t + .35); g.gain.setValueAtTime(.012, t + .9); g.gain.exponentialRampToValueAtTime(.0001, t + 1.9);
      o.connect(g); g.connect(lp); o.start(t); o.stop(t + 2); vib.start(t); vib.stop(t + 2);
    }));
    // sinos de vidro: arpejo subindo (cada nota com um parcial de sino por cima)
    [1175, 1480, 1760, 2349, 2960, 3520].forEach((f, i) => {
      const at = t + .05 + i * .07;
      [[1, .1], [2.76, .025]].forEach(([m, v]) => {
        const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = f * m;
        g.gain.setValueAtTime(.0001, at); g.gain.exponentialRampToValueAtTime(v, at + .008); g.gain.exponentialRampToValueAtTime(.0001, at + .9);
        o.connect(g); g.connect(out); o.start(at); o.stop(at + .92);
      });
    });
    // brilho: chiado agudo bem baixinho subindo
    const n = actx.createBufferSource(), nf = actx.createBiquadFilter(), ng = actx.createGain();
    n.buffer = noise(1.2); nf.type = 'bandpass'; nf.Q.value = 3; nf.frequency.setValueAtTime(4000, t); nf.frequency.exponentialRampToValueAtTime(9000, t + 1.2);
    ng.gain.setValueAtTime(.0001, t); ng.gain.exponentialRampToValueAtTime(.06, t + .3); ng.gain.exponentialRampToValueAtTime(.0001, t + 1.2);
    n.connect(nf); nf.connect(ng); ng.connect(out); n.start(t);
  } catch (e) {}
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
    } else if (kind === 'laser') { // poder do versículo: rajada de luz — sopro que sobe + acorde brilhante que abre + sininho no fim
      hiss(.32, 500, 5200, 1.1, .9); // o sopro de energia subindo
      const o0 = actx.createOscillator(), g0 = actx.createGain(); o0.type = 'sine'; // o "tum" do impulso
      o0.frequency.setValueAtTime(120, t); o0.frequency.exponentialRampToValueAtTime(55, t + .18);
      g0.gain.setValueAtTime(.5, t); g0.gain.exponentialRampToValueAtTime(.001, t + .2); o0.connect(g0); g0.connect(out); o0.start(t); o0.stop(t + .21);
      const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 4; lp.frequency.setValueAtTime(600, t); lp.frequency.exponentialRampToValueAtTime(7000, t + .22); lp.connect(out);
      [523, 659, 784, 1047].forEach((f, i) => { // acorde maior que sobe uma oitava e abre o filtro (brilho, sem zumbido)
        const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sawtooth'; o.detune.value = (i - 1.5) * 7;
        o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 2, t + .22);
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.05, t + .03); g.gain.exponentialRampToValueAtTime(.0005, t + .42);
        o.connect(g); g.connect(lp); o.start(t); o.stop(t + .43);
      });
      [2093, 3136].forEach((f, i) => { // o sininho de luz quando o corte sai
        const o = actx.createOscillator(), g = actx.createGain(), at = t + .12 + i * .05; o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(.0001, at); g.gain.exponentialRampToValueAtTime(.09, at + .01); g.gain.exponentialRampToValueAtTime(.0005, at + .5);
        o.connect(g); g.connect(out); o.start(at); o.stop(at + .52);
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

// ---------- Sons gravados (assets/audio) ----------
// escudo.mp3 (~8,7 s, um zumbido contínuo): toca EM LOOP enquanto o escudo está erguido (entra e sai com fade curto)
// poder.mp3 (~4,2 s): o golpe com o poder do versículo (no lugar do 'laser' sintetizado, que fica de reserva até carregar)
const RAW = { escudo: 'assets/audio/escudo.mp3', poder: 'assets/audio/poder.mp3' }, BUF = {}, BYTES = {};
for (const k in RAW) fetch(RAW[k]).then(r => r.ok ? r.arrayBuffer() : null).then(a => { BYTES[k] = a; decode(); }).catch(() => {});
function decode() { // só decodifica depois que o AudioContext existe (ele nasce no 1º som, já com um clique/tecla do jogador)
  if (!actx) return;
  for (const k in BYTES) if (BYTES[k] && !BUF[k]) { const a = BYTES[k]; BYTES[k] = null; actx.decodeAudioData(a).then(b => { BUF[k] = b; }).catch(() => {}); }
}
function ctxOk() {
  actx = actx || new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === 'suspended') actx.resume();
  decode(); return actx;
}
// golpe com poder; devolve false se o arquivo ainda não carregou (aí quem chama usa o som sintetizado)
export function poderSfx() {
  if (!opts.sound) return true;
  try {
    ctxOk(); if (!BUF.poder) return false;
    const s = actx.createBufferSource(), g = actx.createGain(); s.buffer = BUF.poder; g.gain.value = .4;
    s.connect(g); g.connect(actx.destination); s.start(); return true;
  } catch (e) { return false; }
}
// versículo certo: um trecho de ~1 s do mesmo som do escudo, MAIS AGUDO (tocado 1,6× mais rápido), com fade; false se não carregou
export function acertoSfx() {
  if (!opts.sound) return true;
  try {
    ctxOk(); if (!BUF.escudo) return false;
    const s = actx.createBufferSource(), g = actx.createGain(), t = actx.currentTime, dur = 1;
    s.buffer = BUF.escudo; s.playbackRate.value = 1.6;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.45, t + .03); g.gain.setValueAtTime(.45, t + .4); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(g); g.connect(actx.destination); s.start(t, .3, dur * 1.6 + .05); return true;
  } catch (e) { return false; }
}
let esc = null; // o loop do escudo tocando agora: { s, g }
export function escudoSom(on) {
  try {
    if (on && opts.sound) {
      ctxOk(); if (esc || !BUF.escudo) return;
      const s = actx.createBufferSource(), g = actx.createGain(), t = actx.currentTime;
      s.buffer = BUF.escudo; s.loop = true; s.loopStart = .3; s.loopEnd = 8.4; // o miolo contínuo, sem o começo nem o fade do fim
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.35, t + .08);
      s.connect(g); g.connect(actx.destination); s.start(); esc = { s, g };
    } else if (esc) {
      const { s, g } = esc, t = actx.currentTime; esc = null;
      g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.exponentialRampToValueAtTime(.0001, t + .15); s.stop(t + .16);
    }
  } catch (e) {}
}
