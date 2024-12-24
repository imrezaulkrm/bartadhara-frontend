// Define constants for URLs
const baseURL = 'http://192.168.49.2/api';
const userProfileURL = `${baseURL}/users`;

// Get the user ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

// Function to fetch user data by ID
async function fetchUserByID() {
    const response = await fetch(`${userProfileURL}/${userId}`);
    const user = await response.json();

    // Pre-fill the form with user data
    document.getElementById('name').value = user.name;
    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;

    // Fix the picture URL if needed
    const userPicture = fixPictureURL(user.picture || 'default-avatar.png');
    document.getElementById('picture-preview').src = userPicture; // Assuming you have an image preview element with id 'picture-preview'
}

// Fetch user data when the page loads
fetchUserByID();

// Handle form submission
document.getElementById('update-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const updatedUser = new FormData();
    updatedUser.append('name', document.getElementById('name').value);
    updatedUser.append('username', document.getElementById('username').value);
    updatedUser.append('email', document.getElementById('email').value);
    updatedUser.append('password', document.getElementById('password').value);

    // Check if the user has uploaded a picture
    const pictureFile = document.getElementById('picture').files[0];
    
    if (pictureFile) {
        // If a picture is selected, append it to FormData
        updatedUser.append('picture', pictureFile);
    } else {
        // If no picture is selected, append a placeholder (empty string or default picture URL)
        updatedUser.append('picture', ''); // You can replace '' with a default image URL if required
    }

    // Send PUT request to update user data
    const response = await fetch(`${userProfileURL}/${userId}`, {
        method: 'PUT',
        body: updatedUser,
    });

    if (response.ok) {
        alert('User updated successfully!');
        window.location.href = `user-profile.html?id=${userId}`;  // Correct way of string interpolation
    } else {
        alert('Error updating user');
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
