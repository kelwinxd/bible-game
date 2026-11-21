// ---------- Música das fases ----------
// Cada jornada pode ter a sua música (data/jornadas/*.js → fases[].musica = caminho do mp3): toca em loop do começo da jornada até sair dela
// (nos menus toca o rádio, ../musics/radio.js). Nas configurações (do menu e da pausa): Música liga/desliga e o volume, salvos no
// aparelho (ef-musica, ef-musica-vol).
import { $ } from './utils.js';

const au = new Audio(); au.loop = true; au.preload = 'auto';
let ligada = true, volume = .6;
try { ligada = localStorage.getItem('ef-musica') !== '0'; const v = localStorage.getItem('ef-musica-vol'); if (v != null) volume = Math.max(0, Math.min(1, +v)); } catch (e) {}
au.volume = volume;

/** começa a música da fase (do início); sem música, para a que estiver tocando */
export function tocarMusicaDaFase(src) {
  if (!src) return pararMusica();
  const url = new URL(src, location.href).href;
  if (au.src !== url) au.src = url;
  au.currentTime = 0;
  if (ligada) au.play().catch(() => {});
}
export const pararMusica = () => au.pause();

export function setMusica(on) {
  ligada = on; sincronizar();
  try { localStorage.setItem('ef-musica', on ? '1' : '0'); } catch (e) {}
  if (!on) au.pause(); else if (au.src && document.getElementById('battle').classList.contains('on')) au.play().catch(() => {});
}
export function setVolumeMusica(v) {
  volume = Math.max(0, Math.min(1, v)); au.volume = volume; sincronizar();
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
