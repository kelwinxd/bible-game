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
// bichos (gravados, assets/audio/sound-effects/<bicho>.mp3): ra = 6 coaxares · dragao = rugido de T-Rex (~1,5 s) · cobra = sibilo (~1,6 s) · lobo = 2 rosnados de pantera negra (um calmo, um forte) · uivo = uivo de lobo (~5 s) · piolho = o murmúrio da mulher dos piolhos (loop de ~10 s) · ave = grito de ave de rapina · coruja = 2 piados · passo = 1 passo do soldado esqueleto (~0,7 s) · gemido = o gemido do soldado (~1,2 s) · reiChamas / reiInvoca / ignicao = o lança-chamas, a invocação e a coluna de fogo do Nabucodonosor · caverna = o ambiente da caverna (gotas, eco; loop de 30 s, gravado baixo)
const RAW = { escudo: 'assets/audio/escudo.mp3', poder: 'assets/audio/poder.mp3',
  ra: 'assets/audio/sound-effects/ra.mp3', dragao: 'assets/audio/sound-effects/dragao.mp3',
  cobra: 'assets/audio/sound-effects/cobra.mp3', lobo: 'assets/audio/sound-effects/lobo-rosnado.mp3', uivo: 'assets/audio/sound-effects/lobo-uivo.mp3', piolho: 'assets/audio/sound-effects/mulher-piolho.mp3',
  vomito: 'assets/audio/sound-effects/piolhenta-vomito.mp3', piolhentaDor: 'assets/audio/sound-effects/piolhenta-dor.mp3',
  heroiDano: 'assets/audio/sound-effects/heroi-dano.mp3', mugido: 'assets/audio/sound-effects/boi.mp3', goliasGrito: 'assets/audio/sound-effects/golias-grito.mp3', passo: 'assets/audio/sound-effects/soldado-passo.mp3', gemido: 'assets/audio/sound-effects/soldado-gemido.mp3', reiChamas: 'assets/audio/sound-effects/rei-lanca-chamas.mp3', reiInvoca: 'assets/audio/sound-effects/rei-invocacao.mp3', ignicao: 'assets/audio/sound-effects/coluna-de-fogo.mp3', caverna: 'assets/audio/sound-effects/caverna-ambiente.mp3', ave: 'assets/audio/sound-effects/ave.mp3', coruja: 'assets/audio/sound-effects/coruja.mp3' }, BUF = {}, BYTES = {};
for (const k in RAW) fetch(encodeURI(RAW[k])).then(r => r.ok ? r.arrayBuffer() : null).then(a => { BYTES[k] = a; decode(); }).catch(() => {});
function decode() { // só decodifica depois que o AudioContext existe (ele nasce no 1º som, já com um clique/tecla do jogador)
  if (!actx) return;
  for (const k in BYTES) if (BYTES[k] && !BUF[k]) { const a = BYTES[k]; BYTES[k] = null; actx.decodeAudioData(a).then(b => { BUF[k] = b; }).catch(() => {}); }
}
// já no 1º clique/tecla (o navegador só deixa criar o áudio depois de um gesto): cria o AudioContext e decodifica os sons
// gravados, para o 1º coaxar/rugido da jornada já sair do arquivo (e não da reserva sintetizada)
const preparar = () => { try { ctxOk(); } catch (e) {} removeEventListener('pointerdown', preparar); removeEventListener('keydown', preparar); };
addEventListener('pointerdown', preparar); addEventListener('keydown', preparar);
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

// ---------- Mar (ambiente, sintetizado) ----------
// Ondas indo e vindo: ruído rosa em loop por 2 filtros — grave (o corpo da onda, "shhhuuu") e agudo (a espuma) — com o volume
// subindo e descendo devagar (uma onda a cada ~8 s) e o grave mudando de cor aos poucos. Fica sempre ligado em silêncio;
// marSom(vol, pan) só ajusta o volume (0–1) e o lado (-1 esquerda … 1 direita), com transição suave (js/battle/ambiente.js)
let mar = null;
function criarMar() {
  const n = actx.sampleRate * 6, buf = actx.createBuffer(1, n, actx.sampleRate), d = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0; // ruído rosa (filtro de Paul Kellet, versão leve): soa como água, o branco soa como chiado
  for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; b0 = .99765 * b0 + w * .099046; b1 = .963 * b1 + w * .2965164; b2 = .57 * b2 + w * 1.0526913; d[i] = (b0 + b1 + b2 + w * .1848) * .18; }
  const fade = 2000; for (let i = 0; i < fade; i++) { const k = i / fade; d[i] = d[i] * k + d[n - fade + i] * (1 - k); } // emenda do loop sem estalo
  const src = actx.createBufferSource(); src.buffer = buf; src.loop = true;
  const out = actx.createGain(); out.gain.value = 0;
  const pan = actx.createStereoPanner ? actx.createStereoPanner() : null;
  if (pan) { out.connect(pan); pan.connect(actx.destination); } else out.connect(actx.destination);
  const onda = actx.createOscillator(); onda.frequency.value = .125; // o ritmo das ondas
  const cor = actx.createOscillator(); cor.frequency.value = .043; // o grave clareia e escurece devagar
  // grave: o corpo da onda
  const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520; lp.Q.value = .6;
  const cg = actx.createGain(); cg.gain.value = 220; cor.connect(cg); cg.connect(lp.frequency);
  const gGrave = actx.createGain(); gGrave.gain.value = .55; const og = actx.createGain(); og.gain.value = .4; onda.connect(og); og.connect(gGrave.gain);
  // agudo: a espuma quebrando no alto da onda
  const bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2200; bp.Q.value = .5;
  const gEsp = actx.createGain(); gEsp.gain.value = .1; const oe = actx.createGain(); oe.gain.value = .09; onda.connect(oe); oe.connect(gEsp.gain);
  src.connect(lp); lp.connect(gGrave); gGrave.connect(out);
  src.connect(bp); bp.connect(gEsp); gEsp.connect(out);
  src.start(); onda.start(); cor.start();
  return { out, pan, vol: 0 };
}
export function marSom(vol, p = 0) {
  try {
    if (!opts.sound) vol = 0;
    if (!mar) { if (vol <= 0) return; ctxOk(); mar = criarMar(); }
    const t = actx.currentTime, alvo = vol * .38; // volume máximo do mar (em cima da água)
    if (Math.abs(alvo - mar.vol) > .002) { mar.vol = alvo; mar.out.gain.setTargetAtTime(alvo, t, .25); }
    if (mar.pan) mar.pan.pan.setTargetAtTime(Math.max(-1, Math.min(1, p)), t, .2);
  } catch (e) {}
}
// aba escondida: o jogo para (sem quadros), então o mar silencia na hora
document.addEventListener('visibilitychange', () => { if (document.hidden && mar) { mar.vol = 0; mar.out.gain.setTargetAtTime(0, actx.currentTime, .05); } });

// ---------- Vozes dos bichos (sintetizadas) ----------
// distorção leve (dá a aspereza da garganta)
let curvaAspera = null;
function aspera() {
  if (!curvaAspera) { const n = 1024; curvaAspera = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i / (n - 1) * 2 - 1; curvaAspera[i] = Math.tanh(x * 3.2); } }
  const w = actx.createWaveShaper(); w.curve = curvaAspera; return w;
}
// (reserva sintetizada, enquanto o arquivo gravado não carregou)
// Rã: 'coaxar' = "crroac-crroac" (2 pulsos curtos: dente de serra com o volume batendo rápido — o "rrr" — num filtro nasal);
//      'grito' = o guincho curto quando morre. vol 0–1 (quem chama já põe a distância); tom = 0.8–1.2 (cada rã um pouco diferente)
function sapoSint(kind = 'coaxar', vol = 1, tom = 1) {
  if (!opts.sound || vol <= .01) return;
  try {
    ctxOk(); const t = actx.currentTime, out = actx.createGain(); out.gain.value = .55 * vol; out.connect(actx.destination);
    const pulso = (at, dur, f0, f1, v) => {
      const o = actx.createOscillator(), am = actx.createOscillator(), amg = actx.createGain(), g = actx.createGain(), bp = actx.createBiquadFilter(), bp2 = actx.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(f0 * tom, at); o.frequency.exponentialRampToValueAtTime(f1 * tom, at + dur);
      am.type = 'square'; am.frequency.value = 62 * tom; amg.gain.value = .5; am.connect(amg); amg.connect(g.gain); // o "rrr"
      bp.type = 'bandpass'; bp.frequency.value = 850 * tom; bp.Q.value = 2.5; bp2.type = 'bandpass'; bp2.frequency.value = 380 * tom; bp2.Q.value = 3;
      const env = actx.createGain(); env.gain.setValueAtTime(.0001, at); env.gain.exponentialRampToValueAtTime(v, at + .012); env.gain.setValueAtTime(v, at + dur * .6); env.gain.exponentialRampToValueAtTime(.0001, at + dur);
      g.gain.value = .5; o.connect(g); g.connect(bp); g.connect(bp2); bp.connect(env); bp2.connect(env); env.connect(out);
      o.start(at); am.start(at); o.stop(at + dur + .02); am.stop(at + dur + .02);
    };
    if (kind === 'grito') {
      const o = actx.createOscillator(), g = actx.createGain(); o.type = 'triangle';
      o.frequency.setValueAtTime(1100 * tom, t); o.frequency.exponentialRampToValueAtTime(320 * tom, t + .22);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.35, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + .24);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + .25);
      pulso(t + .05, .16, 260, 150, .9);
    } else { pulso(t, .11, 300, 220, 1); pulso(t + .17, .14, 280, 190, 1); }
  } catch (e) {}
}
// Dragão / serpente / leão: tudo grave, áspero e com respiração (ruído).
//   'rosnar' = rosnado baixo e trêmulo (~0,8 s: o aviso antes do bote) · 'rugido' = sobe e desce, forte (~1,3 s: chegou, surgiu)
//   'dor'    = grunhido curto ao levar golpe                         · 'morte'  = rugido longo que cai e some (~1,8 s)
// grave = 0.7–1.3 (menor = mais grave/maior)
function dragaoSint(kind = 'rosnar', vol = 1, grave = 1) {
  if (!opts.sound || vol <= .01) return;
  try {
    ctxOk(); const t = actx.currentTime;
    const P = { rosnar: { d: .8, f: [62, 70, 55], ruido: [380, 520, 300], v: .5, trem: 22 },
                rugido: { d: 1.3, f: [95, 175, 70], ruido: [500, 1500, 380], v: .6, trem: 30 },
                dor:    { d: .35, f: [150, 120, 80], ruido: [700, 900, 400], v: .5, trem: 35 },
                morte:  { d: 1.8, f: [140, 120, 38], ruido: [1200, 700, 160], v: .6, trem: 26 } }[kind];
    const out = actx.createGain(); out.gain.value = P.v * vol; out.connect(actx.destination);
    const env = actx.createGain(), d = P.d; // ataque rápido, segura e cai
    env.gain.setValueAtTime(.0001, t); env.gain.exponentialRampToValueAtTime(1, t + Math.min(.12, d * .2)); env.gain.setValueAtTime(1, t + d * .55); env.gain.exponentialRampToValueAtTime(.0001, t + d);
    const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(700, t); lp.frequency.linearRampToValueAtTime(kind === 'rugido' ? 1600 : 900, t + d * .4); lp.frequency.linearRampToValueAtTime(400, t + d);
    const dist = aspera(); dist.connect(lp); lp.connect(env); env.connect(out);
    const trem = actx.createGain(); trem.gain.value = .65; trem.connect(dist); // tremor da garganta
    const lfo = actx.createOscillator(), lg = actx.createGain(); lfo.type = 'sawtooth'; lfo.frequency.value = P.trem; lg.gain.value = .35; lfo.connect(lg); lg.connect(trem.gain);
    const [f0, f1, f2] = P.f.map(f => f / grave);
    [[0, 'sawtooth', .5], [-14, 'sawtooth', .35], [1200, 'square', .06]].forEach(([det, tp, v]) => { // a voz: 2 serras desafinadas + um harmônico
      const o = actx.createOscillator(), g = actx.createGain(); o.type = tp; o.detune.value = det + (Math.random() - .5) * 20;
      o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f1, t + d * .35); o.frequency.exponentialRampToValueAtTime(f2, t + d);
      g.gain.value = v; o.connect(g); g.connect(trem); o.start(t); o.stop(t + d + .05);
    });
    const n = actx.createBufferSource(), nf = actx.createBiquadFilter(), ng = actx.createGain(); // o bafo
    n.buffer = noise(d + .05); nf.type = 'bandpass'; nf.Q.value = 1.4;
    const [r0, r1, r2] = P.ruido.map(f => f / grave); nf.frequency.setValueAtTime(r0, t); nf.frequency.linearRampToValueAtTime(r1, t + d * .35); nf.frequency.exponentialRampToValueAtTime(r2, t + d);
    ng.gain.value = .9; n.connect(nf); nf.connect(ng); ng.connect(trem); n.start(t);
    lfo.start(t); lfo.stop(t + d + .05);
  } catch (e) {}
}

// ---------- Vozes gravadas ----------
// toca um trecho de um som carregado: ini/dur em s do arquivo, rate = velocidade (< 1 = mais grave e lento), lp = filtro passa-baixa
// (Hz, abafa), pan −1…1; fade curto nas pontas para não estalar. false se o arquivo ainda não carregou
function amostra(k, { ini = 0, dur, rate = 1, vol = 1, lp = 0, pan = 0 } = {}) {
  if (!opts.sound) return true;
  try {
    ctxOk(); const b = BUF[k]; if (!b) return false;
    const t = actx.currentTime, d = Math.min(dur ?? b.duration - ini, b.duration - ini), real = d / rate;
    const s = actx.createBufferSource(), g = actx.createGain(); s.buffer = b; s.playbackRate.value = rate;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(.02, real * .1));
    g.gain.setValueAtTime(vol, t + real * .75); g.gain.exponentialRampToValueAtTime(.0001, t + real);
    let n = s; n.connect(g); n = g;
    if (lp) { const f = actx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; n.connect(f); n = f; }
    if (pan && actx.createStereoPanner) { const p = actx.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, pan)); n.connect(p); n = p; }
    n.connect(actx.destination); s.start(t, ini, d); return true;
  } catch (e) { return true; }
}
// Rã (gravada): 'coaxar' = um dos 6 coaxares do arquivo, sorteado · 'grito' = um coaxar curto mais agudo (morrendo)
// tom = a voz de cada rã (velocidade 0,85–1,15)
const COAXARES = [[.2, .45], [.8, .45], [1.85, .4], [2.4, .45], [2.9, .4], [3.4, .5]];
export function sapoSom(kind = 'coaxar', vol = 1, tom = 1) {
  if (!opts.sound || vol <= .01) return;
  const [ini, dur] = COAXARES[Math.floor(Math.random() * COAXARES.length)];
  const ok = kind === 'grito' ? amostra('ra', { ini, dur: dur * .6, rate: tom * 1.45, vol: vol * .9 }) : amostra('ra', { ini, dur, rate: tom, vol: vol * .8 });
  if (!ok) sapoSint(kind, vol, tom);
}
// Dragão (o rugido do T-Rex): 'rugido' = inteiro · 'rosnar' = mais lento, grave e abafado, baixo · 'dor' = um pedaço curto e mais
// agudo · 'morte' = inteiro, bem lento (cai e some). grave < 1 = mais grave (Naja, leão), > 1 = mais agudo (cobra verde)
export function dragaoSom(kind = 'rosnar', vol = 1, grave = 1) {
  if (!opts.sound || vol <= .01) return;
  // volumes baixados ~40% (estavam altos)
  const P = { rugido: { rate: 1, vol: .42 }, rosnar: { ini: .1, dur: 1.2, rate: .72, vol: .3, lp: 900 }, dor: { ini: .25, dur: .45, rate: 1.3, vol: .33 }, morte: { rate: .68, vol: .48, lp: 2200 } }[kind];
  if (!amostra('dragao', { ...P, rate: P.rate * grave, vol: P.vol * vol })) dragaoSint(kind, vol, grave);
}
// Ave de rapina (a Ave da Dúvida): 'grito' = o grito inteiro (ao chegar e no mergulho) · 'dor' = curto e agudo · 'morte' = lento
export function aveSom(kind = 'grito', vol = 1) {
  if (!opts.sound || vol <= .01) return;
  const P = { grito: { ini: .05, dur: 1.3, rate: 1, vol: .42 }, dor: { ini: .3, dur: .4, rate: 1.25, vol: .35 }, morte: { ini: .05, dur: 1.3, rate: .75, vol: .45 } }[kind]; // volumes −30% (estavam altos)
  if (!amostra('ave', { ...P, vol: P.vol * vol })) sfx('whoosh');
}
// Coruja (ambiente do Vale da sombra): um dos 2 piados do arquivo, longe (abafado), do lado `pan`
export function corujaSom(vol = .35, pan = 0) {
  if (!opts.sound) return;
  const [ini, dur] = Math.random() < .5 ? [.05, 1] : [1.75, 1.45];
  amostra('coruja', { ini, dur, rate: .95 + Math.random() * .1, vol, lp: 2500, pan });
}

// Cobra verde (o sibilo): mesmos tipos do dragão — 'rugido' (ao chegar) = o sibilo inteiro · 'rosnar' = mais curto (o aviso
// antes do cuspe; baixo quando solto) · 'dor' = curtinho e agudo · 'morte' = inteiro e lento
export function cobraSom(kind = 'rosnar', vol = 1) {
  if (!opts.sound || vol <= .01) return;
  const P = { rugido: { ini: 0, dur: 1.65, rate: 1, vol: .8 }, rosnar: { ini: .15, dur: .9, rate: 1.05, vol: .7 }, dor: { ini: .3, dur: .35, rate: 1.3, vol: .6 }, morte: { ini: 0, dur: 1.65, rate: .7, vol: .8 } }[kind];
  if (!amostra('cobra', { ...P, vol: P.vol * vol })) dragaoSint(kind, vol, 1.2);
}

// Lobo (os rosnados da pantera negra): 've' = rosnado calmo (viu o herói e parte atrás dele) · 'rosnar' = pedaço do rosnado forte
// (arma o salto) · 'dor' = curtinho e agudo · 'morte' = o fim do rosnado forte, lento
export function loboSom(kind = 'rosnar', vol = 1) {
  if (!opts.sound || vol <= .01) return;
  // volumes baixados ~40% (estavam altos)
  const P = { ve: { ini: 1.0, dur: 1.4, rate: 1.05, vol: .42 }, rosnar: { ini: 3.9, dur: .7, rate: 1.1, vol: .48 }, dor: { ini: 4.3, dur: .3, rate: 1.35, vol: .36 }, morte: { ini: 4.2, dur: .9, rate: .75, vol: .48 } }[kind];
  if (!amostra('lobo', { ...P, rate: P.rate * (.95 + Math.random() * .1), vol: P.vol * vol })) dragaoSint(kind === 've' ? 'rosnar' : kind, vol * .7, 1.3);
}

// Uivo de lobo: o lobo uivando quando aparece na tela (perto) ou um uivo distante de fundo (longe = abafado e baixo); pan = o lado
let ultUivo = -99;
export function uivoSom(vol = .6, pan = 0, longe = false) {
  if (!opts.sound || vol <= .01) return;
  const agora = performance.now() / 1000; if (agora - ultUivo < 8) return; // nunca 2 uivos um em cima do outro
  if (amostra('uivo', { ini: .15, dur: 5.2, rate: .96 + Math.random() * .08, vol, pan, lp: longe ? 1800 : 0 })) ultUivo = agora;
}

// Som em loop que sai de um bicho (a mulher dos piolhos): loopsDeBichos(k, [[dono, vol, pan], …]) a cada quadro — cada dono da
// lista tem o seu loop (começa num ponto sorteado do arquivo, para dois não soarem iguais) com volume e lado ajustados suavemente;
// quem saiu da lista (morreu, outra jornada, pausa) some em ~0,3 s e o loop é desligado
const LOOPS = new Map(); // dono → { k, s, g, p }
export function loopsDeBichos(k, lista) {
  try {
    const vivos = new Set();
    if (opts.sound && BUF[k]) for (const [dono, vol, pan] of lista) {
      vivos.add(dono);
      let L = LOOPS.get(dono);
      if (!L) {
        if (vol <= .01) { vivos.delete(dono); continue; }
        ctxOk(); const s = actx.createBufferSource(), g = actx.createGain(), p = actx.createStereoPanner ? actx.createStereoPanner() : null;
        s.buffer = BUF[k]; s.loop = true; g.gain.value = 0; s.connect(g);
        if (p) { g.connect(p); p.connect(actx.destination); } else g.connect(actx.destination);
        s.start(0, Math.random() * BUF[k].duration); L = { k, s, g, p }; LOOPS.set(dono, L);
      }
      const t = actx.currentTime; L.g.gain.setTargetAtTime(vol, t, .2); if (L.p) L.p.pan.setTargetAtTime(Math.max(-1, Math.min(1, pan)), t, .2);
    }
    else if (!BUF[k] && lista.length) ctxOk(); // ainda não decodificou: pede (na próxima vez já toca)
    LOOPS.forEach((L, dono) => {
      if (L.k !== k || vivos.has(dono)) return;
      const t = actx.currentTime; L.g.gain.setTargetAtTime(0, t, .08); L.s.stop(t + .4); LOOPS.delete(dono);
    });
  } catch (e) {}
}

// ---------- Herói, mulher dos piolhos, boi e o grito do Golias (gravados) ----------
// Herói levando dano (heroi-dano.mp3: só os 2 s iniciais valem, o resto do arquivo é descartado): o gemido toca A CADA 2 GOLPES
// recebidos (no 2º, 4º, 6º…); nos outros fica o som curto sintetizado de sempre. Devolve false quando quem chama deve tocar o sintetizado
let golpesNoHeroi = 0;
export function heroiDanoSom() {
  if (!opts.sound) return true;
  if (++golpesNoHeroi % 2) return false; // golpe ímpar: só o som curto
  return amostra('heroiDano', { ini: 0, dur: 2, rate: .97 + Math.random() * .06, vol: .6 });
}
// Mulher dos piolhos: 'vomito' = o cuspe da nuvem (o trecho forte do arquivo) · 'dor' = o gemido ao levar golpe · 'morte' = o gemido grave
export function piolhentaSom(kind = 'dor', vol = 1) {
  if (!opts.sound || vol <= .01) return;
  if (kind === 'vomito') return amostra('vomito', { ini: .1, dur: .85, vol: .7 * vol });
  amostra('piolhentaDor', { ini: 0, dur: .45, rate: kind === 'morte' ? .75 : .95 + Math.random() * .1, vol: .6 * vol });
}
// Boi: o mugido (trecho de 0,6 a 1,8 s do arquivo); 'morte' = mais lento e grave
export function boiSom(kind = 'mugido', vol = 1) {
  if (!opts.sound || vol <= .01) return;
  amostra('mugido', { ini: .55, dur: 1.3, rate: kind === 'morte' ? .7 : .95 + Math.random() * .1, vol: .5 * vol });
}
// Golias: o grito (grunhido de raiva) antes do empurrão
export function goliasGritoSom(vol = 1) { if (opts.sound && vol > .01) amostra('goliasGrito', { ini: 0, dur: 1.5, vol: .4 * vol }); } // (era .7: estava alto)

// ---------- Soldado esqueleto da Babilônia (gravados) ----------
// Passo (soldado-passo.mp3, um pisão abafado de ~0,7 s): toca quando o pé dele bate no chão (2 vezes por volta da corrida); o tom
// varia um pouco a cada passo para não soar igual. 'corre' = mais forte (atrás do herói); andando de ronda, mais baixo
export function soldadoPassoSom(vol = 1, corre = false) {
  if (!opts.sound || vol <= .01) return;
  amostra('passo', { ini: .1, dur: .5, rate: .9 + Math.random() * .2, vol: (corre ? .55 : .35) * vol });
}
// Gemido (soldado-gemido.mp3, ~1,2 s): 've' = o gemido inteiro (viu o herói) · 'dor' = um pedaço curto e mais agudo · 'morte' = inteiro, lento e grave
export function soldadoGemidoSom(kind = 've', vol = 1) {
  if (!opts.sound || vol <= .01) return;
  const P = { ve: { ini: 0, dur: 1.2, rate: .95 + Math.random() * .1, vol: .38 }, dor: { ini: .4, dur: .35, rate: 1.25, vol: .32 }, morte: { ini: 0, dur: 1.25, rate: .72, vol: .42 } }[kind];
  amostra('gemido', { ...P, vol: P.vol * vol });
}

// ---------- Nabucodonosor (gravados) ----------
// 'invoca' = o rei erguendo as mãos para invocar (rei-invocacao.mp3, ~1,8 s) · 'chamas' = o rugido do lança-chamas (rei-lanca-chamas.mp3,
// ~1,8 s, junto com o jato) · 'coluna' = a ignição da coluna de fogo que brota do chão onde os soldados nascem (coluna-de-fogo.mp3, ~2,8 s)
// Sem o arquivo carregado, cai no 'fire' sintetizado de sempre
export function reiSom(kind, vol = 1) {
  if (!opts.sound || vol <= .01) return;
  const P = { invoca: ['reiInvoca', { ini: 0, dur: 1.9, vol: .55 }], chamas: ['reiChamas', { ini: 0, dur: 1.9, vol: .6 }], coluna: ['ignicao', { ini: 0, dur: 2.8, vol: .6 }] }[kind];
  if (!amostra(P[0], { ...P[1], rate: .97 + Math.random() * .06, vol: P[1].vol * vol })) sfx('fire');
}
