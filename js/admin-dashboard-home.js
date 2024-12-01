// =============================
// Dashboard Statistics Fetching
// =============================

document.addEventListener('DOMContentLoaded', () => {
    async function fetchData() {
        try {
            // Fetching Total News Count
            const newsResponse = await fetch('http://localhost:8080/news');
            const newsData = await newsResponse.json();
            document.getElementById('total-news').textContent = newsData.length;

            // Fetching Total Users Count
            const usersResponse = await fetch('http://localhost:8080/users');
            const usersData = await usersResponse.json();
            document.getElementById('total-users').textContent = usersData.length;

            // Fetching Total Admins Count
            const adminsResponse = await fetch('http://localhost:8080/admin');
            const adminsData = await adminsResponse.json();
            document.getElementById('total-admins').textContent = adminsData.length;

            // Fetching Categories from News Data
            const categoryResponse = await fetch('http://localhost:8080/news');
            const categoryData = await categoryResponse.json();

            // Extracting Categories from News
            const categories = categoryData.map(news => news.category);

            // Counting Occurrences of Each Category
            const categoryCounts = categories.reduce((acc, category) => {
                acc[category] = (acc[category] || 0) + 1;
                return acc;
            }, {});

            // Chart Data Preparation
            const chartLabels = Object.keys(categoryCounts);  // Category Labels
            const chartData = Object.values(categoryCounts);  // Category Counts

            // Assigning Random Background Colors to Categories
            const backgroundColors = chartLabels.map((_, index) => {
                const colors = [
                    'rgba(255, 99, 132, 0.2)',  // Pink
                    'rgba(54, 162, 235, 0.2)',  // Blue
                    'rgba(255, 159, 64, 0.2)',  // Orange
                    'rgba(75, 192, 192, 0.2)',  // Green
                    'rgba(153, 102, 255, 0.2)', // Purple
                    'rgba(255, 159, 64, 0.2)'   // Yellow
                ];
                return colors[index % colors.length];  // Cycle through colors
            });

            // Assigning Border Colors to Categories
            const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));  // Darker border colors

            // Creating Bar Chart for News by Category
            const ctx = document.getElementById('news-chart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'News by Category',
                        data: chartData,
                        backgroundColor: backgroundColors,  // Dynamic background colors
                        borderColor: borderColors,          // Dynamic border colors
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true  // Ensure Y-axis starts from zero
                        }
                    }
                }
            });

        } catch (error) {
            // Logging errors if any
            console.error('Error fetching data:', error);
        }
    }

    // Calling fetchData on page load
    fetchData();
});

// =============================
// DOM Content Loaded Event
// =============================
