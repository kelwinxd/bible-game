// ---------- Habilidades → Forjar (aumenta o DANO do versículo) ----------
// Por versículo (o id de palavra/versiculos.js): as palavras que somem do texto e que o jogador martela na faixa.
//   nível 1 = `lacunas` (2 palavras) · nível 2 = `lacunas` + `lacunas2` (4) · nível 3 = o versículo inteiro.
//   cada lacuna: certa = a palavra do texto · distratores = as opções erradas que passam na faixa (palavras diferentes, não
//   conjugações da certa). O teste (npm test) confere que a certa está no texto e não aparece entre os distratores.
export const FORJA = {
  // Êxodo 20:3
  "ex20-3": {
    lacunas: [
      { certa: "deuses", distratores: ["amigos", "caminhos", "senhores"] },
      { certa: "mim", distratores: ["eles", "nós", "todos"] }
    ],
    lacunas2: [
      { certa: "outros", distratores: ["muitos", "grandes", "velhos"] },
      { certa: "diante", distratores: ["longe", "depois", "fora"] }
    ]
  },
  // Êxodo 20:4
  "ex20-4": {
    lacunas: [
      { certa: "escultura", distratores: ["madeira", "ouro", "pedra"] },
      { certa: "céus", distratores: ["montes", "mares", "templos"] }
    ],
    lacunas2: [
      { certa: "imagem", distratores: ["casa", "coroa", "arma"] },
      { certa: "águas", distratores: ["areias", "trevas", "nuvens"] }
    ]
  },
  // Êxodo 20:7
  "ex20-7": {
    lacunas: [
      { certa: "nome", distratores: ["pão", "ouro", "dia"] },
      { certa: "inocente", distratores: ["forte", "sábio", "rico"] }
    ],
    lacunas2: [
      { certa: "tomarás", distratores: ["venderás", "cantarás", "guardarás"] },
      { certa: "Senhor", distratores: ["faraó", "rei", "povo"] }
    ]
  },
  // Hebreus 4:12
  "hb4-12": {
    lacunas: [
      { certa: "viva", distratores: ["antiga", "bela", "simples"] },
      { certa: "espada", distratores: ["lança", "flecha", "pedra"] }
    ],
    lacunas2: [
      { certa: "eficaz", distratores: ["breve", "rara", "difícil"] },
      { certa: "coração", distratores: ["povo", "mundo", "templo"] }
    ]
  },
  // Tiago 4:7
  "tg4-7": {
    lacunas: [
      { certa: "resisti", distratores: ["obedecei", "servi", "ouvi"] },
      { certa: "fugirá", distratores: ["voltará", "ficará", "vencerá"] }
    ],
    lacunas2: [
      { certa: "Deus", distratores: ["lei", "igreja", "verdade"] },
      { certa: "diabo", distratores: ["mundo", "pecado", "medo"] }
    ]
  },
  // 1 Coríntios 10:13
  "1co10-13": {
    lacunas: [
      { certa: "fiel", distratores: ["justo", "forte", "santo"] },
      { certa: "escape", distratores: ["caminho", "refúgio", "descanso"] }
    ],
    lacunas2: [
      { certa: "humana", distratores: ["divina", "pequena", "rara"] },
      { certa: "suportar", distratores: ["vencer", "esquecer", "evitar"] }
    ]
  },
  // Isaías 41:10
  "is41-10": {
    lacunas: [
      { certa: "contigo", distratores: ["grande", "longe", "juiz"] },
      { certa: "destra", distratores: ["esquerda", "palavra", "força"] }
    ],
    lacunas2: [
      { certa: "temas", distratores: ["chores", "fujas", "durmas"] },
      { certa: "ajudo", distratores: ["julgo", "chamo", "provo"] }
    ]
  },
  // Salmos 23:4
  "sl23-4": {
    lacunas: [
      { certa: "sombra", distratores: ["casa", "vida", "festa"] },
      { certa: "cajado", distratores: ["pão", "manto", "escudo"] }
    ],
    lacunas2: [
      { certa: "morte", distratores: ["noite", "guerra", "fome"] },
      { certa: "consolam", distratores: ["guiam", "cercam", "ferem"] }
    ]
  },
  // Salmos 3:7
  "sl3-7": {
    lacunas: [
      { certa: "salva-me", distratores: ["ouve-me", "ensina-me", "consola-me"] },
      { certa: "dentes", distratores: ["ossos", "braços", "escudos"] }
    ],
    lacunas2: [
      { certa: "inimigos", distratores: ["amigos", "irmãos", "servos"] },
      { certa: "ímpios", distratores: ["justos", "reis", "leões"] }
    ]
  },
  // 1 Pedro 5:6
  "1pe5-6": {
    lacunas: [
      { certa: "Humilhai-vos", distratores: ["Alegrai-vos", "Levantai-vos", "Guardai-vos"] },
      { certa: "mão", distratores: ["voz", "casa", "lei"] }
    ],
    lacunas2: [
      { certa: "potente", distratores: ["santa", "antiga", "leve"] },
      { certa: "exalte", distratores: ["esqueça", "julgue", "chame"] }
    ]
  },
  // Provérbios 3:5
  "pv3-5": {
    lacunas: [
      { certa: "Confia", distratores: ["Pensa", "Espera", "Olha"] },
      { certa: "coração", distratores: ["dinheiro", "braço", "nome"] }
    ],
    lacunas2: [
      { certa: "próprio", distratores: ["grande", "velho", "único"] },
      { certa: "entendimento", distratores: ["caminho", "trabalho", "tesouro"] }
    ]
  }
};

// Níveis por trilha. Forja: multiplicador de dano (8 × mult). Afiação: segundos de poder.
export const NIVEIS_FORJA = { nomes: ["Bruto", "Forjado", "Temperado"], mult: [1.0, 1.2, 1.4], descr: ["2 palavras faltando", "4 palavras faltando", "versículo inteiro"] };
// graus da lâmina (a runa no card do versículo), do melhor para o pior
export const GRAUS = [
  { nome: "Temperado", mult: 1.4, cor: "#f2c84b", letra: "T" },
  { nome: "Forjado",   mult: 1.2, cor: "#c9d1d9", letra: "F" },
  { nome: "Bruto",     mult: 1.0, cor: "#c87533", letra: "B" }
];

// mandamento upado (forja nesse nível ou mais: 2 = Forjado): o martelo vai e VOLTA girando (bumerangue), acertando também na volta,
// e some ao chegar perto do herói
export const MARTELO_VOLTA = 2;
