/* script.js */
// Placeholder for any interactive functionality (e.g., dynamic content or navigation toggle)
// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // Define constants for elements
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

    // Set the base URL for API and other resources
    const API_BASE_URL = 'http://192.168.49.2/api';

    // Set other relevant links
    const userProfilePage = 'user-profile.html';
    const newsDetailsPage = 'news-details.html';

    let newsData = [];
    let currentPage = 1;
    const itemsPerPage = 20;
    let selectedCategories = [];

    // Fetch user info from localStorage
    // Function to fix the image URL (same as for news pictures)
    function fixPictureURL(picture) {
        const API_BASE_URL = 'http://192.168.49.2/api';
        if (picture.startsWith('http://localhost:8080')) {
            return picture.replace('http://localhost:8080', API_BASE_URL);
        }
        return picture;
    }

    // Fetch user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Check if the user exists in localStorage
    if (user) {
        // Fix the user picture URL using the fixPictureURL function
        const fixedPictureUrl = fixPictureURL(user.picture);

        // Set the image source
        userPicture.src = fixedPictureUrl || 'default-user.png'; // Use default if no picture

        // Show user info and hide authentication links
        userInfo.style.display = 'flex';
        authLinks.style.display = 'none'; // Assuming authLinks is defined somewhere in your code
    } else {
        // Hide user info and show authentication links if no user is logged in
        userInfo.style.display = 'none';
        authLinks.style.display = 'flex'; // Assuming authLinks is defined somewhere in your code
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
            window.location.href = `${userProfilePage}?id=${user.id}`;
        });
    }

    // Function to fix image URLs
    function fixPictureURL(picture) {
        const API_BASE_URL = 'http://192.168.49.2/api';
        if (picture.startsWith('http://localhost:8080')) {
            return picture.replace('http://localhost:8080', API_BASE_URL);
        }
        return picture;
    }

    // Load news data from server
    async function loadNews() {
        try {
            const response = await fetch(`${API_BASE_URL}/news`);
            if (!response.ok) throw new Error('Failed to fetch news');

            newsData = await response.json();

            // Fix image URLs
            newsData.forEach(news => {
                if (news.image) {
                    news.image = fixPictureURL(news.image);
                }
            });

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

            document.querySelectorAll('.see-more').forEach(button => {
                button.addEventListener('click', () => {
                    const newsID = button.getAttribute('data-id');

                    // Open the news details in a new tab
                    window.open(`${newsDetailsPage}?id=${newsID}`, '_blank');
                });
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
