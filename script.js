// Small progressive-enhancement helpers. The page works without JavaScript.
const links = document.querySelectorAll('.nav-links a');
const sections = [...document.querySelectorAll('main section[id]')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => observer.observe(section));

// Data Services trivia
const trivia = [
  {
    q: 'What is the main purpose of Data Services?',
    options: ['Enable data and analytics through services, solutions and tools', 'Replace every business system', 'Create only financial reports', 'Manage employee payroll'],
    answer: 0,
    fact: 'Data Services connects people, platforms, solutions and practices that enable data and analytics.'
  },
  {
    q: 'Which group builds the data foundation through pipelines, integration and transformation?',
    options: ['Metadata & Governance', 'Data Engineering', 'Finance', 'Data Visualization'],
    answer: 1,
    fact: 'Data Engineering builds and maintains the data foundation.'
  },
  {
    q: 'Which of these is a shared tool across the Data Engineering and Metadata & Governance view?',
    options: ['Snowflake', 'Informatica', 'Alation', 'Business Glossary'],
    answer: 0,
    fact: 'Snowflake is shown as part of the shared technical foundation, along with Python, SQL and Git.'
  },
  {
    q: 'Who provides business context and validates metadata?',
    options: ['Business stewards', 'Only the database', 'The reporting dashboard', 'The network team'],
    answer: 0,
    fact: 'Business stewards help validate and certify metadata and provide business context.'
  },
  {
    q: 'What is the role of AI-powered metadata curation?',
    options: ['Scale metadata curation while keeping human review', 'Replace all data owners', 'Delete old databases automatically', 'Build financial forecasts'],
    answer: 0,
    fact: 'AI can help scale curation, while human stewards review and validate the result.'
  },
  {
    q: 'Approximately how many columns were represented in the EDG data landscape snapshot?',
    options: ['1.5 million', '11.6 million', '56 thousand', '19 thousand'],
    answer: 1,
    fact: 'The presentation snapshot listed approximately 11.6 million columns across the data landscape.'
  }
];

const triviaRoot = document.querySelector('[data-trivia]');
if (triviaRoot) {
  let current = 0;
  let score = 0;
  let answered = false;
  const qEl = triviaRoot.querySelector('[data-question]');
  const optionsEl = triviaRoot.querySelector('[data-options]');
  const feedbackEl = triviaRoot.querySelector('[data-feedback]');
  const numberEl = triviaRoot.querySelector('[data-question-number]');
  const totalEl = triviaRoot.querySelector('[data-total]');
  const scoreEl = triviaRoot.querySelector('[data-score]');
  const nextBtn = triviaRoot.querySelector('[data-next]');
  totalEl.textContent = trivia.length;

  function renderQuestion() {
    answered = false;
    const item = trivia[current];
    numberEl.textContent = current + 1;
    qEl.textContent = item.q;
    feedbackEl.textContent = '';
    feedbackEl.className = 'trivia-feedback';
    nextBtn.disabled = true;
    nextBtn.textContent = current === trivia.length - 1 ? 'See result →' : 'Next question →';
    optionsEl.innerHTML = item.options.map((option, i) => `<button class="trivia-option" data-index="${i}">${option}</button>`).join('');
    optionsEl.querySelectorAll('.trivia-option').forEach(btn => btn.addEventListener('click', () => answer(Number(btn.dataset.index))));
  }

  function answer(index) {
    if (answered) return;
    answered = true;
    const item = trivia[current];
    const buttons = [...optionsEl.querySelectorAll('.trivia-option')];
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === item.answer) btn.classList.add('correct');
      if (i === index && i !== item.answer) btn.classList.add('incorrect');
    });
    if (index === item.answer) {
      score++;
      feedbackEl.textContent = 'Correct! ' + item.fact;
      feedbackEl.classList.add('correct');
    } else {
      feedbackEl.textContent = 'Not quite. ' + item.fact;
      feedbackEl.classList.add('incorrect');
    }
    scoreEl.textContent = `Score: ${score}`;
    nextBtn.disabled = false;
  }

  nextBtn.addEventListener('click', () => {
    if (current < trivia.length - 1) {
      current++;
      renderQuestion();
    } else {
      qEl.textContent = `You scored ${score} out of ${trivia.length}!`;
      optionsEl.innerHTML = `<p class="trivia-result">${score >= 5 ? 'Great job — you know the data ecosystem well.' : score >= 3 ? 'Nice work — there is more to discover behind the data.' : 'A good start — explore the sections above to learn more.'}</p>`;
      feedbackEl.textContent = 'Thanks for playing!';
      feedbackEl.className = 'trivia-feedback correct';
      nextBtn.disabled = true;
      nextBtn.style.display = 'none';
    }
  });

  renderQuestion();
}
