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
  - **Jogar** → **mapa das jornadas** (tela cheia, pergaminho escuro com grade de meridianos). Cada jornada é um **ponto do mapa**: medalhão redondo com **desenho próprio** (Exodus = pirâmides ao pôr do sol; O vale da sombra = vale escuro entre montanhas, lua e trilha descendo; Babilônia = zigurate ao pôr do sol) e legenda "Jornada N · nome"; a região em volta brilha na cor da jornada. Os pontos são ligados por uma **trilha tracejada** na ordem das fases: o trecho já vencido fica **dourado**, e depois da última jornada a trilha **some na névoa** (há mais por vir). A jornada atual pulsa e tem o **escudo do templário** flutuando em cima; vencida ganha selo ✓; trancada fica apagada com 🔒 e desabilitada. Posição, desenho e cor em `data.js` → `fases[].mapa` (`x`/`y` em %, `icone`, `cor`); desenhos em `js/ui/map.js` → `ICONES` (sem ícone: ruínas). **Celular em pé**: o mapa gira (x e y trocam) e a trilha desce. Setas + Enter escolhem o ponto, Esc / ← Voltar volta ao menu. **Vencer uma jornada libera a próxima** (salvo no navegador). **No protótipo todas estão abertas** (`data.js` → `jornadasLiberadas: true`); `false` volta a travar. A vitória mostra **Jornada N →** (na última, Menu); "Jogar de novo" repete a mesma; "Ir para a jornada" da forja abre a última liberada.
  - **Habilidades** → tela de personagem com **4 vistas** (cada uma isolada; "← Habilidades" volta ao hub, "← Menu" sai), sempre com "Ir para a jornada ⚔" no topo:
    - **Hub**: o templário **no centro**, grande, em pé com a **capa ondulando ao vento** (`hero/hab-idle.webp`, arte própria desta tela: 6 quadros de 308×352 alinhados pelo elmo, em loop de 1,2 s; a batalha continua com o `idle.png`), com a **luz em volta pulsando devagar**, em pé numa **base de pedra em dois degraus** (`assets/img/base-pedra.webp`; antes era a laje de terra do Exodus), pisando no degrau de cima, com sombra sob os pés num círculo de luz dourada; à esquerda Efésios 6:11, à direita as **métricas** (Fé, Espírito, Espada, Palavra, Jornadas). **Na frente dele, 3 entradas**: **Forjar versículos** (achados/total), **Exercitar a fé** (escudo e impulso) e **Armadura** (peças ativas).
    - **Forjar versículos**: lista à esquerda (larga, ocupa a altura da tela e rola; 2 colunas em tela larga), com busca e filtro por tema; à direita as métricas e o templário. Voltar do versículo cai nesta vista.
    - **Exercitar a fé**: os quizzes (Heróis da fé, Espírito Santo) à esquerda; métricas e templário à direita.
    - **Armadura** (Armadura de Deus, Ef 6:13-17): o templário no centro e **uma peça por card**, 3 de cada lado, o ícone virado para ele. Esquerda: Capacete da salvação, Couraça da justiça, Cinto da verdade (**em breve**, bloqueados). Direita, já ligadas ao jogo: **Escudo da fé** (segundos de escudo → abre Exercitar a fé), **Espada do Espírito** (versículos forjados → abre Forjar versículos), **Calçados do evangelho** (Impulso [L] → abre Exercitar a fé).
    - No celular tudo empilha (templário, entradas, métricas; na armadura os cards vão para baixo dele).
  - **Configurações** → **Som** (interruptor, sincronizado com o da pausa e salvo). Abaixo, recolhidas em "Opções de teste do protótipo": faixa da forja (Normal / Calma / Parada), **Jogador imortal** (ligado por padrão) e **Tudo liberado** (todos os versículos, 3 fogos e todas as jornadas).
  - Esc ou "← Voltar" retorna à lista principal. A ajuda de teclas saiu do menu (fica em Pausa → Controles).
- As antigas "3 ondas" na tela fixa foram substituídas pela jornada (seção 4b).
- Na forja, botões **☰ Menu** e **← Lista** sempre visíveis, inclusive no meio do martelar.

## 2. Forja (conquistar versículos)

- O versículo é **digitado** (32 caracteres/s) num pergaminho.
- A digitação **pausa depois da lacuna**, mostrando até **3 palavras seguintes** (ou até a pontuação) para dar contexto. Ex.: `Sujeitai-vos, pois, a Deus; ___ ao diabo,`. Pontuação colada na lacuna não conta como palavra.
- Só nessa pausa a faixa de palavras começa a rolar. Acertou → o texto continua até a próxima lacuna, depois até o fim.
- Martelar: **K** / Espaço / clique / toque (o botão mostra a tecla K) quando a palavra certa está na zona de brasa.
- **Forja dos versículos — tela**: versículo à **esquerda** com o botão Martelar embaixo; à **direita** uma **caixa escura** com o **forjador** na bigorna (sprite de 4 quadros, `assets/sprites/forge/forjador.webp`) com a **faixa de palavras passando embaixo dele** (no celular, tudo empilhado). Sem apertar nada ele fica em **idle** (respira, 4 quadros em loop, `forjador-idle.webp`, mesma grade e âncora); a cada martelada **ergue o martelo → bate (faíscas) → solta** (~0,4 s) e volta ao idle. Em cima da cabeça dele aparece **Certo!** (dourado) ou **Errado!** (vermelho) a cada martelada; a faixa de palavras é o pé dessa caixa, da mesma largura. No impacto **pisca dourado** se acertou a palavra e **vermelho** se errou (o piscar fica mesmo com "reduzir movimento", pois é o aviso de certo/errado).
- **Martelo e bigorna** desenhados embaixo da faixa (no centro, alinhados à mira), só na **Afiação**: a cada toque o martelo **desce inclinando** até bater na bigorna e volta (~0,26 s), acertando ou errando.
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

Clicar num versículo da lista abre o **hub do versículo** com as duas trilhas. **Só passa para o próximo nível quem acerta tudo (0 erros)**; errou → refaz o nível, o progresso não cai. Na **Forja**, terminar com erro troca a tela por **só o resultado** (sem versículo, forjador nem Martelar): acertos, erros, precisão e os botões **Voltar ao menu** / **Tentar de novo**. A forja tem **3 vidas** (corações no canto superior direito da caixa do forjador): cada erro quebra um; no **3º erro** perde na hora e vai para o resultado ("Sem vidas"). Nível concluído pode ser refeito.

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
| Combo de golpes | **K** = 1º golpe: **corte lateral** (`hero/attack1.webp`, 6 quadros: guarda → arma → corte → corte largo → estocada → guarda; 0,6 s, acerta aos 0,27 s). **K + K**: apertar K durante o golpe (ou até 0,3 s depois) emenda o **2º golpe: corte de cima para baixo** (`hero/attack2.webp`, 5 quadros: guarda → ergue → no alto → desce cortando, sem bater no chão; 0,44 s, acerta aos 0,28 s). Continuando, alterna 1º → 2º → 1º… As sprites estão na mesma escala do idle (a guarda tem a mesma altura nas duas), cada quadro alinhado pelo pé de trás. No chão ele **finca os pés** enquanto golpeia; no ar o golpe usa a animação antiga (espada erguida → estocada). Mesmo dano |
| Sons da espada | sintetizados (`swordSfx` em js/core/audio.js): **vento** da lâmina cortando o ar a cada golpe (um "fu!" curto, sempre igual; **com poder de versículo**, o vento vem com um **feixe de laser leve** (tom limpo e agudo que desliza para baixo, com um tremor de energia, ~0,3 s), **golpe na carne** ao acertar um inimigo (pancada surda + tapa abafado + rasgo úmido, sem metal). Ídolo (`stoneSfx`): cada golpe **trinca** como construção (estalo seco, trincas pipocando, cascalho; mais forte quanto mais rachado) e o último **desaba** (estrondo grave, pedaços batendo no chão, poeira; ~1,4 s) |
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
- **Fundo esticado** (jornada 2, Vale da sombra — `assets/img/fundo-vale.webp`: céu vermelho-escuro, lua, montanhas e pinheiros; `fundo: { estica: 1.2 }`): em vez de repetir, **uma imagem só atravessa a fase inteira**: ampliada 1,2× e presa no topo (lua abaixo do HUD; a sobra de baixo fica atrás do chão), começa mostrando a borda esquerda e chega à direita no fim da fase. Anda só ~190 px nos 11.500 px da fase, quase parado, sem emenda e sem perder qualidade (a arte original tem 1672 px de largura, desenhada em ~1150). Véu escuro de 40% (tom roxo-escuro) para o herói e os inimigos destacarem.
- **Chão com imagem** (jornada 1, Exodus — `assets/img/chao-exodus.webp`, `data.js` → `fases[].chao`): laje de terra com pedras, capim seco e ossadas. O miolo da imagem se repete pela fase (fim dissolvido no começo) e as **pontas arredondadas** fecham cada trecho na borda de buraco ou de desnível; terreno alto mostra a parede de rochas (faixa de rochas repetida, escurecendo com a profundidade). As **plataformas** viram lajes flutuantes pequenas. A areia da arte era clara demais: o chão é **multiplicado por uma cor da paleta do fundo** (`CHAO_COR` em `js/battle/draw/world.js`, terra avermelhada escura). Mesma estrutura da fase (posições e alturas não mudaram); sem `chao`, usa o chão desenhado de antes.
- **Sensação de avanço**: o céu muda ao longo da fase (noite roxa → aurora dourada perto do fim) e o fundo tem 3 camadas de parallax (serras distantes, montanhas de alturas variadas, ruínas de colunas espaçadas). Antes o cenário era idêntico em toda a fase.
- **Terreno variado** (não é sempre buraco):
  - **Buraco**: pular. **Buracos comuns com 190–200 px**. **O colisor segue a borda desenhada**: o herói cai exatamente onde a ponta da laje acaba (`bordaBuraco` em js/battle/draw/world.js = 14 + o quanto a ponta passa da borda: 29 px no Exodus, 41 px na grama de guerra), em buracos e mares. Cair = volta ao **último ponto firme**, −10 de vida ("Caiu na água! -10", com espirro). Enquanto cai, o herói é **recortado** entre as bordas do chão e acima da linha d'água (afunda no mar); antes uns blocos escuros, sobra do chão desenhado por código, apareciam dos lados do buraco. Todo buraco tem **água agitada com mãos de esqueleto** saindo dela (`assets/sprites/hazard/mar-maos.webp`: os 4 quadros do GIF enviado, 0,18 s cada, recortados sem a margem vazia — o canvas não anima GIF, então os quadros viram uma tira). A cena inteira (3 mãos) cabe na largura do buraco, atrás das lajes. As antigas mãos de fogo (`mao-fogo.png`) só aparecem se essa arte não carregar.
  - **Mar** (`tipo: "mar"` no data.js): buraco cheio de **mar agitado** (`assets/sprites/hazard/mar.webp`, 4 quadros 470×206 em loop a 5 qps, repetidos lado a lado alternando espelhado, com 6 px da borda de cada quadro cortados e posições em pixel inteiro, para emendar sem linha; as cristas passam um pouco acima da borda do chão, por trás das lajes). **Sem mãos de fogo.** Cair = igual ao buraco (volta ao último ponto firme, −10), com **espirro d'água** e "Caiu no mar! -10". Ponha uma **plataforma** em cima para atravessar.
  - **Fim da jornada**: uma **cruz com um manto vermelho ao vento** (`assets/sprites/object/cruz.webp`, 4 quadros 350×412 alinhados pela base de pedras, em vai-e-volta a 5 qps, escala 0,42, com brilho dourado) sob um **facho de luz vindo do céu** (pulsando). A luz aparece mesmo com a terra submersa (marca o fim de longe); a cruz sobe junto com a terra.
  - **Terra submersa** (`tipo: "terra"`): chão dentro de um mar que fica embaixo d'água até o chefão cair; aí sobe desacelerando (~2,2 s) e vira chão firme.
  - **Cobra verde** (3º monstro da Jornada 1, a 1ª Mentira; `aparencia: { sprite: "verde", acido: true }` no grupo do data.js — só troca aparência e ataque, o tema e as mentiras continuam os da Mentira). Sprites dos 2 GIFs enviados: `enemy/verde-run.webp` (4 quadros) e `enemy/verde-attack.webp` (8 quadros: arma 0–3, cospe 4–7), 270×292, os dois na mesma escala (igualados pela base enrolada) e alinhados pela base. Desenhada a **80%** (`sc: .8`; era grande demais), com a boca do cuspe e o balão acompanhando. A tira de andar tinha uma **sobra do quadro vizinho** na borda direita (aparecia à esquerda quando ela vira): limpa. **Cospe ácido de longe**: fica a ~240–380 px do herói (chega perto se ele foge, recua se ele encosta, sempre inteira na tela), brilha verde armando (0,7 s) e solta uma **bola verde de ácido** da boca que cai **em arco** onde o herói está (8 de dano; o escudo bloqueia; espirra verde). A cada 2 s.
  - **Chefona da jornada 1: a Naja, a serpente do mar** (`tipo: "chefe", pele: "naja"`): é o Leviatã abaixo (mesmo comportamento) com a arte da **naja verde** grande (ver Bestiário) e o jato de ácido do próprio sprite. **Mente como o Golias**: 5 s depois de surgir aparece o balão forte (vermelho-escuro, borda dourada, caixa alta) acima da cabeça, alternando 2 mentiras curtas — "Curve-se a mim. Eu sou o seu deus agora!" (**Êxodo 20:3**) e "Sua Bíblia é papel morto. Afunde comigo!" (**Hebreus 4:12**). O versículo certo a refuta (poder ativo contra ela); quando o poder acaba, troca para a outra mentira. O balão some enquanto ela mergulha. Avisos: "Naja, a serpente do mar!", "A Naja está furiosa!", "A Naja foi derrotada!".
  - **Chefão do mar: Leviatã, o monstro do mar** (antes o chefe da jornada 1; hoje só no Bestiário) (`tipo: "chefe"`, `js/battle/boss.js`, Isaías 27:1). Sprites: `assets/sprites/enemy/leviata.webp` (2 linhas de 8 quadros 250×236 — 1ª nadando, 2ª o bote) e `leviata-acido.webp` (8 quadros 306×236: abre a boca → bola de ácido → jato → pinga; recortados pela ponta da cauda e alinhados pelo corpo com os outros). Mora no `mar` em que está e **nunca sai dele**: é desenhado entre a água funda e as ondas (as ondas cobrem a base do corpo; a base fica na borda de baixo da tela, então o corte da arte nunca aparece) e atrás das lajes, em escala **×1,45**.
    - **Surge** do fundo (1,4 s, espirro d'água, aviso "Leviatã, o monstro do mar!") quando o herói chega a 420 px do mar; aparece a **barra de vida do chefão** no topo. Fica **seguindo o herói** dentro do mar (75 px/s, sempre virado para ele).
    - **Bote** (mordida): com o herói a até 300 px — brilha vermelho armando, morde entre 0,55 e 0,8 s (15 de dano; o escudo bloqueia). 2 s entre ataques.
    - **A cada 3 ataques ele mergulha**: afunda (0,9 s), fica embaixo d'água 1,8 s (**não leva golpe**; a barra mostra "mergulhou…") e **sobe de novo** perto do herói, de surpresa, e continua atacando.
    - **Metade da vida (fase 2)**: aviso "O Leviatã está furioso!", barra fica verde e ele passa a **alternar bote e ácido**; se o herói estiver longe (até 650 px), cospe ácido. O ácido: brilha verde armando, aos 0,8 s solta uma **bola de ácido** da ponta do jato que cai **em arco** onde o herói estava (12 de dano; o escudo bloqueia; espirra verde no chão ou no mar).
    - **Vida 50**: leva espada (3), rasgo do poder (8 × forja) e impulso, da laje ou da margem. Ao cair: afunda devagar, tela treme, "Leviatã derrotado!". **A jornada só termina depois que ele cai** (chegar ao fim com ele vivo não vence).
    - Pequenas (~0,55×, tamanhos levemente diferentes, espelhadas alternadas, **de propósito desalinhadas na altura**: uma mais alta, outra mais baixa, ~30 px de diferença; a base de todas fica abaixo da borda da tela, sem faixa preta embaixo), saindo do fundo da tela: **sobem e agarram** (quadros 1–5 em loop, cada uma no seu ritmo) quando o herói chega a ~280 px, **uma depois da outra**, e **afundam** (quadros 6–10) quando ele se afasta. Desenhadas na frente do herói: quem cai some entre elas.
    - Em buraco com laje no meio, as mãos ficam só nos vãos livres.
  - **Terreno mais alto**: parede na frente; precisa pular (até ~130 px).
  - **Vale (terreno mais baixo)**: desce andando; para sair, a parede exige pulo.
  - **Plataforma** (laje flutuante): passa por baixo, pula para subir e fica em cima. Serve de ponte em buraco largo e de degrau para penhasco alto (190 px, impossível sem o degrau). **Móvel** (`move` / `periodo` no data.js): vai para a direita e volta, suave (desacelera nas pontas); **quem está em pé em cima vai junto**.
- **Rãs** (Êxodo 8, a praga das rãs; `{ tipo: "ra", x }` no data.js, `js/battle/frog.js`): bichos soltos pela fase, **fora das arenas** (não travam a câmera, não mentem, não atacam). **Encostar nelas fere** (4 de dano — metade de um golpe de monstro, no máximo 1 vez por segundo por rã; o escudo e o impulso protegem). Desenhadas a **72%** da arte (pequenas). Ficam paradas (idle: a papada enchendo, `enemy/ra-idle.webp`, 6 quadros 106×84) por 1,1–2,2 s e dão **um pulo curto (até 90 px, 0,55 s)**. **Patrulham como em jogos de plataforma**: longe do herói, vão e voltam em volta de onde nasceram (até 110 px para cada lado); só com o herói a até 180 px (e na mesma altura) pulam na direção dele, sem se afastar mais que 230 px de casa. Travou num buraco, parede ou no fim da ronda: vira e vai para o outro lado (`ra-pulo.webp`, 6 quadros 172×210: a altura do pulo, ~67 px, já vem desenhada na arte; a tira do pulo era 18% menor e foi igualada ao idle), com um coaxar. Não pulam em buraco nem sobem parede. **20 de vida**: 2 golpes de espada (10 cada), o rasgo do poder ou o impulso; morrem num estouro verde. **A 1ª rã (x 480) só patrulha** (`ronda: true`, nunca persegue: o jogador ainda está aprendendo a andar) e **ensina a atacar** (`ensina: true`): com o herói a até 220 px dela (no começo vem primeiro a dica de andar), a dica do tutorial vira "[K] atacar / Golpeie a rã antes que ela encoste em você", e some quando ela morre. Na Exodus: **6 rãs** — 2 antes do 1º monstro (x 480 e 1280) e as outras espalhadas (2950, 4330, 6600, 7850).
- **Lobos** (Vale da sombra; `{ tipo: "lobo", x }`, mesmo módulo das rãs, `js/battle/frog.js`): bichos soltos, **fora das arenas**, pequenos (~140 px de comprimento). **Patrulham**: andam devagar (55 px/s) indo e voltando em volta de onde nasceram (até 170 px para cada lado), dando meia-volta em buraco ou parede. Com o herói a até **200 px** e na mesma altura, **correm atrás dele** (150 px/s, sem se afastar mais que 340 px de casa; se não conseguem chegar — fim da coleira, buraco, parede — **não ficam parados encarando**: voltam a patrulhar) e, a ~150 px, **rosnam** (brilho vermelho, 0,35 s) e **saltam para a frente mordendo** (até 95 px em 0,4 s, sem atravessar o herói; **8 de dano**, o escudo bloqueia), com 1,4 s até o próximo salto. **40 de vida** (4 golpes de espada, o rasgo do poder ou o impulso); morrem num estouro cinza e vermelho. Sprites: `enemy/lobo-run.webp` (6 quadros andando) e `lobo-attack.webp` (6: agacha → rosna → arma → salto → aterrissa → volta), 190×136, alinhados pela pata de trás; a arte do ataque era ~20% menor e foi igualada. No Vale da sombra: **5 lobos** espalhados (x 1000, 3550, 5330 no fundo do vale, 7300 e 9200), longe das arenas.
- **Sombra dos monstros** (`drawShadow` em `js/battle/draw/world.js`): elipse escura e suave no chão embaixo dos inimigos de chão, do Golias, das rãs e dos lobos; a da ave fica no chão embaixo dela. No pulo ou no voo a sombra encolhe e clareia.
- **Ídolo — bezerro de ouro** (`assets/sprites/object/bezerro.png`, no lugar da antiga pedra brilhante; no data.js segue `tipo: "pedra"`): fica **apoiado no que estiver embaixo** — chão, terreno alto, fundo do vale, topo do penhasco — e brilha dourado. **Bloqueia** quem está na mesma altura (alto demais para pular). **3 golpes** (espada, rasgo ou impulso) o derrubam; **cada golpe muda o quadro**: inteiro → rachado → quebrado (lascas douradas a cada golpe). No 3º golpe ele **desmorona**: sobra o pedestal com entulho e os pedaços (cabeça, pata, lascas — `bezerro-pecas.png`) **caem com gravidade, giram, quicam uma vez e assentam** sobre o entulho. De dentro **salta um livro dourado** que flutua.
- **Tocar o livro** (ou passar por ele) → o jogo **pausa** e abre um **pergaminho que se desenrola** com "✦ NOVO VERSÍCULO ✦", a referência e o **texto completo**, com **brilho dourado pulsando** em volta (fundo escurece com halo dourado). ✕, Enter, Esc ou clique fora fecha. Ao fechar, um **📖 voa da fase até o card novo**, que surge com **faíscas douradas** — o jogador lê o versículo antes de poder usá-lo.
- **Inimigos** surgem quando o herói chega a ~600 px do grupo (mais cedo, para o herói ficar à esquerda e sobrar espaço para os inimigos espaçados); a **câmera desliza e trava** (arena de x−740 a x+220 do grupo) até o grupo todo cair (+20 de vida ao vencer cada grupo).
- **Tutorial no começo** (só na 1ª jornada, fora do modo teste): caixa no alto da tela, uma dica por vez, com as **teclas desenhadas pulsando**. Fica **atrás do balão da mentira** do inimigo (o balão nunca é coberto). **Cada dica some assim que o jogador faz o que ela pede**, sem esperar o objetivo inteiro:
  1. "A D andar · W ou Espaço pular — Pule o buraco!" → some ao passar o buraco
  2. Perto do ídolo: "K atacar — Destrua o bezerro de ouro" → some no 1º golpe
  3. "Pegue o livro dourado!"
  4. Depois de ler o versículo novo: "Os versículos são suas armas. Utilize o certo para refutar e atacar. / Pressione 1 ou clique no card" → some ao refutar
  5. Depois de refutar, uma linha por ação: "Sua lâmina brilha: K ataque o demônio" (some ao atacar) e "Segure J para erguer o escudo" (some ao erguer o escudo); se o inimigo morrer antes, some tudo.
- Ordem da fase 1 (**"Exodus"**, antes "A Palavra no caminho") — **só 2 versículos e 4 monstros**, versículos bem separados (fase de 10 100 px, ~1 min jogando direto):
  1. buraco → bezerro de ouro no chão: **Êxodo 20:3** ("Não terás outros deuses diante de mim") — o 1º versículo do jogo fala justamente do ídolo que o herói acabou de derrubar
  2. **Idolatria** ("Curve-se ao bezerro de ouro. Esse deus você pode ver.") → terreno alto → **Idolatria** ("Tenha quantos deuses quiser…") — uma de cada vez, as duas refutadas por Êxodo 20:3
  3. caminho longo: buraco, **mar** (x 4500, 500 px) com **uma laje no meio** para atravessar, **mar largo** (x 5300) com 2 lajes, degrau de plataforma → ídolo **no topo de um penhasco**: **Hebreus 4:12** (a Palavra viva e eficaz)
  4. **Mentira — a cobra verde** ("A Bíblia é só um livro antigo…") → **Mentira** ("Palavras velhas e mortas…") — uma de cada vez, frases fixas que Hebreus 4:12 refuta
  5. **chegada**: um **mar largo** (x 8800, **770 px ≈ 80% da tela**) atravessado numa **laje móvel larga** (230 px) que vai e volta (505 px, 10 s a ida e volta), com a **chefona Naja** no mar. **Até ele cair, tudo é mar até o fim** (a terra do fim, `tipo: "terra"` em x 9570, fica submersa — não dá para terminar a fase antes); quando ele cai, **a terra sobe da água** (~2 s, com a cruz em cima) → terra firme → cruz = vitória
  - Tiago 4:7 e 1Co 10:13 (Tentação) não aparecem em jornada nenhuma por enquanto (continuam na forja e no modo teste).
- **Chão da fase 2**: **grama de campo de batalha** (`assets/img/chao-guerra.webp`: as 2 artes enviadas emendadas numa laje só — a 2ª, desenhada ~85% do tamanho, foi ampliada e encaixada no miolo com transição suave, sem cortar o corvo). Sem o tom avermelhado do Exodus (`chaoCor: null`) e com medidas próprias (`chaoMedidas`: superfície y=145, pontas 140 px, pedras y 250–390, escala 0,45). Buracos, terreno alto, vale e lajes saem da mesma arte, como no Exodus; as pontas mostram o estandarte templário e os elmos.
- Ordem da fase 2 ("O vale da sombra") — **no máximo 2 versículos por fase: Isaías 41:10 e Salmos 23:4; 4 inimigos + o chefão** (fase de 11 500 px). Começa com o aviso "A Dúvida ataca do alto: a ave mergulha onde você está / Saia do lugar ou erga o escudo [J]; pule para golpeá-la":
  1. buraco → pedra no chão: **Isaías 41:10**
  2. **ave** ("Você é fraco e medroso. Desista.") → terreno alto
  3. buraco → descida ao vale; a pedra fica **lá embaixo** ("vale da sombra da morte"): **Salmos 23:4**
  4. **ave** ("Deus te abandonou.")
  5. buraco largo com lajes, degrau e penhasco (Salmos 3:7 saiu daqui)
  6. **uma ave e uma cobra vermelha juntas** ("Seus inimigos são fortes demais." / "Você está sozinho no escuro."). A cobra é uma Dúvida com a aparência da serpente, no chão (`aparencia` em lista, uma por inimigo do grupo). As duas mentiras que antes só Salmos 3:7 refutava agora também aceitam Isaías 41:10.
  7. **chefão: Golias, o gigante de Gate** (x 10950) → cruz = vitória **só depois que ele cair**
- **Chefão Golias** (`tipo: "gigante"`, `js/battle/giant.js`, 1 Samuel 17; sprites `enemy/gigante-run.webp` 8 quadros e `enemy/gigante-attack.webp` 5 quadros, 504×370, recortados de cada quadro e alinhados pelo meio dos pés; escala **0,82** (bem maior que o herói), **afundado 12 px na grama** para não parecer flutuar). Quando o herói chega perto (com os outros grupos vencidos), a câmera **trava numa arena** e ele **entra pela direita**; aviso "Golias, o gigante de Gate!" (sem versículo) e barra de vida do chefão no topo. **Chega calado**: o balão da 1ª mentira só aparece **5 s depois** de ele surgir; daí em diante as mentiras vão se alternando. **Anda até o herói** (70 px/s) e, a até 250 px, dá uma **estocada de lança**: brilha vermelho armando, estoca entre 0,52 e 0,68 s (18 de dano; o escudo bloqueia), 1,4 s entre ataques. **Vida 60**: espada, rasgo do poder e impulso. Ao cair: some devagar, tela treme, a arena destrava e aparece "Golias caiu!".
  - **Golpe no chão** (`enemy/gigante-chao.webp`, 8 quadros 524×396, ampliados 1,43× para a mesma escala dos outros): **a cada 3 ataques** (ou se o herói ficar longe) ele ergue a lança e **bate no chão** (brilha vermelho armando; impacto aos 0,76 s): **a tela treme**, sobem faíscas e pedrinhas e **quem estiver no chão leva 14 de dano — o escudo não segura**; pulando (no ar) ou no impulso, não pega. Na 1ª vez aparece o aviso "O chão treme! Pule [W] na hora do golpe".
  - **Mentiras do Golias** (`data.js` → mentiras do tipo `"gigante"`, na ordem): "Olhe meu tamanho. Ninguém vai te socorrer de mim!" (Is 41:10) → "Neste vale só existe morte. Tenha medo de mim!" (Sl 23:4) → "Sou forte demais. Você vai cair aqui, sozinho!" (Is 41:10) → "O seu Deus não desce a este vale escuro." (Sl 23:4). **Refuta-se como os outros** (card do versículo certo: poder ativo contra ele; errado trava os cards). Quando o poder acaba, **ele troca para a próxima mentira**, que pede o outro versículo. **Balão mais forte**: fundo vermelho-escuro, borda dourada grossa pulsando, letra Cinzel em caixa alta dourada com contorno; refutado, a borda e o brilho ficam na cor do versículo.
- **Pontas do chão da fase 2**: largas e terminando em grama limpa (esq. 440 px com o estandarte e o elmo, dir. 581 px com o elmo e a flecha), dissolvendo só nos últimos 50 px — nenhum objeto aparece cortado ("pedaço comido"). Cada ponta passa só 60 px da arte (o arredondado) para dentro do buraco (`capOut`), então **as duas bordas do buraco fazem a volta arredondada** e o vão fica visível. Em terreno elevado, a parede de pedras continua por baixo das pontas, de borda a borda (no chão normal não, para não sobrar um bloco escuro embaixo em telas mais altas).
- **Leão do Orgulho** (Babilônia, Daniel 6; inimigo próprio `orgulho` no data.js, tema Orgulho; a 1ª mentira é sobre força própria): o leão de **cicatrizes e olhos vermelhos**: tiras `enemy/leao-run.webp` (6 quadros andando) e `leao-attack.webp` (6: encara → agacha → salta → garras → aterrissa → volta), 284×166, as duas na mesma escala (arte reduzida a 70%, o mesmo tamanho do leão anterior), alinhadas pela pata de trás (procurada nos 40 px de baixo, porque num quadro as garras da frente descem mais que ela). Anda no chão, mais rápido que a serpente (120 px/s), brilha vermelho armando (0,5 s) e **salta com as garras**: no bote ele **avança 80 px para a frente** em 0,2 s (`salto: 80`; para a 70 px do herói, sem atravessá-lo), então alcança mais longe que a serpente (até 230 px); o escudo bloqueia. Caixa de golpe baixa e comprida; balão mais baixo que o da serpente. Na Babilônia: o 1º inimigo e um dos dois do final; está no Bestiário.
- **Jornada 3: Babilônia** (Daniel 3–4, a cidade dos ídolos e do **orgulho**) — **2 versículos de humildade e dependência do Senhor: 1 Pedro 5:6 ("Humilhai-vos… debaixo da potente mão de Deus") e Provérbios 3:5 ("Confia no Senhor de todo o teu coração"); tema novo Orgulho (verde-água); 4 inimigos**, sem chefão por enquanto (fase de 9 500 px). Aviso no começo: "Babilônia: a cidade dos ídolos / Suba a escadaria do zigurate: a Palavra está lá no alto". No mapa: medalhão com o zigurate ao pôr do sol (`icone: "zigurate"`).
  - **Fundo**: a cidade com o zigurate, a estátua de ouro do rei, fogo e fumaça (`assets/img/fundo-babilonia.webp`, 1920×819, **parada**, em melhor qualidade que o GIF animado de antes). Ampliada 1,05× e **esticada pela fase** (parallax: anda ~380 px do início ao fim), presa no topo, com véu escuro de 50% (a arte é bem clara).
  - **Chão**: o **altar de pedra dourada** com panos, cálices e vinho derramado (`assets/img/chao-babilonia.webp`, 1986×416, recortado). Sem tingir; medidas próprias: superfície y=140, pontas esq. 560 px (pano vermelho e cálice até a pilastra) e dir. 260 px (pérolas e cálice), dissolvendo nos últimos 50 px, faixa de blocos y 320–400, escala 0,45. Buracos, terreno alto e lajes saem dele, como nas outras jornadas.
  - **Escadaria do zigurate** (`tipo: "estrutura"` no data.js; `assets/img/escadaria-babilonia.webp`, 1994×630 desenhada a 45%): uma **arte inteira em pé no chão** (base 45 px abaixo da superfície). Cada degrau vira **terreno invisível** (`degraus: [x0, x1, y da superfície]` em px da arte → `B.terrain` com `oculto`), então o herói pisa nos degraus desenhados: 20, 47, 110 e 146 px acima do chão, todos alcançáveis com o pulo (~130 px). O ídolo de 1 Coríntios 10:13 fica no degrau mais alto; depois dele, desce-se pela parede da direita. Qualquer jornada pode usar outra estrutura do mesmo jeito.
  - **Buracos**: **mar vermelho com mãos de armadura** (`fases[].maos` → `assets/sprites/hazard/mar-vermelho.webp`, do GIF "Mãos Blindadas nas Ondas Vermelhas": 12 quadros 358×338, 0,11 s cada; o céu preto do GIF virou transparente e o corpo do mar ficou sólido; a superfície do mar fica na borda do chão). Qualquer jornada pode trocar a arte dos buracos do mesmo jeito.
  - **Mentiras do orgulho** (`tipo: "orgulho"`): "Você é forte sozinho. Não se curve a ninguém!" e "Você chegou aqui sozinho. Ninguém te deu nada." (1 Pedro 5:6); "Sua força vem de você. Deus é para os fracos." e "Confie no seu braço. Só os fracos pedem ajuda." (Provérbios 3:5).
  - Ordem: buraco → ídolo **1 Pedro 5:6** → **Leão do Orgulho** ("Você é forte sozinho…") → terreno alto → buraco → **escadaria** com o ídolo **Provérbios 3:5** no topo → **Ave da Dúvida** ("Confie no seu braço…") → buraco → final: um **leão** ("Você chegou aqui sozinho. Ninguém te deu nada.") e uma **harpia** ("Sua força vem de você…") juntos → cruz. **Na Babilônia só há leões e harpias** (a Ave da Dúvida); todas as mentiras se refutam com os 2 versículos da fase.
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
  - cada clique solta um **rasgo de luz** (meia-lua) que voa **reto na horizontal, para onde o herói está virado** (900 px/s) — ataque à distância; é a mesma meia-lua, **um corte só** (sem as cópias de rastro atrás), **só esticada na vertical** conforme o golpe: no **corte lateral** fica um pouco maior que a original e no **meio do corpo**; no **corte de cima para baixo** vai **do pescoço aos pés**. Acerta a altura desenhada (`corte` em `HERO_ATK`, js/battle/config.js);
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

- **Animação de defesa** (`assets/sprites/hero/defend.webp`, 5 quadros 182×210): ao apertar [J] no chão o templário **ergue o escudo e agacha** (0,06 s por quadro) e **para no último quadro** enquanto o J estiver apertado; soltou (ou acabou a barra), volta ao normal. A arte enviada foi reduzida a 54% para o 1º quadro, em pé, ter a altura do idle; cada quadro alinhado pelo meio dos pés. No ar continua o sprite do pulo.
- **Andando defendendo** (`assets/sprites/hero/defend-walk.webp`, 6 quadros 172×204, a 35% da velocidade): passos curtos atrás do escudo, em loop a 7 quadros/s; parou de andar, volta ao último quadro da defesa. Arte reduzida a 49% (o capacete com o tamanho do da defesa), alinhada pelo capacete.
- **Cor dos golpes do combo** (`attack1/attack2.webp`) também igualada (prata e capa branca; o rastro dourado do corte ficou), e eles são desenhados **8% maiores** (`sc: 1.08` em `HERO_ATK`): na arte o herói golpeando ficava um pouco menor que parado.
- **Cor das tiras do escudo** igualada ao idle e à corrida: a arte enviada era mais quente (metal rosado, capa creme). Metal e capa (tons pouco saturados) viraram **prata neutra**, com meios-tons mais escuros e brilhos mais brancos; a cruz vermelha e o couro do cinto ficaram como estavam.
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
  - **Altura de pairar: y = 285** (`BIRD_HOVER_Y` em js/battle/bird.js; antes 200), com a área de acerto indo até as garras: baixa o bastante para o **rasgo do poder lançado do chão** (golpe lateral ou de cima para baixo) pegar a parte de baixo dela; pulando, pega em cheio.
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
- **Controles**: tela ilustrada com teclas WASD (cores por função), Espaço, mouse (botão esquerdo/direito destacados), K, J, **L (Impulso do Espírito: atravessa os inimigos; precisa de 1 fogo; recarga 3 s)**, **K + K (combo de golpes), L + L (combo à parte: com 3 fogos, L de novo em até 1 s volta pelo mesmo caminho)**, 1–9, 👁, P/Esc, setas + Enter. O botão Controles usa o ícone ⌨ monocromático, na cor dos outros do menu.
- Pausado: tudo congela, escudo é baixado, entradas ignoradas.

---

## 11. Bestiário (teste de desenvolvedor)
- **Onde**: botão tracejado **"🛠 Bestiário"** no menu principal (só para desenvolvimento; tirar no jogo oficial). Tela com um card por monstro (figura do 1º quadro da sprite, nome, o que faz; chefões com a etiqueta "Chefão").
- **Monstros**: Serpente (Tentação), Cobra verde (Mentira que cospe ácido), Ave da Dúvida, Cobra vermelha (Dúvida no chão), Leão (Tentação, Babilônia), **Leviatã**, **Naja do mar** e **Golias**.
- **Naja do mar** (chefona da jornada 1): o chefão do mar com outra arte (`chefe.pele: "naja"` → `PELES` em `js/battle/boss.js`). Mesmo comportamento do Leviatã: segue o herói dentro do mar, bote, mergulho a cada 3 ataques e ácido da metade da vida para baixo. Tiras `enemy/naja-run.webp` (8 quadros), `naja-attack.webp` (6, o bote estica para a frente) e `naja-acido.webp` (6, o jato sai da boca). **O ácido dela é o próprio sprite** (sem a bola verde): tocar no jato nos quadros 3–4 tira 12 de dano (o escudo bloqueia); por isso ela só cospe com o herói a até ~470 px. As 3 vieram em escalas diferentes: igualadas pela tira do bote e alinhadas pela cauda e pela base. Escala 1,25 (do tamanho do Leviatã); a arte olha para a direita. Lista em `js/battle/bestiary.js` (`BESTIARIO`): um monstro novo é só uma linha.
- **A luta**: clicar num card monta na hora uma **arena curta** com o cenário da jornada onde o monstro aparece (fundo e chão da jornada 1 ou 2) e **um monstro só**. O Leviatã vem com o mar largo, a laje que vai e volta e a terra submersa, como no fim da jornada 1; o Golias com a arena da jornada 2.
- **Imortais**: quando a vida do monstro ou do chefão zera, ela **volta cheia** (aviso "imortal · vida cheia"); não tem fatality nem vitória. O Leviatã continua na fase do ácido depois da 1ª metade.
- Começa com **todos os versículos** (para testar a refutação), sem tutorial e sem dica. Não libera jornada nem marca versículo achado. O título e o canto do HUD mostram "Bestiário".
- **Pausa [P]**: botão **"🐍 Trocar de monstro"** (só no Bestiário) volta para a escolha. Se o herói cair (com "Jogador imortal" desligado): "← Bestiário" ou "Lutar de novo".

## Pendências / a decidir no jogo oficial

- Conferir todos os textos bíblicos (escritos de memória, ARC) e a licença da tradução. Isaías 41:10 usado como "eu te esforço" (ARC) — o GDD dizia "fortaleço".
- Sangue vs. luz no fatality (público-alvo).
- Arte dos demônios (hoje desenhados em código) e animações faltantes do herói: parado, escudo, dano, derrota.
- Controles de toque para celular (hoje só teclado + mouse; há botões de escudo e pausa na tela).
