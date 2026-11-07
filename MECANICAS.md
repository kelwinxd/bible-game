# Espada Forjada — Mecânicas validadas no protótipo

Registro do que já foi implementado e testado no protótipo HTML (`index.html` + `script.js`/`js/` + `data.js`).
Serve de base para o jogo oficial. **Atualizar sempre que uma mecânica mudar** — só o que importa
para o design, não detalhe de código. O GDD original é `espada-forjada-gdd.md` (v0.3, fora do repo, em Downloads); onde este arquivo
diverge do GDD, **vale este arquivo** (são decisões tomadas testando).

Como rodar: `python -m http.server 5500` na pasta e abrir http://localhost:5500 (Ctrl+F5 após mudanças).

---

## 1. Fluxo de telas

Menu → **Jornada** (fase com rolagem) → Vitória / Derrota. A batalha ocupa a **janela inteira**: a arena é o maior 16:9 que cabe acima do HUD, centralizada, e o HUD acompanha a largura dela. A Forja (lista de versículos + Exercitar a fé) é opcional, para melhorar versículos.

- **Menu inicial "Sword of God"**: título e botões **alinhados à esquerda** sobre a arte do templário contra a serpente (`assets/img/menu.webp`), escurecida e com degradê escuro à esquerda para os botões e o nome ficarem legíveis; no celular a arte fica atrás, mais escura. Três botões:
  - **Jogar** → **mapa das jornadas** (tela cheia, pergaminho escuro com grade de meridianos). Cada jornada é um **ponto do mapa**: medalhão redondo com **desenho próprio** (Exodus = pirâmides ao pôr do sol; O vale da sombra = vale escuro entre montanhas, lua e trilha descendo) e legenda "Jornada N · nome"; a região em volta brilha na cor da jornada. Os pontos são ligados por uma **trilha tracejada** na ordem das fases: o trecho já vencido fica **dourado**, e depois da última jornada a trilha **some na névoa** (há mais por vir). A jornada atual pulsa e tem o **escudo do templário** flutuando em cima; vencida ganha selo ✓; trancada fica apagada com 🔒 e desabilitada. Posição, desenho e cor em `data.js` → `fases[].mapa` (`x`/`y` em %, `icone`, `cor`); desenhos em `js/ui/map.js` → `ICONES` (sem ícone: ruínas). **Celular em pé**: o mapa gira (x e y trocam) e a trilha desce. Setas + Enter escolhem o ponto, Esc / ← Voltar volta ao menu. **Vencer uma jornada libera a próxima** (salvo no navegador). **No protótipo todas estão abertas** (`data.js` → `jornadasLiberadas: true`); `false` volta a travar. A vitória mostra **Jornada N →** (na última, Menu); "Jogar de novo" repete a mesma; "Ir para a jornada" da forja abre a última liberada.
  - **Habilidades** → a Forja ("Forjar versículos"): lista de versículos e Exercitar a fé **à esquerda** (60%), com ícones dourados de traço nos títulos (Bíblia em "Forjar versículos", escudo em "Exercitar a fé") e no cadeado dos versículos escondidos; **à direita** (40%), o templário parado (sprite idle, 4 quadros) em pé numa laje de areia (a arte do chão do Exodus, na mesma cor `CHAO_COR`), com **sombra projetada** sob os pés num círculo de luz dourada e, em cima dele, as **métricas de habilidade**: Fé (segundos de escudo, barras até o teto), Espírito (dano do impulso [L], barras), Espada (dano do golpe sem versículo), Palavra (versículos achados / total, maior dano e maior duração de poder entre eles) e Jornadas vencidas. No celular o painel do herói vai para baixo da lista, menor, com as métricas ao lado.
  - **Configurações** → **Som** (interruptor, sincronizado com o da pausa e salvo). Abaixo, recolhidas em "Opções de teste do protótipo": faixa da forja (Normal / Calma / Parada), **Jogador imortal** (ligado por padrão) e **Tudo liberado** (todos os versículos, 3 fogos e todas as jornadas).
  - Esc ou "← Voltar" retorna à lista principal. A ajuda de teclas saiu do menu (fica em Pausa → Controles).
- As antigas "3 ondas" na tela fixa foram substituídas pela jornada (seção 4b).
- Na forja, botões **☰ Menu** e **← Lista** sempre visíveis, inclusive no meio do martelar.

## 2. Forja (conquistar versículos)

- O versículo é **digitado** (32 caracteres/s) num pergaminho.
- A digitação **pausa depois da lacuna**, mostrando até **3 palavras seguintes** (ou até a pontuação) para dar contexto. Ex.: `Sujeitai-vos, pois, a Deus; ___ ao diabo,`. Pontuação colada na lacuna não conta como palavra.
- Só nessa pausa a faixa de palavras começa a rolar. Acertou → o texto continua até a próxima lacuna, depois até o fim.
- Martelar: Espaço / clique / toque quando a palavra certa está na zona de brasa.
- **Martelo e bigorna** desenhados embaixo da faixa (no centro, alinhados à zona/mira), na Forja e na Afiação: a cada toque o martelo **desce inclinando** até bater na bigorna e volta (~0,26 s), acertando ou errando.
- **Distratores são palavras diferentes, nunca conjugações/variações da certa** (decisão de teste: conjugações viravam prova de gramática, não de conhecimento do texto). Ex.: `sombra` → casa, vida, festa.
- 4 palavras por ciclo (1 certa + 3 distratores), ordem sorteada a cada ciclo.

| Parâmetro | Normal | Calma |
|---|---|---|
| Velocidade da faixa | 150 px/s | 85 px/s |
| Janela de acerto | ±60 px | ±90 px |

- Modo **Sem pressa**: faixa parada, toca na palavra.
- **Lista com busca e rolagem**: acima da lista, campo **Buscar versículo ou palavra** (procura na referência e no texto, sem diferenciar acento nem maiúscula: "exodo" acha Êxodo 20:3, "espada" acha Hebreus 4:12) e filtro **por tema** (só os temas dos versículos já encontrados). A lista mostra **até 5 versículos**; a partir do 6º, a altura trava e o resto **rola**. Sem resultado: "Nenhum versículo com essa busca." No campo de busca, ← → andam no texto e ↑ ↓ saem dele (navegação por setas).
- **A forja só lista versículos já encontrados** na jornada (tocar o livro dourado salva no navegador). Sem nenhum: "Nenhum versículo ainda. Derrube os ídolos de ouro…"; os que faltam aparecem só como contagem ("🔒 N versículos ainda escondidos pelo caminho"). "Forjar tudo (teste)" vale só para os encontrados. A jornada de teste (todos os versículos) não marca nada como encontrado.
- **Não há mais pré-requisito**: os versículos são **encontrados na jornada**. A forja só melhora (dano/duração); versículo nunca forjado vale dano ×1,0 e poder 4 s.

## 2b. Duas trilhas por versículo: Forja e Afiação (3 níveis cada)

Clicar num versículo da lista abre o **hub do versículo** com as duas trilhas. **Só passa para o próximo nível quem acerta tudo (0 erros)**; errou → refaz o nível, o progresso não cai. Nível concluído pode ser refeito.

| Nível | 🔨 Forja → aumenta o **DANO** | 🗡 Afiação → aumenta a **DURAÇÃO do poder** |
|---|---|---|
| 1 | 2 palavras faltando · dano ×1,0 | Autor do livro · poder 5 s |
| 2 | 4 palavras faltando · dano ×1,2 | Contexto histórico · poder 6 s |
| 3 | Versículo inteiro (toda palavra é lacuna) · dano ×1,4 | Contexto da passagem · poder 7 s |

- Sem afiação o poder dura **4 s** (+1 s por nível).
- Substitui o antigo grau por erros (Bruto/Forjado/Temperado); a runa do card agora segue o nível da Forja.
- Na **lista da forja**, cada versículo mostra **barras douradas** (Forja) e **barras prateadas** (Afiação), 3 cada, acesas conforme o nível.
- Forja nível 3: os distratores de cada palavra são **outras palavras do próprio versículo** (testa a ordem do texto).
- **Afiação** = mesma faixa da forja, mas sem palavras rolando: as **4 opções ficam fixas em botões** e uma **mancha escura** atravessa a faixa. O jogador só pode responder **quando a mancha está na mira** (centro). Clique fora da mira **conta erro**, resposta errada conta erro. 2 perguntas por nível. Teclas 1–4 também respondem.
  - Normal: mancha a **250 px/s**, janela ±40 px · Calma: **140 px/s**, ±60 px · Sem pressa: sem mancha, responde quando quiser. (Mais rápida que a faixa da forja: aqui a resposta já está à vista, o desafio é o tempo.)
  - **Acerto**: a mancha fica **prata** (~0,7 s; na última pergunta fica prata de vez), a faixa **pisca amarelo** e o pergaminho vai ficando **prateado** proporcionalmente aos acertos do nível (metade na 1ª, prata total ao concluir) — a lâmina sendo afiada.
- **Afiação nível 1 = só sobre o autor como pessoa** (nada de contexto da carta, ex.: quem aparece na saudação). Pergunta 1 é sempre "Quem escreveu…?"; a pergunta 2 é **sorteada** de um banco do autor (`data.js` → `autores`), ex. Paulo: nome antigo (Saulo), perseguia os cristãos, conversão em Damasco, Tarso, fariseu, Gamaliel, fazedor de tendas, apóstolo dos gentios. Autores são compartilhados entre versículos (os dois Salmos usam o banco de Davi; Êxodo usa o de Moisés: cesto no rio, filha de Faraó, tribo de Levi, Midiã, sarça ardente, Arão). Assim refazer o nível não é decoreba.
- Conteúdo dos quizzes em `data.js` → `versiculos[].afiacao` e `autores` (escrito de memória — **conferir** antes do jogo oficial).

## 3. Exercitar a fé (melhora o escudo)

- Seção na forja: leitura de **Hebreus 11:1** e **11:6**, depois **quiz de 5 perguntas** sorteadas de 15 sobre os heróis de Hebreus 11 (Abel, Enoque, Noé, Abraão, Sara, Isaque, Jacó, José, Moisés, Mar Vermelho, Jericó, Raabe + 2 de texto).
- Cada resposta mostra ✓/✗ e a referência (ex.: Hebreus 11:24).
- **Errou no máximo 1 de 5 → escudo +1 s.** Começa em 3 s, teto de **6 s** (teto escolhido para não ficar infinito repetindo quiz).
- Duração do escudo salva no navegador.

## 3b. Espírito Santo (melhora o Impulso do Espírito)

- Segunda sessão em "Exercitar a fé" na forja, mesma tela/regras do quiz da fé: leitura de **Atos 1:8** e **João 14:26**, depois **5 perguntas sorteadas de 17, só sobre o Espírito Santo** (Pentecostes, línguas de fogo, pomba no batismo, Consolador, fruto do Espírito, templo do Espírito, Romanos 8:26, Joel 2:28…).
- **Errou no máximo 1 de 5 → Impulso +2 de dano.** Dano 6 → 8 → 10 → **12 (teto, 3 aprovações)**. Nível salvo no navegador. Conteúdo em `data.js` → `espirito` (escrito de memória — conferir).

## 4. Batalha — controle do jogador

O herói **é controlado** (o GDD previa herói fixo; mudou no teste).

| Ação | Comando |
|---|---|
| Andar | A / D (setas) — 260 px/s |
| Pular | W / Espaço / ↑ — necessário para alcançar o demônio que voa e para desviar do golpe da Tentação |
| Atacar | **K** ou clique esquerdo — sai para onde o herói está **virado** (o mouse não mira nem vira o herói) |
| Escudo | Segurar **J** / S / ↓ / botão direito / botão 🛡 |
| Impulso do Espírito | **L** ou botão **Espírito** (ícone minimalista: pomba voando com um risco atrás) |
| Versículos | 1–9 ou clique no card |
| Ler versículo | 👁 no card (pausa o jogo, abre pergaminho central com ✕) |
| Pausar | P (ou botão ⏸); Esc fecha |

- Esquema só-teclado possível: **A/D + W andam/pulam, K ataca, J defende** (mão esquerda move, direita age, estilo jogo de luta).
- **Menus sem mouse**: em todas as telas fora da luta (menu, forja, hub do versículo, Afiação, fé, pausa, fim de batalha) as **setas** movem o foco para o botão mais próximo naquela direção e **Enter** confirma. A primeira seta foca o botão principal da tela. Em seletor (modo da forja), ← → trocam a opção. Durante a luta as setas continuam movendo o herói.
- **Sprite do herói = templário** (capa branca, cruz vermelha). Tiras `assets/sprites/hero/run.png` (8 quadros), `jump.png` (5) e `death.png` (5), recortadas das folhas enviadas; a 2ª folha (pulo/morte) era menor e foi igualada à corrida; todos alinhados pelo tronco e pelos pés; desenhado a **0,78×** no jogo (~150 px correndo — 190 ficava grande demais). Caixa de colisão do herói reduzida junto (160 px de altura).
  - **Correr**: 8 quadros em loop · **Parado (idle)**: `idle.png`, 4 quadros em pé (escudo e espada baixos) a 5 quadros/s; em pé ~205 px na folha (um pouco mais alto que a corrida agachada).
  - **Pular**: subindo = quadro 2 · topo = quadro 1 · descendo = quadro 5.
  - **Golpe (K)**: espada erguida (quadro 3 do pulo) → **estocada** (quadro 4) no instante do acerto. Também é a pose do **Impulso** e do rastro azul.
  - **Morte**: 5 quadros (cambaleia → ajoelha → deita) em ~0,8 s; a tela "Você caiu" espera 1,4 s para dar tempo de ver.
  - Ainda não há sprite próprio de **ataque no chão** (usa as poses do pulo).
  - O herói antigo (sprites `run`/`attack`) foi guardado em `assets/sprites/hero/antigo/`.

## 4b. Jornada (fase com rolagem lateral)

Na 1ª jornada o herói **começa com 0 versículos**; nas seguintes, **só com os versículos achados nas jornadas anteriores**. Os novos ele encontra pelo caminho. Cada jornada é uma lista de eventos em `data.js` → `fases` (fácil de montar novas). Uma jornada pode ter `dica`: aviso no topo ao começar (7 s). A faixa de entrada mostra "Jornada N · nome".

- **Câmera** segue o herói **suavemente** (fase de 11 100 px). Ao fim de uma luta ela desliza de volta ao herói — antes dava um salto e parecia que a fase "resetava". HUD mostra `Jornada N%`.
- **Fundo com imagem** (jornada 1, Exodus: ruínas, pirâmides e céu vermelho-escuro — `assets/img/fundo-exodus.webp`): ocupa a altura da tela e **rola a 35% da câmera** (parallax). Como a fase é bem mais longa que a imagem, ela **se repete**: o fim da imagem se **dissolve no começo dela mesma** (faixa de transição de 320 px), então o cenário volta ao início sem corte nem espelho. Véu escuro (35%; era 15%, mas fundo e chão disputavam atenção) para o chão, o herói e os inimigos destacarem. Qualquer jornada pode ter imagem própria (`data.js` → `fases[].fundo`); sem ela, usa o céu desenhado abaixo.
- **Chão com imagem** (jornada 1, Exodus — `assets/img/chao-exodus.webp`, `data.js` → `fases[].chao`): laje de terra com pedras, capim seco e ossadas. O miolo da imagem se repete pela fase (fim dissolvido no começo) e as **pontas arredondadas** fecham cada trecho na borda de buraco ou de desnível; terreno alto mostra a parede de rochas (faixa de rochas repetida, escurecendo com a profundidade). As **plataformas** viram lajes flutuantes pequenas. A areia da arte era clara demais: o chão é **multiplicado por uma cor da paleta do fundo** (`CHAO_COR` em `js/battle/draw/world.js`, terra avermelhada escura). Mesma estrutura da fase (posições e alturas não mudaram); sem `chao`, usa o chão desenhado de antes.
- **Sensação de avanço**: o céu muda ao longo da fase (noite roxa → aurora dourada perto do fim) e o fundo tem 3 camadas de parallax (serras distantes, montanhas de alturas variadas, ruínas de colunas espaçadas). Antes o cenário era idêntico em toda a fase.
- **Terreno variado** (não é sempre buraco):
  - **Buraco**: pular. Cair = volta ao **último ponto firme**, −10 de vida. Todo buraco tem **3 mãos em chamas** (`assets/sprites/hazard/mao-fogo.png`, 10 quadros recortados da folha enviada; a fileira "afundando" era menor e foi igualada pelo monte de brasas). O fogo é só o da própria arte (o fogo desenhado por código foi removido a pedido).
    - Pequenas (~0,55×, tamanhos levemente diferentes, espelhadas alternadas, **de propósito desalinhadas na altura**: uma mais alta, outra mais baixa, ~30 px de diferença; a base de todas fica abaixo da borda da tela, sem faixa preta embaixo), saindo do fundo da tela: **sobem e agarram** (quadros 1–5 em loop, cada uma no seu ritmo) quando o herói chega a ~280 px, **uma depois da outra**, e **afundam** (quadros 6–10) quando ele se afasta. Desenhadas na frente do herói: quem cai some entre elas.
    - Em buraco com laje no meio, as mãos ficam só nos vãos livres.
  - **Terreno mais alto**: parede na frente; precisa pular (até ~130 px).
  - **Vale (terreno mais baixo)**: desce andando; para sair, a parede exige pulo.
  - **Plataforma** (laje flutuante): passa por baixo, pula para subir e fica em cima. Serve de ponte em buraco largo e de degrau para penhasco alto (190 px, impossível sem o degrau).
- **Ídolo — bezerro de ouro** (`assets/sprites/object/bezerro.png`, no lugar da antiga pedra brilhante; no data.js segue `tipo: "pedra"`): fica **apoiado no que estiver embaixo** — chão, terreno alto, fundo do vale, topo do penhasco — e brilha dourado. **Bloqueia** quem está na mesma altura (alto demais para pular). **3 golpes** (espada, rasgo ou impulso) o derrubam; **cada golpe muda o quadro**: inteiro → rachado → quebrado (lascas douradas a cada golpe). No 3º golpe ele **desmorona**: sobra o pedestal com entulho e os pedaços (cabeça, pata, lascas — `bezerro-pecas.png`) **caem com gravidade, giram, quicam uma vez e assentam** sobre o entulho. De dentro **salta um livro dourado** que flutua.
- **Tocar o livro** (ou passar por ele) → o jogo **pausa** e abre um **pergaminho que se desenrola** com "✦ NOVO VERSÍCULO ✦", a referência e o **texto completo**, com **brilho dourado pulsando** em volta (fundo escurece com halo dourado). ✕, Enter, Esc ou clique fora fecha. Ao fechar, um **📖 voa da fase até o card novo**, que surge com **faíscas douradas** — o jogador lê o versículo antes de poder usá-lo.
- **Inimigos** surgem quando o herói chega a ~600 px do grupo (mais cedo, para o herói ficar à esquerda e sobrar espaço para os inimigos espaçados); a **câmera desliza e trava** (arena de x−740 a x+220 do grupo) até o grupo todo cair (+20 de vida ao vencer cada grupo).
- **Tutorial no começo** (só na 1ª jornada, fora do modo teste): caixa no alto da tela, uma dica por vez, com as **teclas desenhadas pulsando**. Fica **atrás do balão da mentira** do inimigo (o balão nunca é coberto). **Cada dica some assim que o jogador faz o que ela pede**, sem esperar o objetivo inteiro:
  1. "A D andar · W ou Espaço pular — Pule o buraco!" → some ao passar o buraco
  2. Perto do ídolo: "K atacar — Destrua o bezerro de ouro" → some no 1º golpe
  3. "Pegue o livro dourado!"
  4. Depois de ler o versículo novo: "Os versículos são suas armas. Utilize o certo para refutar e atacar. / Pressione 1 ou clique no card" → some ao refutar
  5. Depois de refutar, uma linha por ação: "Sua lâmina brilha: K ataque o demônio" (some ao atacar) e "Segure J para erguer o escudo" (some ao erguer o escudo); se o inimigo morrer antes, some tudo.
- Ordem da fase 1 (**"Exodus"**, antes "A Palavra no caminho") — **só 2 versículos e 4 monstros**, versículos bem separados (fase de 9 300 px, ~1 min jogando direto):
  1. buraco → bezerro de ouro no chão: **Êxodo 20:3** ("Não terás outros deuses diante de mim") — o 1º versículo do jogo fala justamente do ídolo que o herói acabou de derrubar
  2. **Idolatria** ("Curve-se ao bezerro de ouro. Esse deus você pode ver.") → terreno alto → **Idolatria** ("Tenha quantos deuses quiser…") — uma de cada vez, as duas refutadas por Êxodo 20:3
  3. caminho longo: buraco, vale, buraco largo com laje, degrau de plataforma → ídolo **no topo de um penhasco**: **Hebreus 4:12** (a Palavra viva e eficaz)
  4. **Mentira** ("A Bíblia é só um livro antigo…") → **Mentira** ("Palavras velhas e mortas…") — uma de cada vez, frases fixas que Hebreus 4:12 refuta → fim = vitória
  - Tiago 4:7 e 1Co 10:13 (Tentação) não aparecem em jornada nenhuma por enquanto (continuam na forja e no modo teste).
- Ordem da fase 2 ("O vale da sombra") — **3 versículos contra o medo e 6 aves da Dúvida** (fase de 10 800 px). Começa com o aviso "A Dúvida ataca do alto: a ave mergulha onde você está / Saia do lugar ou erga o escudo [J]; pule para golpeá-la":
  1. buraco → pedra no chão: **Isaías 41:10**
  2. **ave** ("Você é fraco e medroso. Desista.") → terreno alto → **ave** ("Ninguém vai te socorrer.")
  3. buraco → descida ao vale; a pedra fica **lá embaixo** ("vale da sombra da morte"): **Salmos 23:4**
  4. **ave** ("Deus te abandonou.") → **ave** ("Você está sozinho no escuro.")
  5. buraco largo com lajes, degrau, pedra **no topo do penhasco**: **Salmos 3:7**
  6. final: **2 aves juntas** ("Seus inimigos são fortes demais." / "Você vai perder essa batalha.") → fim = vitória
- Arenas de luta ficam sempre em trecho plano (regra anotada em `data.js`).
- Regra de design: **o versículo sempre aparece antes do inimigo que ele refuta** (aprende → usa). Um grupo pode ter mentira fixa (`frases`), usado para a primeira Mentira.
- Deck sem versículos mostra "Nenhum versículo — derrube os ídolos de ouro…". Teclas **1–9**.

## 4c. Impulso do Espírito (L)

- **Fogos do Espírito** (3, no botão Espírito): **+1 por inimigo derrotado**, **−1 por versículo errado** (acende com "pop", apaga piscando vermelho). Usar o impulso **não gasta** fogos.
  - **0 fogos**: bloqueado ("Impulso bloqueado: nenhum fogo aceso"). Começa assim.
  - **1–2 fogos**: impulso simples (vai). Ao acender o 1º fogo: aviso "Impulso do Espírito liberado! Aperte L".
  - **3 fogos = impulso DUPLO**: depois do 1º, apertar **L de novo em até 1 s** faz o herói **voltar** pelo mesmo caminho (mesmo rastro azul, fere de novo quem atravessar), **sem esperar a recarga**. L L rápido (o 2º durante o 1º) também vale: a volta sai assim que a ida termina. Depois da volta ele encara a frente de novo e a recarga de 3 s conta a partir da volta. Botão ganha borda/brilho mais forte com 3 fogos; aviso "Impulso duplo! Aperte L L".
- No modo teste "Tudo liberado" começa com os 3 fogos.
- O herói **dispara para frente** (para onde está virado) ~340 px em 0,2 s, no chão ou no ar (sem gravidade durante o avanço). Para em parede, pedra e borda da arena.
- Durante o impulso fica **todo azul** com brilho e deixa um **rastro**: cópias azuis que somem + feixe de luz até o herói.
- **Atravessa os inimigos**: fere cada um no caminho uma vez (dano 6 a 12, conforme a sessão Espírito Santo — seção 3b; número em azul) e fica **intocável** enquanto avança. Também acerta o ídolo (1 golpe).
- **Inimigo morto pelo impulso**: no lugar da referência/"Está escrito" em vermelho, a tela mostra **"O Espírito sopra / para onde quer" em azul, em 2 linhas** (fonte menor, não ocupa a tela toda) e fica **~2,9 s** (as referências normais ficam 1,8 s).
- Recarga **3 s** (era 1,2 s; ficava fácil demais spammar; barra azul no botão). Não funciona com o escudo erguido. Não usa o poder do versículo: o dano é sempre o do impulso.

## 5. Dano: espada sem e com o versículo

- **Golpe normal: 3 de dano**, corpo a corpo (alcance ~135 px à frente).
- **Versículo certo para a mentira** → espada com **poder por 4–7 s** (conforme a Afiação):
  - cada clique solta um **rasgo de luz** (meia-lua) que voa **reto na horizontal, para onde o herói está virado** (900 px/s) — ataque à distância;
  - sai na **altura atual do herói**: no chão, rente; pulando, na altura do pulo (é assim que se acerta o demônio que voa). **Sem diagonais** por enquanto;
  - no demônio refutado o dano é **8 × nível da Forja** (8 / 9,6 / 11,2); em outro demônio, 3;
  - atravessa inimigos, acerta cada um uma vez.
- Ideia central mantida: conhecer o versículo é o que dá dano de verdade.

## 5b. Cor do poder por tema

Cada **tema** de versículo tem uma cor (em `data.js` → `temas`), não cada versículo — escala quando houver muitos:

| Tema (refuta o demônio da…) | Cor |
|---|---|
| Tentação | amarelo / dourado |
| Dúvida | azul claro |
| Mentira (desacredita a Bíblia) | laranja |
| Idolatria (outros deuses) | violeta |

A cor aparece no **brilho do herói** durante o poder, no **rasgo de luz** e seu rastro, no **impacto**, no **número de dano**, na **referência sobre o herói**, na **barra de poder**, na barra de vida do demônio refutado e na **faixa lateral do card**. Novos temas = nova entrada em `temas`.

Obs.: a faixa colorida no card indica o tema, o que dá uma pista parcial (demônio da Tentação → algum card amarelo). Mantido por decisão de design; o jogador ainda precisa saber **qual** versículo do tema.

## 6. Escolher versículo (refutar)

- **Versículos sempre expostos no HUD**, em dois modos alternados pelo botão **⚔📖** (canto inferior direito):
  - **Fechado (padrão)**: cards **compactos** com tecla + **referência abreviada** (`Tg 4:7`, `1Co 10:13`, `Is 41:10`, `Sl 23:4`) + **👁 menor** (lê o versículo sem abrir o deck). Já dá para clicar e usar. A runa do grau da forja só aparece no deck aberto (sem espaço no compacto). Abreviações em `data.js` → `abrev`.
  - **Aberto**: cards largos com o **nome por extenso** (`Tiago 4:7`) e o botão **👁** para ler o versículo.
- Botão ⚔📖 mostra o estado embaixo do ícone: **◂ abrir** (deck fechado) / **▸ fechar** (deck aberto, em dourado).
- **Vagas fixas no HUD**: fechado, cada card ocupa **1/6 da barra** (6 por linha); aberto, 1/3 (3 por linha, 2 linhas). Com 1 ou 2 versículos os cards **não esticam** — o espaço livre fica reservado para os próximos que forem encontrados.
- **Teclas 1–9 funcionam sempre**, nos dois modos. Com os versículos travados, o botão ⚔📖 mostra borda laranja e barra de recarga.
- Cards nunca mostram o texto do versículo. Texto só no 👁 ou na pausa.
- **Ao escolher o versículo certo**, a referência aparece **na cor do tema, acima do herói** (fonte Cinzel), sobe um pouco e some em ~1,1 s — feedback do que foi escolhido mesmo com o deck fechado.
- **Nada indica o versículo certo antes do clique.** (A "dica após 2 erros" do GDD foi removida: entregava a resposta.)
- Depois de acertar: card ativo fica destacado **na cor do tema**, os outros **apagados** até o poder acabar.
- **Versículo errado trava TODOS os cards por 2,5 s** (penalidade; impede clicar em todos até acertar). O nome do versículo **não aparece**: só **"Versículo errado" em vermelho** acima do herói, rápido (~0,8 s).
- Refutar **não apaga a mentira**: o balão **continua visível até o demônio morrer** (antes estilhaçava e voltava quando o poder acabava). Enquanto o poder está ativo contra ele, o balão ganha **borda e brilho na cor do versículo** + faíscas no momento do acerto; quando o poder acaba, volta à borda normal.

## 7. Escudo

- Dura **3 s** erguido (sobe até 6 s com o quiz da fé). Barra azul no HUD.
- Recarrega 0,6 s por segundo abaixado.
- Se esgotar: "Escudo esgotado", só volta com **50%** da carga.
- Erguido: bloqueia golpe e bola de fogo, anda a 35% da velocidade, não ataca.
- Cor do escudo (arco, anel de bloqueio, botão ativo): **azul claro, a mesma do tema Dúvida** — o escudo alude à fé contra a dúvida.

## 8. Inimigos e mentiras

- **O demônio já entra com a mentira sobre a cabeça** (antes ela só aparecia depois que ele terminava de entrar, 2–3 s). Enquanto ele ainda está fora da tela, o balão fica preso na borda. Dá para refutar já durante a entrada. Entrada mais rápida (320 px/s).
- **Distância mínima entre inimigos: 270 px (~3 demônios)**, para os balões não se sobreporem. Cada um tem uma vaga fixa (direita → esquerda: os que voam ficam mais à direita, os de chão mais perto do herói); entram em fila já espaçados e, ao perseguir o herói, não chegam a menos de 270 px de outro. Se mesmo assim dois balões se tocarem, um sobe acima do outro com uma linha até a cabeça do dono.
- **Todos os inimigos de chão (Tentação e Mentira) = serpente vermelha com sprite** (alude à serpente do Éden, pai da mentira). Tiras `assets/sprites/enemy/serpente-run.png` (7 quadros, anda/parado em loop — parado mais lento) e `assets/sprites/enemy/serpente-attack.png` (5 quadros): durante o aviso (`tell`) passa pelos quadros 1→3 (abre a boca, brilho vermelho), no golpe mostra o **bote com o rasgo** (quadro 4) e volta (5). Recortadas da folha enviada; a fileira de movimento era menor e foi **igualada pela altura**, todos os quadros alinhados pela barriga e pela base. Barra de vida acima da cabeça e balão um pouco mais alto. Os outros inimigos continuam desenhados por código (`data.js` → `inimigos[].sprite` liga um sprite a qualquer tipo).
- **Dúvida = ave de rapina com sprite** (`assets/sprites/enemy/ave-fly.png` e `ave-attack.png`, 8 quadros cada, recortados da folha enviada; mesmo tamanho nas duas fileiras, ~160 px de envergadura no jogo, quadros alinhados pelo **olho vermelho**). Os rasgos do golpe saem à frente do bico.
  - **Paira** no alto (y 200) batendo asas, sempre **virada para o herói**. Só alcançável **pulando**, ou quando ela desce.
  - **Aviso** (0,7 s): ergue as asas (ataque 1→2) com brilho azul.
  - **Mergulho** (640 px/s) em linha reta até **onde o herói estava** no fim do aviso: corpo esticado (quadros 7–8) e, perto do alvo, garras e rasgo (3→6). Encostar = 10 de dano, uma vez por mergulho. **Sair do lugar desvia; o escudo bloqueia.** No mergulho ela fica na altura do herói: hora de golpear.
  - **Sobe em curva** para o outro lado (bico inclinado para cima, asas batendo rápido) até a altura de pairar e **vira** para encarar o herói: troca de lado direto, sem animar a virada (o giro horizontal ficava estranho).
  - **Balão da mentira embaixo da ave** (em cima ficava atrás do HUD do topo), com a ponta para cima. Fica na altura de pairar: não desce junto no mergulho, só acompanha a ave na horizontal. **A frase some enquanto ela mergulha e sobe** e volta quando ela fica pairando de novo.
  - Com várias aves, **só uma mergulha por vez**. Ficam dentro da arena.
- **O balão da mentira racha junto com a vida do demônio**, em 3 estágios: **inteiro** (mais de 2/3 da vida) → **rachado** (riscos saindo de cima e de baixo, até 1/3) → **despedaçado** (mais riscos e **pedaços faltando** nos cantos e numa beira). A cada estágio caem **lascas de papel**; quando o demônio morre, o balão **estoura** em lascas. Riscos ficam por baixo do texto e os buracos só na beira: a frase continua legível. Vale para todos os inimigos (serpente e ave). Cada balão racha de um jeito (sorteado), sempre igual até o fim. Feito com a classe reaproveitável `Rachaduras` (`js/battle/draw/cracks.js`), que serve para qualquer painel retangular.
- **Cada demônio carrega UMA mentira até morrer.** Não troca com o tempo e não some ao ser refutada — só desaparece quando ele morre.
- Cada demônio novo traz **outra mentira do seu tema**, sem repetir na mesma batalha (só repete se o repertório do tema acabar).
- 15 mentiras no total (3 da Idolatria): as 5 do GDD + variações com frases diferentes que pedem o mesmo versículo (anti-decoreba).

| | Tentação | Dúvida | Mentira | Idolatria |
|---|---|---|---|---|
| Vida base | 70 | 60 | 60 | 60 |
| Comportamento | Persegue o herói no chão (90 px/s) | Ave: paira alto e mergulha | Persegue no chão, mais lento (70 px/s) | Serpente, igual à Mentira |
| Ataque | Corpo a corpo, 10 dano, alcance 150 px; **pular desvia** | Mergulho até onde o herói estava, 10 dano; sair do lugar desvia | Corpo a corpo, 8 dano | Corpo a corpo, 8 dano |
| Aviso | 0,55 s, brilho vermelho | 0,7 s, ergue as asas, brilho azul | 0,6 s | 0,6 s |
| Cadência | 1,5 s | 2,2 s | 1,8 s | 1,8 s |
| Refutado por | Tiago 4:7, 1 Co 10:13 | Isaías 41:10, Salmos 23:4, Salmos 3:7 | Hebreus 4:12 | Êxodo 20:3 |

- Mentiras da Mentira: "A Bíblia é só um livro antigo. Não serve pra nada hoje." · "Palavras velhas e mortas. Isso não muda ninguém." · "Isso é coisa do passado, não tem poder nenhum."
- Mentiras da Idolatria: "Curve-se ao bezerro de ouro. Esse deus você pode ver." · "Tenha quantos deuses quiser. Todos levam ao mesmo lugar." · "Ponha outra coisa em primeiro lugar. Deus entende."
- Vida por grupo na jornada: primeiros grupos 55–60%, depois 80–100%.

## 9. Derrota do demônio (fatality)

- Câmera lenta 25%, **1,8 s** no total.
- **O demônio explode** (antes sumia num fade lento): pisca branco e incha por ~0,12 s, depois **estoura** — clarão branco-alaranjado, **onda de choque** na cor do versículo que o refutou, **~46 faíscas** (riscos brilhantes dourados/laranja/cor do tema, com gravidade) e **pedaços do corpo** na cor do demônio voando. A **tela treme** ~0,35 s. A explosão roda em tempo real, não na câmera lenta, para ter impacto. Com "movimento reduzido" do sistema: menos partículas e tremor curto.
- **Sem overlay vermelho.** Só a **referência** do versículo (ex.: `Tiago 4:7`), fonte **Cinzel** (clássica, legível), vermelha com contorno preto: aparece em fade, **pisca** e some. Sem texto completo, sem gotas.
- Som: **batida de metal** + **trecho medieval de ~2 s** (Ré dórico, timbre de alaúde, bordão de quinta) — sintetizado no navegador; trocar por áudio real no jogo oficial.

## 10. Pausa (P)

- Menu **em coluna**: Continuar · Ataques (versículos) · Controles · **Configurações** · Sair ao menu.
- **Configurações**: interruptor **Som** (liga/desliga os efeitos). Sincronizado com a caixa "Som" do menu inicial e **salvo no navegador**. Funciona com mouse ou setas + Enter.
- Cabeçalho fixo com **← Voltar** ao lado do título; só o conteúdo rola.
- **Ataques**: lista dos versículos equipados com tecla, dano (×nível da Forja), duração do poder e texto completo (não diz qual mentira cada um refuta).
- **Controles**: tela ilustrada com teclas WASD (cores por função), Espaço, mouse (botão esquerdo/direito destacados), K, J, **L (Impulso do Espírito: atravessa os inimigos; precisa de 1 fogo; recarga 3 s)**, **L + L (combo à parte: com 3 fogos, L de novo em até 1 s volta pelo mesmo caminho)**, 1–9, 👁, P/Esc, setas + Enter. O botão Controles usa o ícone ⌨ monocromático, na cor dos outros do menu.
- Pausado: tudo congela, escudo é baixado, entradas ignoradas.

---

## Pendências / a decidir no jogo oficial

- Conferir todos os textos bíblicos (escritos de memória, ARC) e a licença da tradução. Isaías 41:10 usado como "eu te esforço" (ARC) — o GDD dizia "fortaleço".
- Sangue vs. luz no fatality (público-alvo).
- Arte dos demônios (hoje desenhados em código) e animações faltantes do herói: parado, escudo, dano, derrota.
- Controles de toque para celular (hoje só teclado + mouse; há botões de escudo e pausa na tela).
