// ---------- Habilidades → Exercitar a fé (o ESCUDO) ----------
// Exercitar a fé: leitura + quiz sobre os heróis de Hebreus 11. Passar no quiz aumenta a duração do escudo.
// Textos ARC escritos de memória — conferir antes de publicar.
export const FE = {
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
};
