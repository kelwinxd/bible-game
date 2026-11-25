// ---------- Música das fases ----------
// Cada jornada pode ter a sua música (data/jornadas/*.js → fases[].musica = caminho do mp3): toca em loop do começo da jornada até sair dela
// (nos menus toca o rádio, ../musics/radio.js). fases[].musicaVol (0–1) deixa a música daquela fase mais baixa; fases[].musicaIni (s) faz ela começar (e repetir) daquele segundo. Nas configurações (do menu e da pausa): Música liga/desliga e o volume, salvos no
// aparelho (ef-musica, ef-musica-vol).
import { $ } from './utils.js';

const au = new Audio(); au.loop = true; au.preload = 'auto';
let ligada = true, volume = .6, fator = 1; // fator = o volume da fase (fases[].musicaVol; 1 = normal)
try { ligada = localStorage.getItem('ef-musica') !== '0'; const v = localStorage.getItem('ef-musica-vol'); if (v != null) volume = Math.max(0, Math.min(1, +v)); } catch (e) {}
au.volume = volume;
const aplicar = () => { au.volume = Math.max(0, Math.min(1, volume * fator)); };

/** começa a música da fase (do início, ou de `ini` s); sem música, para a que estiver tocando */
let inicio = 0; // fases[].musicaIni: começa (e volta ao repetir) deste segundo — pula a introdução
export function tocarMusicaDaFase(src, vol = 1, ini = 0) {
  if (!src) return pararMusica();
  fator = vol; aplicar(); // cada fase pode tocar mais baixo (o volume das configurações vale por cima)
  suspensa = false; inicio = ini; au.loop = !inicio; // com início, o loop é feito à mão (no 'ended'), para voltar ao mesmo segundo
  const url = new URL(src, location.href).href;
  if (au.src !== url) au.src = url;
  irPara(inicio);
  if (ligada) au.play().catch(() => {});
}
// pular para um segundo: sem os dados do arquivo ainda, espera eles chegarem
function irPara(t) {
  if (au.readyState >= 1) au.currentTime = t;
  else au.addEventListener('loadedmetadata', () => { au.currentTime = t; }, { once: true });
}
au.addEventListener('ended', () => { if (!inicio) return; irPara(inicio); if (ligada) au.play().catch(() => {}); });
export const pararMusica = () => { suspensa = false; au.pause(); };
// pausa no meio (guarda onde parou) e retoma do mesmo ponto — o chefão da Babilônia: a música dele para quando ele cai e volta
// quando a estátua começa a atacar. Suspensa, ligar a Música nas configurações não a retoma
let suspensa = false;
export const suspenderMusica = () => { suspensa = true; au.pause(); };
export function retomarMusica() { if (!suspensa) return; suspensa = false; if (ligada && au.src) au.play().catch(() => {}); }

export function setMusica(on) {
  ligada = on; sincronizar();
  try { localStorage.setItem('ef-musica', on ? '1' : '0'); } catch (e) {}
  if (!on) au.pause(); else if (au.src && !suspensa && document.getElementById('battle').classList.contains('on')) au.play().catch(() => {});
}
export function setVolumeMusica(v) {
  volume = Math.max(0, Math.min(1, v)); aplicar(); sincronizar();
  try { localStorage.setItem('ef-musica-vol', volume); } catch (e) {}
}

// os controles (iguais no menu e na pausa): checkbox Música + barra de volume (0–100)
const PARES = [['optMusic', 'optMusicVol', 'optMusicVolTxt'], ['pauseMusic', 'pauseMusicVol', 'pauseMusicVolTxt']];
function sincronizar() {
  PARES.forEach(([c, r, t]) => {
    if ($(c)) $(c).checked = ligada;
    if ($(r)) { $(r).value = Math.round(volume * 100); $(r).disabled = !ligada; }
    if ($(t)) $(t).textContent = Math.round(volume * 100) + '%';
  });
}
PARES.forEach(([c, r]) => {
  if ($(c)) $(c).addEventListener('change', e => { setMusica(e.target.checked); e.target.blur(); });
  if ($(r)) { $(r).addEventListener('input', e => setVolumeMusica(e.target.value / 100)); $(r).addEventListener('change', e => e.target.blur()); }
});
sincronizar();
