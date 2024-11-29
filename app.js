const API_BASE_URL = "http://localhost:8080"; // আপনার সার্ভারের ঠিকানা

// Fetch all news
async function fetchNews() {
    const res = await fetch(`${API_BASE_URL}/news`);
    const data = await res.json();
    populateNews(data);
}

// Populate news in the UI
function populateNews(newsList) {
    const newsCards = document.getElementById("news-cards");
    newsCards.innerHTML = ""; // Clear previous content
    newsList.forEach((news) => {
        const card = document.createElement("div");
        card.className = "news-card";
        card.innerHTML = `
            <h4>${news.title}</h4>
            <p>${news.description}</p>
            <button class="view-btn">View</button>
            <button class="update-btn">Update</button>
            <button class="delete-btn" onclick="deleteNews(${news.id})">Delete</button>
        `;
        newsCards.appendChild(card);
    });
}

// Add news
document.getElementById("news-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    await fetch(`${API_BASE_URL}/news`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, image, category, date }),
    });

    fetchNews();
});

// Delete news
async function deleteNews(id) {
    await fetch(`${API_BASE_URL}/news/${id}`, {
        method: "DELETE",
    });
    fetchNews();
}

// Initialize
fetchNews();







// Fetch all news and update stats
async function updateStats() {
    try {
        const res = await fetch(`${API_BASE_URL}/news`); // News API
        const newsList = await res.json();

        // Update Total News
        const totalNewsElement = document.getElementById("total-news-management");
        totalNewsElement.textContent = newsList.length; // Total News Count

        // Calculate News by Category
        const categoryStatsElement = document.getElementById("category-stats");
        const categoryCount = {};
        newsList.forEach((news) => {
            if (!categoryCount[news.category]) {
                categoryCount[news.category] = 0;
            }
            categoryCount[news.category]++;
        });

        // Populate News by Category
        categoryStatsElement.innerHTML = ""; // Clear previous content
        for (const category in categoryCount) {
            const listItem = document.createElement("li");
            listItem.textContent = `${category}: ${categoryCount[category]} news`;
            categoryStatsElement.appendChild(listItem);
        }
    } catch (error) {
        console.error("Error fetching news stats:", error);
    }
}

// Initialize the stats update
updateStats();



// Load categories dynamically from the database (Now Fixed Categories)
const loadCategories = () => {
    const categories = ["Politics", "Sports", "Technology", "Health", "Crime", "Business", "Entertainment"];  // Fixed categories

    const categorySelect = document.getElementById("category");

    // Clear existing options
    categorySelect.innerHTML = "";

    // Append categories to the select dropdown
    categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
};

// Add News Form Submission
document.getElementById("news-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form submission

    // Collect form data
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const imageFile = document.getElementById("image").files[0]; // Handling file input
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    // Prepare data for API
    const newsData = {
        title: title,
        description: description,
        category: category,
        date: date,
    };

    // If an image is selected, append it to the form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("date", date);

    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        // Send API request to add news
        const res = await fetch(`${API_BASE_URL}/news`, {
            method: "POST",
            body: formData, // Send the form data including the image file
        });

        if (res.ok) {
            alert("News added successfully!");
            document.getElementById("news-form").reset(); // Reset form
        } else {
            alert("Failed to add news. Please try again.");
        }
    } catch (error) {
        console.error("Error adding news:", error);
        alert("An error occurred while adding news.");
    }
});

// Load categories on page load
window.addEventListener("DOMContentLoaded", loadCategories);
