// A lógica do progresso (jogar/js/core/progress.js): XP e níveis, vida máxima, liberação das jornadas, forja e afiação.
// Cada teste começa com o save zerado e importa o módulo de novo (ele lê o localStorage ao carregar).
import { beforeEach, describe, expect, test, vi } from 'vitest';

import D from '../jogar/data/index.js';
let P;
beforeEach(async () => { localStorage.clear(); vi.resetModules(); P = await import('../jogar/js/core/progress.js'); });

describe('XP e níveis', () => {
  test('nível pelos limites de data/progresso/xp.js → xp.niveis', () => {
    const [n1, n2] = D.xp.niveis;
    expect(P.nivelDe(0)).toBe(0);
    expect(P.nivelDe(n1 - 1)).toBe(0);
    expect(P.nivelDe(n1)).toBe(1);
    expect(P.nivelDe(n2)).toBe(2);
    expect(P.nivelDe(1e9)).toBe(D.xp.niveis.length);
  });
  test('ganharXp avisa quando sobe de nível e salva', () => {
    expect(P.ganharXp(D.xp.niveis[0] - 1)).toBe(false);
    expect(P.ganharXp(1)).toBe(true);
    expect(P.nivel()).toBe(1);
    expect(+localStorage.getItem('ef-xp')).toBe(D.xp.niveis[0]);
  });
  test('vida máxima cresce por nível', () => {
    expect(P.vidaMax()).toBe(100);
    P.ganharXp(D.xp.niveis[1]);
    expect(P.vidaMax()).toBe(100 + 2 * D.xp.vidaPorNivel);
  });
  test('no Treinamento vale o nível do painel', () => {
    P.treino.on = true; P.treino.nivel = 5;
    expect(P.vidaMax()).toBe(100 + 5 * D.xp.vidaPorNivel);
  });
});

describe('liberação das jornadas', () => {
  const fase = id => D.fases.find(f => f.id === id);
  test('as do começo (sem "abre") estão abertas', () => {
    for (const f of D.fases.filter(f => f.mapa && !f.abre && !f.nivelMin)) expect(P.abertaBase(f), f.nome).toBe(true);
  });
  test('uma jornada com "abre" só abre depois de vencer uma das listadas', () => {
    const f = D.fases.find(f => f.abre?.length);
    expect(P.abertaBase(f)).toBe(false);
    P.marcarVitoria(f.abre[0]);
    expect(P.abertaBase(f)).toBe(true);
    expect(JSON.parse(localStorage.getItem('ef-won'))).toContain(f.abre[0]);
  });
  test('vitória marcada duas vezes não duplica', () => {
    const id = D.fases[0].id; P.marcarVitoria(id); P.marcarVitoria(id);
    expect(JSON.parse(localStorage.getItem('ef-won')).filter(x => x === id)).toHaveLength(1);
  });
  test('save antigo (ef-fase = índice) é migrado', async () => {
    localStorage.setItem('ef-fase', '2'); vi.resetModules();
    const Q = await import('../jogar/js/core/progress.js');
    expect(Q.venceu(D.fases[0].id) && Q.venceu(D.fases[1].id)).toBe(true);
    expect(Q.venceu(D.fases[2].id)).toBe(false);
  });
  test('o Vale abre vencendo o Exodus ou As Pragas', () => {
    const vale = fase('vale'); if (!vale) return;
    P.marcarVitoria('pragas');
    expect(P.abertaBase(vale)).toBe(true);
  });
});

describe('forja e afiação', () => {
  const id = D.versiculos[0].id;
  test('versículo novo começa em 0 nas duas trilhas', () => {
    expect(P.progOf(id)).toEqual({ forja: 0, afia: 0 });
    expect(P.forged(id)).toBe(false);
  });
  test('o dano (mult) segue o nível da forja', () => {
    P.progOf(id).forja = 2;
    expect(P.verseMult(id)).toBe(D.niveis.forja.mult[1]);
  });
  test('a duração do poder segue o nível da afiação', () => {
    P.progOf(id).afia = 3;
    expect(P.powerDur(id)).toBe(D.niveis.afiacao.base + 3 * D.niveis.afiacao.ganho);
  });
  test('ovelha achada fica salva e não duplica', () => {
    P.marcarOvelha('exodus'); P.marcarOvelha('exodus');
    expect(P.achouOvelha('exodus')).toBe(true);
    expect(JSON.parse(localStorage.getItem('ef-ovelhas'))).toEqual(['exodus']);
  });
});
