// Todo sprite, som ou imagem citado no código (JS e CSS) existe no disco? Um caminho errado não dá erro no console do jogo —
// a imagem só não aparece ou o som não toca. Aqui ele falha com o arquivo e a linha.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { expect, test } from 'vitest';

const RAIZ = resolve(import.meta.dirname, '..'), JOGO = join(RAIZ, 'jogar');
const EXT = '(?:webp|png|jpg|jpeg|gif|svg|mp3|ogg|wav)';
const arquivos = (dir, ext) => readdirSync(dir).flatMap(n => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? (n === 'node_modules' ? [] : arquivos(p, ext)) : ext.test(n) ? [p] : [];
});

const casos = [];
// JS: 'assets/…' (relativo à página jogar/) e PREFIXO + 'nome.ext' quando o arquivo define const PREFIXO = 'assets/…/'
for (const f of arquivos(join(JOGO, 'js'), /\.js$/).concat(join(JOGO, 'script.js'))) {
  const src = readFileSync(f, 'utf8'), linha = i => src.slice(0, i).split('\n').length;
  const prefixos = Object.fromEntries([...src.matchAll(/const\s+(\w+)\s*=\s*'(assets\/[^']*\/)'/g)].map(m => [m[1], m[2]]));
  for (const m of src.matchAll(new RegExp(`['"\`](assets/[^'"\`$]+?\\.${EXT})['"\`]`, 'g')))
    casos.push([`${relative(RAIZ, f)}:${linha(m.index)}`, m[1], JOGO]);
  for (const [nome, pre] of Object.entries(prefixos))
    for (const m of src.matchAll(new RegExp(`\\b${nome}\\s*\\+\\s*'([^']+?\\.${EXT})'`, 'g')))
      casos.push([`${relative(RAIZ, f)}:${linha(m.index)}`, pre + m[1], JOGO]);
}
// CSS: url('…') relativo ao próprio arquivo CSS
for (const f of arquivos(join(JOGO, 'style'), /\.css$/).concat(join(RAIZ, 'site/style.css'))) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(new RegExp(`url\\(['"]?([^'")]+?\\.${EXT})['"]?\\)`, 'g')))
    if (!/^(https?:|data:)/.test(m[1])) casos.push([`${relative(RAIZ, f)}:${src.slice(0, m.index).split('\n').length}`, m[1], dirname(f)]);
}

test('achou caminhos para conferir', () => expect(casos.length).toBeGreaterThan(30));
test.each(casos)('%s → %s', (onde, p, base) => expect(existsSync(resolve(base, p)), `${onde}: arquivo não encontrado (${p})`).toBe(true));
