// Prepara um "navegador de mentira" no Node para os testes: window.DATA (o data.js de verdade), localStorage em memória,
// matchMedia e document mínimos — o bastante para importar os módulos de lógica (progress.js, utils.js) sem abrir o jogo.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';

globalThis.window = globalThis;
vm.runInThisContext(readFileSync(resolve(import.meta.dirname, '../jogar/data.js'), 'utf8'), { filename: 'jogar/data.js' });

const mem = new Map();
globalThis.localStorage = {
  getItem: k => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)),
  removeItem: k => mem.delete(k), clear: () => mem.clear()
};
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
globalThis.document = { getElementById: () => null, querySelectorAll: () => [], addEventListener() {} };
