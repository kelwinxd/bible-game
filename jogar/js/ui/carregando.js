// ---------- Tela de carregamento das jornadas ----------
// Antes de cada jornada (mapa, "Jogar de novo", próxima jornada, Bestiário, Treinamento): espera as artes da fase baixarem
// (js/core/carregar.js) com a tela #carregando — o nome da jornada, a barra e a porcentagem — e só então a fase começa, já
// montada. Com tudo em cache (2ª vez), a tela nem aparece: ela só entra se o carregamento passar de MOSTRA_APOS ms.
import { carregarFase } from '../core/carregar.js';
import { $ } from '../core/utils.js';

const MOSTRA_APOS = 150;
let ocupado = false;

/** espera a fase carregar; devolve false se já havia um carregamento em andamento (clique duplo) */
export async function aguardarFase(fase) {
  if (ocupado) return false;
  ocupado = true;
  const tela = $('carregando');
  $('carregandoNome').textContent = fase.nome || '';
  const barra = p => { $('carregandoBarra').style.width = Math.round(p * 100) + '%'; $('carregandoPct').textContent = Math.round(p * 100) + '%'; };
  barra(0);
  const mostrar = setTimeout(() => tela.classList.add('on'), MOSTRA_APOS);
  try { await carregarFase(fase, barra); }
  finally { clearTimeout(mostrar); tela.classList.remove('on'); ocupado = false; }
  return true;
}
