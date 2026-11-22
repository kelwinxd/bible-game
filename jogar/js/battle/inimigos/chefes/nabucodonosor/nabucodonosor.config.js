// Nabucodonosor: os números e os textos
export const REI = {
  vida: 60,
  mentiras: 'rei',
  distancia: 320,          // px que ele guarda do herói (luta de longe)
  velocidade: 60,
  cd: 1.8,
  sequencia: ['fogoDosOlhos', 'lancaChamas', 'fogoDosOlhos', 'invocarSoldados', 'rajada'], // a ordem dos ataques (em loop)
  olhos: [55, 245],        // de onde sai o fogo (px à frente do tronco, px acima do chão)
  afunda: 4,               // px que os pés afundam no chão
  caixa: { meiaLargura: 50, altura: 270 },
  balaoY: 300,             // px acima do chão: a base do balão da mentira
  textos: {
    nome: 'Nabucodonosor · o rei de Babilônia',
    anuncio: 'Nabucodonosor, o rei de Babilônia!',
    morte: ['Nabucodonosor caiu!'],
    avisoSoldados: ['O rei invoca seus soldados!'],
    estatuaSeLevanta: ['O Ídolo Babilônico se levanta contra você!']
  }
};
export const FOGO = { arma: .7, T: 1.1, voo: 430, dano: 14 };                 // uma bola reta até o peito do herói
export const RAJADA = { tiros: [.8, 1.05, 1.3], T: 1.75 };                     // 3 bolas (os instantes de cada uma)
export const SOLDADOS = { T: 1.6, surgem: .9, quantos: 2, maximo: 3, fogoAntes: .3 }; // brotam do chão em fogo ao lado dele (a coluna de fogo começa fogoAntes s antes)
export const CHAMAS = { arma: .6, dura: 2, cresce: .35, tique: .35, dano: 5 }; // jato das mãos: fere a cada tique dentro dele
// o jato (desenho e alcance): maos = de onde sai (px à frente do tronco, px acima do chão), ang = desce na diagonal (~20°),
// sx = quanto o desenho é esticado; cy = o meio da arte na altura
export const JATO = { maos: [118, 180], ang: .36, sx: 1.3, cy: 66 };
