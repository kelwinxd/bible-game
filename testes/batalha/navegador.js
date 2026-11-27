// Navegador de mentira para rodar a BATALHA no Node (sem tela): o canvas, os elementos da página, as imagens e o áudio viram
// objetos "faz-nada" que aceitam qualquer chamada. A lógica (update, combate, chefões, câmera) roda de verdade; só não desenha
// nem toca som. Importe ANTES de qualquer módulo do jogo (import './navegador.js' na 1ª linha do teste).

/** aceita qualquer propriedade e chamada e devolve a si mesmo (ctx.fillRect(), el.style.left = …, el.classList.add() …) */
function nada() {
  const alvo = function () {};
  return new Proxy(alvo, {
    get(_, k) {
      if (k === Symbol.toPrimitive) return () => 0;
      if (k === 'then') return undefined; // não é uma Promise
      if (k === 'contains' || k === 'matches') return () => false;
      if (k in alvo && k !== 'name' && k !== 'length') return alvo[k];
      return (alvo[k] = nada());
    },
    set(_, k, v) { alvo[k] = v; return true; },
    apply: () => nada()
  });
}

const elementos = new Map();
globalThis.window = globalThis;
globalThis.document = {
  getElementById: id => (elementos.has(id) ? elementos.get(id) : elementos.set(id, nada()).get(id)),
  createElement: () => nada(),
  querySelector: () => nada(),
  querySelectorAll: () => [],
  addEventListener() {}, removeEventListener() {},
  body: nada(), documentElement: nada(), hidden: false
};
globalThis.location = { href: 'http://localhost/jogar/', search: '', hash: '' };
globalThis.Image = class { constructor() { this.naturalWidth = 0; this.complete = false; } addEventListener() {} };
globalThis.Audio = class {
  constructor() { this.src = ''; this.volume = 1; this.currentTime = 0; this.paused = true; this.readyState = 0; }
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
  addEventListener() {} removeEventListener() {}
};
globalThis.fetch = () => Promise.reject(new Error('sem rede nos testes'));
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
if (!globalThis.localStorage) {
  const mem = new Map();
  globalThis.localStorage = { getItem: k => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: k => mem.delete(k), clear: () => mem.clear() };
}
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
