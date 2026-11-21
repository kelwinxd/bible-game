// ---------- Habilidades → Espírito Santo (o IMPULSO [L]) ----------
// Sessão Espírito Santo (na forja): leitura + quiz só sobre o Espírito Santo.
// Passar no quiz (errar no máx. 1 de 5) sobe o nível do Impulso do Espírito: dano = danoBase + nível × ganho.
// Escrito de memória — conferir as referências antes do jogo oficial.
export const ESPIRITO = {
  danoBase: 6, ganho: 2, nivelMax: 3, perguntasPorQuiz: 5, errosPermitidos: 1,
  versiculos: [
    { ref: "Atos 1:8", texto: "Mas recebereis a virtude do Espírito Santo, que há de vir sobre vós; e ser-me-eis testemunhas, tanto em Jerusalém como em toda a Judeia e Samaria e até aos confins da terra." },
    { ref: "João 14:26", texto: "Mas aquele Consolador, o Espírito Santo, que o Pai enviará em meu nome, esse vos ensinará todas as coisas e vos fará lembrar de tudo quanto vos tenho dito." }
  ],
  perguntas: [
    { p: "Em que festa o Espírito Santo desceu sobre os discípulos?", certa: "Pentecostes", erradas: ["Páscoa", "Festa dos Tabernáculos", "Dia da Expiação"], ref: "Atos 2:1" },
    { p: "O que apareceu sobre cada um dos discípulos no Pentecostes?", certa: "Línguas como de fogo", erradas: ["Uma pomba branca", "Uma nuvem de glória", "Uma coroa de luz"], ref: "Atos 2:3" },
    { p: "Que som veio do céu quando o Espírito desceu?", certa: "Como de um vento veemente e impetuoso", erradas: ["Um trovão", "Um toque de trombeta", "Um coro de anjos"], ref: "Atos 2:2" },
    { p: "Depois de cheios do Espírito, os discípulos começaram a falar em quê?", certa: "Em outras línguas", erradas: ["Em parábolas", "Só em hebraico", "Em sonhos"], ref: "Atos 2:4" },
    { p: "No batismo de Jesus, o Espírito desceu sobre ele de que forma?", certa: "Como pomba", erradas: ["Como fogo", "Como nuvem", "Como águia"], ref: "Mateus 3:16" },
    { p: "Como Jesus chamou o Espírito Santo que o Pai enviaria?", certa: "Consolador", erradas: ["Juiz", "Mestre da lei", "Mensageiro"], ref: "João 14:16" },
    { p: "Segundo João 14:26, o que o Espírito Santo faria pelos discípulos?", certa: "Ensinaria todas as coisas e os faria lembrar das palavras de Jesus", erradas: ["Daria riquezas a eles", "Os livraria de todo sofrimento", "Escreveria a lei em pedras"], ref: "João 14:26" },
    { p: "Segundo Atos 1:8, o que os discípulos receberiam com a vinda do Espírito?", certa: "Poder para serem testemunhas", erradas: ["Um reino terreno", "Riquezas e honra", "Vida longa"], ref: "Atos 1:8" },
    { p: "Em que cidade Jesus mandou os discípulos esperarem a promessa do Pai?", certa: "Jerusalém", erradas: ["Nazaré", "Belém", "Roma"], ref: "Atos 1:4" },
    { p: "Quem pregou no dia de Pentecostes?", certa: "Pedro", erradas: ["Paulo", "Tiago", "Estêvão"], ref: "Atos 2:14" },
    { p: "Quantas pessoas se converteram naquele dia de Pentecostes?", certa: "Quase três mil", erradas: ["Doze", "Setenta", "Cem"], ref: "Atos 2:41" },
    { p: "Qual destes NÃO está na lista do fruto do Espírito?", certa: "Riqueza", erradas: ["Paz", "Mansidão", "Bondade"], ref: "Gálatas 5:22-23" },
    { p: "Segundo 1 Coríntios 6:19, o corpo do cristão é o quê?", certa: "Templo do Espírito Santo", erradas: ["Altar de pedra", "Arca da aliança", "Trono de Davi"], ref: "1 Coríntios 6:19" },
    { p: "Quando não sabemos orar como convém, o que o Espírito faz?", certa: "Intercede por nós com gemidos inexprimíveis", erradas: ["Fica em silêncio", "Ora só pelos anjos", "Nos deixa sozinhos"], ref: "Romanos 8:26" },
    { p: "Quem anda no Espírito não cumpre o quê?", certa: "Os desejos da carne", erradas: ["A lei de Moisés", "Os mandamentos", "As promessas de Deus"], ref: "Gálatas 5:16" },
    { p: "Em Gênesis 1:2, o Espírito de Deus se movia sobre o quê?", certa: "Sobre a face das águas", erradas: ["Sobre os montes", "Sobre o jardim do Éden", "Sobre a arca"], ref: "Gênesis 1:2" },
    { p: "Pelo profeta Joel, Deus prometeu derramar o seu Espírito sobre quem?", certa: "Sobre toda a carne", erradas: ["Só sobre os sacerdotes", "Só sobre os reis", "Só sobre os anjos"], ref: "Joel 2:28" }
  ]
};
