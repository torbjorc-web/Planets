// Page entry point. Moon card rendering and facts are kept in this page module.
const moonDataUrl = new URL('../../data/moons.json', import.meta.url);
const moonCards = document.querySelectorAll('.moon-card[data-planet]');

try {
  const response = await fetch(moonDataUrl);
  if (!response.ok) throw new Error(`Could not load moon data (${response.status})`);
  const facts = await response.json();
  moonCards.forEach((card) => {
    const fact = facts[card.dataset.planet];
    if (!fact) return;
    const article = document.createElement('article');
    article.className = card.className;
    article.dataset.planet = card.dataset.planet;
    while (card.firstChild) article.append(card.firstChild);
    card.replaceWith(article);
    const description = article.querySelector('small');
    if (description) description.textContent = fact.description;
    const source = document.createElement('a');
    source.href = fact.source;
    source.target = '_blank';
    source.rel = 'noreferrer';
    source.textContent = 'NASA-fakta ↗';
    source.style.gridColumn = '2';
    source.style.fontSize = '11px';
    source.style.color = 'var(--accent)';
    source.style.marginTop = '4px';
    article.append(source);
  });
} catch (error) {
  console.error('Månedata kunne ikke lastes:', error);
}
