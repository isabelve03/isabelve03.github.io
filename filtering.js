function filterSkills(category) {
  const cards = document.querySelectorAll('.skill-card');

  cards.forEach(card => {
    card.classList.remove('show');
    card.style.display = 'none'; // Hide by default
  });

  setTimeout(() => {
    cards.forEach(card => {
      if (category === 'all' || card.classList.contains(category)) {
        card.style.display = 'block'; // Or 'flex' depending on layout
        // Force reflow to restart animation
        void card.offsetWidth;
        card.classList.add('show');
      }
    });
  }, 50); // Delay to allow previous styles to apply
}