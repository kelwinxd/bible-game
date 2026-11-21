// ---------- Jornada: As Pragas ----------
// os tipos de evento e os campos estão explicados em jornadas/index.js
export const PRAGAS = {
  // Jornada 2: As Pragas (Êxodo 7–11). O mesmo cenário do Exodus. Sem versículo novo: o herói usa os do Exodus.
  // Começa com a mulher dos piolhos (Êxodo 8:16–18): uma sozinha, depois duas juntas (soltas, como os lobos); depois uma
  // arena com 2 cobras vermelhas (Idolatria → Êxodo 20:3; Mentira → Hebreus 4:12); no fim, a boca de uma CAVERNA igual à do
  // Vale da sombra: ele cai numa tumba (a mulher dos piolhos, o boi e o Faraó), sobe a rampa de volta à superfície e termina na cruz
  id: "pragas", nome: "As Pragas", comprimento: 8850, // a superfície vai até a cruz, depois da boca da tumba (8160 → a saída em 8300 → a cruz em 8690)
  musica: "assets/audio/musics/Magia Nostra Deficit — versos repetidos.mp3", // a música da fase, em loop (js/core/musica.js)
  mapa: { x: 23, y: 53, icone: "pragas", img: "assets/img/simbolo-pragas.webp", cor: "#a96ad8" }, // img: o olho de Hórus, o mosquito e a caveira // Gósen, no delta do Nilo // medalhão roxo e amarelo: a nuvem de gafanhotos
  // fundo: uma rua do Egito ao pôr do sol (muralhas, tendas, palmeiras, estátuas de faraó e braseiros), parada e esticada pela fase;
  // véu de 45% (a arte é clara); desce = px a mais de altura (presa no topo, a praça de pedra do fundo desce para trás do chão)
  fundo: { img: "assets/img/fundo-pragas.webp", estica: 1.05, desce: 130, escuro: 0.45 },
  // chão: as 2 artes enviadas emendadas numa laje só (sem tingir) — ponta esquerda com palmeira, vasos, manto e frutas; o miolo
  // repetido é SÓ PISO (um trecho de cada arte, emendados): nada em cima dele, para não ser cortado nas bordas; ponta direita com
  // vasos, estandarte do ankh e pilar. Os bois mortos (a praga nos animais, Êxodo 9:3) viraram enfeites soltos (estrutura sem degraus)
  chao: "assets/img/chao-pragas.webp", chaoCor: null,
  chaoMedidas: { cap: 700, capR: 612, capFade: 60, capOut: 50, surf: 480, band: [530, 690], fade: 60, s: 0.45, escurece: 300,
    pontaDesce: { R: 16, L: 8 } }, // nas pontas (pilar e vasos; manto e cesto) o piso desenhado é mais baixo: o pé desce perto dos buracos
  buracoSeco: true, // buracos sem água: só o vão escuro (sem as mãos, sem a pausa atrás das ondas)
  dica: ["A praga dos piolhos! A mulher cospe uma nuvem deles de longe", "Erga o escudo [J] na hora do cuspe e chegue perto para golpear"],
  eventos: [
    { tipo: "buraco", x: 650, w: 190 },
    // bois mortos pelo caminho (enfeites, atrás do herói): recortes das 2 artes do chão, as bordas dissolvidas no piso;
    // longe das bordas de buracos e terrenos (lá ficam as pontas da arte, ~315 px à esquerda e ~275 px à direita)
    { tipo: "estrutura", x: 1230, img: "assets/img/boi-morto-3.webp", w: 400, h: 150, sc: .45, base: -4.5, degraus: [] },
    // 1) a 1ª mulher dos piolhos, sozinha
    { tipo: "piolhenta", x: 1500 },
    { tipo: "terreno", x: 2000, w: 650, altura: 90 }, // largo: cabem as duas pontas da arte
    { tipo: "pedra", x: 2380, verso: "ex20-7" }, // em cima do terreno alto: o bezerro de ouro com o 3º mandamento (Êxodo 20:7)
    { tipo: "estrutura", x: 2780, img: "assets/img/boi-morto-1.webp", w: 340, h: 140, sc: .45, base: -4.5, degraus: [] },
    { tipo: "ra", x: 3050 },
    // 2) duas juntas
    { tipo: "piolhenta", x: 3150 },
    // ovelha perdida: um boi morto pisável (o lombo é um degrau de ~37 px) leva a um terraço a 150 px — do chão o pulo não alcança
    { tipo: "estrutura", x: 3400, img: "assets/img/boi-morto-2.webp", w: 400, h: 230, sc: .45, base: 36, degraus: [[170, 340, 68]] },
    { tipo: "plataforma", x: 3600, w: 150, altura: 150 },
    // a ovelha espera no chão, antes do boi; ao ver o herói foge pulando: chão → lombo do boi (−37) → plataforma (−150), e lá fica
    // parada (como nas outras jornadas; já achada, ela aparece e foge igual, sem dar vida nem XP de novo)
    { tipo: "ovelha", x: 3330, sobe: [[3515, -37], [3680, -150]] },
    // espaço entre a plataforma (até 3750) e o buraco (a ponta do pilar começa ~250 px antes dele): a mulher dos piolhos no meio
    { tipo: "piolhenta", x: 4020 },
    { tipo: "buraco", x: 4300, w: 200 },
    { tipo: "boi", x: 4720 }, // boi morto (a praga nos animais): só corre — investe, gira e investe de novo
    // 3) o mandamento da fase: o ídolo com o livro de Êxodo 20:4 (o herói pode chegar aqui sem nenhum versículo do Exodus)
    { tipo: "pedra", x: 4980, verso: "ex20-4" },
    //    → os monstros, UM POR VEZ: 2 cobras vermelhas da Idolatria, cada uma refutada pelo Êxodo 20:4 (ou o 20:3, se já tiver)
    { tipo: "inimigos", x: 5700, inimigos: ["idolatria"], vida: 0.7, frases: ["Os deuses do Egito são mais fortes que o seu Deus."] },
    { tipo: "estrutura", x: 6050, img: "assets/img/boi-morto-3.webp", w: 400, h: 150, sc: .45, base: -4.5, degraus: [] },
    { tipo: "inimigos", x: 6800, inimigos: ["idolatria"], vida: 0.7, frases: ["Adore o Nilo e o sol. São eles que te dão a vida."] },
    { tipo: "estrutura", x: 7100, img: "assets/img/boi-morto-2.webp", w: 400, h: 230, sc: .45, base: 36, degraus: [] },
    { tipo: "boi", x: 7300 }, // outro boi, entre a última cobra e a caverna
    // 4) a boca da caverna (como no Vale da sombra): o vão é largo demais para pular — ele cai lá dentro
    //    dentro da tumba (área à parte, x 9500–12400): a mulher dos piolhos, o boi e, andando mais um pouco, o Faraó; vencido ele,
    //    a rampa do fim leva de volta à superfície (saida), e a jornada termina na cruz
    { tipo: "caverna", x: 7600, w: 560, x0: 9500, x1: 12400, entrada: 9720, saida: 8300,
      aviso: ["Você caiu numa tumba!", "Atravesse-a e ache a saída"], saiu: ["Você saiu da tumba!", "Siga até a cruz"],
      // fundo próprio: uma tumba egípcia escavada na rocha (Anúbis, ankh, escaravelho alado, colunas, braseiro e um facho de luz)
      fundo: { img: "assets/img/fundo-caverna-egito.webp", estica: 1, escuro: 0.3 },
      chao: { img: "assets/img/chao-caverna.webp", medidas: { cap: 330, capR: 310, capFade: 60, capOut: 50, surf: 240, band: [280, 345], fade: 160, s: 0.5, semFaixa: true } } },
    { tipo: "piolhenta", x: 10250 },
    { tipo: "boi", x: 10750 },
    // no fim da tumba: o chefão, o Faraó (a arena trava a câmera; a saída só abre com ele vencido)
    { tipo: "gigante", pele: "farao", x: 11700, vida: 60, caverna: true }
  ]
};
