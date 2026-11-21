// ---------- Jornada: Babilônia ----------
// os tipos de evento e os campos estão explicados em jornadas/index.js
export const BABILONIA = {
  // Jornada 4: Babilônia, a cidade dos ídolos e do orgulho (Daniel 3–4). 2 versículos de humildade e dependência do Senhor
  // (1 Pedro 5:6, Provérbios 3:5) e 4 inimigos — só leões e harpias.
  id: "babilonia", abre: ["vale"], nivelMin: 2, // abre vencendo o Vale E com o herói no nível 2 ou mais (sistema de XP)
  nome: "Babilônia", comprimento: 9900,
  // Babilônia, no Eufrates. via: a rota do cativeiro de Judá (2 Reis 25) — sobe por Canaã, passa pela Síria e desce o Eufrates
  mapa: { x: 86, y: 22, icone: "zigurate", cor: "#d9a441", via: { vale: [[56, 32], [62, 16], [72, 13], [80, 18]] } },
  // fundo: a cidade com o zigurate, a estátua e fumaça, esticada pela fase (parallax lento)
  fundo: { img: "assets/img/fundo-babilonia.webp", estica: 1.05, escuro: 0.5, final: "assets/img/fundo-babilonia-final.webp", foco: [0.28, 0.3] }, // foco: onde está a estátua na arte (fração x, y) — a câmera vai até ela antes da cena // imagem larga (1920×819, parada): já passa da tela, anda ~380 px pela fase; véu de 50%: a arte é bem clara
  // chão: o altar de pedra dourada com panos, cálices e vinho derramado. Pontas: esq. 560 px (pano vermelho e cálice
  // até a pilastra), dir. 260 px (pérolas e cálice); superfície em y=140, faixa de blocos em y 320–400; tingido mais escuro (chaoCor)
  chao: "assets/img/chao-babilonia.webp", chaoCor: "#d0c4b6", // tingido ~15% mais escuro (a arte era clara demais)
  chaoMedidas: { cap: 560, capR: 260, capFade: 50, capOut: 40, surf: 140, band: [320, 400], fade: 160, s: .45 },
  // buracos: mar vermelho com mãos de armadura (GIF "Mãos Blindadas nas Ondas Vermelhas": 12 quadros 358×338, 0,11 s;
  // o céu preto do GIF virou transparente, o mar fica sólido)
  maos: { img: "assets/sprites/hazard/mar-vermelho.webp", FW: 358, FH: 338, n: 12, dur: 0.11, agua: 120, fundo: ["#2a0606", "#120202"] },
  dica: ["Babilônia: a cidade dos ídolos e do orgulho", "Suba a escadaria do zigurate: a Palavra está lá no alto"],
  eventos: [
    // 1) buraco e pedra no chão → 1 Pedro 5:6 (humildade)
    { tipo: "buraco", x: 800, w: 200 },
    // soldados esqueletos de Babilônia (js/battle/frog.js → BICHO.soldado): soltos pela fase, patrulham e estocam com a lança
    { tipo: "soldado", x: 1200 },
    { tipo: "pedra", x: 1500, verso: "1pe5-6" },
    // o Leão do Orgulho (Daniel 6): a 1ª mentira é sobre força própria → 1 Pedro 5:6
    { tipo: "inimigos", x: 2600, inimigos: ["orgulho"], vida: 0.8, frases: ["Você é forte sozinho. Não se curve a ninguém!"] },
    { tipo: "soldado", x: 3120 },
    { tipo: "terreno", x: 3300, w: 420, altura: 100 },
    { tipo: "soldado", x: 4000 },
    { tipo: "buraco", x: 4300, w: 220 },
    { tipo: "soldado", x: 4850 }, // entre o buraco e a escadaria
    // 2) a escadaria do zigurate (arte inteira, 1994×630 desenhada a 45%): 4 degraus que se sobem pulando
    //    (20, 47, 110 e 146 px acima do chão); no degrau mais alto, o ídolo → Provérbios 3:5 (dependência do Senhor)
    { tipo: "estrutura", x: 5200, img: "assets/img/escadaria-babilonia.webp", w: 1994, h: 630, sc: .45, base: 45,
      degraus: [[0, 500, 485], [500, 800, 425], [800, 1340, 285], [1340, 1994, 205]] },
    // ovelha perdida: um terraço que sai do topo da escadaria para a direita (a 250 px; só dá para pular para ele do degrau de cima)
    { tipo: "plataforma", x: 6140, w: 170, altura: 250 },
    { tipo: "ovelha", x: 6225, y: -250, calma: true },
    { tipo: "pedra", x: 5950, verso: "pv3-5" },
    //    → a harpia, com um soldado chegando junto
    { tipo: "inimigos", x: 7000, inimigos: ["duvida"], vida: 0.8, frases: ["Confie no seu braço. Só os fracos pedem ajuda."], soldados: 1 },
    { tipo: "soldado", x: 7450 },
    { tipo: "buraco", x: 7800, w: 200 },
    // depois do último buraco, até a fornalha: piso de pedra escura com cinzas e pergaminhos queimados (arte inteira que
    // substitui o chão; as rochas da ponta esquerda fazem a borda do buraco, as da direita encostam no piso da fornalha)
    { tipo: "estrutura", x: 7990, img: "assets/img/chao-cinzas-babilonia.webp", w: 1000, h: 230, sc: 1, base: 85, substitui: true, corte: 0, degraus: [] },
    //    → final: a cobra vermelha sozinha (um monstro com frase por vez), com 2 soldados chegando junto
    { tipo: "inimigos", x: 8600, inimigos: ["orgulho"], vida: 0.8, frases: ["Você chegou aqui sozinho. Ninguém te deu nada."], soldados: 2,
      aparencia: { sprite: "serpente", chao: true, mergulho: false, passo: 70, tell: 0.6, cadencia: 1.8, salto: 0 } },
    // fim da fase: o piso de pedra queimada diante da FORNALHA ARDENTE (Daniel 3), arte inteira que substitui o chão normal
    // (o chão termina numa ponta antes dela); o herói pisa no piso (y≈297 da arte), a fornalha e a escada ficam ao fundo; a cruz fica diante dela
    // chefão: Nabucodonosor, diante da fornalha (a arena trava sobre o piso de pedra; a cruz só depois que ele cai)
    { tipo: "gigante", pele: "rei", x: 9480, vida: 60 },
    { tipo: "estrutura", x: 8988, img: "assets/img/chao-forno-babilonia.webp", w: 1086, h: 362, sc: 0.84, base: 54, substitui: true, corte: 30, degraus: [] }
  ]
};
