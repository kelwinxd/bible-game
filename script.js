// Espada Forjada — ponto de entrada.
// Carrega todos os módulos, expõe ao HTML as funções usadas nos onclick e roda o loop do jogo.
import { B } from './js/battle/state.js';
import { byId } from './js/core/utils.js';
import './js/core/options.js';
import './js/core/progress.js';
import './js/core/audio.js';
import { show } from './js/ui/screens.js';
import { sparksTick } from './js/ui/sparks.js';
import { showMenuView } from './js/ui/menu.js';
import './js/ui/menu-nav.js';
import { forgeAll, habView, habBack } from './js/forge/list.js';
import { openFaith, startQuiz, answerQuiz, nextQuiz } from './js/forge/faith.js';
import { openVerse, toggleStudy, backToVerse } from './js/forge/verse.js';
import { openForge, forgeTick } from './js/forge/forge.js';
import { openSharpen, pickSharp, sharpTick } from './js/forge/sharpen.js';
import './js/battle/config.js';
import { startBattle } from './js/battle/world.js';
import { openBestiary, startBestiary } from './js/battle/bestiary.js';
import { setPause, showPauseView, toggleDeck, togglePeek, closePeek, useVerse, halted } from './js/battle/hud.js';
import { startDash } from './js/battle/combat.js';
import './js/battle/bird.js';
import { updateBattle } from './js/battle/update.js';
import { drawBattle } from './js/battle/draw/scene.js';
import './js/battle/draw/world.js';
import './js/battle/draw/hud.js';
import './js/battle/draw/enemies.js';
import './js/input/controls.js';

// onclick="..." do HTML (e dos trechos gerados) roda no escopo global
Object.assign(window, { startBattle, openBestiary, startBestiary, show, showMenuView, forgeAll, habView, habBack, openFaith, startQuiz, answerQuiz, nextQuiz, openVerse, openForge, openSharpen, toggleStudy, backToVerse, pickSharp, setPause, showPauseView, startDash, toggleDeck, togglePeek, closePeek, useVerse, byId });

// ---------- Loop ----------
let last = performance.now();
function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  forgeTick(dt); sharpTick(dt); sparksTick(dt);
  if (B) { if ((!B.over || B.hp <= 0) && !halted()) updateBattle(dt); drawBattle(); }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
