// ---------- Carregamento: só mostra a fase com tudo baixado ----------
// Importado PRIMEIRO no script.js: registra toda imagem criada pelo jogo (os sprites nascem com `new Image()` espalhados pelos
// módulos e começam a baixar sozinhos). Antes de uma jornada, `carregarFase` cria também as artes DAQUELA fase (fundo, chão,
// estruturas, plataformas, a caverna… — o desenho só as criaria no 1º quadro, e elas apareciam aos poucos) e espera tudo
// terminar, com a barra da tela de carregamento (#carregando). Arquivo com erro conta como pronto (a fase não trava) e há um
// limite de LIMITE s: passou disso, a fase começa com o que já chegou.
const LIMITE = 25;

const IMAGENS = new Set();
const ImagemOriginal = globalThis.Image;
if (ImagemOriginal) { // envolve o Image do navegador (estender a classe dá "Illegal constructor" em alguns): devolve a imagem de verdade
  const Registrada = function (...a) { const img = new ImagemOriginal(...a); IMAGENS.add(img); return img; };
  Registrada.prototype = ImagemOriginal.prototype; // `img instanceof Image` continua valendo
  globalThis.Image = Registrada;
}

/** todo caminho de imagem 'assets/….webp|png|jpg' dentro do objeto da fase (eventos, fundo, chão, caverna…) */
function artesDaFase(fase) {
  const achou = new Set();
  (function varre(o) {
    if (typeof o === 'string') { if (/^assets\/.+\.(webp|png|jpe?g|gif)$/i.test(o)) achou.add(o); }
    else if (o && typeof o === 'object') Object.values(o).forEach(varre);
  })(fase);
  return [...achou];
}

const pronta = img => !img.src || img.complete; // sem src ainda (vai ganhar depois) não segura a fila
let guardadas = []; // as artes da fase ficam vivas aqui: o navegador as mantém em memória e o desenho as acha prontas

/**
 * Baixa tudo o que a fase precisa. aoAvancar(0–1) atualiza a barra. Devolve uma Promise que resolve quando acabou (ou no limite).
 */
export function carregarFase(fase, aoAvancar = () => {}) {
  guardadas = artesDaFase(fase).map(src => Object.assign(new Image(), { src }));
  const lista = [...IMAGENS].filter(i => i.src);
  return new Promise(resolve => {
    const inicio = performance.now();
    (function confere() {
      const prontas = lista.filter(pronta).length;
      aoAvancar(lista.length ? prontas / lista.length : 1);
      if (prontas >= lista.length || performance.now() - inicio > LIMITE * 1000) return resolve();
      setTimeout(confere, 80);
    })();
  });
}
