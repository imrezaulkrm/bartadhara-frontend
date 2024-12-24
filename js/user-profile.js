document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id'); // URL থেকে ইউজার আইডি নিন
    const updateBtn = document.getElementById('edit-btn');

    if (!userId) {
        console.error('User ID not found in URL.');
        return;
    }

    try {
        const response = await fetch(`http://192.168.49.2/api/users/${userId}`);
        const userData = await response.json();

        // ইউজারের ছবি এবং তথ্য উপাদানগুলি খুঁজে বের করুন
        const userPicture = document.getElementById('user-profile-picture');  
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        const userUsername = document.getElementById('user-username');

        // যদি কোনো উপাদান মিসিং থাকে, তবে এরর দেখান
        if (!userPicture || !userName || !userEmail || !userUsername) {
            console.error('Some user details elements are missing.');
            return;
        }

        // ছবির URL ঠিক করতে `fixPictureURL` ফাংশন ব্যবহার করুন
        const pictureURL = fixPictureURL(userData.picture || 'default-avatar.png');

        // ইউজারের ছবি সঠিকভাবে আপডেট হচ্ছে কিনা তা দেখুন
        console.log('User picture URL:', pictureURL);
        userPicture.src = pictureURL; // পিকচার URL সেট করুন
        userPicture.alt = `${userData.name}'s Profile Picture`; // পিকচারের alt টেক্সট

        // ইউজারের নাম, ইমেইল এবং ইউজারনেম সেট করুন
        userName.textContent = userData.name;
        userEmail.textContent = userData.email;
        userUsername.textContent = userData.username;

        console.log('User details updated:', userData);

    } catch (error) {
        console.error('Error fetching user data:', error);
    }

    // Update button event listener
    updateBtn.addEventListener('click', () => {
        // Redirect to the update page with user ID in query parameter
        window.location.href = `update-profile.html?id=${userId}`;
    });
});

// Function to fix the picture URL
function fixPictureURL(picture) {
    const API_BASE_URL = 'http://192.168.49.2/api';  // Base URL for images
    if (picture.startsWith('http://localhost:8080')) {
        return picture.replace('http://localhost:8080', API_BASE_URL);
    }
    return picture;
}
