// Validação do conteúdo (jogar/data.js): pega erros de digitação e referências quebradas antes de rodar o jogo.
// Cada falha diz exatamente o que está errado e onde (fase, evento, versículo).
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const D = window.DATA;
const JOGO = resolve(import.meta.dirname, '../jogar');
const versos = new Set(D.versiculos.map(v => v.id));
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const palavras = s => norm(s).split(/[^a-z0-9]+/).filter(Boolean);
// tipos de evento que js/battle/world.js entende
const TIPOS = ['buraco', 'mar', 'terreno', 'plataforma', 'inimigos', 'estrutura', 'caverna', 'ovelha', 'terra', 'pedra', 'chefe', 'gigante',
  'ra', 'lobo', 'soldado', 'piolhenta', 'boi', 'espantalho'];

describe('versículos', () => {
  test('ids únicos', () => {
    const ids = D.versiculos.map(v => v.id), rep = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(rep, `ids repetidos: ${rep}`).toEqual([]);
  });
  test.each(D.versiculos.map(v => [v.id, v]))('%s: campos, tema e autor', (id, v) => {
    for (const c of ['ref', 'texto', 'tema', 'autor']) expect(v[c], `${id} sem "${c}"`).toBeTruthy();
    expect(D.temas[v.tema], `${id}: tema "${v.tema}" não existe em temas`).toBeTruthy();
    expect(D.autores[v.autor], `${id}: autor "${v.autor}" não existe em autores`).toBeTruthy();
  });
  test.each(D.versiculos.map(v => [v.id, v]))('%s: lacunas batem com o texto', (id, v) => {
    const texto = palavras(v.texto);
    for (const l of [...(v.lacunas || []), ...(v.lacunas2 || [])]) {
      expect(texto, `${id}: a palavra "${l.certa}" não está no texto`).toEqual(expect.arrayContaining(palavras(l.certa)));
      expect(l.distratores?.length, `${id}: "${l.certa}" precisa de distratores`).toBeGreaterThanOrEqual(2);
      expect(l.distratores.map(norm), `${id}: "${l.certa}" aparece entre os próprios distratores`).not.toContain(norm(l.certa));
    }
  });
  test.each(D.versiculos.map(v => [v.id, v]))('%s: perguntas da afiação', (id, v) => {
    for (const p of (v.afiacao || []).flat()) {
      expect(p.p && p.certa, `${id}: pergunta sem texto ou resposta`).toBeTruthy();
      expect(p.erradas.map(norm), `${id}: "${p.p}" tem a resposta certa entre as erradas`).not.toContain(norm(p.certa));
    }
  });
});

describe('mentiras', () => {
  test.each(D.mentiras.map(m => [m.texto, m]))('"%s": versículos que a refutam existem', (t, m) => {
    expect(m.ideal?.length, `sem versículo ideal`).toBeGreaterThan(0);
    for (const id of m.ideal) expect(versos.has(id), `versículo "${id}" não existe`).toBe(true);
  });
});

describe('jornadas (fases)', () => {
  const comId = D.fases.filter(f => f.mapa);
  test('toda jornada do mapa tem id único', () => {
    const ids = comId.map(f => f.id);
    expect(ids.every(Boolean), 'jornada do mapa sem id').toBe(true);
    expect(new Set(ids).size, `ids repetidos: ${ids}`).toBe(ids.length);
  });
  test.each(D.fases.map(f => [f.nome, f]))('%s: liberação (abre) aponta para jornadas que existem', (n, f) => {
    for (const id of f.abre || []) expect(D.fases.some(o => o.id === id), `${n}: abre "${id}", que não existe`).toBe(true);
  });
  test.each(D.fases.map(f => [f.nome, f]))('%s: eventos válidos', (n, f) => {
    f.eventos.forEach((e, i) => {
      const onde = `${n}, evento ${i} (${e.tipo} x ${e.x})`;
      expect(TIPOS, `${onde}: tipo desconhecido`).toContain(e.tipo);
      expect(typeof e.x === 'number' || e.tipo === 'caverna', `${onde}: sem x`).toBe(true);
      if (e.tipo === 'pedra') expect(versos.has(e.verso), `${onde}: versículo "${e.verso}" não existe`).toBe(true);
      if (e.tipo === 'inimigos') for (const t of e.inimigos) expect(D.inimigos[t], `${onde}: inimigo "${t}" não existe em inimigos`).toBeTruthy();
      if (['buraco', 'mar', 'terreno', 'plataforma'].includes(e.tipo)) expect(e.w, `${onde}: sem largura (w)`).toBeGreaterThan(0);
      if (e.x != null) expect(e.x, `${onde}: fora da fase (comprimento ${f.comprimento})`).toBeLessThan(f.comprimento + (f.eventos.some(o => o.tipo === 'caverna') ? 8000 : 0));
    });
  });
  test.each(D.fases.map(f => [f.nome, f]))('%s: um chefão no máximo', (n, f) => {
    expect(f.eventos.filter(e => e.tipo === 'chefe' || e.tipo === 'gigante').length).toBeLessThanOrEqual(1);
  });
});

describe('arquivos citados no data.js', () => {
  const caminhos = [];
  (function varre(o) {
    if (typeof o === 'string') { if (/^assets\//.test(o)) caminhos.push(o); }
    else if (o && typeof o === 'object') Object.values(o).forEach(varre);
  })(D);
  test.each([...new Set(caminhos)])('%s existe', p => expect(existsSync(resolve(JOGO, p)), `arquivo não encontrado: jogar/${p}`).toBe(true));
});
