/* script.js */
// Placeholder for any interactive functionality (e.g., dynamic content or navigation toggle)
// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const newsContainer = document.getElementById('news-container');
    const pagination = { currentPage: 1, totalPages: 5 }; // Example for pagination

    // Toggle Dark Mode
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // Pagination Buttons
    document.getElementById('prev-page').addEventListener('click', () => loadPage(--pagination.currentPage));
    document.getElementById('next-page').addEventListener('click', () => loadPage(++pagination.currentPage));

    function loadPage(page) {
        console.log(`Loading page ${page}`);
        // Update pagination info and enable/disable buttons
        pagination.currentPage = page;
        document.getElementById('page-info').textContent = `Page ${page} of ${pagination.totalPages}`;
        document.getElementById('prev-page').disabled = page === 1;
        document.getElementById('next-page').disabled = page === pagination.totalPages;

        // Fetch and render news for the page
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

    loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html'; // Redirect to the login page
    });

    signupBtn.addEventListener('click', () => {
        window.location.href = 'signup.html'; // Redirect to the sign-up page
    });

    // Dark Mode Toggle (existing functionality)
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
});