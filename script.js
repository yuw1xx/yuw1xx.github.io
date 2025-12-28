// --- GITHUB FETCHING LOGIC ---
async function fetchGitHubProjects() {
    const username = 'yuw1xx';
    const container = document.getElementById('github-projects');

    // Safety Check: Only run if container exists
    if (!container) return;

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
            </a>`;
            container.insertAdjacentHTML('beforeend', projectHTML);
        });
        
        // Re-initialize hover for the new dynamic projects
        initCursorHover();
    } catch (error) {
        container.innerHTML = '<div class="loading-text">GitHub offline.</div>';
    }
}

document.addEventListener('DOMContentLoaded', fetchGitHubProjects);

// --- OVERLAY TOGGLE (Safe for 404) ---
const openBtn = document.getElementById('open-journey');
const closeBtn = document.getElementById('close-overlay');
const overlay = document.getElementById('journey-overlay');
const rootElement = document.documentElement;

// Only add listeners if these elements actually exist
if (openBtn && overlay) {
    openBtn.addEventListener('click', () => {
        overlay.classList.remove('hidden');
        rootElement.classList.add('stop-scrolling');
    });
}

if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        rootElement.classList.remove('stop-scrolling');
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.add('hidden');
            rootElement.classList.remove('stop-scrolling');
        }
    });
}

// --- EMAIL DECRYPTION ---
const emailLink = document.querySelector('.email-btn');
if (emailLink) {
    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        const user = atob(emailLink.getAttribute('data-user'));
        const domain = atob(emailLink.getAttribute('data-domain'));
        const fullEmail = `${user}@${domain}`;
        window.location.href = `mailto:${fullEmail}`;
    });
}

// --- CUSTOM CURSOR LOGIC ---
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");

// Only run mouse logic if cursor divs exist
if (dot && outline) {
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

    window.addEventListener("mousedown", () => document.body.classList.add("cursor-clicking"));
    window.addEventListener("mouseup", () => document.body.classList.remove("cursor-clicking"));
}

// --- HOVER STATE LOGIC ---
function initCursorHover() {
    // Only proceed if cursor elements exist
    if (!dot || !outline) return;

    const clickables = document.querySelectorAll('a, button, .social-btn, .project-card, .project-mini, #open-journey');

    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    });
};

initCursorHover();
