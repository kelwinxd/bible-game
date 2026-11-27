// ---------- Os monstros das arenas (a ficha de cada tema) ----------
export const INIMIGOS = {
  // chao: anda no chão e ataca corpo a corpo (passo = px/s); sem chao: flutua e cospe fogo;
  // mergulho: ave que paira no alto e mergulha no herói (sprite assets/sprites/enemy/ave-*.webp)
  tentacao: { nome: "Demônio da Tentação", vida: 70, dano: 10, tell: 0.55, cadencia: 1.5, chao: true, passo: 90, cor: "#6e0f12", sprite: "serpente" },
  duvida:   { nome: "Ave da Dúvida",       vida: 60, dano: 10, tell: 0.7,  cadencia: 2.2, cor: "#4a3426", sprite: "ave", mergulho: true },
  mentira:  { nome: "Demônio da Mentira",  vida: 60, dano: 8,  tell: 0.6,  cadencia: 1.8, chao: true, passo: 70, cor: "#9a1c1c", sprite: "serpente" }, // serpente: assets/sprites/enemy/serpente-*.webp
  idolatria: { nome: "Demônio da Idolatria", vida: 60, dano: 8, tell: 0.6,  cadencia: 1.8, chao: true, passo: 70, cor: "#7a1c4a", sprite: "serpente" },
  // leão (Babilônia, Daniel 6): fala de força e orgulho; salto = px que ele avança no bote
  orgulho: { nome: "Leão do Orgulho", vida: 70, dano: 12, tell: 0.5, cadencia: 1.6, chao: true, passo: 120, cor: "#8a5a12", sprite: "leao", salto: 80 }
};
