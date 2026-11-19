// Golias: as artes (olham para a DIREITA; ax = meio dos pés, foot = linha dos pés no quadro)
const img = src => Object.assign(new Image(), { src: 'assets/sprites/enemy/' + src });
// arte nova (capacete de ferro, escamas, saiote de couro): os quadros foram separados, alinhados pelo tronco (ax) e pelos pés (foot)
// e escalados para o Golias ter o mesmo tamanho nas 3 tiras (a antiga, de capa vermelha, está em enemy/antigo/)
export const SPRITES = {
  anda: { img: img('gigante-run.webp'), FW: 250, FH: 355, ax: 135, foot: 349, n: 7, fps: 8 },           // andando (7 quadros)
  estocada: { img: img('gigante-attack.webp'), FW: 430, FH: 366, ax: 198, foot: 363 },                // em pé → abaixa a lança → recolhe → ESTOCA → volta
  golpeNoChao: { img: img('gigante-chao.webp'), FW: 384, FH: 400, ax: 168, foot: 394 },               // em pé → ergue → no alto → desce (arco) → BATE (faísca) → poeira
  parado: { img: img('gigante-idle.webp'), FW: 168, FH: 361, ax: 85, foot: 357, n: 7, fps: 6 },        // parado, de capacete (respirando)
  // 2ª fase, sem capacete (ferido, o saiote rasgado)
  cansado: { img: img('gigante-cansado.webp'), FW: 210, FH: 371, ax: 122, foot: 367, n: 6, fps: 5 },   // parado, curvado e ofegante (o bafo no 4º quadro)
  anda2: { img: img('gigante-run2.webp'), FW: 230, FH: 375, ax: 126, foot: 371, n: 6, fps: 9 },        // andando
  grito: { img: img('gigante-grito.webp'), FW: 255, FH: 390, ax: 133, foot: 384, n: 5 },             // o grito antes do empurrão (rosna → abre os braços → ruge)
  empurrao: { img: img('gigante-empurrao.webp'), FW: 335, FH: 296, ax: 216, foot: 281, n: 5 },         // 0 = arma · 1–3 = correndo (loop) · 4 = o tranco
  golpes: { img: img('gigante-golpes.webp'), FW: 423, FH: 381, ax: 185, foot: 377, n: 8 }  // ampliada (estava menor que as outras)              // guarda → estoca → gira → guarda → no alto → gira → estoca → volta
};
