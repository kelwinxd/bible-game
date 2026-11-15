# Espada Forjada — protótipo

Protótipo HTML das mecânicas do jogo bíblico **Espada Forjada**: forjar versículos e usá-los para refutar as mentiras dos demônios numa jornada de plataforma.

## Como rodar

```bash
python serve.py
```

Abra http://localhost:5500 (a landing page) ou http://localhost:5500/jogar/ (o jogo). O serve.py desliga o cache: um F5 já pega as mudanças.

## Estrutura (mono repo: site + jogo)

- `index.html` + `site/`: a **landing page** (escura, Cinzel + Cormorant Garamond; menus Início, Sobre e Jogar). Usa as artes do jogo direto de `jogar/assets/`
- `musics/`: a **playlist** (mp3) e o **rádio** (`radio.js`), usados pelo site e pelo jogo: tocar/pausar, próxima e mutar, em loop; nada toca sozinho
- `jogar/`: o **jogo** inteiro (tudo abaixo fica dentro dele; os caminhos são relativos, então funciona em qualquer pasta). O `localStorage` é por domínio, então os saves continuam valendo
- Deploy: a pasta raiz inteira como site estático → `/` é a landing, `/jogar/` é o jogo

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

O jogo usa módulos ES, então precisa ser aberto por um servidor (não funciona abrindo o arquivo direto).
