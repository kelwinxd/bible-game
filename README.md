# Espada Forjada — protótipo

Protótipo HTML das mecânicas do jogo bíblico **Espada Forjada**: forjar versículos e usá-los para refutar as mentiras dos demônios numa jornada de plataforma.

## Como rodar

```bash
python -m http.server 5500
```

Abra http://localhost:5500 (Ctrl+F5 depois de mudanças).

- `index.html`: só a marcação das telas (menu, forja, batalha, pausa)
- `style/global.css`: importa os estilos de cada parte (`base`, `menu`, `map`, `forge`, `quiz`, `battle`, `hud`, `peek`, `overlay`)
- `script.js`: ponto de entrada. Importa os módulos ES, expõe ao HTML as funções dos `onclick` e roda o loop do jogo
- `js/`:
  - `core/`: utilitários, opções, progresso salvo, som
  - `ui/`: troca de telas, menu, mapa das jornadas, faíscas, navegação por setas
  - `forge/`: lista, versículo, forja, afiação, quizzes
  - `battle/`: configuração e sprites, estado, mundo, HUD, combate, atualização
  - `battle/draw/`: desenho da cena, do cenário, do HUD e dos inimigos
  - `input/`: teclado, mouse e escudo
- `data.js`: versículos, mentiras, inimigos, quizzes e as jornadas (`fases`, com posição no mapa)
- `assets/sprites/`: `hero/` (templário; `antigo/` = herói anterior), `enemy/` (serpente), `hazard/` (mãos em chamas)
- `MECANICAS.md`: registro das mecânicas validadas no protótipo

O jogo usa módulos ES, então precisa ser aberto por um servidor (não funciona abrindo o arquivo direto).
