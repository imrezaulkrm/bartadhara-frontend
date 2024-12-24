// utils.js

// Function to fix image URLs
export function fixPictureURL(picture) {
    const API_BASE_URL = 'http://192.168.49.2/api'; // Ensure this is the correct base URL for your API
    if (picture.startsWith('http://localhost:8080')) {
        return picture.replace('http://localhost:8080', API_BASE_URL);
    }
    return picture;
}
