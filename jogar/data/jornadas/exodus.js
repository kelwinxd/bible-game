// ---------- Jornada: Exodus ----------
// os tipos de evento e os campos estão explicados em jornadas/index.js
export const EXODUS = {
  // Jornada 1: só 2 versículos (Êxodo 20:3, depois Hebreus 4:12), bem separados. Cada um vem antes de 2 serpentes (uma por vez) que ele refuta.
  id: "exodus", nome: "Exodus", comprimento: 11200,
  musica: "assets/audio/musics/Cantemus Domino.mp3", // a música da fase, em loop (js/core/musica.js)
  mapa: { x: 10, y: 71, icone: "piramide", img: "assets/img/simbolo-exodus.webp", cor: "#e0782c" }, // img: o símbolo (faraó, pirâmides, sol e palmeira) no lugar do desenho // Egito, perto das pirâmides (posição na pintura assets/img/mapa.webp)
  // fundo (opcional): imagem que rola devagar (parallax) e se repete espelhada, emendando sem corte; escuro = véu por cima
  fundo: { img: "assets/img/fundo-exodus.webp", parallax: 0.35, escuro: 0.35 },
  chao: "assets/img/chao-exodus.webp", // laje de terra e pedras (miolo repetido + pontas nas bordas)
  eventos: [
    // 1) buraco e o bezerro de ouro no chão → Êxodo 20:3 ("Não terás outros deuses diante de mim")
    // rãs (Êxodo 8): soltas pela fase, fora das arenas; encostar fere, morrem fácil (js/battle/frog.js)
    { tipo: "buraco", x: 650, w: 190 },
    { tipo: "ra", x: 1020, ronda: true, ensina: true }, // a 1ª vem logo depois do buraco, só patrulha e ensina o [K]
    { tipo: "pedra", x: 1500, verso: "ex20-3" }, // afastado da rã: sobra espaço para a luta
    //    → 2 serpentes da Idolatria, uma de cada vez, com um terreno alto entre elas (a 1ª provoca com o bezerro)
    { tipo: "inimigos", x: 2250, inimigos: ["idolatria"], vida: 0.6, frases: ["Curve-se ao bezerro de ouro. Esse deus você pode ver."] },
    { tipo: "terreno", x: 2550, w: 330, altura: 90 },
    { tipo: "ra", x: 2950 },
    { tipo: "inimigos", x: 3650, inimigos: ["idolatria"], vida: 0.7, frases: ["Tenha quantos deuses quiser. Todos levam ao mesmo lugar."] },
    // 2) caminho longo até o 2º versículo: buraco, mar com uma laje no meio, mar largo com 2 lajes, penhasco com a pedra no topo → Hebreus 4:12
    { tipo: "buraco", x: 4000, w: 200 },
    { tipo: "ra", x: 4330 },
    { tipo: "mar", x: 4500, w: 500 },
    { tipo: "plataforma", x: 4640, w: 200, altura: 40 },
    { tipo: "mar", x: 5300, w: 330 },
    { tipo: "plataforma", x: 5400, w: 130, altura: 50 },
    { tipo: "plataforma", x: 5720, w: 140, altura: 70 },
    { tipo: "terreno", x: 5880, w: 460, altura: 140 },
    { tipo: "ra", x: 6600 },
    { tipo: "pedra", x: 6150, verso: "hb4-12" },
    //    → 2 Mentiras (serpentes), uma de cada vez, que desacreditam a Bíblia (Hebreus 4:12 refuta)
    // a 1ª Mentira é a cobra verde: cospe ácido de longe (aparencia troca sprite e ataque; o tema e as mentiras continuam os da Mentira)
    { tipo: "inimigos", x: 7200, inimigos: ["mentira"], vida: 0.6, frases: ["A Bíblia é só um livro antigo. Não serve pra nada hoje."], aparencia: { sprite: "verde", acido: true, tell: 0.7, cadencia: 2, passo: 80 }, ras: 2 }, // ras: N → N rãs caem do céu quando a arena acaba
    { tipo: "inimigos", x: 8500, inimigos: ["mentira"], vida: 0.75, frases: ["Palavras velhas e mortas. Isso não muda ninguém."], ras: 10 }, // a praga antes da chefona
    // 3) chegada: um mar largo, atravessado numa laje que vai e volta — e nele mora a chefona, a Naja (o Leviatã com a arte da naja verde; mente como o Golias)
    // ovelha perdida (opcional): depois da chuva de rãs, antes da Naja — um degrau e uma plataforma alta (do chão o pulo não
    // alcança a plataforma, só do degrau). Ao ver o herói ela foge pulando: chão → degrau → plataforma → a plataforma mais alta, e lá em cima fica calma
    { tipo: "ovelha", x: 8950, sobe: [[9260, -90], [9580, -200], [9380, -310]] },
    { tipo: "terreno", x: 9100, w: 320, altura: 90 },
    { tipo: "plataforma", x: 9480, w: 200, altura: 200 },
    { tipo: "plataforma", x: 9300, w: 160, altura: 310 }, // a mais alta, em cima à esquerda: só dá para pular para ela da de 200
    { tipo: "mar", x: 9900, w: 1300 }, // ~80% da tela de água aberta; o resto até o fim é a terra submersa
    { tipo: "terra", x: 10670, w: 530 }, // o chão do fim: fica embaixo d'água até o Leviatã cair, depois sobe
    { tipo: "plataforma", x: 9920, w: 340, altura: 30, move: 400, periodo: 10, espera: true, img: "assets/img/jangada.webp" }, // bem larga: dá para lutar em cima; parada até a Naja surgir (ela surge quando o herói pisa na laje)
    { tipo: "chefe", x: 10285, vida: 50, pele: "naja" }
  ]
};
