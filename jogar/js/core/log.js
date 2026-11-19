// ---------- Logs de uso (PostHog), só em produção ----------
// log('evento', { ...dados }) registra o que o jogador fez (jornada começada/vencida/abandonada, morte, versículo forjado…).
//  - Desenvolvimento (npm run dev): nada é enviado — só aparece no console ([log] evento {dados}).
//  - Produção (npm run build): o posthog-js é carregado sob demanda (fica num arquivo à parte, não pesa no começo) e envia
//    em lote para o PostHog. Precisa da chave do projeto em VITE_POSTHOG_KEY (arquivo .env.production na raiz; sem chave, nada é
//    enviado). VITE_POSTHOG_HOST = a região (padrão: https://us.i.posthog.com; Europa: https://eu.i.posthog.com).
//  - Anônimo: um id aleatório por aparelho (sem nome, e-mail ou login), sem gravação de tela e sem captura automática de cliques.
//  - O jogador pode desligar em Configurações → "Dados de uso anônimos" (salvo em ef-analytics); desligado, nada é enviado.
//  - Erros de JavaScript também viram evento (erro_js), com a mensagem e onde aconteceu.
import { $ } from './utils.js';

const PROD = import.meta.env.PROD, KEY = import.meta.env.VITE_POSTHOG_KEY, HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';
let ligado = true;
try { ligado = localStorage.getItem('ef-analytics') !== '0'; } catch (e) {}

let ph = null, carregando = null; const fila = []; // eventos que chegaram antes do posthog carregar
function carregar() {
  if (ph || carregando || !PROD || !KEY || !ligado) return carregando;
  carregando = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: HOST,
      autocapture: false, capture_pageview: true, capture_pageleave: true, // só os eventos do jogo (o canvas não tem cliques úteis)
      disable_session_recording: true, persistence: 'localStorage', person_profiles: 'identified_only',
      loaded: p => { if (!ligado) p.opt_out_capturing(); }
    });
    ph = posthog; fila.splice(0).forEach(([e, d, o]) => ph.capture(e, d, o));
  }).catch(() => {});
  return carregando;
}

/** registra um evento; final = a página pode estar fechando (envia na hora, por sendBeacon) */
export function log(evento, dados = {}, final = false) {
  if (!PROD) { console.debug('[log]', evento, dados); return; }
  if (!KEY || !ligado) return;
  const opc = final ? { transport: 'sendBeacon' } : undefined;
  if (ph) ph.capture(evento, dados, opc); else { if (fila.length < 50) fila.push([evento, dados, opc]); carregar(); }
}

export function setAnalytics(on) {
  ligado = on; sincronizar();
  try { localStorage.setItem('ef-analytics', on ? '1' : '0'); } catch (e) {}
  if (ph) on ? ph.opt_in_capturing() : ph.opt_out_capturing(); else if (on) carregar();
}
const sincronizar = () => { if ($('optAnalytics')) $('optAnalytics').checked = ligado; };
if ($('optAnalytics')) $('optAnalytics').addEventListener('change', e => { setAnalytics(e.target.checked); e.target.blur(); });
sincronizar();

// erros de JavaScript em produção (no máximo 10 por página, para um erro em loop não inundar)
let erros = 0;
const erro = (msg, onde) => { if (erros++ < 10) log('erro_js', { msg: String(msg).slice(0, 300), onde: String(onde || '').slice(0, 200) }); };
addEventListener('error', e => erro(e.message, `${(e.filename || '').split('/').pop()}:${e.lineno}:${e.colno}`));
addEventListener('unhandledrejection', e => erro(e.reason?.message || e.reason, e.reason?.stack?.split('\n')[1]));

carregar();
