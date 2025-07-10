document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById('theme-toggle');
  const aboutBtn = document.getElementById('about-toggle');
  const aboutBox = document.getElementById('about-text');
  const ageSpan = document.getElementById("age");

  // Theme toggle
  function updateThemeIcon() {
    toggleButton.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('light');
      updateThemeIcon();
    });

    updateThemeIcon(); // Run once on load
  }

  // About toggle
  if (aboutBtn && aboutBox) {
    aboutBtn.addEventListener('click', () => {
      aboutBox.classList.toggle('show');
    });
  }

  // Dynamic Age
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

  // Emoji pop-out and fall effect on hover, only one at a time
  let emojiActive = false;

  document.querySelectorAll('.emoji-hover').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (emojiActive) return; // Skip if an emoji is already active

      emojiActive = true;

      const emoji = el.dataset.emoji || '✨';

      // Create emoji element
      const span = document.createElement('span');
      span.textContent = emoji;
      span.className = 'falling-emoji';

      // Position it above the hovered word (centered)
      const rect = el.getBoundingClientRect();
      span.style.left = `${rect.left + rect.width / 2}px`;
      span.style.top = `${rect.top - 30}px`;

      document.body.appendChild(span);

      // Remove element after animation ends and reset flag
      span.addEventListener('animationend', () => {
        span.remove();
        emojiActive = false;
      });
    });
  });
});
