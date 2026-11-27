// Nenhum arquivo esquecido: todo sprite, imagem e som em jogar/assets (e as músicas do rádio em musics/) tem que ser citado em
// algum lugar do jogo (código, dados, páginas, CSS). Uma música trocada ou uma arte antiga que fica para trás falha aqui — antes
// de ir parar no build e na AWS (o build copia jogar/assets inteira). Se o arquivo não é mais usado, apague-o.
// Nomes montados no código (ex.: `${k}-attack.${e}`) contam pelo pedaço fixo: ver MONTADOS.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, relative, sep } from 'node:path';
import { expect, test } from 'vitest';

const RAIZ = join(import.meta.dirname, '..');
const lista = (d, f = []) => { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? lista(p, f) : f.push(p); } return f; };

// todo o texto do jogo onde um arquivo pode ser citado
const FONTES = [join(RAIZ, 'jogar', 'js'), join(RAIZ, 'jogar', 'data'), join(RAIZ, 'jogar', 'style'), join(RAIZ, 'site'), join(RAIZ, 'musics')];
const texto = [...FONTES.flatMap(d => lista(d)), join(RAIZ, 'jogar', 'index.html'), join(RAIZ, 'jogar', 'script.js'), join(RAIZ, 'index.html')]
  .filter(p => /\.(js|css|html)$/.test(p)).map(p => readFileSync(p, 'utf8')).join('\n');

// arquivos cujo nome o código MONTA (não aparece inteiro): pasta → regra que diz se o nome é coberto
const MONTADOS = [
  // config.js: ESPR[k].attack/run = `assets/sprites/enemy/${k}-attack.${e}` e `${k}-${runName || 'run'}.${e}` — k = chave de ESPR
  [/^sprites\/enemy\/(\w+)-(attack|run|fly)\.webp$/, m => new RegExp(`\\b${m[1]}\\s*:\\s*\\{\\s*attack:`).test(texto)],
  // config.js: HERO[k].src = `assets/sprites/hero/${k}.webp` para k em ['run', 'jump', 'death']
  [/^sprites\/hero\/(run|jump|death)\.webp$/, m => texto.includes(`'${m[1]}'`) && texto.includes('assets/sprites/hero/${k}.webp')],
  // config.js: HERO_ATK[i].img.src = `assets/sprites/hero/attack${i + 1}.webp` (os 2 golpes do combo)
  [/^sprites\/hero\/attack(\d)\.webp$/, () => texto.includes('assets/sprites/hero/attack${i + 1}.webp')]
];

const usado = rel => {
  const nome = basename(rel), sem = nome.slice(0, -extname(nome).length);
  if (texto.includes(nome) || texto.includes(encodeURI(nome)) || texto.includes(`/${sem}.`) || texto.includes(`'${sem}'`) || texto.includes(`"${sem}"`)) return true;
  for (const [re, ok] of MONTADOS) { const m = rel.match(re); if (m) return ok(m); }
  return false;
};

const ASSETS = join(RAIZ, 'jogar', 'assets');
const arquivos = [
  ...lista(ASSETS).map(p => relative(ASSETS, p).split(sep).join('/')),
  ...lista(join(RAIZ, 'musics')).filter(p => p.endsWith('.mp3')).map(p => '../../musics/' + basename(p))
];

test('achou arquivos para conferir', () => expect(arquivos.length).toBeGreaterThan(50));
test.each(arquivos)('%s é usado pelo jogo', rel => expect(usado(rel), `jogar/assets/${rel}: nenhum código, dado ou página cita este arquivo — se não é mais usado, apague-o`).toBe(true));
