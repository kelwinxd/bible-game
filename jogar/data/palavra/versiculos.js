// ---------- Os versículos (a Palavra) ----------
// Só o versículo em si: id (usado em todo o jogo), ref, tema (a cor do poder e as mentiras que refuta — palavra/temas.js),
// autor (chave de habilidades/afiacao.js → AUTORES), mandamento (true = um dos Dez Mandamentos: o poder vira o martelo) e o texto.
// O que se pratica com cada um fica em habilidades/: forja.js (as palavras que faltam) e afiacao.js (as perguntas), pelo mesmo id.
// Para o versículo aparecer numa jornada, ponha uma pedra com o id dele (jornadas/*.js → { tipo: "pedra", verso: "<id>" }).
// Textos ARC escritos de memória — conferir antes de publicar.
export const VERSICULOS = [
  {
    id: "ex20-3", ref: "Êxodo 20:3", tema: "idolatria", autor: "moises", mandamento: true,
    texto: "Não terás outros deuses diante de mim."
  },
  {
    // As Pragas (jornada 2): o 2º mandamento — as pragas julgaram os deuses do Egito: do céu (o sol), da terra e das águas (o Nilo)
    id: "ex20-4", ref: "Êxodo 20:4", tema: "idolatria", autor: "moises", mandamento: true,
    texto: "Não farás para ti imagem de escultura, nem alguma semelhança do que há em cima nos céus, nem em baixo na terra, nem nas águas debaixo da terra."
  },
  {
    // As Pragas: o 3º mandamento — o faraó zombou do nome do Senhor ("Quem é o Senhor, cuja voz eu ouvirei?", Êxodo 5:2)
    id: "ex20-7", ref: "Êxodo 20:7", tema: "mentira", autor: "moises", mandamento: true,
    texto: "Não tomarás o nome do Senhor, teu Deus, em vão; porque o Senhor não terá por inocente o que tomar o seu nome em vão."
  },
  {
    id: "hb4-12", ref: "Hebreus 4:12", tema: "mentira", autor: "hebreus",
    texto: "Porque a palavra de Deus é viva, e eficaz, e mais penetrante do que qualquer espada de dois gumes, e penetra até à divisão da alma, e do espírito, e das juntas e medulas, e é apta para discernir os pensamentos e intenções do coração."
  },
  {
    id: "tg4-7", ref: "Tiago 4:7", tema: "tentacao", autor: "tiago",
    texto: "Sujeitai-vos, pois, a Deus; resisti ao diabo, e ele fugirá de vós."
  },
  {
    id: "1co10-13", ref: "1 Coríntios 10:13", tema: "tentacao", autor: "paulo",
    texto: "Não veio sobre vós tentação, senão humana; mas fiel é Deus, que vos não deixará tentar acima do que podeis; antes, com a tentação dará também o escape, para que a possais suportar."
  },
  {
    id: "is41-10", ref: "Isaías 41:10", tema: "duvida", autor: "isaias",
    texto: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te esforço, e te ajudo, e te sustento com a destra da minha justiça."
  },
  {
    id: "sl23-4", ref: "Salmos 23:4", tema: "duvida", autor: "davi",
    texto: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam."
  },
  {
    id: "sl3-7", ref: "Salmos 3:7", tema: "duvida", autor: "davi",
    texto: "Levanta-te, Senhor; salva-me, Deus meu, pois feriste a todos os meus inimigos nas queixadas; quebraste os dentes dos ímpios."
  },
  {
    id: "1pe5-6", ref: "1 Pedro 5:6", tema: "orgulho", autor: "pedro",
    texto: "Humilhai-vos, pois, debaixo da potente mão de Deus, para que, a seu tempo, vos exalte."
  },
  {
    id: "pv3-5", ref: "Provérbios 3:5", tema: "orgulho", autor: "salomao",
    texto: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento."
  }
];
