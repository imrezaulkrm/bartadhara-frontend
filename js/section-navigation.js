// ==============================
// Navigation Section Switching
// ==============================

function switchSections(showSection, hideSection) {
    showSection.style.display = 'block';  // Show the target section
    hideSection.style.display = 'none';   // Hide the other section
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements for navigation between sections
    const homeSection = document.getElementById('home-section');
    const newsManagementSection = document.getElementById('news-management');
    const userManagementSection = document.getElementById('user-management');
    const adminManagementSection = document.getElementById('admin-management');
    
    const homeBtn = document.getElementById('home-btn');
    const newsManagementBtn = document.getElementById('news-management-btn');
    const userManagementBtn = document.getElementById('user-management-btn');
    const adminManagementBtn = document.getElementById('admin-management-btn');
    
    // Default section to be displayed initially
    homeSection.style.display = 'block';
    newsManagementSection.style.display = 'none';
    userManagementSection.style.display = 'none';
    adminManagementSection.style.display = 'none';
    
    // Handling Navigation Button Clicks
    homeBtn.addEventListener('click', () => {
        switchSections(homeSection, newsManagementSection);
        switchSections(homeSection, userManagementSection);
        switchSections(homeSection, adminManagementSection);
    });

    newsManagementBtn.addEventListener('click', () => {
        switchSections(newsManagementSection, homeSection);
        switchSections(newsManagementSection, userManagementSection);
        switchSections(newsManagementSection, adminManagementSection);
    });

    userManagementBtn.addEventListener('click', () => {
        switchSections(userManagementSection, homeSection);
        switchSections(userManagementSection, newsManagementSection);
        switchSections(userManagementSection, adminManagementSection);
    });

    adminManagementBtn.addEventListener('click', () => {
        switchSections(adminManagementSection, homeSection);
        switchSections(adminManagementSection, newsManagementSection);
        switchSections(adminManagementSection, userManagementSection);
    });
});
