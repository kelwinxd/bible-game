// ---------- As mentiras dos monstros e chefões ----------
// texto = o balão · tipo = quem fala (o tema do monstro, ou o chefão: gigante = Golias, rei = Nabucodonosor, naja, farao)
// ideal = os versículos (ids de palavra/versiculos.js) que a refutam: só eles acendem o poder contra ela
export const MENTIRAS = [
  { texto: "Cede. Só desta vez.", tipo: "tentacao", ideal: ["tg4-7"] },
  { texto: "Você não aguenta mais.", tipo: "tentacao", ideal: ["1co10-13"] },
  { texto: "Deus te abandonou.", tipo: "duvida", ideal: ["sl23-4"] },
  { texto: "Você é fraco e medroso. Desista.", tipo: "duvida", ideal: ["is41-10"] },
  { texto: "Seus inimigos são fortes demais.", tipo: "duvida", ideal: ["sl3-7", "is41-10"] },
  // variações: frases diferentes que pedem o mesmo versículo (anti-decoreba, GDD 6.3)
  { texto: "Ninguém vai saber.", tipo: "tentacao", ideal: ["tg4-7"] },
  { texto: "Você merece isso, aproveita.", tipo: "tentacao", ideal: ["tg4-7"] },
  { texto: "Não tem saída, desista.", tipo: "tentacao", ideal: ["1co10-13"] },
  { texto: "Isso é forte demais pra você.", tipo: "tentacao", ideal: ["1co10-13"] },
  { texto: "Você está sozinho no escuro.", tipo: "duvida", ideal: ["sl23-4"] },
  { texto: "Ninguém vai te socorrer.", tipo: "duvida", ideal: ["is41-10"] },
  { texto: "Aqui embaixo ninguém te acha.", tipo: "duvida", ideal: ["sl23-4"] },
  { texto: "Você vai perder essa batalha.", tipo: "duvida", ideal: ["sl3-7", "is41-10"] },
  // Golias (chefão da Jornada 2): fala estas na ordem, alternando o versículo que refuta (Isaías 41:10 ↔ Salmos 23:4)
  { texto: "Olhe meu tamanho. Ninguém vai te socorrer de mim!", tipo: "gigante", ideal: ["is41-10"] },
  { texto: "Neste vale só existe morte. Tenha medo de mim!", tipo: "gigante", ideal: ["sl23-4"] },
  { texto: "Sou forte demais. Você vai cair aqui, sozinho!", tipo: "gigante", ideal: ["is41-10"] },
  // Nabucodonosor (chefão da Babilônia, Daniel 3–4): orgulho do rei → humildade (1 Pedro 5:6) e confiança no Senhor (Provérbios 3:5)
  { texto: "Eu ergui Babilônia com a minha força!", tipo: "rei", ideal: ["1pe5-6"] },
  { texto: "Que deus te livrará das minhas mãos?", tipo: "rei", ideal: ["pv3-5"] },
  { texto: "O seu Deus não desce a este vale escuro.", tipo: "gigante", ideal: ["sl23-4"] },
  // Naja, chefona do mar da jornada 1: duas mentiras que se alternam (uma para cada versículo da jornada)
  { texto: "Curve-se a mim. Eu sou o seu deus agora!", tipo: "naja", ideal: ["ex20-3"] },
  { texto: "Sua Bíblia é papel morto. Afunde comigo!", tipo: "naja", ideal: ["hb4-12"] },
  // demônio da Mentira: desacredita a Bíblia
  { texto: "A Bíblia é só um livro antigo. Não serve pra nada hoje.", tipo: "mentira", ideal: ["hb4-12"] },
  { texto: "Palavras velhas e mortas. Isso não muda ninguém.", tipo: "mentira", ideal: ["hb4-12"] },
  { texto: "Isso é coisa do passado, não tem poder nenhum.", tipo: "mentira", ideal: ["hb4-12"] },
  { texto: "Pragas são só azar. Deus não fala com ninguém.", tipo: "mentira", ideal: ["hb4-12"] },
  { texto: "Quem é o Senhor para que eu ouça a sua voz?", tipo: "mentira", ideal: ["ex20-7", "hb4-12"] },
  // demônio da Idolatria: puxa para outros deuses (o bezerro de ouro está logo ali)
  { texto: "Curve-se ao bezerro de ouro. Esse deus você pode ver.", tipo: "idolatria", ideal: ["ex20-3"] },
  { texto: "Tenha quantos deuses quiser. Todos levam ao mesmo lugar.", tipo: "idolatria", ideal: ["ex20-3"] },
  { texto: "Ponha outra coisa em primeiro lugar. Deus entende.", tipo: "idolatria", ideal: ["ex20-3"] },
  // As Pragas: os deuses do Egito (Êxodo 12:12) e a Palavra desacreditada
  { texto: "Os deuses do Egito são mais fortes que o seu Deus.", tipo: "idolatria", ideal: ["ex20-4", "ex20-3"] },
  // o Faraó (chefão das Pragas): refutado pelos mandamentos
  { texto: "Quem é o Senhor, para que eu ouça a sua voz?", tipo: "farao", ideal: ["ex20-7"] },
  { texto: "Eu sou o deus do Egito. Curve-se diante de mim!", tipo: "farao", ideal: ["ex20-3"] },
  { texto: "Meus deuses de ouro e pedra vão te esmagar!", tipo: "farao", ideal: ["ex20-4"] },
  { texto: "Adore o Nilo e o sol. São eles que te dão a vida.", tipo: "idolatria", ideal: ["ex20-4", "ex20-3"] },
  // Babilônia (Daniel 3): a estátua de ouro do rei
  { texto: "Curve-se à estátua de ouro do rei. Todos se curvam!", tipo: "idolatria", ideal: ["ex20-3"] },
  // Orgulho (Babilônia): força própria contra humildade e dependência do Senhor
  { texto: "Você é forte sozinho. Não se curve a ninguém!", tipo: "orgulho", ideal: ["1pe5-6"] },
  { texto: "Sua força vem de você. Deus é para os fracos.", tipo: "orgulho", ideal: ["pv3-5"] },
  { texto: "Confie no seu braço. Só os fracos pedem ajuda.", tipo: "orgulho", ideal: ["pv3-5"] },
  { texto: "Você chegou aqui sozinho. Ninguém te deu nada.", tipo: "orgulho", ideal: ["1pe5-6"] }
];
