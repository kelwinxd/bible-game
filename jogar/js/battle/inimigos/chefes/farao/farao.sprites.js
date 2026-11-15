// O Faraó: as artes (olham para a DIREITA; ax = a coroa, pés na base; as 3 tiras na mesma escala, medida pela altura em pé)
const img = src => Object.assign(new Image(), { src: 'assets/sprites/enemy/' + src });
export const SPRITES = {
  anda: { img: img('farao-walk.webp'), FW: 194, FH: 275, ax: 123, n: 6, fps: 7 },
  ataque: { img: img('farao-attack.webp'), FW: 337, FH: 275, ax: 199, n: 6 },  // em pé → arma → cajado estendido → a cobra surge → morde → volta
  morte: { img: img('farao-morte.webp'), FW: 275, FH: 275, ax: 128, n: 5 }     // de pé → curva-se → agacha → de joelhos (larga o cajado) → prostrado
};
