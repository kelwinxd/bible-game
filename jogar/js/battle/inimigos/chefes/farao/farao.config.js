// O Faraó: os números e os textos
export const FARAO = {
  vida: 60,
  mentiras: 'farao',
  distancia: 300,          // px que ele guarda do herói
  velocidade: 55,
  cd: 1.7,
  arma: .8,                // s armando (cajado brilhando) antes da praga e das rãs
  sequencia: ['praga', 'pragaDasRas', 'praga', 'ondaDoCajado'], // a ordem (em loop); de perto, a cobra tem prioridade
  cajado: [70, 175],       // a ponta do cajado na pose estendida (px à frente da coroa, px acima do chão)
  caixa: { meiaLargura: 45, altura: 262 },
  balaoY: 300,
  textos: {
    nome: 'Faraó · o rei do Egito',
    anuncio: 'O Faraó, o rei do Egito!',
    caiu: ['O Faraó caiu!', 'Suba a rampa e saia da tumba'],
    avisoRas: ['O Faraó invoca a praga das rãs!'],
    avisoOnda: ['O cajado do Faraó faz o chão tremer!', 'Pule [W] por cima da onda ou erga o escudo [J]']
  }
};
export const PRAGA = { T: 1.2, voo: 380, dano: 12, raio: 22 };                 // a nuvem de gafanhotos
export const COBRA = { T: 1.3, acerta: [.72, 1], dano: 15, alcance: 200,        // de perto: o cajado vira cobra e morde
  quadros: [[0, 0], [.15, 1], [.35, 2], [.55, 3], [.72, 4], [1.02, 5]], mordida: [40, 185, 95, 215] }; // mordida: px à frente (de, até) e altura (de, até)
export const RAS = { T: 1.5, quantas: 2, maximo: 3 };                           // a praga das rãs
export const ONDA = { T: 1.5, bate: .9, velocidade: 520, dano: 13, alcance: 420 }; // bate o cajado: a onda corre rente ao chão
// MORTE: quadros da arte; fala = de quando a quando o balão aparece (s); texto = as linhas do balão (Êxodo 12:31–32)
export const MORTE = { quadros: [[0, 0], [.3, 1], [.6, 2], [.95, 3], [1.3, 4]], fala: [1.6, 6.2], texto: ['Saia daqui! Deixe-me em paz!', 'Seu Deus é maior.'] };
