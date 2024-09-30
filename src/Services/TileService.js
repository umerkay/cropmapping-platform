import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:5000/map'; // Base URL for the map-related API endpoints

// Function to show Toastify notifications for errors
function showErrorToast(message) {
    toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

/**
 * Fetches the list of timestamps from the server.
 * Sends a GET request to /map/timestamps.
 * @returns {Promise<Array<string>>} - Returns a Promise that resolves to an array of timestamps or rejects with an error message.
 */
async function getTimestamps() {
    try {
        const response = await fetch(`${API_BASE_URL}/timestamps`);
        if (!response.ok) {
            throw new Error(`Failed to fetch timestamps: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        showErrorToast(error.message);
        throw error;
    }
}

/**
 * Fetches the tile info (data.json) for a given timestamp.
 * Sends a GET request to /map/tileinfo?timestamp={timestamp}.
 * @param {string} timestamp - The timestamp directory name.
 * @returns {Promise<Object>} - Returns a Promise that resolves to the JSON data or rejects with an error message.
 */
async function getTileInfo(timestamp) {
    if (!timestamp) {
        showErrorToast("Timestamp is required!");
        throw new Error("Timestamp is required!");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tileinfo?timestamp=${timestamp}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch tile info: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        showErrorToast(error.message);
        throw error;
    }
}

// Export the functions for use in other scripts
export { getTimestamps, getTileInfo };
