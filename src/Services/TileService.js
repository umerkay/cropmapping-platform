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

/**
 * Sends a request to generate a map tile for a given bounding box.
 * Sends a POST request to /map/generate with bounding box coordinates.
 * @param {Object} boundingBox - Bounding box coordinates {min_lon, min_lat, max_lon, max_lat}.
 * @returns {Promise<Object>} - Returns a Promise that resolves to the generated tile information or rejects with an error message.
 */
async function generateMap(boundingBox) {
    if (!boundingBox || !boundingBox.min_lon || !boundingBox.min_lat || !boundingBox.max_lon || !boundingBox.max_lat) {
        showErrorToast("Valid bounding box coordinates are required!");
        throw new Error("Valid bounding box coordinates are required!");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bounding_box: [boundingBox.min_lon, boundingBox.min_lat, boundingBox.max_lon, boundingBox.max_lat]
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate map tile: ${response.statusText}`);
        }

        const data = await response.json();
        return data;  // Contains tile_name, output_png, and output_json
    } catch (error) {
        showErrorToast(error.message);
        throw error;
    }
}

// Export the functions for use in other scripts
export { getTimestamps, getTileInfo, generateMap };
