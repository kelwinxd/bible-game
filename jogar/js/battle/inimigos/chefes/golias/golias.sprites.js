// Golias: as artes (olham para a DIREITA; ax = meio dos pés, foot = linha dos pés no quadro)
const img = src => Object.assign(new Image(), { src: 'assets/sprites/enemy/' + src });
export const SPRITES = {
  anda: { img: img('gigante-run.webp'), FW: 504, FH: 370, ax: 180, foot: 364, n: 8, fps: 8 },          // andando
  estocada: { img: img('gigante-attack.webp'), FW: 504, FH: 370, ax: 180, foot: 364 },               // guarda → arma → recolhe → ESTOCA → volta
  golpeNoChao: { img: img('gigante-chao.webp'), FW: 524, FH: 396, ax: 180, foot: 390 }               // ergue → no alto → desce → BATE → faísca e poeira
};
