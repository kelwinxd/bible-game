// Vite: servidor de desenvolvimento (npm run dev) e build de produção (npm run build → dist/).
// O jogo continua em JS puro, sem framework. O build:
//  - gera as 2 páginas (a landing na raiz e o jogo em jogar/), juntando e minificando os módulos e o CSS, com nomes de arquivo
//    com hash (cada versão nova tem nome novo: o navegador nunca fica com a velha em cache);
//  - copia o que o código carrega por caminho em tempo de execução (sprites, áudios e imagens em jogar/assets, a playlist em
//    musics/) e os 2 scripts clássicos (jogar/data.js e musics/radio.js), estes minificados.
// base './' = caminhos relativos: o dist/ funciona em qualquer pasta (raiz do domínio ou GitHub Pages em /bible-game/).
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { defineConfig, transformWithEsbuild } from 'vite';

const raiz = import.meta.dirname;
const COPIAR = ['jogar/assets', 'musics']; // pastas que vão inteiras
const CLASSICOS = ['jogar/data.js', 'musics/radio.js']; // <script src> sem type="module": o Vite não empacota, só minificamos

function copiarEstaticos() {
  let saida;
  return {
    name: 'copiar-estaticos',
    apply: 'build',
    configResolved(c) { saida = resolve(raiz, c.build.outDir); },
    async closeBundle() {
      for (const p of COPIAR) cpSync(resolve(raiz, p), resolve(saida, p), { recursive: true });
      for (const p of CLASSICOS) {
        const { code } = await transformWithEsbuild(readFileSync(resolve(raiz, p), 'utf8'), p, { minify: true, format: undefined });
        mkdirSync(dirname(resolve(saida, p)), { recursive: true });
        writeFileSync(resolve(saida, p), code);
      }
    }
  };
}

export default defineConfig({
  base: './',
  server: { port: 5500, open: false },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: { input: { site: resolve(raiz, 'index.html'), jogar: resolve(raiz, 'jogar/index.html') } }
  },
  plugins: [copiarEstaticos()]
});
