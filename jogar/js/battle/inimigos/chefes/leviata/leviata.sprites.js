// O chefão do mar: as artes de cada pele. ax/foot = meio do corpo e a base dele no quadro; row = a linha da tira
const img = src => Object.assign(new Image(), { src: 'assets/sprites/enemy/' + src });
const LEVI = img('leviata.webp'); // 2 linhas de 8 quadros 250×236: 1ª = nadando/parado, 2ª = bote (a arte olha para a ESQUERDA)
export const SPRITES = {
  leviata: {
    nada: { img: LEVI, FW: 250, FH: 236, ax: 150, foot: 234, n: 8, row: 0 },
    bote: { img: LEVI, FW: 250, FH: 236, ax: 150, foot: 234, n: 8, row: 1 },
    acido: { img: img('leviata-acido.webp'), FW: 306, FH: 236, ax: 194, foot: 234, n: 8 } // abre a boca → bola de ácido → jato → pinga
  },
  naja: { // olha para a direita; as 3 tiras igualadas pela do bote e alinhadas pela cauda e pela base
    nada: { img: img('naja-run.webp'), FW: 288, FH: 294, ax: 136, foot: 292, n: 8 },
    bote: { img: img('naja-attack.webp'), FW: 428, FH: 260, ax: 136, foot: 258, n: 6 },
    acido: { img: img('naja-acido.webp'), FW: 408, FH: 288, ax: 136, foot: 286, n: 6 } // o jato é o próprio sprite
  }
};
