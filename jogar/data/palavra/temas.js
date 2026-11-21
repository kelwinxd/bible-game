// ---------- Temas dos versículos e como eles aparecem ----------
// Cor do poder por tema do versículo: brilho no herói, rasgo, impacto, referência, barra de poder e cards.
export const TEMAS = {
  tentacao: { nome: "Tentação", cor: "#f2c84b", claro: "#fff2b0", brilho: "#ffd34d" }, // amarelo/dourado
  duvida:   { nome: "Dúvida",   cor: "#7cc8ff", claro: "#e3f5ff", brilho: "#5fb8ff" }, // azul claro
  mentira:  { nome: "Mentira",  cor: "#ff9a4d", claro: "#ffe0c4", brilho: "#ff8a2a" }, // laranja
  idolatria: { nome: "Idolatria", cor: "#c88cff", claro: "#f0e0ff", brilho: "#b06aff" }, // violeta
  orgulho:  { nome: "Orgulho",  cor: "#4fd1b8", claro: "#d8fff6", brilho: "#2fe0c0" }  // verde-água (humildade contra o orgulho)
};

// versículos dos Dez Mandamentos (mandamento: true): o poder é amarelo-ouro (no lugar da cor do tema) e o golpe vira o martelo
// dourado que voa girando (assets/img/martelo.webp). O tema (e a mentira que refuta) continua o do versículo
export const COR_MANDAMENTO = { cor: "#ffd23f", claro: "#fff6c8", brilho: "#ffc21a" };

// Abreviação dos livros para os cards compactos do HUD (deck fechado): "Tiago 4:7" → "Tg 4:7".
export const ABREV = { "Êxodo": "Êx", "Hebreus": "Hb", "Tiago": "Tg", "1 Coríntios": "1Co", "Isaías": "Is", "Salmos": "Sl", "1 Pedro": "1Pe", "Provérbios": "Pv" };
