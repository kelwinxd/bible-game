// ---------- Bichos: a fábrica e a chuva de rãs ----------
// criarBicho escolhe a classe pelo tipo do data/jornadas. Para criar um bicho novo: uma classe que herda de Bicho (ou de Patrulheiro)
// e uma linha em BICHOS.
import { B } from '../../state.js';
import { terrainTop } from '../../world.js';
import { Boi } from './boi.js';
import { Espantalho } from './espantalho.js';
import { Lobo, Piolhenta, Soldado } from './patrulheiro.js';
import { Ra } from './ra.js';

/** tipo (data/jornadas) → classe; sem tipo = rã (as da chuva de rãs). Função: só lê as classes na hora (sem importação circular) */
export const BICHOS = () => ({ ra: Ra, lobo: Lobo, soldado: Soldado, piolhenta: Piolhenta, boi: Boi, espantalho: Espantalho });
export const criarBicho = e => new (BICHOS()[e.tipo] || Ra)(e);

/** chuva de rãs (data/jornadas → grupo com ras: N): quando a arena acaba, N rãs caem do céu espalhadas pela tela, longe do herói */
export function chuvaDeRas(n, ar) {
  const hx = B.hero.x, xs = [];
  for (let tries = 0; xs.length < n && tries < 600; tries++) {
    const x = ar.left + 50 + Math.random() * (ar.right - ar.left - 100), gap = tries < 300 ? 50 : 25; // sem lugar: aceita mais juntas
    if (Math.abs(x - hx) < 120 || xs.some(o => Math.abs(o - x) < gap) || terrainTop(x) > 200) continue;
    xs.push(x);
  }
  xs.forEach((x, i) => B.frogs.push(new Ra({ x }).cairDoCeu(520 + i * 70)));
  B.notice = { lines: ['Uma praga de rãs!', 'Elas caem do céu: cuidado para não encostar'], t: 3, c: '#9be07a' };
}
/** rãs que caem na plataforma do chefão (a jangada da Naja): andam junto com ela e não saem de cima */
export function rasNaJangada(n, pl, aviso = true) {
  const hx = B.hero.x, xs = B.frogs.filter(f => f.pl === pl && !f.dead).map(f => f.x), ja = xs.length; // longe das que já estão lá
  for (let tries = 0; xs.length < ja + n && tries < 400; tries++) {
    const x = pl.x + 30 + Math.random() * (pl.w - 60), gap = tries < 200 ? 45 : 20;
    if (Math.abs(x - hx) < 60 || xs.some(o => Math.abs(o - x) < gap)) continue;
    xs.push(x);
  }
  xs.slice(ja).forEach((x, i) => B.frogs.push(new Ra({ x }).cairDoCeu(520 + i * 80, pl)));
  if (aviso) B.notice = { lines: ['Rãs caem do céu na jangada!', 'Derrube-as antes que encostem em você'], t: 3, c: '#9be07a' };
}
