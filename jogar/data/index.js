// ---------- Conteúdo do jogo (separado da lógica, GDD 14.2) ----------
// Cada domínio fica no seu arquivo; aqui só se junta tudo em DATA, que o jogo importa (js/core/utils.js → D).
//
//   palavra/      versiculos.js  os versículos em si (id, ref, tema, autor, texto)
//                 temas.js       a cor de cada tema, a dos mandamentos e as abreviações dos livros
//   habilidades/  forja.js       Forjar: as palavras que faltam em cada versículo, os níveis (dano) e os graus da lâmina
//                 afiacao.js     Afiar: as perguntas de cada versículo, as dos autores e os níveis (duração do poder)
//                 fe.js          Exercitar a fé (o escudo)          espirito.js  Espírito Santo (o impulso)
//   batalha/      mentiras.js    as mentiras e os versículos que as refutam    inimigos.js  a ficha dos monstros
//   progresso/    xp.js          XP e níveis do herói
//   jornadas/     index.js       a ordem das jornadas e a explicação dos eventos; um arquivo por jornada
//
// Para o resto do jogo nada mudou: DATA tem o mesmo formato de antes. Os versículos saem daqui já com o que é da forja
// (lacunas, lacunas2) e da afiação (afiacao) juntos — ligados pelo id. O teste (npm test) confere que todo versículo tem os dois.
import { VERSICULOS } from './palavra/versiculos.js';
import { ABREV, COR_MANDAMENTO, TEMAS } from './palavra/temas.js';
import { FORJA, GRAUS, MARTELO_VOLTA, NIVEIS_FORJA } from './habilidades/forja.js';
import { AFIACAO, AUTORES, NIVEIS_AFIACAO } from './habilidades/afiacao.js';
import { FE } from './habilidades/fe.js';
import { ESPIRITO } from './habilidades/espirito.js';
import { MENTIRAS } from './batalha/mentiras.js';
import { INIMIGOS } from './batalha/inimigos.js';
import { XP } from './progresso/xp.js';
import { FASES, JORNADAS_LIBERADAS } from './jornadas/index.js';

/** o versículo com o que é da forja e da afiação dele (o formato que o jogo usa) */
const montarVersiculo = v => ({ ...v, ...FORJA[v.id], afiacao: AFIACAO[v.id] });

export const DATA = {
  versiculos: VERSICULOS.map(montarVersiculo),
  mentiras: MENTIRAS,
  abrev: ABREV,
  temas: TEMAS,
  corMandamento: COR_MANDAMENTO,
  marteloVolta: MARTELO_VOLTA,
  inimigos: INIMIGOS,
  jornadasLiberadas: JORNADAS_LIBERADAS,
  xp: XP,
  fases: FASES,
  autores: AUTORES,
  espirito: ESPIRITO,
  fe: FE,
  niveis: { forja: NIVEIS_FORJA, afiacao: NIVEIS_AFIACAO },
  graus: GRAUS
};
export default DATA;
