const pagePaths = ['/', '/solsystem', '/maaner', '/melkeveien'];
const answerList = document.querySelector('#answer-list');
const questionTitle = document.querySelector('#question-title');
const questionMeta = document.querySelector('#question-meta');
const feedback = document.querySelector('#answer-feedback');
const nextButton = document.querySelector('#next-question');
const sourceNote = document.querySelector('#source-note');
const scores = {
  correct: document.querySelector('#score-correct'),
  answered: document.querySelector('#score-answered'),
  streak: document.querySelector('#score-streak'),
  progress: document.querySelector('#progress-bar')
};

const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

async function readPage(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Kunne ikke lese ${path}`);
  return new DOMParser().parseFromString(await response.text(), 'text/html');
}

function makeQuestion(prompt, correct, pool, explanation, source, category) {
  const distractors = shuffle(pool.filter((answer) => answer !== correct)).slice(0, 3);
  if (!correct || distractors.length < 2) return null;
  return { prompt, correct, answers: shuffle([correct, ...distractors]), explanation, source, category };
}

function createQuestions([info, orbit, moonPage, galaxy]) {
  const questions = [];
  const planetRows = [...info.querySelectorAll('tbody tr')]
    .filter((row) => !row.className.includes('summary') && !row.className.includes('sun'))
    .map((row) => ({ name: row.cells[0]?.textContent.trim(), ratio: row.cells[2]?.textContent.trim() }))
    .filter((planet) => planet.name && planet.ratio);
  const planetNames = planetRows.map((planet) => planet.name);
  planetRows.forEach(({ name, ratio }) => {
    const question = makeQuestion(
      `Hvilken planet har et volum på omtrent ${ratio} ganger Jordens volum?`,
      name, planetNames,
      `${name} er oppført med ${ratio} ganger Jordens volum.`, '/', 'Planeter'
    );
    if (question) questions.push(question);
  });

  const moonFactsPromise = fetch('/static/data/moons.json').then((response) => {
    if (!response.ok) throw new Error('Kunne ikke lese månedata');
    return response.json();
  });
  return moonFactsPromise.then((moonFacts) => {
    const moonNames = [...moonPage.querySelectorAll('.moon-card b')].map((item) => item.textContent.trim());
    [...moonPage.querySelectorAll('.moon-groups section')].forEach((section) => {
      const planet = section.querySelector('h2')?.textContent.trim();
      section.querySelectorAll('.moon-card').forEach((card) => {
        const key = card.dataset.planet;
        const fact = moonFacts[key];
        const name = card.querySelector('b')?.textContent.trim() || fact?.name;
        if (!name || !planet || !fact) return;
        const association = makeQuestion(
          `Rundt hvilken planet går ${name} i bane?`, planet,
          [...new Set(Object.values(moonFacts).map((item) => item.planet))],
          `${name} går i bane rundt ${planet}.`, '/maaner', 'Måner'
        );
        if (association) questions.push(association);

        const description = fact.description;
        const clue = description.split(/[.;]/)[0].trim();
        const byDescription = makeQuestion(
          `Hvilken måne passer til denne beskrivelsen: «${clue}»?`, name, moonNames,
          description, '/maaner', 'Måner'
        );
        if (byDescription) questions.push(byDescription);
      });
    });

    const planetCount = orbit.querySelectorAll('.orbit-object.planet-body').length;
    if (planetCount) {
      const q = makeQuestion(
        'Hvor mange planeter er med i den animerte solsystemmodellen?', String(planetCount),
        [String(planetCount), '7', '9', '10'],
        `Modellen viser ${planetCount} planeter.`, '/solsystem', 'Solsystemet'
      );
      if (q) questions.push(q);
    }

    const galaxyText = galaxy.body.textContent.replace(/\s+/g, ' ');
    const galaxyType = galaxyText.match(/Melkeveien er en ([^,.]+)/i)?.[1]?.trim();
    if (galaxyType) {
      const q = makeQuestion(
        'Hvilken type galakse er Melkeveien?', galaxyType,
        [galaxyType, 'elliptisk galakse', 'uregelmessig galakse', 'dverggalakse'],
        `Melkeveien er en ${galaxyType}.`, '/melkeveien', 'Melkeveien'
      );
      if (q) questions.push(q);
    }
    if (/Orion-armen/i.test(galaxyText)) {
      const q = makeQuestion(
        'I hvilken spiralarm ligger solsystemet?', 'Orion-armen',
        ['Orion-armen', 'Perseus-armen', 'Norma-armen', 'Scutum–Centaurus-armen'],
        'Solsystemet ligger i den mindre Orion-armen.', '/melkeveien', 'Melkeveien'
      );
      if (q) questions.push(q);
    }
    return questions;
  });
}

let deck = [];
let questions = [];
let round = 0;
let correctCount = 0;
let answeredCount = 0;
let streak = 0;
let activeQuestion;
let selectedAnswer = false;

function drawQuestion() {
  if (deck.length === 0) {
    deck = shuffle(questions);
    if (deck.length > 1 && deck.at(-1) === activeQuestion) deck.unshift(deck.pop());
    round += 1;
  }
  activeQuestion = deck.pop();
  selectedAnswer = false;
  questionTitle.textContent = activeQuestion.prompt;
  questionMeta.textContent = `Runde ${round} · ${deck.length + 1} spørsmål igjen i denne bunken · ${activeQuestion.category}`;
  feedback.textContent = '';
  feedback.className = 'answer-feedback';
  sourceNote.textContent = '';
  answerList.replaceChildren(...activeQuestion.answers.map((answer) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-option';
    button.textContent = answer;
    button.addEventListener('click', () => chooseAnswer(button, answer));
    return button;
  }));
  nextButton.disabled = true;
  scores.progress.style.width = `${Math.min(100, (answeredCount % 10) * 10)}%`;
}

function chooseAnswer(button, answer) {
  if (selectedAnswer) return;
  selectedAnswer = true;
  answeredCount += 1;
  const isCorrect = answer === activeQuestion.correct;
  if (isCorrect) { correctCount += 1; streak += 1; }
  else streak = 0;
  answerList.querySelectorAll('button').forEach((option) => {
    option.disabled = true;
    if (option.textContent === activeQuestion.correct) option.classList.add('correct');
  });
  if (!isCorrect) button.classList.add('incorrect');
  feedback.textContent = `${isCorrect ? 'Riktig!' : 'Ikke helt.'} ${activeQuestion.explanation}`;
  feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
  sourceNote.innerHTML = `Kilde: <a href="${activeQuestion.source}">åpne siden</a>`;
  scores.correct.textContent = correctCount;
  scores.answered.textContent = answeredCount;
  scores.streak.textContent = streak;
  scores.progress.style.width = `${(answeredCount % 10) * 10}%`;
  nextButton.disabled = false;
  nextButton.focus();
}

nextButton.addEventListener('click', drawQuestion);

try {
  const pages = await Promise.all(pagePaths.map(readPage));
  questions = await createQuestions(pages);
  if (questions.length < 4) throw new Error('Ikke nok tilgjengelige spørsmål ennå.');
  questionMeta.textContent = `${questions.length} spørsmål hentet fra nettsidens egne sider.`;
  drawQuestion();
} catch (error) {
  console.error(error);
  questionTitle.textContent = 'Spørsmålene kunne ikke lastes';
  questionMeta.textContent = 'Kontroller at Flask-serveren kjører, og prøv å laste siden på nytt.';
}
