// ---------- As jornadas (fases), em ordem no mapa ----------
import { EXODUS } from './exodus.js';
import { PRAGAS } from './pragas.js';
import { VALE } from './vale.js';
import { BABILONIA } from './babilonia.js';

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
export const FASES = [EXODUS, PRAGAS, VALE, BABILONIA];

// protótipo: true = todas as jornadas abertas no menu, sem precisar vencer a anterior (false = trava até vencer)
export const JORNADAS_LIBERADAS = false;
