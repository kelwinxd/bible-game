// O chefão do mar: os números, e as PELES (data.js → chefe.pele): mesma luta, muda a arte, os textos e alguns jeitos de lutar
import { GROUND } from '../../../config.js';
import { SPRITES } from './leviata.sprites.js';

export const MAR = {
  vida: 50,
  surge: 1.4,              // s subindo da água
  velocidade: 75,          // px/s nadando atrás do herói
  alcance: 300,            // px: perto assim, dá o bote
  cd: 2,
  agua: 60,                // px: a base do corpo fica dentro da água (o corte de baixo da arte nunca aparece)
  margem: 110,             // px das bordas do mar que ele não passa
  mergulhaACada: 3,        // a cada N ataques, mergulha
  rasACada: 5,             // s entre uma rã e outra caindo na jangada (Naja)
  maxRasNaJangada: 6
};
export const BOTE = { T: 1.2, acerta: [.55, .8], dano: 15, caixa: [40, 300, 110, 300] }; // caixa: px à frente (de, até), altura (de, até)
export const ACIDO = { T: 1.3, cospe: .8, dano: 12, voo: .75, alcance: 650 };             // da metade da vida para baixo
export const MERGULHO = { desce: .9, embaixo: 1.8 };                                     // some e reaparece perto do herói
export const DISTANTE = { vem: 300, volta: 240, bote: 190 };                              // Naja: vem rápido para o bote e recua

// as peles: sc = escala, dir = −1 se a arte olha para a esquerda, boca = de onde sai o ácido (px na arte a partir de ax/foot)
//  mentiras = tipo das mentiras (data.js); distancia = fica a N px do herói e só chega perto para o bote; ras = rãs na jangada a cada
//  1/6 da vida; jato = o ácido é o próprio sprite (caixa em px da arte; quadros que ferem); lieY = base do balão
export const PELES = {
  leviata: { nome: 'Leviatã', titulo: 'o monstro do mar', furia: 'O Leviatã está furioso!', morte: 'Leviatã derrotado!',
    sc: 1.45, dir: -1, boca: [181, 124], arte: SPRITES.leviata },
  naja: { nome: 'Naja', titulo: 'a serpente do mar', furia: 'A Naja está furiosa!', morte: 'A Naja foi derrotada!',
    mentiras: 'naja', lieY: GROUND - 305, distancia: 380, ras: 5, sc: 1.25, dir: 1, boca: [249, 138],
    jato: { x: [235, 400], y: [108, 188], fr: [3, 5] }, arte: SPRITES.naja }
};
