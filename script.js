const toggleButton = document.getElementById('theme-toggle');
const aboutBtn = document.getElementById('about-toggle');
const aboutBox = document.getElementById('about-text');

function updateThemeIcon() {
  toggleButton.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
}

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('light');
  updateThemeIcon();
});

updateThemeIcon(); // Run once on load

aboutBtn.addEventListener('click', () => {
  aboutBox.classList.toggle('show');
});