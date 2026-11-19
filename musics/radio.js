// ---------- Rádio do Sword of God (site e jogo) ----------
// A mesma playlist em loop nos dois: a landing (index.html) e o jogo (jogar/, só nos menus). JÁ COMEÇA TOCANDO: tenta tocar ao abrir;
// se o navegador bloquear som antes de um clique, começa no primeiro clique/tecla (fora das jornadas). ❚❚ pausa e 🔇 muta.
// Lembra no aparelho (localStorage ef-radio) a faixa, o volume e o mudo.
// Uso: <script src="(…)/musics/radio.js"></script> e um <div data-radio></div> onde os controles devem aparecer (pode haver vários:
// todos ficam em sincronia). As faixas ficam na mesma pasta deste arquivo.
(function () {
  const PLAYLIST = [
    { arq: 'et-veritas-me-liberat.mp3', nome: 'Et Veritas Me Liberat' },
    { arq: 'indutus-virtute-dei.mp3', nome: 'Indutus Virtute Dei' },
    { arq: 'digitus-dei-est-hic.mp3', nome: 'Digitus Dei est hic' } // "o dedo de Deus está aqui" (Êx 8:19); a Magia Nostra Deficit com reprises
  ];
  const base = document.currentScript ? document.currentScript.src : location.href;
  let st = { i: 0, mudo: false, vol: .5 };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem('ef-radio') || '{}')); } catch (e) {}
  if (!(st.i >= 0 && st.i < PLAYLIST.length)) st.i = 0; // a faixa salva pode não existir mais (a playlist mudou)
  const salva = () => { try { localStorage.setItem('ef-radio', JSON.stringify({ i: st.i, mudo: st.mudo, vol: st.vol })); } catch (e) {} };
  const au = new Audio(); au.preload = 'none';
  const carrega = () => { au.src = new URL(PLAYLIST[st.i].arq, base).href; au.volume = st.vol; au.muted = st.mudo; };
  carrega();
  au.addEventListener('ended', () => R.proxima()); // playlist em loop
  ['play', 'pause', 'volumechange'].forEach(ev => au.addEventListener(ev, () => desenha()));

  const R = {
    tocando: () => !au.paused,
    tocar() { au.play().catch(() => {}); },
    pausar() { au.pause(); },
    alternar() { au.paused ? R.tocar() : R.pausar(); },
    proxima() { const ia = !au.paused || au.ended; st.i = (st.i + 1) % PLAYLIST.length; salva(); carrega(); if (ia) R.tocar(); desenha(); },
    mudo() { st.mudo = !st.mudo; au.muted = st.mudo; salva(); desenha(); },
    // o jogo para o rádio ao entrar numa jornada (lá não tem rádio) e volta a tocar ao sair, se estava tocando
    suspender() { R.emJornada = true; R.suspenso = !au.paused || R.esperandoClique; au.pause(); },
    retomar() { R.emJornada = false; if (R.suspenso) { R.suspenso = false; R.tocar(); } },
    montar
  };
  window.Radio = R;

  // os controles: ▶/❚❚, nome da faixa (rola se for longo), ⏭ e o mudo
  const SVG = {
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
    prox: '<svg viewBox="0 0 24 24"><path d="M6 6l8.5 6L6 18zM16 6h2v12h-2z"/></svg>',
    som: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 9v6h4l5 4V5L8 9z"/></svg>',
    mudo: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  const els = [];
  function montar(el) {
    el.classList.add('radio');
    el.innerHTML = `<button class="radio-bt radio-play" type="button"></button>
      <span class="radio-faixa"><b></b><small>Sword of God</small></span>
      <button class="radio-bt radio-prox" type="button" aria-label="Próxima música" title="Próxima música">${SVG.prox}</button>
      <button class="radio-bt radio-mudo" type="button"></button>`;
    const sem = f => e => { f(); e.currentTarget.blur(); }; // tira o foco (no jogo, Espaço/Enter não "clicam" de novo)
    el.querySelector('.radio-play').addEventListener('click', sem(R.alternar));
    el.querySelector('.radio-prox').addEventListener('click', sem(R.proxima));
    el.querySelector('.radio-mudo').addEventListener('click', sem(R.mudo));
    els.push(el); desenha();
  }
  function desenha() {
    els.forEach(el => {
      const p = el.querySelector('.radio-play'), m = el.querySelector('.radio-mudo');
      p.innerHTML = au.paused ? SVG.play : SVG.pause; p.setAttribute('aria-label', au.paused ? 'Tocar a música' : 'Pausar a música'); p.title = p.getAttribute('aria-label');
      m.innerHTML = st.mudo ? SVG.mudo : SVG.som; m.setAttribute('aria-label', st.mudo ? 'Ligar o som da música' : 'Mutar a música'); m.title = m.getAttribute('aria-label');
      el.querySelector('.radio-faixa b').textContent = PLAYLIST[st.i].nome;
      el.classList.toggle('on', !au.paused); el.classList.toggle('mudo', st.mudo);
    });
  }

  // estilo padrão (escuro e dourado, como o resto); cada página posiciona o .radio como quiser
  const css = document.createElement('style');
  css.textContent = `
  .radio{box-sizing:border-box;width:auto;display:inline-flex;align-items:center;gap:8px;padding:6px 10px 6px 12px;border-radius:999px;background:#140d0ae6;border:1px solid #6b4a32;color:#e8dcc6;
    box-shadow:0 6px 20px #0008;font:600 13px/1.2 system-ui,sans-serif;max-width:100%}
  .radio .radio-bt{all:unset;box-sizing:border-box;display:grid;place-items:center;width:32px;height:32px;min-height:0;padding:0;border-radius:50%;border:1px solid #6b4a32;background:#2a1d16;color:#f2c84b;cursor:pointer;flex:none}
  .radio .radio-bt:hover,.radio .radio-bt:focus-visible{border-color:#f2c84b;outline:none}
  .radio .radio-bt svg{width:16px;height:16px;fill:currentColor}
  .radio .radio-play{width:36px;height:36px;background:linear-gradient(#f6d873,#d4a038);color:#1a120c;border-color:#f6d873}
  .radio-faixa{display:flex;flex-direction:column;min-width:0;max-width:170px}
  .radio-faixa small{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#d4a038}
  .radio-faixa b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600}
  
  .radio.mudo .radio-faixa b{color:#8a7a66}
  @keyframes radioPulsa{50%{transform:scale(1.18)}}
  `;
  document.head.appendChild(css);
  const iniciar = () => { document.querySelectorAll('[data-radio]').forEach(montar); autoplay(); };
  // já começa tocando: tenta agora; se o navegador bloquear (sem clique ainda), toca no primeiro clique ou tecla — menos numa jornada
  // do jogo (lá não tem rádio) ou se a pessoa já mexeu no ▶ (aí a escolha é dela)
  function autoplay() {
    au.play().then(() => { R.esperandoClique = false; }).catch(() => {
      R.esperandoClique = true;
      const no1o = e => {
        if (e.target.closest && e.target.closest('.radio')) { R.esperandoClique = false; tirar(); return; } // clicou no próprio rádio: vale o botão
        if (R.emJornada) return;
        R.esperandoClique = false; tirar(); R.tocar();
      };
      const tirar = () => ['pointerdown', 'keydown'].forEach(ev => document.removeEventListener(ev, no1o, true));
      ['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, no1o, true));
    });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', iniciar) : iniciar();
})();
