// O Ídolo Babilônico: as artes (de frente, alinhadas pelo meio do pedestal; a mesma escala)
const img = src => Object.assign(new Image(), { src: 'assets/sprites/enemy/' + src });
export const SPRITES = {
  parada: { img: img('estatua-idle.webp'), FW: 300, FH: 667, n: 4, fps: 3 },  // braços cruzados, respirando
  soco: { img: img('estatua-soco.webp'), FW: 360, FH: 667, n: 5 },            // cruzados → ergue o punho → gira → SOCO → segue
  sopro: { img: img('estatua-sopro.webp'), FW: 360, FH: 667, n: 6 },          // abre a boca → o fogo sai e desce (2 últimos em loop)
  morte: { img: img('estatua-morte.webp'), FW: 561, FH: 609, pe: 605, n: 4 } // urra → cambaleia → de joelhos → tomba (pelos pés)
};
