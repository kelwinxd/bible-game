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

Gera a pasta `dist/` (é ela que vai para o servidor): os módulos do jogo e o CSS juntos e minificados, com hash no nome (cada versão nova tem nome novo, então ninguém fica com a velha em cache); os sprites, áudios e a playlist copiados como estão; `data.js` e `radio.js` minificados. Os caminhos são relativos: funciona na raiz do domínio ou numa subpasta (GitHub Pages). Para testar a versão de produção antes de publicar: `npm run preview` → http://localhost:4173. Configuração em `vite.config.js`.

O jogo continua em JS puro (módulos ES), sem framework: o Vite só serve no desenvolvimento e empacota no build.

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
- `data.js`: versículos, mentiras, inimigos, quizzes e as jornadas (`fases`, com posição no mapa)
- `assets/sprites/`: `hero/` (templário; `antigo/` = herói anterior), `enemy/` (serpente), `hazard/` (mãos em chamas)
- `MECANICAS.md`: registro das mecânicas validadas no protótipo

O jogo usa módulos ES, então precisa ser aberto por um servidor (`npm run dev`; não funciona abrindo o arquivo direto).
