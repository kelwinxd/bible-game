// Prepara um "navegador de mentira" no Node para os testes: localStorage em memória, matchMedia e document mínimos —
// o bastante para importar os módulos de lógica (progress.js, utils.js) sem abrir o jogo. O conteúdo vem de jogar/data/.
globalThis.window = globalThis;

const mem = new Map();
globalThis.localStorage = {
  getItem: k => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)),
  removeItem: k => mem.delete(k), clear: () => mem.clear()
};
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
globalThis.document = { getElementById: () => null, querySelectorAll: () => [], addEventListener() {} };
