# Espada Forjada — protótipo

Protótipo HTML das mecânicas do jogo bíblico **Espada Forjada**: forjar versículos e usá-los para refutar as mentiras dos demônios numa jornada de plataforma.

## Como rodar

Precisa do Node (18+). Na primeira vez: `npm install`.

```bash
npm run dev
```

Abra http://localhost:5500 (a landing page) ou http://localhost:5500/jogar/ (o jogo). O Vite recarrega a página sozinho a cada arquivo salvo, sem problema de cache.

### Publicar (produção)

```bash
npm run build
```

Gera a pasta `dist/` (é ela que vai para o servidor): os módulos do jogo e o CSS juntos e minificados, com hash no nome (cada versão nova tem nome novo, então ninguém fica com a velha em cache); os sprites, áudios e a playlist copiados como estão; `radio.js` minificado (o conteúdo, `jogar/data/`, entra no pacote do jogo). Os caminhos são relativos: funciona na raiz do domínio ou numa subpasta (GitHub Pages). Para testar a versão de produção antes de publicar: `npm run preview` → http://localhost:4173. Configuração em `vite.config.js`.

O jogo continua em JS puro (módulos ES), sem framework: o Vite só serve no desenvolvimento e empacota no build.

### Testes

```bash
npm test
```

Vitest, em `testes/` (o `npm run build` roda os testes antes e não publica se algum falhar; `npm run test:watch` roda de novo a cada arquivo salvo):

- `dados.test.js`: o conteúdo (`jogar/data/`) — todo versículo com a forja e a afiação ligadas pelo id; ids repetidos; tema e autor que existem; cada lacuna da forja está no texto do versículo e não aparece entre os próprios distratores; resposta certa da afiação fora das erradas; versículos citados pelas mentiras e pelas pedras das fases existem; tipos de evento conhecidos, largura, x dentro da fase, um chefão por fase; liberação (`abre`) aponta para jornadas que existem; todo arquivo `assets/…` citado existe
- `arquivos.test.js`: todo sprite, som e imagem citado no JS (inclusive `SP + 'nome.webp'`) e no CSS (`url(…)`) existe no disco
- `progresso.test.js`: a lógica de `js/core/progress.js` — XP e níveis, vida máxima, liberação das jornadas, migração do save antigo, forja (dano) e afiação (duração), ovelha salva
- `sem-uso.test.js`: **nenhum arquivo esquecido** — todo sprite, imagem e som em `jogar/assets` (e as músicas do rádio em `musics/`) é citado por algum código, dado ou página; uma música trocada ou uma arte antiga que ficou para trás falha aqui (o build copia `jogar/assets` inteira para o `dist/`). Nomes montados no código (ex.: `${k}-attack.webp`) ficam em `MONTADOS`
- `batalha/batalha.test.js`: a **batalha rodando de verdade, sem tela** (`batalha/navegador.js` troca canvas, imagens e áudio por objetos que não fazem nada), quadro a quadro — todas as jornadas começam e rodam sem erro; a arena abre ao vencer o grupo (+20 de vida), inclusive com **dois monstros mortos no mesmo golpe** (o bug que prendia o herói antes do Golias); Golias perde o capacete e volta com a 2ª vida; o golpe no chão joga o herói longe mesmo de escudo; a caverna do Vale (cai, só sai limpa, volta ao vale); Nabucodonosor cai e vira a estátua

**No GitHub** (`.github/workflows/testes.yml`): a cada push na `main` (e em pull request) o GitHub Actions roda `npm test` e o build; o commit fica com ✅ ou ❌ (aba *Actions* do repositório; falhou, chega e-mail). Roda em Linux, que diferencia maiúsculas e minúsculas nos nomes de arquivo (como o S3): um caminho com a caixa errada passa no Windows e falha lá.

**Tamanho dos arquivos**: músicas em mp3 **112 kbps** (estéreo, 44,1 kHz; os originais em alta ficam fora do repositório) e sprites/imagens em **WebP** (qualidade 90, transparência intacta). Ao trazer uma música nova: `ffmpeg -i original.mp3 -c:a libmp3lame -b:a 112k -map_metadata -1 nova.mp3`.

Cada falha diz o que está errado e onde (ex.: `Exodus, evento 2 (pedra x 1500): versículo "ex20-99" não existe`). Ao criar um tipo de evento novo no `world.js`, acrescente-o em `TIPOS` no `dados.test.js`.

### Logs de uso (PostHog, só em produção)

`jogar/js/core/log.js`: `log('evento', {dados})` em pontos-chave do jogo. No `npm run dev` só aparece no console (`[log] …`); no build, envia ao PostHog (carregado sob demanda, num arquivo à parte). Para ligar: crie um projeto em posthog.com, copie `.env.example` para `.env.production` e coloque a chave (`VITE_POSTHOG_KEY`, pública) e a região. Sem a chave, nada é enviado. Anônimo (id aleatório por aparelho), sem gravação de tela nem captura automática de cliques; o jogador pode desligar em Configurações → "Dados de uso anônimos".

| Evento | Quando | Dados |
|---|---|---|
| `jornada_iniciada` | começa uma jornada | fase |
| `jornada_vencida` | vence | fase, segundos, vida, vidaMax, primeira (1ª vitória nela) |
| `jornada_abandonada` | sai no meio (menu, mapa, recomeçar ou fechou a página) | fase, progresso (% da fase), segundos, zona, fechou |
| `morreu` | o herói cai | fase, progresso, segundos, zona, arena, chefe |
| `versiculo_achado` | pega o livro na fase | verso, fase |
| `versiculo_forjado` / `versiculo_afiado` | passa de nível na forja / afiação | verso, nivel |
| `forja_errou` / `afiacao_errou` | erra o nível | verso, nivel, erros |
| `ovelha_achada` | toca na ovelha (1ª vez) | fase |
| `nivel_subiu` | sobe de nível | nivel, fase |
| `erro_js` | erro de JavaScript | msg, onde |

O Bestiário e o Treinamento não geram eventos. O PostHog ainda registra sozinho a visita à página e a saída, com aparelho, navegador e país.

## Estrutura (mono repo: site + jogo)

- `index.html` + `site/`: a **landing page** (escura, Cinzel + Cormorant Garamond; menus Início, Sobre e Jogar). Usa as artes do jogo direto de `jogar/assets/`
- `musics/`: a **playlist** (mp3) e o **rádio** (`radio.js`), usados pelo site e pelo jogo: tocar/pausar, próxima e mutar, em loop; nada toca sozinho
- `jogar/`: o **jogo** inteiro (tudo abaixo fica dentro dele; os caminhos são relativos, então funciona em qualquer pasta). O `localStorage` é por domínio, então os saves continuam valendo
- Deploy: a pasta `dist/` (do `npm run build`) como site estático → `/` é a landing, `/jogar/` é o jogo

## O jogo (`jogar/`)


- `jogar/index.html`: só a marcação das telas (menu, forja, batalha, pausa)
- `style/global.css`: importa os estilos de cada parte (`base`, `menu`, `map`, `forge`, `quiz`, `battle`, `hud`, `peek`, `overlay`)
- `script.js`: ponto de entrada. Importa os módulos ES, expõe ao HTML as funções dos `onclick` e roda o loop do jogo
- `js/`:
  - `core/`: utilitários, opções, progresso salvo, som
  - `ui/`: troca de telas, menu, mapa das jornadas, faíscas, navegação por setas
  - `forge/`: lista, versículo, forja, afiação, quizzes
  - `battle/`: configuração e sprites, estado, mundo, HUD, combate, atualização
  - `battle/inimigos/`: chefões, monstros e bichos em **classes** (`base/` = os contratos `Chefe`, `ChefeDeArena`, `Monstro` e `Bicho`; `chefes/`, `monstros/` e `bichos/` = cada inimigo herdando; `efeitos.js` = o que é comum). `boss.js` e `frog.js` são as fachadas
  - `battle/draw/`: desenho da cena, do cenário, do HUD e dos inimigos
  - `input/`: teclado, mouse e escudo
- `data/`: o **conteúdo** do jogo, dividido por domínio (módulos ES; `data/index.js` junta tudo em `DATA`, importado por `js/core/utils.js`):
  - `palavra/versiculos.js` (o versículo em si: id, ref, tema, autor, texto) e `palavra/temas.js` (cores, abreviações)
  - `habilidades/forja.js` (Forjar: as palavras que faltam de cada versículo, níveis e graus), `habilidades/afiacao.js` (Afiar: as perguntas de cada versículo, as dos autores e os níveis), `habilidades/fe.js` e `habilidades/espirito.js`
  - `batalha/mentiras.js` (as mentiras e os versículos que as refutam) e `batalha/inimigos.js` (a ficha dos monstros)
  - `progresso/xp.js` (XP e níveis) e `jornadas/` (a ordem das jornadas e a explicação dos eventos em `index.js`, um arquivo por jornada)
  - um versículo novo: o texto em `palavra/versiculos.js`, as lacunas em `habilidades/forja.js`, as perguntas em `habilidades/afiacao.js` (o mesmo id nos três) e uma `pedra` com o id numa jornada; o `npm test` avisa se faltar algo
- `assets/sprites/`: `hero/` (templário; `antigo/` = herói anterior), `enemy/` (serpente), `hazard/` (mãos em chamas)
- `MECANICAS.md`: registro das mecânicas validadas no protótipo

O jogo usa módulos ES, então precisa ser aberto por um servidor (`npm run dev`; não funciona abrindo o arquivo direto).
