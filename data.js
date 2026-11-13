// Conteúdo separado da lógica (GDD 14.2). Textos ARC escritos de memória — conferir antes de publicar.
window.DATA = {
  // Cada versículo tem 2 trilhas de 3 níveis (só passa de nível acertando tudo):
  //  - Forja (aumenta o DANO): nível 1 = `lacunas` (2), nível 2 = `lacunas` + `lacunas2` (4), nível 3 = versículo inteiro.
  //  - Afiação (aumenta a DURAÇÃO do poder): `afiacao[0]` = "quem escreveu?" (+ 1 pergunta sorteada de `autores[autor]`),
  //    `afiacao[1]` contexto histórico, `afiacao[2]` contexto da passagem.
  versiculos: [
    {
      id: "ex20-3", ref: "Êxodo 20:3", tema: "idolatria", autor: "moises",
      texto: "Não terás outros deuses diante de mim.",
      lacunas: [
        { certa: "deuses", distratores: ["amigos", "caminhos", "senhores"] },
        { certa: "mim", distratores: ["eles", "nós", "todos"] }
      ],
      lacunas2: [
        { certa: "outros", distratores: ["muitos", "grandes", "velhos"] },
        { certa: "diante", distratores: ["longe", "depois", "fora"] }
      ],
      afiacao: [
        [
          { p: "Quem escreveu o livro de Êxodo?", certa: "Moisés", erradas: ["Arão", "Josué", "Samuel"] }
        ],
        [
          { p: "De qual terra Deus tinha acabado de tirar Israel?", certa: "Egito", erradas: ["Babilônia", "Canaã", "Assíria"] },
          { p: "Em qual monte Deus deu os Dez Mandamentos (Êxodo 19:20)?", certa: "Sinai", erradas: ["Carmelo", "Sião", "Das Oliveiras"] }
        ],
        [
          { p: "Logo antes (Êxodo 20:2), Deus se apresenta como aquele que tirou o povo de onde?", certa: "Da casa da servidão, a terra do Egito", erradas: ["Do dilúvio", "Da cova dos leões", "Do deserto de Midiã"] },
          { p: "Logo depois (Êxodo 20:4), o que Deus proíbe fazer?", certa: "Imagens de escultura para adorar", erradas: ["Trabalhar no sábado", "Comer carne de porco", "Casar com estrangeiros"] }
        ]
      ]
    },
    {
      id: "hb4-12", ref: "Hebreus 4:12", tema: "mentira", autor: "hebreus",
      texto: "Porque a palavra de Deus é viva, e eficaz, e mais penetrante do que qualquer espada de dois gumes, e penetra até à divisão da alma, e do espírito, e das juntas e medulas, e é apta para discernir os pensamentos e intenções do coração.",
      lacunas: [
        { certa: "viva", distratores: ["antiga", "bela", "simples"] },
        { certa: "espada", distratores: ["lança", "flecha", "pedra"] }
      ],
      lacunas2: [
        { certa: "eficaz", distratores: ["breve", "rara", "difícil"] },
        { certa: "coração", distratores: ["povo", "mundo", "templo"] }
      ],
      afiacao: [
        [
          { p: "Quem escreveu a carta aos Hebreus?", certa: "Não se sabe (o autor não se identifica)", erradas: ["Pedro", "Tiago", "João"] }
        ],
        [
          { p: "A carta foi escrita principalmente para quem?", certa: "Cristãos de origem judaica", erradas: ["Romanos pagãos", "Filósofos gregos", "Sacerdotes egípcios"] },
          { p: "Segundo Hebreus 10:32-34, o que aqueles cristãos já tinham sofrido?", certa: "Perseguição e perda dos bens", erradas: ["Uma grande fome", "Um terremoto", "O exílio na Babilônia"] }
        ],
        [
          { p: "Logo antes (Hebreus 4:11), o autor exorta a se esforçar para entrar em quê?", certa: "No descanso de Deus", erradas: ["No templo", "Na arca", "Na cidade de Davi"] },
          { p: "Logo depois (Hebreus 4:13), o que fica encoberto diante de Deus?", certa: "Nada, tudo está descoberto", erradas: ["Os pensamentos", "O futuro", "Os pecados antigos"] }
        ]
      ]
    },
    {
      id: "tg4-7", ref: "Tiago 4:7", tema: "tentacao", autor: "tiago",
      texto: "Sujeitai-vos, pois, a Deus; resisti ao diabo, e ele fugirá de vós.",
      lacunas: [
        { certa: "resisti", distratores: ["obedecei", "servi", "ouvi"] },
        { certa: "fugirá", distratores: ["voltará", "ficará", "vencerá"] }
      ],
      lacunas2: [
        { certa: "Deus", distratores: ["lei", "igreja", "verdade"] },
        { certa: "diabo", distratores: ["mundo", "pecado", "medo"] }
      ],
      afiacao: [
        [
          { p: "Quem escreveu a carta de Tiago?", certa: "Tiago, irmão do Senhor", erradas: ["Tiago, filho de Zebedeu", "Pedro", "Paulo"] }
        ],
        [
          { p: "Tiago foi líder de qual igreja?", certa: "Jerusalém", erradas: ["Antioquia", "Roma", "Éfeso"] },
          { p: "A quem a carta foi dirigida (Tiago 1:1)?", certa: "Às doze tribos dispersas", erradas: ["À igreja de Roma", "Aos gálatas", "A Timóteo"] }
        ],
        [
          { p: "Em Tiago 4:1, de onde vinham as guerras e contendas entre eles?", certa: "Dos seus próprios deleites", erradas: ["Da perseguição romana", "Da falta de dinheiro", "Dos falsos profetas"] },
          { p: "Logo antes (Tiago 4:6), Deus resiste a quem?", certa: "Aos soberbos", erradas: ["Aos pobres", "Aos gentios", "Aos pecadores arrependidos"] }
        ]
      ]
    },
    {
      id: "1co10-13", ref: "1 Coríntios 10:13", tema: "tentacao", autor: "paulo",
      texto: "Não veio sobre vós tentação, senão humana; mas fiel é Deus, que vos não deixará tentar acima do que podeis; antes, com a tentação dará também o escape, para que a possais suportar.",
      lacunas: [
        { certa: "fiel", distratores: ["justo", "forte", "santo"] },
        { certa: "escape", distratores: ["caminho", "refúgio", "descanso"] }
      ],
      lacunas2: [
        { certa: "humana", distratores: ["divina", "pequena", "rara"] },
        { certa: "suportar", distratores: ["vencer", "esquecer", "evitar"] }
      ],
      afiacao: [
        [
          { p: "Quem escreveu 1 Coríntios?", certa: "Paulo", erradas: ["Pedro", "Apolo", "Lucas"] }
        ],
        [
          { p: "Corinto ficava em qual região?", certa: "Grécia (Acaia)", erradas: ["Ásia Menor", "Judeia", "Itália"] },
          { p: "De qual cidade Paulo escreveu a carta (1 Coríntios 16:8)?", certa: "Éfeso", erradas: ["Roma", "Jerusalém", "Antioquia"] }
        ],
        [
          { p: "Em 1 Coríntios 10, Paulo usa como exemplo de advertência a história de quem?", certa: "Israel no deserto", erradas: ["Davi e Golias", "Jonas em Nínive", "Daniel na Babilônia"] },
          { p: "Logo depois (10:14), Paulo manda fugir de quê?", certa: "Da idolatria", erradas: ["Das contendas", "Da avareza", "Das festas"] }
        ]
      ]
    },
    {
      id: "is41-10", ref: "Isaías 41:10", tema: "duvida", autor: "isaias",
      texto: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te esforço, e te ajudo, e te sustento com a destra da minha justiça.",
      lacunas: [
        { certa: "contigo", distratores: ["grande", "longe", "juiz"] },
        { certa: "destra", distratores: ["esquerda", "palavra", "força"] }
      ],
      lacunas2: [
        { certa: "temas", distratores: ["chores", "fujas", "durmas"] },
        { certa: "ajudo", distratores: ["julgo", "chamo", "provo"] }
      ],
      afiacao: [
        [
          { p: "Quem escreveu o livro de Isaías?", certa: "O profeta Isaías", erradas: ["Jeremias", "Ezequiel", "Moisés"] }
        ],
        [
          { p: "Isaías profetizou nos dias de quais reis de Judá (Isaías 1:1)?", certa: "Uzias, Jotão, Acaz e Ezequias", erradas: ["Davi e Salomão", "Josias e Jeoaquim", "Saul e Davi"] },
          { p: "Qual império ameaçava Judá nos dias de Isaías?", certa: "Assíria", erradas: ["Pérsia", "Roma", "Grécia"] }
        ],
        [
          { p: "Em Isaías 41:8, Deus chama de \"meu servo\" a quem?", certa: "Israel, a descendência de Jacó", erradas: ["Ciro, rei da Pérsia", "Davi", "Os filisteus"] },
          { p: "Isaías 41:8 lembra que Israel descende de qual \"amigo\" de Deus?", certa: "Abraão", erradas: ["Noé", "Moisés", "Davi"] }
        ]
      ]
    },
    {
      id: "sl23-4", ref: "Salmos 23:4", tema: "duvida", autor: "davi",
      texto: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.",
      lacunas: [
        { certa: "sombra", distratores: ["casa", "vida", "festa"] },
        { certa: "cajado", distratores: ["pão", "manto", "escudo"] }
      ],
      lacunas2: [
        { certa: "morte", distratores: ["noite", "guerra", "fome"] },
        { certa: "consolam", distratores: ["guiam", "cercam", "ferem"] }
      ],
      afiacao: [
        [
          { p: "A quem é atribuído o Salmo 23?", certa: "Davi", erradas: ["Salomão", "Asafe", "Moisés"] }
        ],
        [
          { p: "Davi foi ungido rei no lugar de quem?", certa: "Saul", erradas: ["Salomão", "Samuel", "Jônatas"] },
          { p: "Qual cidade Davi conquistou e fez capital do reino?", certa: "Jerusalém", erradas: ["Belém", "Siló", "Samaria"] }
        ],
        [
          { p: "No Salmo 23, o Senhor é comparado a quê?", certa: "A um pastor", erradas: ["A um rei", "A uma rocha", "A um guerreiro"] },
          { p: "No versículo 4, o que consola o salmista?", certa: "A vara e o cajado do Senhor", erradas: ["A espada e o escudo", "A luz da lâmpada", "O canto dos anjos"] }
        ]
      ]
    },
    {
      id: "sl3-7", ref: "Salmos 3:7", tema: "duvida", autor: "davi",
      texto: "Levanta-te, Senhor; salva-me, Deus meu, pois feriste a todos os meus inimigos nas queixadas; quebraste os dentes dos ímpios.",
      lacunas: [
        { certa: "salva-me", distratores: ["ouve-me", "ensina-me", "consola-me"] },
        { certa: "dentes", distratores: ["ossos", "braços", "escudos"] }
      ],
      lacunas2: [
        { certa: "inimigos", distratores: ["amigos", "irmãos", "servos"] },
        { certa: "ímpios", distratores: ["justos", "reis", "leões"] }
      ],
      afiacao: [
        [
          { p: "A quem é atribuído o Salmo 3?", certa: "Davi", erradas: ["Salomão", "Asafe", "Coré"] }
        ],
        [
          { p: "Quem era Absalão?", certa: "Filho de Davi", erradas: ["Irmão de Davi", "General de Saul", "Rei dos filisteus"] },
          { p: "Por que Davi fugia de Jerusalém naquela época?", certa: "Absalão se rebelou para tomar o trono", erradas: ["Os filisteus invadiram a cidade", "Saul queria matá-lo", "Uma fome atingiu Judá"] }
        ],
        [
          { p: "Em Salmos 3:2, o que muitos diziam sobre Davi?", certa: "Que não há salvação para ele em Deus", erradas: ["Que ele reinaria para sempre", "Que ele fugiria para o Egito", "Que ele tinha muitos aliados"] },
          { p: "Em Salmos 3:5, mesmo cercado de inimigos, o que Davi fez?", certa: "Deitou, dormiu e acordou, sustentado pelo Senhor", erradas: ["Venceu sozinho o exército", "Escondeu-se numa caverna", "Fugiu para o deserto"] }
        ]
      ]
    },
    // Babilônia: humildade e dependência do Senhor (contra o orgulho)
    {
      id: "1pe5-6", ref: "1 Pedro 5:6", tema: "orgulho", autor: "pedro",
      texto: "Humilhai-vos, pois, debaixo da potente mão de Deus, para que, a seu tempo, vos exalte.",
      lacunas: [
        { certa: "Humilhai-vos", distratores: ["Alegrai-vos", "Levantai-vos", "Guardai-vos"] },
        { certa: "mão", distratores: ["voz", "casa", "lei"] }
      ],
      lacunas2: [
        { certa: "potente", distratores: ["santa", "antiga", "leve"] },
        { certa: "exalte", distratores: ["esqueça", "julgue", "chame"] }
      ],
      afiacao: [
        [
          { p: "Quem escreveu a primeira carta de Pedro?", certa: "Pedro", erradas: ["Paulo", "João", "Tiago"] }
        ],
        [
          { p: "Pelo que passavam os cristãos que receberam a carta (1 Pedro 4:12)?", certa: "Provações e sofrimentos", erradas: ["Uma grande riqueza", "Uma guerra civil", "O exílio no Egito"] },
          { p: "Pedro manda saudações da igreja de qual cidade (1 Pedro 5:13), nome simbólico para Roma?", certa: "Babilônia", erradas: ["Jerusalém", "Antioquia", "Corinto"] }
        ],
        [
          { p: "Logo antes (1 Pedro 5:5), Deus resiste a quem?", certa: "Aos soberbos", erradas: ["Aos pobres", "Aos estrangeiros", "Aos fracos"] },
          { p: "Logo depois (1 Pedro 5:7), o que devemos lançar sobre Deus?", certa: "Toda a nossa ansiedade", erradas: ["Nossas ofertas", "Nossos inimigos", "Nossas coroas"] }
        ]
      ]
    },
    {
      id: "pv3-5", ref: "Provérbios 3:5", tema: "orgulho", autor: "salomao",
      texto: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.",
      lacunas: [
        { certa: "Confia", distratores: ["Pensa", "Espera", "Olha"] },
        { certa: "coração", distratores: ["dinheiro", "braço", "nome"] }
      ],
      lacunas2: [
        { certa: "próprio", distratores: ["grande", "velho", "único"] },
        { certa: "entendimento", distratores: ["caminho", "trabalho", "tesouro"] }
      ],
      afiacao: [
        [
          { p: "Quem escreveu a maior parte de Provérbios?", certa: "Salomão", erradas: ["Davi", "Moisés", "Daniel"] }
        ],
        [
          { p: "Salomão era filho de qual rei?", certa: "Davi", erradas: ["Saul", "Ezequias", "Josias"] },
          { p: "O que Salomão pediu a Deus em Gibeom (1 Reis 3:9)?", certa: "Sabedoria para governar o povo", erradas: ["Riquezas", "Vida longa", "Vitória sobre os inimigos"] }
        ],
        [
          { p: "Logo depois (Provérbios 3:6), quem reconhece a Deus em todos os caminhos recebe o quê?", certa: "Veredas endireitadas por Ele", erradas: ["Muitas riquezas", "Inimigos derrotados", "Um reino"] },
          { p: "Logo depois (Provérbios 3:7), o conselho é não ser o quê aos próprios olhos?", certa: "Sábio", erradas: ["Pobre", "Forte", "Triste"] }
        ]
      ]
    }
  ],
  mentiras: [
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
    // demônio da Idolatria: puxa para outros deuses (o bezerro de ouro está logo ali)
    { texto: "Curve-se ao bezerro de ouro. Esse deus você pode ver.", tipo: "idolatria", ideal: ["ex20-3"] },
    { texto: "Tenha quantos deuses quiser. Todos levam ao mesmo lugar.", tipo: "idolatria", ideal: ["ex20-3"] },
    { texto: "Ponha outra coisa em primeiro lugar. Deus entende.", tipo: "idolatria", ideal: ["ex20-3"] },
    // Babilônia (Daniel 3): a estátua de ouro do rei
    { texto: "Curve-se à estátua de ouro do rei. Todos se curvam!", tipo: "idolatria", ideal: ["ex20-3"] },
    // Orgulho (Babilônia): força própria contra humildade e dependência do Senhor
    { texto: "Você é forte sozinho. Não se curve a ninguém!", tipo: "orgulho", ideal: ["1pe5-6"] },
    { texto: "Sua força vem de você. Deus é para os fracos.", tipo: "orgulho", ideal: ["pv3-5"] },
    { texto: "Confie no seu braço. Só os fracos pedem ajuda.", tipo: "orgulho", ideal: ["pv3-5"] },
    { texto: "Você chegou aqui sozinho. Ninguém te deu nada.", tipo: "orgulho", ideal: ["1pe5-6"] }
  ],
  // Abreviação dos livros para os cards compactos do HUD (deck fechado): "Tiago 4:7" → "Tg 4:7".
  abrev: { "Êxodo": "Êx", "Hebreus": "Hb", "Tiago": "Tg", "1 Coríntios": "1Co", "Isaías": "Is", "Salmos": "Sl", "1 Pedro": "1Pe", "Provérbios": "Pv" },

  // Cor do poder por tema do versículo: brilho no herói, rasgo, impacto, referência, barra de poder e cards.
  temas: {
    tentacao: { nome: "Tentação", cor: "#f2c84b", claro: "#fff2b0", brilho: "#ffd34d" }, // amarelo/dourado
    duvida:   { nome: "Dúvida",   cor: "#7cc8ff", claro: "#e3f5ff", brilho: "#5fb8ff" }, // azul claro
    mentira:  { nome: "Mentira",  cor: "#ff9a4d", claro: "#ffe0c4", brilho: "#ff8a2a" }, // laranja
    idolatria: { nome: "Idolatria", cor: "#c88cff", claro: "#f0e0ff", brilho: "#b06aff" }, // violeta
    orgulho:  { nome: "Orgulho",  cor: "#4fd1b8", claro: "#d8fff6", brilho: "#2fe0c0" }  // verde-água (humildade contra o orgulho)
  },
  inimigos: {
    // chao: anda no chão e ataca corpo a corpo (passo = px/s); sem chao: flutua e cospe fogo;
    // mergulho: ave que paira no alto e mergulha no herói (sprite assets/sprites/enemy/ave-*.png)
    tentacao: { nome: "Demônio da Tentação", vida: 70, dano: 10, tell: 0.55, cadencia: 1.5, chao: true, passo: 90, cor: "#6e0f12", sprite: "serpente" },
    duvida:   { nome: "Ave da Dúvida",       vida: 60, dano: 10, tell: 0.7,  cadencia: 2.2, cor: "#4a3426", sprite: "ave", mergulho: true },
    mentira:  { nome: "Demônio da Mentira",  vida: 60, dano: 8,  tell: 0.6,  cadencia: 1.8, chao: true, passo: 70, cor: "#9a1c1c", sprite: "serpente" }, // serpente: assets/sprites/enemy/serpente-*.png
    idolatria: { nome: "Demônio da Idolatria", vida: 60, dano: 8, tell: 0.6,  cadencia: 1.8, chao: true, passo: 70, cor: "#7a1c4a", sprite: "serpente" },
    // leão (Babilônia, Daniel 6): fala de força e orgulho; salto = px que ele avança no bote
    orgulho: { nome: "Leão do Orgulho", vida: 70, dano: 12, tell: 0.5, cadencia: 1.6, chao: true, passo: 120, cor: "#8a5a12", sprite: "leao", salto: 80 }
  },
  // Jornadas (fases), em ordem: vencer uma libera a próxima. O herói começa só com os versículos achados nas
  // jornadas anteriores. dica (opcional) = aviso no topo ao começar; fundo (opcional) = imagem de fundo (sem ele, céu desenhado).
  // Eventos em ordem de x (pixels do mundo):
  //  buraco     = obstáculo para pular (cair = volta ao último ponto firme, -10 de vida)
  //  mar        = buraco cheio de mar agitado (sprite animado, sem as mãos de fogo); cair = igual ao buraco. Ponha uma plataforma em cima
  //  terra      = chão que fica SUBMERSO dentro de um mar até o chefão cair; aí sobe da água (use no fim da fase, sobre o mar)
  //  gigante    = Golias (js/battle/giant.js): chefão em terra; ao chegar perto a câmera trava numa arena e ele entra pela direita;
  //               vida = pontos de vida. A jornada só termina depois que ele cai
  //  chefe      = chefão do mar (js/battle/boss.js): mora no mar que estiver em x e só sai dele morto; vida = pontos de vida;
  //               pele (opcional) = arte e falas ("naja"; sem ela = Leviatã). A pele pode trazer mentiras (como o Golias).
  //               A jornada só termina depois que ele cai
  //  terreno    = trecho com outra altura: altura > 0 = mais alto (parede: precisa pular), < 0 = vale mais baixo
  //  plataforma = laje flutuante; sobe pulando por baixo e fica em cima. Móvel (opcional): move = quantos px ela anda para a
  //               direita e volta, periodo = segundos de uma ida e volta (quem está em cima vai junto)
  //  pedra      = ídolo (bezerro de ouro) com o livro dourado do versículo; fica apoiada no que estiver embaixo
  //               (chão, terreno alto, vale ou plataforma). 3 golpes; tocar no livro = versículo no HUD
  //  inimigos   = grupo que surge quando o herói chega perto; a câmera trava até todos caírem. vida = multiplicador;
  //               frases (opcional) = mentira fixa de cada inimigo do grupo (texto igual ao de `mentiras`)
  //               aparencia (opcional) = troca campos do inimigo só nesse grupo, ex.: { sprite: "verde", acido: true } = cobra verde que cospe ácido;
  //               pode ser uma lista, uma por inimigo do grupo (null = sem troca)
  //  Arenas ficam no plano: deixe ~740 px antes e ~220 px depois do x de `inimigos` sem desnível.
  //  Pulo: sobe até ~130 px e alcança ~185 px na horizontal. Buraco: o vão real é w − 36 (até w 200 dá para pular com folga).
  // mapa (tela Jogar): x/y = posição do ponto em % do mapa deitado (no celular em pé, x e y se invertem);
  //   icone = desenho do ponto (js/ui/map.js → ICONES: piramide, vale; sem ele, ruínas); cor = brilho da região em volta
  // protótipo: true = todas as jornadas abertas no menu, sem precisar vencer a anterior (false = trava até vencer)
  jornadasLiberadas: true,
  fases: [{
    // Jornada 1: só 2 versículos (Êxodo 20:3, depois Hebreus 4:12), bem separados. Cada um vem antes de 2 serpentes (uma por vez) que ele refuta.
    nome: "Exodus", comprimento: 10100,
    mapa: { x: 24, y: 60, icone: "piramide", cor: "#e0782c" },
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
      { tipo: "mar", x: 8800, w: 1300 }, // ~80% da tela de água aberta; o resto até o fim é a terra submersa
      { tipo: "terra", x: 9570, w: 530 }, // o chão do fim: fica embaixo d'água até o Leviatã cair, depois sobe
      { tipo: "plataforma", x: 8820, w: 340, altura: 30, move: 400, periodo: 10, espera: true, img: "assets/img/jangada.webp" }, // bem larga: dá para lutar em cima; parada até a Naja surgir (ela surge quando o herói pisa na laje)
      { tipo: "chefe", x: 9185, vida: 50, pele: "naja" }
    ]
  }, {
    // Jornada 2: a Dúvida ataca do alto. 2 versículos contra o medo (Isaías 41:10, Salmos 23:4), 4 inimigos e o chefão Golias.
    nome: "O vale da sombra", comprimento: 11500,
    mapa: { x: 58, y: 38, icone: "vale", cor: "#5d7fb8" },
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
      { tipo: "caverna", x: 4900, w: 560, x0: 12400, x1: 15000, entrada: 12620, saida: 5560,
        fundo: { img: "assets/img/fundo-caverna.webp", estica: 1, escuro: 0.25 },
        // chão de pedra da caverna: as 2 variações enviadas emendadas numa faixa só (o miolo alterna entre elas ao repetir)
        chao: { img: "assets/img/chao-caverna.webp", medidas: { cap: 330, capR: 310, capFade: 60, capOut: 50, surf: 240, band: [280, 345], fade: 160, s: 0.5, semFaixa: true } } },
      // em ondas (bando/apos): o ídolo logo na queda; 2 lobos esperando; mortos eles, vem a ave com mais 2 lobos;
      // mortos todos, a cobra vermelha com mais 2 lobos (cada onda só começa quando a anterior acabou inteira)
      { tipo: "pedra", x: 12820, verso: "sl23-4" },
      { tipo: "lobo", x: 13550, bando: "cav1" }, // fora da 1ª tela: esperando mais adiante
      { tipo: "lobo", x: 13800, bando: "cav1" },
      { tipo: "inimigos", x: 13800, apos: "cav1", bando: "cav2", lobos: 2, inimigos: ["duvida"], vida: 0.7, frases: ["Você está sozinho no escuro."] },
      { tipo: "ovelha", x: 14450, calma: true }, // no fim da caverna, antes da rampa: a ovelha perdida (a que fugiu e caiu); tocar nela dá vida
      { tipo: "inimigos", x: 13800, apos: "cav2", bando: "cav3", lobos: 2, inimigos: ["duvida"], vida: 0.7, frases: ["Aqui embaixo ninguém te acha."],
        aparencia: { sprite: "serpente", chao: true, mergulho: false, passo: 70, tell: 0.6, cadencia: 1.8 } },
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
      { tipo: "gigante", x: 10950, vida: 60 }
    ]
  }, {
    // Jornada 3: Babilônia, a cidade dos ídolos e do orgulho (Daniel 3–4). 2 versículos de humildade e dependência do Senhor
    // (1 Pedro 5:6, Provérbios 3:5) e 4 inimigos — só leões e harpias.
    nome: "Babilônia", comprimento: 9900,
    mapa: { x: 84, y: 60, icone: "zigurate", cor: "#d9a441" },
    // fundo: a cidade com o zigurate, a estátua e fumaça, esticada pela fase (parallax lento)
    fundo: { img: "assets/img/fundo-babilonia.webp", estica: 1.05, escuro: 0.5, final: "assets/img/fundo-babilonia-final.webp", foco: [0.28, 0.3] }, // foco: onde está a estátua na arte (fração x, y) — a câmera vai até ela antes da cena // imagem larga (1920×819, parada): já passa da tela, anda ~380 px pela fase; véu de 50%: a arte é bem clara
    // chão: o altar de pedra dourada com panos, cálices e vinho derramado. Pontas: esq. 560 px (pano vermelho e cálice
    // até a pilastra), dir. 260 px (pérolas e cálice); superfície em y=140, faixa de blocos em y 320–400; tingido mais escuro (chaoCor)
    chao: "assets/img/chao-babilonia.webp", chaoCor: "#b8aa9c", // tingido ~25% mais escuro (a arte era clara demais)
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
  }],
  // Exercitar a fé: leitura + quiz sobre os heróis de Hebreus 11. Passar no quiz aumenta a duração do escudo.
  // Afiação nível 1: perguntas SÓ sobre a pessoa do autor (não sobre o contexto da carta/livro).
  // Uma é sorteada a cada partida, depois do "quem escreveu?". Autores compartilhados entre versículos (ex.: Davi).
  autores: {
    hebreus: { nome: "Autor de Hebreus", perguntas: [
      { p: "A tradição antiga da igreja atribuiu Hebreus a quem?", certa: "Paulo", erradas: ["Pedro", "João", "Tiago"] },
      { p: "Além de Paulo, quais nomes os estudiosos já sugeriram como autor?", certa: "Apolo ou Barnabé", erradas: ["Pedro ou João", "Mateus ou Tiago", "Davi ou Salomão"] },
      { p: "Em Hebreus 13:23, o autor menciona qual irmão, já posto em liberdade?", certa: "Timóteo", erradas: ["Silas", "Tito", "Marcos"] }
    ] },
    paulo: { nome: "Paulo", perguntas: [
      { p: "Qual era o nome de Paulo antes de ser chamado Paulo?", certa: "Saulo", erradas: ["Silas", "Simeão", "Barnabé"] },
      { p: "Antes da conversão, Paulo perseguia quem?", certa: "Os cristãos", erradas: ["Os romanos", "Os fariseus", "Os samaritanos"] },
      { p: "Onde Paulo encontrou Jesus e se converteu?", certa: "No caminho de Damasco", erradas: ["No templo de Jerusalém", "Em Atenas", "No mar da Galileia"] },
      { p: "Paulo era natural de qual cidade?", certa: "Tarso", erradas: ["Nazaré", "Cafarnaum", "Corinto"] },
      { p: "Antes de Cristo, Paulo pertencia a qual grupo judeu?", certa: "Fariseus", erradas: ["Saduceus", "Essênios", "Zelotes"] },
      { p: "Paulo foi instruído aos pés de qual mestre (Atos 22:3)?", certa: "Gamaliel", erradas: ["Nicodemos", "Caifás", "Anás"] },
      { p: "Qual ofício Paulo usava para se sustentar?", certa: "Fazedor de tendas", erradas: ["Pescador", "Carpinteiro", "Cobrador de impostos"] },
      { p: "Paulo ficou conhecido como apóstolo de quem?", certa: "Dos gentios", erradas: ["Dos sacerdotes", "Dos samaritanos", "Dos reis"] }
    ] },
    tiago: { nome: "Tiago", perguntas: [
      { p: "Tiago, autor da carta, era irmão de quem?", certa: "De Jesus", erradas: ["De João", "De Pedro", "De André"] },
      { p: "Como Tiago se apresenta no início da carta (Tiago 1:1)?", certa: "Servo de Deus e do Senhor Jesus Cristo", erradas: ["Apóstolo dos gentios", "Profeta de Israel", "Filho do trovão"] },
      { p: "Antes da ressurreição, os irmãos de Jesus criam nele (João 7:5)?", certa: "Não, não criam", erradas: ["Sim, desde a infância", "Eram do grupo dos doze", "Só Tiago cria"] },
      { p: "Segundo 1 Coríntios 15:7, Jesus ressuscitado apareceu a quem?", certa: "A Tiago", erradas: ["A Nicodemos", "A Lázaro", "A José de Arimateia"] },
      { p: "Como Paulo chama Tiago em Gálatas 1:19?", certa: "Irmão do Senhor", erradas: ["Filho do trovão", "Pai da fé", "O zelote"] }
    ] },
    moises: { nome: "Moisés", perguntas: [
      { p: "Quando bebê, onde Moisés foi colocado para escapar da ordem de Faraó (Êxodo 2:3)?", certa: "Num cesto de junco no rio", erradas: ["Numa caverna", "No templo", "Num poço seco"] },
      { p: "Quem criou Moisés no palácio (Êxodo 2:10)?", certa: "A filha de Faraó", erradas: ["A rainha de Sabá", "Raabe", "Rute"] },
      { p: "Moisés era de qual tribo de Israel (Êxodo 2:1)?", certa: "Levi", erradas: ["Judá", "Benjamim", "Dã"] },
      { p: "Para qual terra Moisés fugiu depois de matar o egípcio (Êxodo 2:15)?", certa: "Midiã", erradas: ["Moabe", "Edom", "Filístia"] },
      { p: "De dentro de quê Deus chamou Moisés (Êxodo 3:2)?", certa: "De uma sarça ardente", erradas: ["De uma nuvem", "De um redemoinho", "De uma rocha"] },
      { p: "Quem Deus deu para falar ao lado de Moisés (Êxodo 4:14)?", certa: "Seu irmão Arão", erradas: ["Josué", "Calebe", "Jetro"] }
    ] },
    isaias: { nome: "Isaías", perguntas: [
      { p: "Isaías era filho de quem (Isaías 1:1)?", certa: "Amoz", erradas: ["Hilquias", "Buzi", "Jessé"] },
      { p: "Quando foi chamado (Isaías 6), o que Isaías viu?", certa: "O Senhor num alto e sublime trono", erradas: ["Uma sarça ardente", "Uma escada até o céu", "Um carro de fogo"] },
      { p: "O que tocou os lábios de Isaías no seu chamado (Isaías 6:6-7)?", certa: "Uma brasa viva do altar", erradas: ["Um ramo de hissopo", "Óleo da unção", "Água do Jordão"] },
      { p: "O que Isaías respondeu quando Deus perguntou: a quem enviarei?", certa: "Eis-me aqui, envia-me a mim", erradas: ["Quem sou eu para ir?", "Não sei falar", "Envia outro"] },
      { p: "Isaías profetizou principalmente a qual reino?", certa: "Judá", erradas: ["Edom", "Egito", "Moabe"] }
    ] },
    pedro: { nome: "Pedro", perguntas: [
      { p: "Qual era a profissão de Pedro antes de seguir Jesus?", certa: "Pescador", erradas: ["Cobrador de impostos", "Carpinteiro", "Pastor"] },
      { p: "Qual era o nome de Pedro antes de Jesus chamá-lo assim?", certa: "Simão", erradas: ["Saulo", "Levi", "Natanael"] },
      { p: "Quantas vezes Pedro negou Jesus?", certa: "Três", erradas: ["Uma", "Duas", "Sete"] },
      { p: "Quem era o irmão de Pedro, também apóstolo?", certa: "André", erradas: ["João", "Tiago", "Filipe"] }
    ] },
    salomao: { nome: "Salomão", perguntas: [
      { p: "Qual grande obra Salomão construiu em Jerusalém?", certa: "O templo", erradas: ["A muralha de Neemias", "O palácio de Herodes", "A torre de Babel"] },
      { p: "Quem era a mãe de Salomão?", certa: "Bate-Seba", erradas: ["Rute", "Ester", "Mical"] },
      { p: "Qual rainha visitou Salomão para provar a sabedoria dele?", certa: "A rainha de Sabá", erradas: ["A rainha Ester", "A rainha Jezabel", "A rainha Vasti"] }
    ] },
    davi: { nome: "Davi", perguntas: [
      { p: "Antes de ser rei, Davi trabalhava como quê?", certa: "Pastor de ovelhas", erradas: ["Pescador", "Carpinteiro", "Sacerdote"] },
      { p: "Davi era filho de quem?", certa: "Jessé", erradas: ["Saul", "Samuel", "Boaz"] },
      { p: "Davi nasceu em qual cidade?", certa: "Belém", erradas: ["Nazaré", "Jericó", "Hebrom"] },
      { p: "Qual gigante filisteu Davi venceu?", certa: "Golias", erradas: ["Ogue", "Sansão", "Anaque"] },
      { p: "Qual profeta ungiu Davi como rei?", certa: "Samuel", erradas: ["Natã", "Elias", "Eli"] },
      { p: "Qual instrumento Davi tocava para acalmar Saul?", certa: "Harpa", erradas: ["Trombeta", "Flauta", "Tamboril"] }
    ] }
  },

  // Sessão Espírito Santo (na forja): leitura + quiz só sobre o Espírito Santo.
  // Passar no quiz (errar no máx. 1 de 5) sobe o nível do Impulso do Espírito: dano = danoBase + nível × ganho.
  // Escrito de memória — conferir as referências antes do jogo oficial.
  espirito: {
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
  },

  fe: {
    escudoBase: 3, escudoMax: 6, ganho: 1, perguntasPorQuiz: 5, errosPermitidos: 1,
    versiculos: [
      { ref: "Hebreus 11:1", texto: "Ora, a fé é o firme fundamento das coisas que se esperam e a prova das coisas que se não veem." },
      { ref: "Hebreus 11:6", texto: "Ora, sem fé é impossível agradar-lhe, porque é necessário que aquele que se aproxima de Deus creia que ele existe e que é galardoador dos que o buscam." }
    ],
    perguntas: [
      { p: "Pela fé, quem ofereceu a Deus maior sacrifício do que Caim?", certa: "Abel", erradas: ["Sete", "Enoque", "Noé"], ref: "Hebreus 11:4" },
      { p: "Pela fé, quem foi trasladado para não ver a morte?", certa: "Enoque", erradas: ["Elias", "Moisés", "Abel"], ref: "Hebreus 11:5" },
      { p: "Pela fé, quem, avisado por Deus, preparou a arca para salvar a sua família?", certa: "Noé", erradas: ["Abraão", "Jacó", "José"], ref: "Hebreus 11:7" },
      { p: "Pela fé, quem obedeceu e saiu para um lugar que havia de receber por herança, sem saber para onde ia?", certa: "Abraão", erradas: ["Isaque", "Ló", "Moisés"], ref: "Hebreus 11:8" },
      { p: "Pela fé, quem recebeu força para conceber, mesmo fora da idade, porque teve por fiel aquele que lho prometera?", certa: "Sara", erradas: ["Raquel", "Rebeca", "Ana"], ref: "Hebreus 11:11" },
      { p: "Pela fé, sendo provado, Abraão ofereceu qual filho?", certa: "Isaque", erradas: ["Ismael", "Jacó", "José"], ref: "Hebreus 11:17" },
      { p: "Pela fé, quem abençoou Jacó e Esaú, no tocante às coisas futuras?", certa: "Isaque", erradas: ["Abraão", "Labão", "José"], ref: "Hebreus 11:20" },
      { p: "Pela fé, quem, próximo da morte, abençoou cada um dos filhos de José e adorou encostado à ponta do seu bordão?", certa: "Jacó", erradas: ["Isaque", "Moisés", "Davi"], ref: "Hebreus 11:21" },
      { p: "Pela fé, quem, próximo da morte, fez menção da saída dos filhos de Israel e deu ordem acerca de seus ossos?", certa: "José", erradas: ["Jacó", "Moisés", "Josué"], ref: "Hebreus 11:22" },
      { p: "Pela fé, quem recusou ser chamado filho da filha de Faraó?", certa: "Moisés", erradas: ["Arão", "José", "Josué"], ref: "Hebreus 11:24" },
      { p: "Pela fé, o povo passou como por terra seca por qual mar?", certa: "Mar Vermelho", erradas: ["Mar Morto", "Mar da Galileia", "Rio Jordão"], ref: "Hebreus 11:29" },
      { p: "Pela fé, caíram os muros de qual cidade, depois de rodeados durante sete dias?", certa: "Jericó", erradas: ["Jerusalém", "Babilônia", "Nínive"], ref: "Hebreus 11:30" },
      { p: "Pela fé, qual mulher não pereceu com os incrédulos, por ter recebido os espias em paz?", certa: "Raabe", erradas: ["Rute", "Débora", "Ester"], ref: "Hebreus 11:31" },
      { p: "\"A fé é o firme fundamento das coisas que se ___.\"", certa: "esperam", erradas: ["veem", "temem", "sabem"], ref: "Hebreus 11:1" },
      { p: "\"Sem fé é impossível ___ a Deus.\"", certa: "agradar", erradas: ["conhecer", "servir", "ver"], ref: "Hebreus 11:6" }
    ]
  },
  // Níveis por trilha. Forja: multiplicador de dano (8 × mult). Afiação: segundos de poder.
  niveis: {
    forja:   { nomes: ["Bruto", "Forjado", "Temperado"], mult: [1.0, 1.2, 1.4], descr: ["2 palavras faltando", "4 palavras faltando", "versículo inteiro"] },
    afiacao: { base: 4, ganho: 1, descr: ["Autor do livro", "Contexto histórico", "Contexto da passagem"] }
  },
  graus: [
    { nome: "Temperado", mult: 1.4, cor: "#f2c84b", letra: "T" },
    { nome: "Forjado",   mult: 1.2, cor: "#c9d1d9", letra: "F" },
    { nome: "Bruto",     mult: 1.0, cor: "#c87533", letra: "B" }
  ]
};
