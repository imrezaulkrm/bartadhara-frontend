// Function to fetch admin data
async function fetchAdmins() {
  const response = await fetch('http://localhost:8080/admin'); // API to fetch all admins
  const admins = await response.json();
  displayAdmins(admins);
}

// Function to display admins in card format
function displayAdmins(admins) {
  const adminCardsContainer = document.getElementById('admin-cards-container');
  adminCardsContainer.innerHTML = '';
  admins.forEach(admin => {
      const adminCard = document.createElement('div');
      adminCard.classList.add('admin-card');
      adminCard.innerHTML = `
          <img src="${admin.picture || 'default.jpg'}" alt="Admin Picture">
          <h4 class="usercard-text h">${admin.name}</h4>
          <p class="usercard-text p">Username: ${admin.username}</p>
          <p class="usercard-text p">Email: ${admin.email}</p>
          <button class="usercard-update" onclick="openUpdatePopup(${admin.id})">Update</button>
          <button class="usercard-delete" onclick="deleteAdmin(${admin.id})">Delete</button>
      `;
      adminCardsContainer.appendChild(adminCard);
  });
  document.getElementById('total-admins-count').textContent = admins.length;
}

// Function to open update popup
function openUpdatePopup(adminId) {
  const popup = document.getElementById('admin-update-popup');
  popup.style.display = 'flex';
  // Fetch admin details and populate form
  fetch(`http://localhost:8080/admin/${adminId}`)
      .then(response => response.json())
      .then(admin => {
          document.getElementById('update-user-id').value = admin.id; // Set the admin ID for updating
          document.getElementById('update-admin-name').value = admin.name;
          document.getElementById('update-admin-username').value = admin.username;
          document.getElementById('update-admin-email').value = admin.email;
          document.getElementById('update-admin-password').value = ''; // No pre-fill for password
      });
  document.getElementById('update-admin-btn').onclick = () => updateAdmin(adminId);
}

// Function to close the popup
function adminCloseUpdatePopup() {
  document.getElementById('admin-update-popup').style.display = 'none'; // Hide popup
}

// Function to update admin
async function updateAdmin(adminId) {
  const name = document.getElementById('update-admin-name').value;
  const username = document.getElementById('update-admin-username').value;
  const email = document.getElementById('update-admin-email').value;
  const password = document.getElementById('update-admin-password').value;
  const picture = document.getElementById('update-admin-picture').files[0];

  const formData = new FormData();
  if (name) formData.append('name', name);
  if (username) formData.append('username', username);
  if (email) formData.append('email', email);
  if (password) formData.append('password', password);
  if (picture) formData.append('picture', picture);

  const response = await fetch(`http://localhost:8080/admin/${adminId}`, {
      method: 'PUT',
      body: formData,
  });

  if (response.ok) {
      fetchAdmins(); // Refresh admin list
      adminCloseUpdatePopup(); // Close the popup
  } else {
      alert('Error updating admin');
  }
}

// Function to delete admin
async function deleteAdmin(adminId) {
  const response = await fetch(`http://localhost:8080/admin/${adminId}`, {
      method: 'DELETE',
  });

  if (response.ok) {
      fetchAdmins(); // Refresh admin list
  } else {
      alert('Error deleting admin');
  }
}

// Handle form submit to add new admin
document.getElementById('add-admin-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const name = document.getElementById('admin-name').value;
  const username = document.getElementById('admin-username').value;
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  const picture = document.getElementById('admin-picture').files[0];

  const formData = new FormData();
  formData.append('name', name);
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  if (picture) formData.append('picture', picture);

  const response = await fetch('http://localhost:8080/admin/register', {
      method: 'POST',
      body: formData,
  });

  if (response.ok) {
      fetchAdmins(); // Refresh admin list
  } else {
      alert('Error adding admin');
  }
});

// Initial fetch of admins
fetchAdmins();

// Get form and success message elements
const adminform = document.getElementById('add-admin-form');
const adminSuccessMessage = document.getElementById('admin-success-message');

// Add event listener to form submit
adminform.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the form from submitting normally

  // Display success message immediately
  adminSuccessMessage.style.display = 'block';

  // Clear the form fields
  adminform.reset();

  // Hide the success message after 3 seconds
  setTimeout(function() {
    adminSuccessMessage.style.display = 'none';
  }, 3000); // Hide message after 3 seconds
});
