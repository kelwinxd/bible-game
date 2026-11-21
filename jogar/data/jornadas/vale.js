// ---------- Jornada: O vale da sombra ----------
// os tipos de evento e os campos estão explicados em jornadas/index.js
export const VALE = {
  // Jornada 3: a Dúvida ataca do alto. 2 versículos contra o medo (Isaías 41:10, Salmos 23:4), 4 inimigos e o chefão Golias.
  id: "vale", abre: ["exodus", "pragas"], // abre quando o herói vence o Exodus OU As Pragas
  nome: "O vale da sombra", comprimento: 11500,
  musica: "assets/audio/musics/The Lord Is My Shepherd — com flauta.mp3", // a música da fase, em loop (js/core/musica.js)
  coruja: true, uivo: true, // ambiente: uma coruja pia e um lobo uiva ao longe de vez em quando (js/battle/ambiente.js)
  // sul de Canaã, a oeste do Mar Morto (o deserto da Judeia, onde Davi pastoreava). via: a trilha chega por terra, pela rota do
  // Êxodo — de Gósen pelo Deserto de Sur, atravessando o Sinai perto do Monte Sinai, e subindo pelo Neguebe (o Exodus entra nela)
  mapa: { x: 53, y: 48, icone: "vale", cor: "#5d7fb8",
    via: { pragas: [[31, 57], [40, 62], [45, 68], [48.5, 71.5], [52, 62]], exodus: [[17, 63], [31, 57], [40, 62], [45, 68], [48.5, 71.5], [52, 62]] } },
  // chão: grama de um campo de batalha (elmos, flechas, estandarte, corvo) — as 2 artes enviadas emendadas numa laje só.
  // Sem tingir (é verde); medidas próprias: superfície em y=145, faixa de pedras em y 250–390. Pontas largas que terminam em
  // grama limpa (esq. 440 px: estandarte + elmo; dir. 581 px: elmo + flecha), dissolvendo só nos últimos 50 px — sem objeto cortado
  chao: "assets/img/chao-guerra.webp", chaoCor: null, chaoMedidas: { cap: 440, capR: 581, capFade: 50, capOut: 60, surf: 162, band: [250, 390], fade: 160, s: .45 },
  // fundo: céu vermelho-escuro com lua e montanhas, ampliado 1,2× e esticado pela fase toda (anda só ~190 px do início ao fim)
  fundo: { img: "assets/img/fundo-vale.webp", estica: 1.2, escuro: 0.4 },
  dica: ["A Dúvida ataca do alto: a ave mergulha onde você está", "Saia do lugar ou erga o escudo [J]; pule para golpeá-la"],
  eventos: [
    // 1) buraco e pedra no chão → Isaías 41:10
    { tipo: "buraco", x: 700, w: 200 },
    // lobos soltos pela fase (patrulham; com o herói perto, correm e saltam mordendo — js/battle/frog.js)
    { tipo: "lobo", x: 1080 },
    { tipo: "pedra", x: 1650, verso: "is41-10" }, // bem afastado do lobo: sobra espaço para a luta
    //    → 1 ave, depois um terreno alto
    { tipo: "inimigos", x: 2550, inimigos: ["duvida"], vida: 0.7, frases: ["Você é fraco e medroso. Desista."] },
    { tipo: "terreno", x: 2900, w: 400, altura: 100 },
    { tipo: "lobo", x: 3550 },
    // 2) buraco e descida ao vale: a pedra fica lá embaixo ("vale da sombra da morte") → Salmos 23:4
    { tipo: "buraco", x: 4000, w: 200 }, // recuado: o chão até a boca da caverna ficou largo (700 px), com miolo limpo para a ovelha
    // o vale fundo é a boca de uma CAVERNA: quem cai nele despenca lá dentro (área x0–x1, depois do fim da fase, com fundo
    // próprio). Lá embaixo: lobos, monstros e o ídolo de Salmos 23:4 ("ainda que eu andasse pelo vale da sombra da morte");
    // no fim, uma rampa de pedra leva à saída, que devolve o herói logo depois do vale (x saida)
    { tipo: "ovelha", x: 4540 }, // ovelha perdida: com o herói perto ela foge e cai na boca da caverna
    // 2 lajes sobre a boca da caverna: dá para atravessar pulando (e seguir pelo vale) ou cair nela de propósito
    { tipo: "plataforma", x: 4990, w: 130, altura: 40 },
    { tipo: "plataforma", x: 5290, w: 140, altura: 40 }, // vão de 170 px entre as duas (ainda dá no pulo, ~187 px)
    // na 2ª laje: a placa "Lucas 15:3-7" com a seta para baixo — a parábola da ovelha perdida (a que fugiu caiu aí dentro)
    { tipo: "estrutura", x: 5298, img: "assets/img/placa-lucas15.webp", w: 330, h: 307, sc: .38, base: -35, degraus: [] },
    { tipo: "caverna", x: 4900, w: 560, x0: 12400, x1: 17900, entrada: 12620, saida: 5560,
      fundo: { img: "assets/img/fundo-caverna.webp", estica: 1, escuro: 0.25 },
      // chão de pedra da caverna: as 2 variações enviadas emendadas numa faixa só (o miolo alterna entre elas ao repetir)
      chao: { img: "assets/img/chao-caverna.webp", medidas: { cap: 330, capR: 310, capFade: 60, capOut: 50, surf: 240, band: [280, 345], fade: 160, s: 0.5, semFaixa: true } } },
    // a caverna (x 12 400–17 900), da esquerda para a direita, com relevos e lajes entre as lutas — cada onda numa ARENA FIXA no
    // caminho (caverna: true; não surge mais à frente do herói onde ele estiver), e a ovelha sozinha no fim, depois da última:
    // 1) a queda e o ídolo de Salmos 23:4, e um degrau de pedra
    { tipo: "pedra", x: 12820, verso: "sl23-4" },
    { tipo: "terreno", x: 13080, w: 320, altura: 80 },
    // 2) 2 lobos esperando no chão plano
    { tipo: "lobo", x: 13850, bando: "cav1" },
    { tipo: "lobo", x: 14100, bando: "cav1" },
    // relevos: uma laje baixa e um degrau alto
    { tipo: "plataforma", x: 14420, w: 140, altura: 70 },
    { tipo: "terreno", x: 14650, w: 300, altura: 120 },
    // 3) arena: a ave da Dúvida com mais 2 lobos
    { tipo: "inimigos", x: 15700, caverna: true, bando: "cav2", lobos: 2, inimigos: ["duvida"], vida: 0.7, frases: ["Você está sozinho no escuro."] },
    // relevos: duas lajes em escada
    { tipo: "plataforma", x: 15990, w: 140, altura: 80 },
    { tipo: "plataforma", x: 16210, w: 140, altura: 160 },
    // 4) arena: a cobra vermelha com mais 2 lobos
    { tipo: "inimigos", x: 17000, caverna: true, bando: "cav3", lobos: 2, inimigos: ["duvida"], vida: 0.7, frases: ["Aqui embaixo ninguém te acha."],
      aparencia: { sprite: "serpente", chao: true, mergulho: false, passo: 70, tell: 0.6, cadencia: 1.8 } },
    // 5) no fim, antes da rampa da saída: a ovelha perdida (a que fugiu e caiu), sozinha; tocar nela dá vida
    { tipo: "ovelha", x: 17470, calma: true },
    { tipo: "inimigos", x: 6400, inimigos: ["duvida"], vida: 0.8, frases: ["Deus te abandonou."] },
    // 3) buraco largo com lajes e penhasco (sem versículo: no máximo 2 por fase)
    { tipo: "lobo", x: 7300 },
    { tipo: "buraco", x: 8000, w: 330 },
    { tipo: "plataforma", x: 8100, w: 130, altura: 50 },
    { tipo: "plataforma", x: 8420, w: 140, altura: 70 },
    { tipo: "terreno", x: 8580, w: 460, altura: 140 },
    { tipo: "lobo", x: 9200 },
    //    → final: uma ave e uma cobra vermelha juntas (a cobra é uma Dúvida com a aparência da serpente, no chão)
    { tipo: "inimigos", x: 10050, inimigos: ["duvida", "duvida"], vida: 0.7, frases: ["Seus inimigos são fortes demais.", "Você está sozinho no escuro."],
      aparencia: [null, { sprite: "serpente", chao: true, mergulho: false, passo: 70, tell: 0.6, cadencia: 1.8 }] },
    //    → chefão: Golias, o gigante de Gate (estocada de lança; fala mentiras alternando o versículo que as refuta)
    { tipo: "plataforma", x: 10270, w: 190, altura: 110 }, // na arena do Golias, à esquerda: lá em cima o empurrão e o tremor do golpe no chão não pegam
    { tipo: "gigante", x: 10950, vida: 35 } // 1ª vida (de capacete); depois ele perde o capacete e volta com mais 50 (golias.config.js)
  ]
};
