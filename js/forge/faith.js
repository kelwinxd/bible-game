import { sfx } from '../core/audio.js';
import { dashDmg, prog, setShieldMax, setSpiritLvl, shieldMax, spiritLvl } from '../core/progress.js';
import { $, D, shuffle } from '../core/utils.js';
import { show } from '../ui/screens.js';
import { burst } from '../ui/sparks.js';

// ---------- Exercitar a fé (quiz Hebreus 11) ----------
// A mesma tela serve às duas sessões: 'fe' (Hebreus 11 → escudo) e 'espirito' (Espírito Santo → Impulso)
export let quiz = null, quizKind = 'fe';
export const QUIZ = {
  fe: {
    d: () => D.fe, cor: '#9fc3ff', titulo: '🛡 Fé fortalecida', releia: 'Releia Hebreus 11 e tente de novo.',
    info: () => `Escudo atual: <b>${shieldMax}s</b> (máx. ${D.fe.escudoMax}s)`,
    intro: () => `Os heróis de Hebreus 11 creram antes de ver. Responda ${D.fe.perguntasPorQuiz} perguntas sobre eles; errando no máximo ${D.fe.errosPermitidos}, seu escudo dura +${D.fe.ganho}s.`,
    ganhar: () => { const b = shieldMax; setShieldMax(shieldMax + D.fe.ganho);
      return shieldMax > b ? `Sua fé foi fortalecida: o escudo agora dura <b>${shieldMax}s</b>.` : `O escudo já está no máximo (${shieldMax}s).`; }
  },
  espirito: {
    d: () => D.espirito, cor: '#7fd8ff', titulo: '💨 Cheio do Espírito', releia: 'Releia Atos 1 e 2 e tente de novo.',
    info: () => `Impulso do Espírito: dano <b>${dashDmg()}</b> (máx. ${D.espirito.danoBase + D.espirito.nivelMax * D.espirito.ganho})`,
    intro: () => `Sobre o Espírito Santo: o Consolador, o Pentecostes, o fruto do Espírito. Responda ${D.espirito.perguntasPorQuiz} perguntas; errando no máximo ${D.espirito.errosPermitidos}, o <b>Impulso do Espírito</b> causa +${D.espirito.ganho} de dano.`,
    ganhar: () => { const b = spiritLvl; setSpiritLvl(spiritLvl + 1);
      return spiritLvl > b ? `Você foi fortalecido pelo Espírito: o Impulso agora causa <b>${dashDmg()}</b> de dano.` : `O Impulso já está no máximo (${dashDmg()} de dano).`; }
  }
};
export function openFaith(kind = 'fe') {
  quizKind = kind; const Q = QUIZ[kind], d = Q.d();
  show('faith'); quiz = null;
  $('faithShield').innerHTML = Q.info();
  $('faithBody').innerHTML = d.versiculos.map(v => `<div class="scroll" style="margin-bottom:12px"><div class="ref">${v.ref}</div>${v.texto}</div>`).join('') +
    `<p class="muted">${Q.intro()}</p>
     <button class="primary" onclick="startQuiz()">Começar o quiz</button>`;
}
export function startQuiz() {
  const d = QUIZ[quizKind].d();
  quiz = { qs: shuffle(d.perguntas).slice(0, d.perguntasPorQuiz), i: 0, errors: 0, results: [], answered: false };
  renderQuiz();
}
export function renderQuiz() {
  const q = quiz.qs[quiz.i];
  const prog = quiz.qs.map((_, k) => `<span style="${k === quiz.i ? 'border-color:var(--ember)' : ''}">${quiz.results[k] === true ? '✓' : quiz.results[k] === false ? '✗' : k + 1}</span>`).join('');
  $('faithBody').innerHTML = `<div class="qprog">${prog}</div>
    <div class="scroll"><div class="ref">Pergunta ${quiz.i + 1} de ${quiz.qs.length}</div>${q.p}</div>
    <div class="quiz-opts">${shuffle([q.certa, ...q.erradas]).map(o => `<button data-o="${o}" onclick="answerQuiz(this)">${o}</button>`).join('')}</div>
    <div id="quizFeedback" class="muted" style="min-height:24px"></div>
    <div class="row"><button class="primary" id="quizNext" style="display:none" onclick="nextQuiz()">${quiz.i + 1 < quiz.qs.length ? 'Próxima →' : 'Ver resultado'}</button></div>`;
  quiz.answered = false;
}
export function answerQuiz(btn) {
  if (quiz.answered) return; quiz.answered = true;
  const q = quiz.qs[quiz.i], ok = btn.dataset.o === q.certa;
  quiz.results[quiz.i] = ok; if (!ok) quiz.errors++;
  document.querySelectorAll('.quiz-opts button').forEach(b => {
    if (b.dataset.o === q.certa) { b.classList.add('ok'); b.textContent = '✓ ' + b.textContent; }
    else if (b === btn) { b.classList.add('bad'); b.textContent = '✗ ' + b.textContent; }
    else b.disabled = true;
  });
  sfx(ok ? 'hit' : 'miss');
  $('quizFeedback').innerHTML = `${ok ? '<b>Certo!</b>' : `<b>Não.</b> A resposta é <b>${q.certa}</b>.`} (${q.ref})`;
  $('quizNext').style.display = '';
}
export function nextQuiz() {
  quiz.i++;
  if (quiz.i < quiz.qs.length) return renderQuiz();
  const Q = QUIZ[quizKind], d = Q.d(), passed = quiz.errors <= d.errosPermitidos;
  const acertos = quiz.qs.length - quiz.errors;
  const msg = !passed ? `Você acertou ${acertos} de ${quiz.qs.length}. Precisa errar no máximo ${d.errosPermitidos}. ${Q.releia}`
    : `Você acertou ${acertos} de ${quiz.qs.length}! ${Q.ganhar()}`;
  $('faithShield').innerHTML = Q.info();
  $('faithBody').innerHTML = `<div class="scroll" style="text-align:center"><div class="ref">${passed ? Q.titulo : 'Continue firme'}</div>${msg}</div>
    <div class="row" style="margin-top:14px"><button onclick="startQuiz()">Fazer outro quiz</button><button class="primary" onclick="habView('fe')">Voltar</button></div>`;
  if (passed) { const r = $('faithBody').getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 40, 40, QUIZ[quizKind].cor); }
}
