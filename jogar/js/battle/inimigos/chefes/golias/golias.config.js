// Golias: os números e os textos (mexa aqui para balancear)
export const GOLIAS = {
  vida: 35,               // 1ª vida (de capacete); acabou, ele perde o capacete e volta com a 2ª
  vidaSemCapacete: 50,    // 2ª vida (sem capacete, furioso)
  mentiras: 'gigante',     // data/batalha/mentiras.js → mentiras[].tipo
  velocidade: 70,          // px/s andando até o herói
  alcance: 250,            // px: perto assim, estoca; longe disso (+80), bate no chão
  cd: 1.4,                 // s de espera entre um ataque e outro
  golpeNoChaoACada: 3,     // a cada N ataques, bate a lança no chão
  // sem capacete (2ª fase): anda mais rápido, alterna a sequência de golpes (de perto) e o empurrão (corre até o herói)
  velocidade2: 95, alcance2: 240, cd2: 1.1, empurraoACada: 2,
  escala: .82, afunda: 12, // desenho: escala e quantos px os pés afundam na grama
  caixa: { meiaLargura: 60, altura: 290 },
  textos: {
    nome: 'Golias · o gigante de Gate',
    anuncio: 'Golias, o gigante de Gate!',
    morte: ['Golias caiu!', 'Siga até a cruz no fim da jornada'],
    avisoGolpeNoChao: ['O chão treme!', 'Pule [W] na hora do golpe — o escudo não segura o tremor'],
    nome2: 'Golias · sem capacete, furioso',
    perdeCapacete: ['O capacete de Golias caiu!', 'Ferido e furioso: cuidado com o empurrão'],
    avisoEmpurrao: ['Golias vem correndo!', 'Suba na plataforma ou pule por cima dele']
  }
};
// cada ataque: T = duração (s), acerta = quando fere (s), dano, quadros = [[t, quadro], …] da arte
export const ESTOCADA = { T: 1.05, acerta: [.52, .68], dano: 18, quadros: [[0, 0], [.15, 1], [.35, 2], [.52, 3], [.78, 4]] };
export const GOLPE_NO_CHAO = { T: 1.45, acerta: .76, dano: 14, quadros: [[0, 0], [.15, 1], [.35, 2], [.6, 3], [.76, 4], [1.02, 5]] }; // 4 = a lança bate (faísca) na hora do acerto, 5 = a poeira
// 2ª fase (sem capacete)
// PERDE_CAPACETE: a troca de fase — ele cambaleia cansado (sem levar golpe) e volta com a 2ª vida
export const PERDE_CAPACETE = { T: 1.6 };
// EMPURRÃO: GRITA (grito s, sem se mexer — o aviso), arma (brilho vermelho) e CORRE na direção do herói pela arena até bater nele, na parede da arena ou o tempo acabar;
// acertou: dano e empurra o herói para longe (o escudo segura o dano, não o empurrão). Na plataforma ou pulando, passa por baixo
export const EMPURRAO = { grito: 1, gritoQuadros: [[0, 0], [.15, 1], [.35, 2], [.6, 3], [.85, 4]], arma: .3, velocidade: 560, corrida: 1.1, recupera: .5, dano: 16, empurra: 170, alturaLivre: 100, fps: 12 };
// GOLPES: sequência de lança — estoca, gira no alto e estoca de novo; cada janela fere uma vez (o escudo bloqueia)
export const GOLPES = { T: 1.9, alcance: 290, dano: 9, acertos: [[.4, .58], [1.05, 1.22], [1.3, 1.45]],
  quadros: [[0, 0], [.18, 1], [.4, 2], [.62, 3], [.8, 4], [1.05, 5], [1.3, 6], [1.55, 7]] };
