const API_BASE_URL = "http://localhost:8080"; // আপনার সার্ভারের ঠিকানা

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
    const categories = ["Politics", "Sports", "Technology", "Health", "Crime", "Business", "Entertainment", "Random"];  // Fixed categories

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




// Fetch news and display dynamically
const loadNews = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/news`);
        const newsData = await response.json();
        displayNews(newsData);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
};

// Display news dynamically
const displayNews = (news) => {
    const newsCardsContainer = document.getElementById("news-cards");
    newsCardsContainer.innerHTML = ""; // Clear existing cards

    news.forEach((item) => {
        const newsCard = document.createElement("div");
        newsCard.classList.add("news-card");
        newsCard.innerHTML = `
            <img src="${item.image || 'placeholder.jpg'}" alt="News Image" />
            <h4>${item.title}</h4>
            <p class="news-description">${item.description}</p>
            <div class="card-buttons">
                <button class="delete-btn" onclick="deleteNews(${item.id})">Delete</button>
                <button class="update-btn" onclick="updateNews(${item.id})">Update</button>
            </div>
            <button class="view-btn" onclick="viewNews(${item.id})">View Full News</button>
        `;
    
        newsCardsContainer.appendChild(newsCard);
    });
};


// Filter news based on category and date
const applyFilter = async () => {
    const selectedCategories = Array.from(
        document.querySelectorAll("#category-filter input:checked")
    ).map((checkbox) => checkbox.value);

    const selectedDate = document.getElementById("filter-date").value;

    try {
        const response = await fetch(`${API_BASE_URL}/news`);
        const newsData = await response.json();

        const filteredNews = newsData.filter((news) => {
            const categoryMatch =
                selectedCategories.length === 0 || selectedCategories.includes(news.category);
            const dateMatch = !selectedDate || news.date === selectedDate;
            return categoryMatch && dateMatch;
        });

        displayNews(filteredNews);
    } catch (error) {
        console.error("Error filtering news:", error);
    }
};

// Delete news
const deleteNews = async (id) => {
    try {
        await fetch(`${API_BASE_URL}/news/${id}`, {
            method: "DELETE",
        });
        alert("News deleted successfully!");
        loadNews();
    } catch (error) {
        console.error("Error deleting news:", error);
    }
};

// View full news in a modal
const viewNews = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/news/${id}`);
        const newsItem = await response.json();

        document.getElementById("view-title").textContent = newsItem.title;
        document.getElementById("view-description").textContent = newsItem.description;
        document.getElementById("view-category").textContent = `Category: ${newsItem.category}`;
        document.getElementById("view-date").textContent = `Date: ${newsItem.date}`;
        document.getElementById("view-image").src = newsItem.image || "placeholder.jpg";

        // Show the modal
        document.getElementById("view-modal").style.display = "block";
    } catch (error) {
        console.error("Error fetching news details:", error);
    }
};

// Update news in a modal
const updateNews = async (id) => {
    try {
        // Fetch existing news data
        const response = await fetch(`${API_BASE_URL}/news/${id}`);
        const newsItem = await response.json();

        // Populate modal form fields with existing data
        document.getElementById("update-title").value = newsItem.title;
        document.getElementById("update-description").value = newsItem.description;
        document.getElementById("update-category").value = newsItem.category;
        document.getElementById("update-date").value = newsItem.date;

        // Show the modal
        document.getElementById("update-modal").style.display = "block";

        // Handle form submission
        document.getElementById("update-form").onsubmit = async (e) => {
            e.preventDefault();

            // Prepare form data for update
            const formData = new FormData();
            formData.append("title", document.getElementById("update-title").value);
            formData.append("description", document.getElementById("update-description").value);
            formData.append("category", document.getElementById("update-category").value);
            formData.append("date", document.getElementById("update-date").value);

            const imageFile = document.getElementById("update-image").files[0];
            if (imageFile) {
                formData.append("image", imageFile);
            }

            try {
                // Send updated data to the server
                await fetch(`${API_BASE_URL}/news/${id}`, {
                    method: "PUT",
                    body: formData,
                });

                alert("News updated successfully!");
                document.getElementById("update-modal").style.display = "none";
                loadNews();
            } catch (error) {
                console.error("Error updating news:", error);
            }
        };
    } catch (error) {
        console.error("Error fetching news for update:", error);
    }
};



// Close modals
const closeModal = (modalId) => {
    document.getElementById(modalId).style.display = "none";
};

// Event listeners
document.getElementById("apply-filter-btn").addEventListener("click", applyFilter);

// Load news on page load
window.addEventListener("DOMContentLoaded", loadNews);

