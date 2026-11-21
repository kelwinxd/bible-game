// Vite: servidor de desenvolvimento (npm run dev) e build de produção (npm run build → dist/).
// O jogo continua em JS puro, sem framework. O build:
//  - gera as 2 páginas (a landing na raiz e o jogo em jogar/), juntando e minificando os módulos e o CSS, com nomes de arquivo
//    com hash (cada versão nova tem nome novo: o navegador nunca fica com a velha em cache);
//  - copia o que o código carrega por caminho em tempo de execução (sprites, áudios e imagens em jogar/assets, a playlist em
//    musics/) e o script clássico musics/radio.js, minificado (o conteúdo do jogo, jogar/data/, é módulo e entra no pacote).
// base './' = caminhos relativos: o dist/ funciona em qualquer pasta (raiz do domínio ou GitHub Pages em /bible-game/).
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { defineConfig, transformWithEsbuild } from 'vite';

const raiz = import.meta.dirname;
const COPIAR = ['jogar/assets', 'musics']; // pastas que vão inteiras
const CLASSICOS = ['musics/radio.js']; // <script src> sem type="module": o Vite não empacota, só minificamos

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
  plugins: [copiarEstaticos()],
  // testes (npm test): Vitest, em testes/ — validação do conteúdo (jogar/data/) e dos arquivos, e a lógica do progresso
  test: { include: ['testes/**/*.test.js'], environment: 'node', setupFiles: ['testes/ambiente.js'] }
});
