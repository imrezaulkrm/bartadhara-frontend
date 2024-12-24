document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    // Get the entered username and password
    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    var credentials = {
        username: username,
        password: password
    };

    console.log("Sending credentials:", credentials);
    // fetch('bartadhara/admin/login', {
    fetch('http://192.168.49.2/api/admin/login', {
    // fetch('http://localhost:8080/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    })
    .then(response => {
        console.log("Raw response:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse JSON response
    })
    .then(data => {
        console.log("Parsed response:", data);

        if (data.success) { // Adjust this condition as per your backend's success key
            document.getElementById('login-modal').style.display = 'none';
            document.querySelector('.dashboard').style.display = 'flex';
            alert(`Welcome, ${data.username || 'Admin'}!`);
        } else {
            alert(data.message || 'Invalid credentials, please try again!');
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred while logging in. Please check your network and try again.');
    });
});