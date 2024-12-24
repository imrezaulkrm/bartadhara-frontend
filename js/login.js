// Define API base URL
const apiBaseUrl = 'http://192.168.49.2/api'; // Update this as needed

// Login form submission handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Get the username and password from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Show loading state (optional, for UX)
    const loginButton = document.getElementById('login-btn');
    loginButton.disabled = true; // Disable login button while processing
    loginButton.innerHTML = 'Logging in...'; // Change button text

    // Send login request to the backend API
    try {
        const response = await fetch(`${apiBaseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Check if the response was successful
        if (response.ok) {
            const userData = await response.json();

            // Save user data in localStorage (remove password before storing)
            delete userData.password; // Remove password from userData
            localStorage.setItem('user', JSON.stringify(userData)); 
            console.log('Login successful:', userData);

            // Redirect to the home page
            window.location.href = './index.html';
        } else {
            // If login failed, alert the user
            alert('Login failed. Please check your credentials and try again.');
        }
    } catch (error) {
        // Handle any error during the fetch request
        console.error('Error during login request:', error);
        alert('An error occurred. Please try again later.');
    } finally {
        // Reset the login button state after the process is complete
        loginButton.disabled = false;
        loginButton.innerHTML = 'Login';
    }
});

// Check if user is already logged in (optional, for session management)
window.onload = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
        const parsedUserData = JSON.parse(userData);
        console.log('User is already logged in:', parsedUserData);
        // You can redirect them to the home page or another page if already logged in
        window.location.href = './index.html';
    }
};
