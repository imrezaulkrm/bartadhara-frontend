// Define API base URL
//const apiBaseUrl = 'bartadhara';
//const apiBaseUrl = 'http://localhost:8080';
const apiBaseUrl = 'http://192.168.49.2/api';

document.addEventListener('DOMContentLoaded', async () => {
    const newsDetailsContainer = document.getElementById('news-details');
    
    // URL থেকে 'id' প্যারামিটার নেয়া
    const urlParams = new URLSearchParams(window.location.search);
    const newsID = urlParams.get('id');

    if (newsID) {
        try {
            const response = await fetch(`${apiBaseUrl}/news/${newsID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch news details');
            }

            const news = await response.json();

            // নিউজ ডেটা এই HTML এলিমেন্টে সেট করা
            newsDetailsContainer.innerHTML = `
                <h2>${news.title}</h2>
                <img src="${fixPictureURL(news.image || 'fallback-image.jpg')}" alt="${news.title}" onerror="this.onerror=null; this.src='fallback-image.jpg';">
                <p>${news.description}</p>
                <div>
                    <span>Category: ${news.category}</span>
                    <span>Published on: ${news.date}</span>
                </div>
            `;
        } catch (error) {
            console.error(error);
            newsDetailsContainer.innerHTML = '<p>Error loading news details.</p>';
        }
    } else {
        newsDetailsContainer.innerHTML = '<p>No news found.</p>';
    }
});

// Function to fix the picture URL
function fixPictureURL(picture) {
    const API_BASE_URL = 'http://192.168.49.2/api';  // Base URL for images
    if (picture.startsWith('http://localhost:8080')) {
        return picture.replace('http://localhost:8080', API_BASE_URL);
    }
    return picture;
}
