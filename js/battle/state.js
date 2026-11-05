// Estado compartilhado da batalha: B = partida em andamento (null fora dela), keys = teclas seguradas.
// Módulos só leem B; trocar a partida inteira é com setB.
export let B = null;
export const setB = b => { B = b; };
export const keys = {};
