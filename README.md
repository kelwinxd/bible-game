# Espada Forjada — protótipo

Protótipo HTML das mecânicas do jogo bíblico **Espada Forjada**: forjar versículos e usá-los para refutar as mentiras dos demônios numa jornada de plataforma.

## Como rodar

```bash
python -m http.server 5500
```

Abra http://localhost:5500 (Ctrl+F5 depois de mudanças).

- `index.html` — jogo (canvas + HUD)
- `data.js` — versículos, mentiras, inimigos, quizzes e a fase
- `sprites/` — herói (templário), serpente, mãos em chamas
- `MECANICAS.md` — registro das mecânicas validadas no protótipo
