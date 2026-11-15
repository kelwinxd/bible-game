// O Ídolo Babilônico (a estátua de ouro): os números e os textos
export const ESTATUA = {
  vida: 80,
  esperaInicial: 2.5,      // s antes do 1º ataque
  espera: [2, 3],          // s entre ataques (sorteado nesse intervalo)
  sobe: 1.4,               // s levantando de trás do piso (sem atacar)
  escala: 1.12,
  punho: 345,              // y da arte onde fica o punho no soco (vai na borda do piso)
  caixa: { meiaLargura: 115, altura: 400 },
  textos: {
    nome: 'Ídolo Babilônico · a estátua de ouro do rei',
    morte: ['O Ídolo Babilônico caiu!', 'Siga até a cruz no fim da jornada'],
    avisoSoco: ['O Ídolo Babilônico soca o chão!', 'Pule [W] na hora do soco — o escudo não segura o tremor']
  }
};
// SOCO NO CHÃO: T = duração, impacto = quando o punho bate, quadros = [[t, quadro], …]
export const SOCO = { T: 1.35, impacto: .75, dano: 16, quadros: [[0, 0], [.12, 1], [.5, 2], [.72, 3], [.95, 4]] };
// SOPRO DE FOGO: abre a boca (abre), depois os 2 últimos quadros em loop (a partir de loop0, trocando a cada `troca` s);
// a cada volta cospe uma bola em arco (voo s, gravidade g) que espirra onde cai. boca = px da arte (do meio, de cima)
export const SOPRO = { abre: [[0, 0], [.2, 1], [.45, 2], [.7, 3]], loop0: .9, troca: .15, voltas: 4, voo: .85, g: 1100, dano: 12, boca: [12, 150] };
SOPRO.T = SOPRO.loop0 + SOPRO.voltas * 2 * SOPRO.troca + .3;
// MORTE: quadros (s em que cada um começa), base = px abaixo do chão da linha dos pés por quadro; fica deitada e depois afunda
export const MORTE = { quadros: [0, .5, 1, 1.5], base: [234, 210, 170, 110], fica: 2.9, afunda: 1.3 };
