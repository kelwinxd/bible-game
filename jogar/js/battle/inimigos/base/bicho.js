// ---------- Bicho: a classe-base (o contrato) dos bichos soltos pela fase ----------
// Bichos não mentem nem têm balão: andam pela fase (fora das arenas), ferem por golpe ou por encostar, e morrem fácil.
// Cada um HERDA desta classe e implementa o contrato; vida, piscar, dano, morte (estouro de lascas + xp) já vêm prontos.
//
// Contrato (obrigatório):
//   caixa()            [x0, y0, x1, y1] do corpo (leva golpe e, nos que ferem por encostar, fere)
//   agir(h, dt)        o comportamento (andar, patrulhar, atacar)
//   desenhar()         o desenho (já sabe se está na tela: só é chamado se visível)
// Ganchos (opcionais): get cores (as 2 cores das lascas quando morre), aoMorrer()
import { sfx } from '../../../core/audio.js';
import { reduced } from '../../../core/utils.js';
import { GROUND } from '../../config.js';
import { heroBox, hitHero, overlap } from '../../combat.js';
import { B } from '../../state.js';
import { terrainTop } from '../../world.js';
import { relevo } from '../../draw/world.js';
import { darXp } from '../../xp.js';


const naoImplementado = (classe, metodo) => { throw new Error(`${classe}.${metodo}() não implementado (contrato de Bicho)`); };

export class Bicho {
  /** @param {object} e o evento do data/jornadas ({ tipo, x, bando? }); vida = pontos de vida */
  constructor(e, { vida }) {
    Object.assign(this, { kind: e.tipo, bando: e.bando, x: e.x, home: e.x, face: Math.random() < .5 ? -1 : 1,
      hp: vida, maxHp: vida, state: 'walk', t: 0, flash: 0, cd: 0, ph: Math.random() * 6, dead: false });
  }

  // ----- contrato -----
  caixa() { return naoImplementado(this.constructor.name, 'caixa'); }
  agir(h, dt) { return naoImplementado(this.constructor.name, 'agir'); }
  desenhar() { return naoImplementado(this.constructor.name, 'desenhar'); }

  // ----- ganchos -----
  get cores() { return ['120,160,50', '200,170,80']; }
  aoMorrer() {}

  // ----- ciclo -----
  atualizar(h, dt) { this.flash = Math.max(0, this.flash - dt); this.cd = Math.max(0, this.cd - dt); this.ph += dt; this.agir(h, dt); }
  visivel() { return this.x > B.cam - 120 && this.x < B.cam + 1080; }
  /** o chão embaixo dele (colisão) e o do desenho (acompanha o relevo da arte) */
  chao() { return terrainTop(this.x); }
  piso() { return GROUND + terrainTop(this.x) + relevo(this.x); }
  /** dá para pisar em x? (sem buraco nem parede mais alta que `degrau` px) */
  podePisar(x, degrau = 30) { return terrainTop(x) !== Infinity && terrainTop(x) >= terrainTop(this.x) - degrau; }
  /** encostar fere (o escudo e o impulso protegem): uma vez a cada `intervalo` s */
  ferirAoEncostar(h, dano, intervalo = 1) { if (this.cd <= 0 && overlap(this.caixa(), heroBox(h))) { this.cd = intervalo; hitHero(dano); } }

  // ----- dano e morte (iguais para todos) -----
  sofrer(dano, cor = '#bbb') {
    this.hp -= dano; this.flash = .12;
    const b = this.caixa();
    B.floats.push({ x: this.x, y: b[1] - 14, t: .7, s: dano.toFixed(dano % 1 ? 1 : 0), c: cor });
    if (this.hp > 0) return;
    if (B.fase && B.fase.dev) { this.hp = this.maxHp; return; } // Bestiário / Treinamento: imortal (a vida volta cheia)
    this.dead = true; sfx('slash'); darXp('pequeno', this.x, b[1]);
    const [c0, c1] = this.cores;
    for (let k = 0; k < (reduced ? 6 : 16); k++)
      B.shards.push({ x: this.x + (Math.random() - .5) * 50, y: b[1] + 30, vx: (Math.random() - .5) * 300, vy: -100 - Math.random() * 260, r: Math.random() * 6, t: .7, c: Math.random() < .5 ? c0 : c1, sz: .4 + Math.random() * .5 });
    this.aoMorrer();
  }
}
