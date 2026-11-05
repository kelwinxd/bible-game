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
