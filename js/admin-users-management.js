// API Base URL
//const apiBaseUrl = 'bartadhara';
// API Base URL
//const apiBaseUrl = 'http://localhost:8080';
const apiBaseUrl = 'http://192.168.49.2/api';

// DOM Elements
const addUserForm = document.getElementById('add-user-form');
const userCardsContainer = document.getElementById('user-cards-container');
const userCount = document.getElementById('user-count');
const updateUserPopup = document.getElementById('update-user-popup');
const closeUpdatePopupBtn = document.getElementById('close-update-popup');
const updateUserForm = document.getElementById('update-user-form');
const updateUserId = document.getElementById('update-user-id');
const updateName = document.getElementById('update-name');
const updateEmail = document.getElementById('update-email');
const updateUsername = document.getElementById('update-username');
const updatePassword = document.getElementById('update-password');

// Fetch all users from the backend
async function fetchUsers() {
    try {
        const response = await fetch(`${apiBaseUrl}/users`);
        const users = await response.json();
        userCount.innerText = users.length; // Update total user count
        renderUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Render users as cards
function renderUsers(users) {
    userCardsContainer.innerHTML = ''; // Clear existing cards
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        userCard.innerHTML = `
            <img src="${user.picture || 'default-avatar.png'}" alt="${user.name}">
            <h4 class="usercard-text h">${user.name}</h4>
            <p class="usercard-text p">Username: ${user.username}</p>
            <p class="usercard-text p">Email: ${user.email}</p>
            <button class="usercard-update" onclick="openUpdateUserForm(${user.id})">Update</button>
            <button class="usercard-delete" onclick="deleteUser(${user.id})">Delete</button>
        `;
        userCardsContainer.appendChild(userCard);
    });
}

// Add new user
addUserForm.onsubmit = async function (e) {
    e.preventDefault();

    const newUser = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };

    const formData = new FormData();
    formData.append('name', newUser.name);
    formData.append('email', newUser.email);
    formData.append('username', newUser.username);
    formData.append('password', newUser.password);

    if (document.getElementById('picture').files[0]) {
        formData.append('picture', document.getElementById('picture').files[0]);
    }

    try {
        const response = await fetch(`${apiBaseUrl}/users`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            fetchUsers(); // Refresh the user list
        } else {
            alert('User registration failed');
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }
};

// Get form and success message elements
const form = document.getElementById('add-user-form');
const successMessage = document.getElementById('success-message');

// Add event listener to form submit
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting normally

    // Display success message immediately
    successMessage.style.display = 'block';

    // Clear the form fields
    form.reset();

    // Hide the success message after 3 seconds
    setTimeout(function() {
        successMessage.style.display = 'none';
    }, 3000); // Hide message after 3 seconds
});

// Open update user form with pre-filled data
function openUpdateUserForm(userId) {
    fetch(`${apiBaseUrl}/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            // Pre-fill form data
            document.getElementById('update-user-id').value = user.id;
            document.getElementById('update-name').value = user.name;
            document.getElementById('update-email').value = user.email;
            document.getElementById('update-username').value = user.username;
            document.getElementById('update-password').value = ''; // Clear password field
            document.getElementById('update-picture').value = ''; // Clear file input

            // Open popup
            document.getElementById('update-user-popup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching user data for update:', error));
}

// Update user
document.getElementById('update-user-form').onsubmit = async function (e) {
    e.preventDefault();

    const updatedUser = {
        id: document.getElementById('update-user-id').value,
        name: document.getElementById('update-name').value,
        email: document.getElementById('update-email').value,
        username: document.getElementById('update-username').value,
        password: document.getElementById('update-password').value,
    };

    const formData = new FormData();
    formData.append('id', updatedUser.id);
    formData.append('name', updatedUser.name);
    formData.append('email', updatedUser.email);
    formData.append('username', updatedUser.username);
    if (updatedUser.password) {
        formData.append('password', updatedUser.password); // Append only if password is provided
    }
    const profilePicture = document.getElementById('update-picture').files[0];
    if (profilePicture) {
        formData.append('picture', profilePicture); // Append the profile picture if provided
    }

    try {
        const response = await fetch(`${apiBaseUrl}/users/${updatedUser.id}`, {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
            await fetchUsers(); // Refresh the user list
            closeUpdatePopup(); // Close the update popup
        } else {
            alert('User update failed');
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
};

// Close update popup
document.getElementById('close-update-popup').onclick = function () {
    closeUpdatePopup();
};

// Function to close the popup
function closeUpdatePopup() {
    document.getElementById('update-user-popup').style.display = 'none'; // Hide popup
}


async function deleteUser(userId) {
    try {
        const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchUsers();  // Refresh the user list
        } else {
            const errorMessage = await response.text();
            console.error('Error deleting user:', errorMessage);  // Show error message from server
            alert(errorMessage);  // Show error message to user
        }
    } catch (error) {
        console.error('Error deleting user:', error);  // Log error
        alert('An error occurred while deleting the user');
    }
}

// Initialize by fetching all users
fetchUsers();
