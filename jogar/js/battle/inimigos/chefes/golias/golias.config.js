// Golias: os números e os textos (mexa aqui para balancear)
export const GOLIAS = {
  vida: 60,
  mentiras: 'gigante',     // data.js → mentiras[].tipo
  velocidade: 70,          // px/s andando até o herói
  alcance: 250,            // px: perto assim, estoca; longe disso (+80), bate no chão
  cd: 1.4,                 // s de espera entre um ataque e outro
  golpeNoChaoACada: 3,     // a cada N ataques, bate a lança no chão
  escala: .82, afunda: 12, // desenho: escala e quantos px os pés afundam na grama
  caixa: { meiaLargura: 60, altura: 290 },
  textos: {
    nome: 'Golias · o gigante de Gate',
    anuncio: 'Golias, o gigante de Gate!',
    morte: ['Golias caiu!', 'Siga até a cruz no fim da jornada'],
    avisoGolpeNoChao: ['O chão treme!', 'Pule [W] na hora do golpe — o escudo não segura o tremor']
  }
};
// cada ataque: T = duração (s), acerta = quando fere (s), dano, quadros = [[t, quadro], …] da arte
export const ESTOCADA = { T: 1.05, acerta: [.52, .68], dano: 18, quadros: [[0, 0], [.15, 1], [.35, 2], [.52, 3], [.78, 4]] };
export const GOLPE_NO_CHAO = { T: 1.45, acerta: .76, dano: 14, quadros: [[0, 0], [.15, 1], [.32, 2], [.55, 3], [.76, 4], [.92, 5], [1.08, 6], [1.25, 7]] };
