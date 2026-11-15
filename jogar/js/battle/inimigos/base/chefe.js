// ---------- Chefe: a classe-base (o contrato) de todo chefão ----------
// JavaScript não tem interface: o contrato é esta classe. Cada chefão HERDA dela e implementa os métodos marcados como
// "contrato" (os que lançam erro aqui). O resto (vida, dano, morte, mentiras, barra de vida, balão) já vem pronto e é igual
// para todos — quem precisar de algo diferente sobrescreve só aquele método ou um dos "ganchos" (aoSofrer, aoMorrer…).
//
// Ciclo de vida (state):  'hidden' → (deveSurgir) → surgir() → … a luta (agir) … → morrer() → 'dead' → morto(dt)
//
// Contrato (obrigatório):
//   get nome()            nome na barra de vida ("Golias · o gigante de Gate")
//   caixa()               [x0, y0, x1, y1] do corpo que leva golpe
//   deveSurgir(h)         true quando o herói chegou perto e a luta começa
//   agir(h, dt)           a luta: andar, escolher e executar os ataques
//   desenhar()            o desenho na frente do cenário
// Ganchos (opcionais): surgir(), morto(dt), aoSofrer(), aoMorrer(), desenharAtras(), desenharNoMar(mar),
//   get avisoMorte, get imortalNoBestiario, get lieY, falando()
import { sfx } from '../../../core/audio.js';
import { D } from '../../../core/utils.js';
import { GROUND, ctx } from '../../config.js';
import { tema } from '../../hud.js';
import { B } from '../../state.js';
import { darXp } from '../../xp.js';

const naoImplementado = (classe, metodo) => { throw new Error(`${classe}.${metodo}() não implementado (contrato de Chefe)`); };
const ESTADOS_INVULNERAVEIS = ['hidden', 'dead', 'mergulho', 'submerso']; // escondido, morto ou embaixo d'água: não leva golpe
const ESTADOS_SEM_FALA = ['hidden', 'dead', 'mergulho', 'submerso', 'surge', 'enter', 'aproximar', 'recuar']; // o balão da mentira some

export class Chefe {
  /**
   * @param {object} e        o evento do data.js ({ tipo, x, vida, pele, … })
   * @param {object} op       kind ('gigante' = em terra, 'leviata' = no mar), vida padrão, tipo das mentiras (data.js → mentiras[].tipo)
   */
  constructor(e, { kind, vida = 60, mentiras = null, mentirEm = 5 } = {}) {
    const lies = mentiras ? D.mentiras.filter(m => m.tipo === mentiras) : [];
    Object.assign(this, {
      kind, x: e.x, home: e.x, face: -1, hp: e.vida || vida, maxHp: e.vida || vida,
      state: 'hidden', t: 0, cd: 1, flash: 0, hit: false, sink: 0, atks: 0, bolas: [],
      // mentiras: uma por vez; cada uma é refutada por um versículo (data.js → ideal); quando o poder acaba, troca de mentira
      lies, li: 0, lie: null, lieIn: lies.length ? mentirEm : 0, vuln: false, lastVerse: null, lieFlash: 0
    });
  }

  // ----- contrato -----
  get nome() { return naoImplementado(this.constructor.name, 'nome'); }
  caixa() { return naoImplementado(this.constructor.name, 'caixa'); }
  deveSurgir(h) { return naoImplementado(this.constructor.name, 'deveSurgir'); }
  agir(h, dt) { return naoImplementado(this.constructor.name, 'agir'); }
  desenhar() { return naoImplementado(this.constructor.name, 'desenhar'); }

  // ----- ganchos (padrões) -----
  surgir() { this.state = 'surge'; this.t = 0; }
  morto(dt) { this.sink = Math.min(1, this.sink + dt / 1.4); } // afunda/some aos poucos
  aoSofrer() {}
  aoMorrer() {}
  desenharAtras() {} // antes do chão (a estátua, que fica atrás do piso)
  desenharNoMar() {} // dentro do mar, atrás das ondas (o chefão do mar)
  get avisoMorte() { return { lines: [`${this.nome.split(' · ')[0]} caiu!`], t: 4, c: '#f2c84b' }; }
  get imortalNoBestiario() { return true; } // no Bestiário a vida volta cheia (quem tem cena de morte desliga)
  get lieY() { return GROUND - 285; }       // base do balão da mentira
  get corBarra() { return '#b3261e'; }
  get textoBarra() { return this.nome; }

  // ----- estado -----
  vulneravel() { return !ESTADOS_INVULNERAVEIS.includes(this.state); }
  lutando() { return this.state !== 'hidden' && this.state !== 'dead'; }
  falando() { return !!this.lie && !ESTADOS_SEM_FALA.includes(this.state); }

  // ----- ciclo (chamado todo quadro) -----
  atualizar(dt) {
    const h = B.hero;
    this.flash = Math.max(0, this.flash - dt); this.t += dt;
    if (this.state === 'hidden') { if (this.deveSurgir(h)) this.surgir(); return; }
    if (this.state === 'dead') return this.morto(dt);
    if (!this.lie && this.lieIn > 0 && (this.lieIn -= dt) <= 0 && this.lies.length) { this.lie = this.lies[0]; this.lieFlash = .3; } // chega calado, depois mente
    this.agir(h, dt);
  }
  /** fim de um ataque: volta a andar e espera cd segundos */
  terminarAtaque(cd) { this.state = 'walk'; this.t = 0; this.cd = cd; this.atks++; }
  /** começa um estado (ataque) zerando o tempo e os marcadores de acerto */
  iniciar(estado) { this.state = estado; this.t = 0; this.hit = false; this.tiros = 0; }

  // ----- ataques -----
  // Cada chefão registra os seus ataques em this.ataques: { nomeDoEstado: ataque }. Um ataque é um objeto (no arquivo
  // <chefe>.attacks.js) com: estado (o nome, que também é o state enquanto ele acontece), cd (espera depois, s; opcional),
  // contaNaSequencia (false = não avança a sequência; opcional) e atualizar(chefe, h, dt) → true quando terminou.
  get ataqueAtual() { return this.ataques && this.ataques[this.state]; }
  /** roda o ataque em andamento; quando ele termina, volta a andar */
  executarAtaque(h, dt, cdPadrao) {
    const a = this.ataqueAtual; if (!a || !a.atualizar(this, h, dt)) return;
    if (a.contaNaSequencia === false) { this.state = 'walk'; this.t = 0; this.cd = a.cd ?? cdPadrao; }
    else this.terminarAtaque(a.cd ?? cdPadrao);
  }

  // ----- mentiras -----
  proximaMentira() { if (!this.lies.length) return; this.li = (this.li + 1) % this.lies.length; this.lie = this.lies[this.li]; this.vuln = false; this.lieFlash = .3; }

  // ----- dano e morte (iguais para todos) -----
  sofrer(dano, cor = '#bbb') {
    if (!this.vulneravel()) return;
    this.hp -= dano; this.flash = .15;
    this.aoSofrer();
    const topo = this.caixa()[1];
    B.floats.push({ x: this.x, y: topo - 10, t: .8, s: dano.toFixed(dano % 1 ? 1 : 0), c: cor });
    if (B.fase.dev && this.hp <= 0 && this.imortalNoBestiario) { // Bestiário: imortal
      this.hp = this.maxHp; B.floats.push({ x: this.x, y: topo - 45, t: 1, s: 'imortal · vida cheia', c: '#9fe4ff' }); return;
    }
    if (this.hp <= 0) { this.hp = 0; this.morrer(); }
  }
  morrer() {
    this.state = 'dead'; this.t = 0; this.sink = 0; B.shake = .5; this.bolas = [];
    darXp('grande', this.x, this.caixa()[1]);
    this.aoMorrer();
    const aviso = this.avisoMorte; if (aviso) B.notice = aviso;
    sfx('refute');
  }

  // ----- desenho comum -----
  /** barra de vida no topo da tela durante a luta */
  desenharBarra(bar) {
    if (!this.lutando()) return;
    const k = this.state === 'surge' && this.atks === 0 ? Math.min(1, this.t / 1.4) : 1;
    ctx.save(); ctx.globalAlpha = k;
    ctx.fillStyle = '#000a'; ctx.fillRect(230, 58, 500, 40);
    ctx.fillStyle = this.fase2 ? '#c8ff8a' : '#ffb4a8'; ctx.font = '800 15px Cinzel, serif'; ctx.textAlign = 'center';
    ctx.fillText(this.textoBarra, 480, 73);
    bar(250, 79, 460, 12, this.hp / this.maxHp, this.corBarra, '');
    ctx.restore();
  }
  /** o balão da mentira: escuro, borda dourada grossa, caixa alta; refutado, borda e brilho na cor do versículo */
  desenharMentira() {
    if (!this.falando()) return;
    this.lieFlash = Math.max(0, this.lieFlash - 1 / 60);
    ctx.save(); ctx.globalAlpha = 1 - this.lieFlash / .3;
    ctx.font = '800 19px Cinzel, Georgia, serif';
    const words = this.lie.texto.toUpperCase().split(' '), lines = []; let ln = '';
    words.forEach(w => { if (ctx.measureText(ln + ' ' + w).width > 400 && ln) { lines.push(ln); ln = w; } else ln = ln ? ln + ' ' + w : w; });
    lines.push(ln);
    const bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 40, bh = lines.length * 26 + 20;
    const cx = Math.min(B.cam + 960 - bw / 2 - 8, Math.max(B.cam + bw / 2 + 8, this.x)), y = this.lieY - bh;
    const tc = this.vuln && this.lastVerse && tema(this.lastVerse), pulse = .5 + .5 * Math.sin(B.time * 4);
    ctx.shadowColor = tc ? tc.brilho : '#ff3a1a'; ctx.shadowBlur = tc ? 22 : 10 + pulse * 10;
    const g = ctx.createLinearGradient(0, y, 0, y + bh); g.addColorStop(0, '#3a0a08'); g.addColorStop(1, '#160403');
    ctx.fillStyle = g; ctx.strokeStyle = tc ? tc.cor : '#d4a038'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.roundRect(cx - bw / 2, y, bw, bh, 6); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(this.x - 14, y + bh); ctx.lineTo(this.x, y + bh + 20); ctx.lineTo(this.x + 14, y + bh); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd98a';
    lines.forEach((l, i) => { const ty = y + 32 + i * 26; ctx.strokeText(l, cx, ty); ctx.fillText(l, cx, ty); });
    ctx.restore();
  }
}
