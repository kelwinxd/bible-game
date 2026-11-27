// Testes de BATALHA: a lógica do jogo rodando de verdade, quadro a quadro, sem tela (navegador.js troca canvas/áudio por
// objetos que não fazem nada). Cada teste monta uma situação (teleporta o herói, limpa o caminho) e confere o resultado.
// Os casos aqui são os que já quebraram ou que travariam a jornada (o herói preso, o chefão que não vem, a caverna sem saída).
import './navegador.js';
import { beforeEach, describe, expect, test } from 'vitest';

const D = (await import('../../jogar/data/index.js')).default;
const { opts } = await import('../../jogar/js/core/options.js');
const W = await import('../../jogar/js/battle/world.js');
const U = await import('../../jogar/js/battle/update.js');
const C = await import('../../jogar/js/battle/combat.js'); // damageDemon
const S = await import('../../jogar/js/battle/state.js');
const { golpeNoChao } = await import('../../jogar/js/battle/inimigos/chefes/golias/golias.attacks.js');
const { GOLIAS } = await import('../../jogar/js/battle/inimigos/chefes/golias/golias.config.js');

// ---------- ajudantes ----------
const B = () => S.B;
/** começa a jornada pelo nome (regex) */
function jornada(nome) { W.startBattle(D.fases.findIndex(f => nome.test(f.nome))); return B(); }
/** roda n quadros de 1/60 s */
function passar(n) { for (let i = 0; i < n; i++) U.updateBattle(1 / 60); }
/** roda até a condição (ou estoura: devolve false) */
function ate(cond, max = 60 * 20) { for (let i = 0; i < max; i++) { if (cond()) return true; U.updateBattle(1 / 60); } return cond(); }
/** marca como vencidos os grupos (menos os que passar no filtro) e mata os bichos soltos */
function limparCaminho(manter = () => false) { B().groups.forEach(g => { if (!manter(g)) g.done = true; }); B().frogs.forEach(f => { f.dead = true; f.hp = 0; }); }
/** põe o herói no chão em x */
function herói(x) { const h = B().hero; h.x = x; h.y = 0; h.vy = 0; h.dash = 0; return h; }

beforeEach(() => { opts.sound = false; opts.god = true; });

// ---------- todas as jornadas ----------
describe('todas as jornadas', () => {
  test.each(D.fases.map(f => [f.nome]))('%s: começa e roda 5 s sem erro', nome => {
    W.startBattle(D.fases.findIndex(f => f.nome === nome));
    expect(() => passar(60 * 5)).not.toThrow();
    expect(B().hero.x).toBeGreaterThan(0);
  });
});

// ---------- arena das lutas ----------
describe('arena das lutas', () => {
  /** leva o herói até o grupo do Vale com 2 monstros (a ave e a cobra vermelha, antes do Golias) e espera eles entrarem */
  function lutaDosDois() {
    jornada(/vale/i);
    const gr = B().groups.find(g => g.inimigos.length === 2 && !g.caverna);
    limparCaminho(g => g === gr); herói(gr.x - 300);
    expect(ate(() => B().arena), 'a arena não travou ao chegar no grupo').toBe(true);
    passar(60 * 4); // entram
    expect(B().demons.length).toBe(2);
    B().demons.forEach(d => { d.hp = 1; if (d.state === 'enter') d.state = 'walk'; });
  }

  test('um por um: a arena abre e dá +20 de vida', () => {
    lutaDosDois();
    B().hp = 50;
    for (const d of [...B().demons]) { C.damageDemon(d, true); expect(ate(() => !B().fatal)).toBe(true); }
    expect(B().arena).toBeNull();
    expect(B().demons.length).toBe(0);
    expect(B().hp).toBe(70);
  });

  test('os dois mortos no MESMO golpe: a arena abre e o Golias vem (regressão)', () => {
    lutaDosDois();
    [...B().demons].forEach(d => C.damageDemon(d, true)); // o impulso pega os dois no mesmo quadro
    expect(ate(() => !B().fatal && !B().arena), 'a arena ficou travada com um monstro morto na lista').toBe(true);
    expect(B().demons.length).toBe(0);
    herói(B().boss.home - 500);
    expect(ate(() => B().boss.state !== 'hidden', 120), 'o Golias não apareceu').toBe(true);
  });
});

// ---------- Golias ----------
describe('Golias', () => {
  function arenaDoGolias() {
    jornada(/vale/i); limparCaminho(); B().demons = [];
    herói(B().boss.home - 500);
    expect(ate(() => B().boss.state === 'walk')).toBe(true); // entrou
    return B().boss;
  }

  test('a 1ª vida acaba: perde o capacete e volta com a 2ª; a 2ª acaba: morre e a fase pode acabar', () => {
    const g = arenaDoGolias();
    g.sofrer(g.hp + 1);
    expect(g.semCapacete).toBe(true);
    expect(g.hp).toBe(GOLIAS.vidaSemCapacete);
    expect(g.state).toBe('perdeCapacete');
    passar(60 * 3); // cambaleia e volta a lutar
    expect(g.state).not.toBe('perdeCapacete');
    g.sofrer(g.hp + 1);
    expect(g.state).toBe('dead');
    expect(B().arena).toBeNull();
  });

  test('golpe no chão: tira vida e JOGA o herói para longe, mesmo de escudo', () => {
    const g = arenaDoGolias();
    const h = herói(g.x - 200); passar(2);
    opts.god = false; B().hp = 100; B().shield = true;
    const x0 = h.x;
    g.iniciar('golpeNoChao'); g.t = 0.8; golpeNoChao.atualizar(g, h); // a lança bate no chão
    expect(B().hp, 'o escudo não segura o tremor').toBeLessThan(100);
    expect(h.vy, 'sobe no arremesso').toBeLessThan(0);
    passar(60);
    expect(x0 - h.x, 'foi jogado para longe do Golias').toBeGreaterThan(100);
    B().shield = false;
  });
});

// ---------- caverna do Vale ----------
describe('caverna do Vale', () => {
  test('cai na boca, a saída só abre com a caverna limpa e devolve o herói ao vale', () => {
    jornada(/vale/i); limparCaminho(g => g.caverna); B().demons = [];
    const Cv = B().caverna;
    herói(Cv.x + Cv.w / 2); B().hero.ground = false;
    expect(ate(() => B().zona === 'caverna', 600), 'não caiu na caverna').toBe(true);
    // com ondas por vencer, a força segura o herói no fim
    herói(Cv.x1 - 150); passar(30);
    expect(B().zona).toBe('caverna');
    // limpa a caverna e sobe a rampa
    limparCaminho(); B().demons = [];
    expect(ate(() => { if (B().zona === null) return true; herói(Cv.x1 - 150); return false; }, 600), 'não saiu da caverna limpa').toBe(true);
    expect(B().hero.x).toBe(Cv.saida);
  });
});

// ---------- Babilônia ----------
describe('Nabucodonosor', () => {
  test('cai, vira a estátua, e a estátua derrotada encerra a luta', () => {
    jornada(/babil/i); limparCaminho(); B().demons = [];
    const rei = B().boss;
    herói(rei.home - 500);
    expect(ate(() => rei.state === 'walk')).toBe(true);
    rei.sofrer(rei.hp + 1);
    expect(rei.state).toBe('dead');
    expect(ate(() => B().boss && B().boss.estatua, 60 * 30), 'a estátua não se levantou').toBe(true);
    const est = B().boss;
    passar(60 * 2);
    est.sofrer(est.hp + 1);
    expect(est.state).toBe('dead');
  });
});
