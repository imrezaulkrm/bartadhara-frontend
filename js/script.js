/* script.js */
// Placeholder for any interactive functionality (e.g., dynamic content or navigation toggle)
// scripts.js


document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const categoryFilters = document.getElementById('category-filters');
    const userInfo = document.getElementById('user-info');
    const userPicture = document.getElementById('user-picture');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const authLinks = document.getElementById('auth-links');
    const logoutButton = document.getElementById('logout-btn');
    const datePicker = document.getElementById('date-picker');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageDisplay = document.getElementById('current-page');

    let newsData = [];
    let currentPage = 1;
    const itemsPerPage = 20;
    let selectedCategories = [];

    // Fetch user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        userPicture.src = user.picture || 'default-user.png';
        userInfo.style.display = 'flex';
        authLinks.style.display = 'none';
    } else {
        userInfo.style.display = 'none';
        authLinks.style.display = 'flex';
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('user');
            alert('You have been logged out successfully.');
            window.location.reload();
        });
    }

    // User picture click event to view user's profile
    if (userPicture) {
        userPicture.addEventListener('click', () => {
            // Redirect to the user profile page with user ID or username
            window.location.href = `user-profile.html?id=${user.id}`;
        });
    }

    // Load news data from server
    async function loadNews() {
        try {
            const response = await fetch('http://localhost:8080/news');
            if (!response.ok) throw new Error('Failed to fetch news');

            newsData = await response.json();
            // Sort news by date (newest first)
            newsData.sort((a, b) => new Date(b.date) - new Date(a.date));

            renderPage();
            renderCategoryFilters(newsData);
        } catch (error) {
            console.error('Error loading news:', error);
            newsContainer.innerHTML = '<p>Error loading news. Please try again later.</p>';
        }
    }

    // Render news items for the current page
    function renderPage() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageNews = newsData.slice(startIndex, endIndex);

        renderNews(pageNews);

        // Update pagination buttons
        currentPageDisplay.textContent = `Page ${currentPage}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = endIndex >= newsData.length;
    }

    // Render news items
    function renderNews(filteredNews) {
        newsContainer.innerHTML = '';

        if (filteredNews.length === 0) {
            newsContainer.innerHTML = '<p>No news available for the selected filters.</p>';
            return;
        }

        filteredNews.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            newsItem.innerHTML = `
                <img src="${news.image}" alt="${news.title}" onerror="this.onerror=null; this.src='fallback-image.jpg';">
                <h2>${news.title}</h2>
                <p class="description">${news.description}</p>
                <button class="see-more" data-id="${news.id}">See more</button>
                <div class="news-footer">
                    <span>${news.date}</span>
                    <span>${news.category}</span>
                </div>
            `;

            newsContainer.appendChild(newsItem);
        });

        document.querySelectorAll('.see-more').forEach(button => {
            button.addEventListener('click', () => {
                const newsID = button.getAttribute('data-id');
                viewNewsDetails(newsID);
            });
        });
    }

    // Apply date and category filters
    function applyFilters() {
        let filteredNews = newsData;

        const selectedDate = datePicker.value;
        if (selectedDate) {
            const selectedDateObj = new Date(selectedDate);
            filteredNews = filteredNews.filter(news => {
                const newsDate = new Date(news.date);
                return newsDate.toDateString() === selectedDateObj.toDateString();
            });
        }

        if (selectedCategories.length > 0) {
            filteredNews = filteredNews.filter(news => selectedCategories.includes(news.category));
        }

        renderNews(filteredNews.slice(0, itemsPerPage)); // Apply filters and render first page
    }

    // Handle date selection
    datePicker.addEventListener('change', applyFilters);

    // Render category filters
    function renderCategoryFilters(newsData) {
        const categories = [...new Set(newsData.map(news => news.category))];
        categoryFilters.innerHTML = '';

        categories.forEach(category => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="checkbox" value="${category}"> ${category}
            `;
            categoryFilters.appendChild(label);
        });

        categoryFilters.addEventListener('change', () => {
            selectedCategories = Array.from(
                categoryFilters.querySelectorAll('input[type="checkbox"]:checked')
            ).map(checkbox => checkbox.value);

            applyFilters();
        });
    }

    // Navigate to news details page
    function viewNewsDetails(newsID) {
        console.log(`Navigating to news details with ID: ${newsID}`);
        window.location.href = `news-details.html?id=${newsID}`;
    }

    // Pagination button event listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const maxPages = Math.ceil(newsData.length / itemsPerPage);
        if (currentPage < maxPages) {
            currentPage++;
            renderPage();
        }
    });

    // Dark mode toggle
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.innerHTML = document.body.classList.contains('dark-mode')
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    });

    // Initial load
    loadNews();
});