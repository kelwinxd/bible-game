// ---------- Inimigos: o índice (importe tudo daqui) ----------
// O resto do jogo importa os inimigos SÓ por este arquivo:  import { Golias, criarMonstro, … } from './inimigos/index.js';
// Dentro da pasta inimigos/, os arquivos importam uns aos outros direto (não por aqui), para não criar importação circular.
//
//   base/      os contratos: Chefe, ChefeDeArena (chefões de terra), Monstro (os que mentem nas arenas), Bicho (soltos pela fase)
//   chefes/    um por pasta: <Nome>.js (a classe, que só coordena) + .config.js (números e textos) + .sprites.js (artes)
//              + .attacks.js (um objeto por ataque) + .draw.js (o desenho)
//   monstros/  Serpente, Leao, CobraVerde, Ave, Flutuante + a fábrica criarMonstro
//   bichos/    Ra, Patrulheiro (Lobo, Soldado, Piolhenta), Boi, Espantalho + a fábrica criarBicho e a chuva de rãs
//   efeitos.js o que todos usam (sprites, partículas, tremor, projéteis, ácido)

// contratos
export { Chefe } from './base/chefe.js';
export { ChefeDeArena } from './base/chefeDeArena.js';
export { Monstro } from './base/monstro.js';
export { Bicho } from './base/bicho.js';
// chefões
export { Golias } from './chefes/golias/Golias.js';
export { Nabucodonosor } from './chefes/nabucodonosor/Nabucodonosor.js';
export { Estatua } from './chefes/estatua/Estatua.js';
export { Farao } from './chefes/farao/Farao.js';
export { Leviata } from './chefes/leviata/Leviata.js';
export { PELES } from './chefes/leviata/leviata.config.js';
// monstros das arenas
export { Serpente, Leao, CobraVerde } from './monstros/serpente.js';
export { Ave } from './monstros/ave.js';
export { Flutuante } from './monstros/flutuante.js';
export { criarMonstro } from './monstros/index.js';
// bichos soltos
export { Ra, RA } from './bichos/ra.js';
export { Patrulheiro, Lobo, Soldado, Piolhenta } from './bichos/patrulheiro.js';
export { Boi } from './bichos/boi.js';
export { Espantalho } from './bichos/espantalho.js';
export { BICHOS, criarBicho, chuvaDeRas, rasNaJangada } from './bichos/index.js';
// efeitos usados fora daqui
export { spitAcid, updateAcid, drawAcid } from './efeitos.js';
