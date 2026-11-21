// ---------- Chefões: a fachada ----------
// B.boss é um chefão só por fase, um objeto de uma das classes em js/battle/inimigos/chefes/ (todas herdam de Chefe,
// js/battle/inimigos/base/chefe.js — o contrato; cada chefão tem a sua pasta). Este arquivo só escolhe a classe pelo data/jornadas e repassa as chamadas do resto
// do jogo para os métodos do chefão. Para criar um chefão novo: uma classe que herda de Chefe (ou ChefeDeArena, em terra),
// e uma linha em chefesDeTerra (data/jornadas → { tipo: "gigante", pele: "<nome>" }).
import { B } from './state.js';
import { Farao, Golias, Leviata, Nabucodonosor } from './inimigos/index.js';
export { drawAcid, spitAcid, updateAcid } from './inimigos/index.js';

/** pele (data/jornadas) → classe do chefão de terra; sem pele = Golias (função: só lê as classes na hora, sem importação circular) */
const chefesDeTerra = () => ({ rei: Nabucodonosor, farao: Farao });

// ----- criação -----
export const makeGiant = e => new (chefesDeTerra()[e.pele] || Golias)(e); // { tipo: "gigante" }: em terra, numa arena
export const makeBoss = e => Leviata.criar(e);                          // { tipo: "chefe" }: no mar (Leviatã / Naja)

// ----- repasses (o resto do jogo chama estes) -----
export const bossBox = L => L.caixa();
export const bossAlive = L => !!L && L.vulneravel();
export const damageBoss = (dano, cor) => { if (B.boss) B.boss.sofrer(dano, cor); };
export const updateBoss = dt => { if (B.boss) B.boss.atualizar(dt); };
export const giantDies = L => L.morrer();
export const nextGiantLie = L => L.proximaMentira();
export const giantLieY = L => L.lieY;
export const bossBlocksWin = () => !!B.boss && B.boss.state !== 'dead'; // a vitória só com o chefão caído
// desenho, em camadas: atrás do chão (a estátua), dentro do mar (o Leviatã), na frente (os de terra) e por cima (balão, barra)
export const drawEstatua = () => { if (B.boss) B.boss.desenharAtras(); };
export const drawBoss = mar => { if (B.boss) B.boss.desenharNoMar(mar); };
export const drawGiant = () => { if (B.boss && B.boss.state !== 'hidden') B.boss.desenhar(); };
export const drawGiantLie = () => { if (B.boss) B.boss.desenharMentira(); };
export const drawBossBar = bar => { if (B.boss) B.boss.desenharBarra(bar); };
