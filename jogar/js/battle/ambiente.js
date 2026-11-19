// ---------- Som ambiente das fases ----------
// Mar: os buracos com água (data.js: tipo "buraco" ou "mar"; fora as fases com buracoSeco) soam como mar.
// O som sai DA ÁGUA: quanto mais perto o herói chega da borda, mais alto (some a RAIO px de distância), e vem do lado
// em que a água está (esquerda/direita). Pausado, fora da jornada ou no fim dela, silencia. Chamado a cada quadro (script.js).
// Coruja (data.js → fases[].coruja): pia ao longe a cada 12–25 s, de um lado sorteado (fora da caverna, fora das pausas).
// Uivo (fases[].uivo): um lobo uiva bem longe (abafado) a cada 30–50 s, do mesmo jeito.
// Bichos com som em loop (classe com `static VOZ = { som, vol, raio }`, ex.: a mulher dos piolhos): o som sai DELES, baixo, e cai
// com a distância até o herói como o mar (some a `raio` px); vem do lado em que o bicho está. Morto, pausa ou fora da jornada: cala.
import { B } from './state.js';
import { halted } from './hud.js';
import { corujaSom, loopsDeBichos, marSom, uivoSom } from '../core/audio.js';

const RAIO = 650; // px: a partir daqui o mar não se ouve mais

let corujaT = 6, uivoT = 18, ultimo = 0;
function coruja() {
  const agora = performance.now() / 1000, dt = Math.min(.1, agora - ultimo); ultimo = agora;
  if (!B || !(B.fase.coruja || B.fase.uivo) || B.over || halted() || B.passagem || B.zona === 'caverna') return;
  const lado = () => (Math.random() < .5 ? -1 : 1) * (.4 + Math.random() * .5);
  if (B.fase.uivo && (uivoT -= dt) <= 0) { uivoT = 30 + Math.random() * 20; uivoSom(.18, lado(), true); }
  if (B.fase.coruja && (corujaT -= dt) <= 0) { corujaT = 12 + Math.random() * 13; corujaSom(.25 + Math.random() * .15, (Math.random() < .5 ? -1 : 1) * (.4 + Math.random() * .5)); }
}

function vozesDosBichos() {
  const porSom = { piolho: [] }; // cada som em loop conhecido (sempre chamado, mesmo vazio: assim os que sobraram calam)
  if (B && !B.over && !halted() && !B.passagem) for (const o of B.frogs) {
    const V = o.constructor.VOZ; if (!V || o.dead) continue;
    const d = Math.abs(o.x - B.hero.x); if (d >= V.raio) continue;
    const k = 1 - d / V.raio; (porSom[V.som] ||= []).push([o, V.vol * k * k, (o.x - B.hero.x) / V.raio * 1.4]);
  }
  for (const som in porSom) loopsDeBichos(som, porSom[som]);
}

export function somAmbiente() {
  coruja(); vozesDosBichos();
  if (!B || B.over || halted() || B.passagem || B.fase.buracoSeco || !B.holes.length) return marSom(0);
  const x = B.hero.x;
  let melhor = null, dMin = Infinity;
  for (const o of B.holes) { // o ponto de água mais perto do herói
    const px = Math.max(o.x, Math.min(o.x + o.w, x)), d = Math.abs(px - x);
    if (d < dMin) { dMin = d; melhor = px; }
  }
  if (dMin >= RAIO) return marSom(0);
  const k = 1 - dMin / RAIO;
  marSom(k * k, (melhor - x) / RAIO * 1.4); // cai como no mundo real (mais rápido de perto); o lado acompanha a direção da água
}
