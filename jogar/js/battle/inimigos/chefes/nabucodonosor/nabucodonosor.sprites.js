// Nabucodonosor: as artes (olham para a DIREITA; ax = tronco, pés na base)
const img = src => Object.assign(new Image(), { src: 'assets/sprites/' + src });
export const SPRITES = {
  anda: { img: img('enemy/rei-walk.webp'), FW: 195, FH: 278, ax: 82, n: 6, fps: 7 },
  parado: { img: img('enemy/rei-idle.webp'), FW: 149, FH: 304, ax: 71, n: 6, fps: 6 },       // o fogo dos olhos tremulando
  invoca: { img: img('enemy/rei-invoca.webp'), FW: 224, FH: 280, ax: 89, n: 6 },            // ergue as mãos em chamas
  chamas: { img: img('enemy/rei-chamas.webp'), FW: 224, FH: 269, ax: 91, n: 6 },            // arma → estica os braços (o último segura o jato)
  jato: { img: img('hazard/chama-rei.webp'), FW: 237, FH: 134, n: 8 }                       // a chama: cresce nos 5 primeiros, depois os 3 últimos em loop
};
