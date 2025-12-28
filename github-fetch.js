// GITHUB FETCHING LOGIC
async function fetchGitHubProjects() {
    const username = 'yuw1xx';
    const container = document.getElementById('github-projects');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=2`);
        const repos = await response.json();

        container.innerHTML = '';

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
const rootElement = document.documentElement;

openBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    rootElement.classList.add('stop-scrolling');
});

const closeModal = () => {
    overlay.classList.add('hidden');
    rootElement.classList.remove('stop-scrolling');
};

closeBtn.addEventListener('click', closeModal);

// Close on background click
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});

// Email decryption logic
const emailLink = document.querySelector('.email-btn');

if (emailLink) {
    emailLink.addEventListener('click', (e) => {
        // Prevents the browser from jumping to the top of the page
        e.preventDefault();

        // Decode the hidden attributes
        const user = atob(emailLink.getAttribute('data-user'));
        const domain = atob(emailLink.getAttribute('data-domain'));
        const fullEmail = `${user}@${domain}`;

        // Trigger the mail application
        window.location.href = `mailto:${fullEmail}`;
    });
}
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.add('hidden');
});

// --- CUSTOM CURSOR LOGIC ---
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;

    outline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// --- HOVER STATE LOGIC ---
const initCursorHover = () => {
    const clickables = document.querySelectorAll('a, button, .social-btn, .project-card, #open-journey');

    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-active');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-active');
        });
    });
};

// Call it immediately for static buttons
initCursorHover();
