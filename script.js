document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById('theme-toggle');
  const aboutBtn = document.getElementById('about-toggle');
  const aboutBox = document.getElementById('about-text');
  const ageSpan = document.getElementById("age");

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
  } else if (savedTheme === 'dark') {
    document.body.classList.remove('light');
  }

  function updateThemeIcon() {
    toggleButton.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('light');
      updateThemeIcon();

      if (document.body.classList.contains('light')) {
        localStorage.setItem('theme', 'light');
      } else {
        localStorage.setItem('theme', 'dark');
      }
    });

    updateThemeIcon();
  }

  if (aboutBtn && aboutBox) {
    aboutBtn.addEventListener('click', () => {
      aboutBox.classList.toggle('show');
    });
  }

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
