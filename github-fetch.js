// GITHUB FETCHING LOGIC
async function fetchGitHubProjects() {
    const username = 'yuw1xx';
    const container = document.getElementById('github-projects');

    try {
        // Fetches your top 2 most recently updated public repositories
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=2`);
        const repos = await response.json();

        container.innerHTML = ''; // Clear loading text

        repos.forEach(repo => {
            const projectHTML = `
            <a href="${repo.html_url}" target="_blank" class="project-mini">
            <span class="project-icon">📂</span>
            <div class="project-info">
            <h4>${repo.name}</h4>
            <p>${repo.description || 'View on GitHub'}</p>
            </div>
            </a>
            `;
            container.insertAdjacentHTML('beforeend', projectHTML);
        });
    } catch (error) {
        container.innerHTML = '<div class="loading-text">GitHub offline.</div>';
    }
}

document.addEventListener('DOMContentLoaded', fetchGitHubProjects);

// OVERLAY TOGGLE
const openBtn = document.getElementById('open-journey');
const closeBtn = document.getElementById('close-overlay');
const overlay = document.getElementById('journey-overlay');

openBtn.addEventListener('click', () => overlay.classList.remove('hidden'));
closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));

// Close overlay if user clicks the blurred background
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.add('hidden');
});
