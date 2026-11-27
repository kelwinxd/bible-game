// Espada Forjada — ponto de entrada.
// Carrega todos os módulos, expõe ao HTML as funções usadas nos onclick e roda o loop do jogo.
import './js/core/carregar.js'; // 1º: registra as imagens criadas por todos os módulos (tela de carregamento)
import { B } from './js/battle/state.js';
import { D, byId } from './js/core/utils.js';
import './js/core/options.js';
import './js/core/progress.js';
import './js/core/audio.js';
import './js/core/log.js';
import { show } from './js/ui/screens.js';
import { sparksTick } from './js/ui/sparks.js';
import { showMenuView } from './js/ui/menu.js';
import './js/ui/menu-nav.js';
import { forgeAll, habView, habBack } from './js/forge/list.js';
import { openFaith, startQuiz, answerQuiz, nextQuiz } from './js/forge/faith.js';
import { openVerse, toggleStudy, backToVerse } from './js/forge/verse.js';
import { openForge, forgeTick } from './js/forge/forge.js';
import { openSharpen, pickSharp, selectSharp, sharpTick } from './js/forge/sharpen.js';
import './js/battle/config.js';
import { startBattle as montarFase } from './js/battle/world.js';
import { aguardarFase } from './js/ui/carregando.js';
import { openBestiary, startBestiary } from './js/battle/bestiary.js';
import { startTreino, treinoAjusta, treinoCheio, treinoMax, treinoRecolhe } from './js/battle/treino.js';
import { setPause, showPauseView, toggleDeck, togglePeek, closePeek, useVerse, halted } from './js/battle/hud.js';
import { startDash } from './js/battle/combat.js';
import { updateBattle } from './js/battle/update.js';
import { drawBattle } from './js/battle/draw/scene.js';
import { somAmbiente } from './js/battle/ambiente.js';
import './js/battle/draw/world.js';
import './js/battle/draw/hud.js';
import './js/input/controls.js';

// onclick="..." do HTML (e dos trechos gerados) roda no escopo global
// os botões chamam startBattle(i): primeiro a tela de carregamento, depois a fase já montada
const startBattle = async (fi, all) => { if (await aguardarFase(D.fases[fi])) montarFase(fi, all); };
Object.assign(window, { startBattle, openBestiary, startBestiary, startTreino, treinoAjusta, treinoCheio, treinoMax, treinoRecolhe, show, showMenuView, forgeAll, habView, habBack, openFaith, startQuiz, answerQuiz, nextQuiz, openVerse, openForge, openSharpen, toggleStudy, backToVerse, pickSharp, selectSharp, setPause, showPauseView, startDash, toggleDeck, togglePeek, closePeek, useVerse, byId });

// ---------- Loop ----------
let last = performance.now();
function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  forgeTick(dt); sharpTick(dt); sparksTick(dt);
  if (B) { if ((!B.over || B.hp <= 0) && !halted()) updateBattle(dt); drawBattle(); }
  somAmbiente(); // o mar perto da água (js/battle/ambiente.js)
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
