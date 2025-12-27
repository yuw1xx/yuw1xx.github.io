document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById('theme-toggle');
  const aboutBtn = document.getElementById('about-toggle');
  const aboutBox = document.getElementById('about-text');
  const ageSpan = document.getElementById("age");

  // --- THEME PERSISTENCE ---

  // Load saved theme from localStorage (default to dark if nothing saved)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }

  // Update the toggle button icon
  function updateThemeIcon() {
    if (!toggleButton) return;
    toggleButton.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
  }

  // Setup toggle button click handler
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('light');

      // Save current theme to localStorage
      if (document.body.classList.contains('light')) {
        localStorage.setItem('theme', 'light');
      } else {
        localStorage.setItem('theme', 'dark');
      }

      updateThemeIcon();
    });

    // Initialize icon on page load
    updateThemeIcon();
  }

  // --- ABOUT TOGGLE ---
  if (aboutBtn && aboutBox) {
    aboutBtn.addEventListener('click', () => {
      aboutBox.classList.toggle('show');
    });
  }

  // --- DYNAMIC AGE ---
  if (ageSpan) {
    const birthday = new Date("2007-04-10");
    const today = new Date();

    let age = today.getFullYear() - birthday.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthday.getMonth() ||
      (today.getMonth() === birthday.getMonth() && today.getDate() >= birthday.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }

    ageSpan.textContent = age;
  } else {
    console.error("No element with ID 'age' found.");
  }

  // --- EMOJI POP-OUT & FALL EFFECT (ONE AT A TIME) ---
  let emojiActive = false;

  document.querySelectorAll('.emoji-hover').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (emojiActive) return;

      emojiActive = true;
      const emoji = el.dataset.emoji || '✨';

      const span = document.createElement('span');
      span.textContent = emoji;
      span.className = 'falling-emoji';

      const rect = el.getBoundingClientRect();
      span.style.left = `${rect.left + rect.width / 2}px`;
      span.style.top = `${rect.top - 30}px`;

      document.body.appendChild(span);

      span.addEventListener('animationend', () => {
        span.remove();
        emojiActive = false;
      });
    });
  });
});
