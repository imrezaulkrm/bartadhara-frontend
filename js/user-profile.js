document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id'); // URL থেকে ইউজার আইডি নিন
    const updateBtn = document.getElementById('edit-btn');
    //const userId = document.getElementById('user-id').value; // Assuming you have user ID stored in a hidden input field or similar

    if (!userId) {
        console.error('User ID not found in URL.');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}`);
        const userData = await response.json();

        // ইউজারের ছবি এবং তথ্য উপাদানগুলি খুঁজে বের করুন
        const userPicture = document.getElementById('user-profile-picture');  // এখানে id পরিবর্তন করা হয়েছে
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        const userUsername = document.getElementById('user-username');

        // যদি কোনো উপাদান মিসিং থাকে, তবে এরর দেখান
        if (!userPicture || !userName || !userEmail || !userUsername) {
            console.error('Some user details elements are missing.');
            return;
        }

        // ইউজারের ছবি সঠিকভাবে আপডেট হচ্ছে কিনা তা দেখুন
        console.log('User picture URL:', userData.picture);
        userPicture.src = userData.picture; // পিকচার URL সেট করুন
        userPicture.alt = `${userData.name}'s Profile Picture`; // পিকচারের alt টেক্সট

        // ইউজারের নাম, ইমেইল এবং ইউজারনেম সেট করুন
        userName.textContent = userData.name;
        userEmail.textContent = userData.email;
        userUsername.textContent = userData.username;

        console.log('User details updated:', userData);

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
    updateBtn.addEventListener('click', () => {
        // Redirect to the update page with user ID in query parameter
        window.location.href = `update-profile.html?id=${userId}`;
    });
});